package com.nova.backend.timelapse.service;

import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimelapseVideoServiceImpl implements TimelapseVideoService {
    private final TimelapseDAO timelapseDAO;
    @Override
    public void renderVideo(long settingId) {
        try {
            TimelapseEntity timelapseEntity = timelapseDAO.findById(settingId);
            String baseDir = "/data/timelapse";
            String imageDir =
                    baseDir + "/farm_" + timelapseEntity.getFarmEntity().getFarmId()
                            + "/setting_" + settingId;
            String outputDir = baseDir + "/video";
            Files.createDirectories(Paths.get(outputDir));

            String outputPath = outputDir + "/timelapse_" + settingId + ".mp4";

            Path ffmpegPath = Paths.get(
                    "C:/ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe"
            );

            if (!Files.exists(ffmpegPath)) {
                throw new IllegalStateException("ffmpeg 실행 파일이 존재하지 않습니다: " + ffmpegPath);
            }

            if (!Files.exists(Paths.get(imageDir)) ||
                    Files.list(Paths.get(imageDir))
                            .noneMatch(p -> p.toString().endsWith(".jpg"))) {
                throw new IllegalStateException("이미지가 존재하지 않습니다: " + imageDir);
            }

            int fps = timelapseEntity.getFps();
            if (fps <= 0) fps = 30;
            List<String> command = List.of(
                    "C:/ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe",
                    "-y",
                    "-framerate", String.valueOf(fps),
                    "-i", imageDir + "/frame_%06d.jpg",
                    "-c:v", "libx264",
                    "-pix_fmt", "yuv420p",
                    outputPath
            );

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 로그 소비 (안 하면 프로세스 멈춤 가능)
            try (BufferedReader reader =
                         new BufferedReader(new InputStreamReader(process.getInputStream()))) {

                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[ffmpeg] " + line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg 실패 exitCode=" + exitCode);
            }

            // DB 저장
            TimelapseVideoEntity video = new TimelapseVideoEntity();
            Path videoPath = Paths.get(outputPath);
            long sizeBytes = Files.size(videoPath);

            video.setTimelapseEntity(timelapseEntity);
            video.setVideoFilePath(outputPath);
            video.setSize(humanReadableSize(sizeBytes));

            timelapseDAO.saveVideo(video);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("타임랩스 영상 생성 실패");
        }
    }

    @Override
    public void mergeStepVideos(Long farmId, int settingId) {
        try {
            String baseDir = "/data/timelapse";
            String outputDir = baseDir + "/video";
            Files.createDirectories(Paths.get(outputDir));

            // 1️⃣ DB에서 해당 farm의 모든 step 영상 조회 (COMPLETED 상태)
            List<TimelapseVideoEntity> stepVideos = timelapseDAO.findVideosByFarmId(farmId);

            if (stepVideos.isEmpty()) {
                System.out.println("합칠 step 영상 없음");
                return;
            }

            if (stepVideos.size() == 1) {
                System.out.println("영상이 하나만 존재합니다. 별도 머지 필요 없음.");
                return;
            }

            Path ffmpegPath = Paths.get(
                    "C:/ffmpeg/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe"
            );

            if (!Files.exists(ffmpegPath)) {
                throw new IllegalStateException("ffmpeg 실행 파일이 존재하지 않습니다: " + ffmpegPath);
            }

            // 2️⃣ FFmpeg 명령어 생성
            List<String> mergeCommand = new ArrayList<>();
            mergeCommand.add(ffmpegPath.toString());

            // 입력 파일 추가
            for (TimelapseVideoEntity v : stepVideos) {
                mergeCommand.add("-i");
                mergeCommand.add(v.getVideoFilePath());
            }

            // filter_complex 구성 (concat)
            StringBuilder filterComplex = new StringBuilder();
            for (int i = 0; i < stepVideos.size(); i++) {
                filterComplex.append("[").append(i).append(":v:0]");
            }
            filterComplex.append("concat=n=").append(stepVideos.size()).append(":v=1:a=0[outv]");

            mergeCommand.add("-filter_complex");
            mergeCommand.add(filterComplex.toString());
            mergeCommand.add("-map");
            mergeCommand.add("[outv]");

            // 출력 파일
            String outputPath = outputDir + "/timelapse_full_" + farmId + ".mp4";
            mergeCommand.add(outputPath);

            // 3️⃣ ProcessBuilder 실행
            ProcessBuilder pb = new ProcessBuilder(mergeCommand);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[ffmpeg-merge] " + line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg merge 실패 exitCode=" + exitCode);
            }

            System.out.println("전체 step 영상 합치기 완료: " + outputPath);


            TimelapseEntity fullSetting = timelapseDAO.findById(settingId);

            if (fullSetting == null) {
                System.out.println("전체 영상용 Timelapse 설정이 존재하지 않습니다.");
                return;
            }

            Path videoPath = Paths.get(outputPath);
            long sizeBytes = Files.size(videoPath);

            TimelapseVideoEntity video = new TimelapseVideoEntity();
            video.setTimelapseEntity(fullSetting);
            video.setVideoFilePath(outputPath);
            video.setSize(humanReadableSize(sizeBytes));

            timelapseDAO.saveVideo(video);

            System.out.println("전체 타임랩스 DB 저장 완료: " + outputPath);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("타임랩스 step 영상 머지 실패");
        }
    }

    @Override
    public String getVideo(long settingId) {
        TimelapseVideoEntity timelapseVideoEntity = timelapseDAO.findBySettingId(settingId);
        String filePath = timelapseVideoEntity.getVideoFilePath();
        String[] path = filePath.split("/");
        String fileName = path[path.length - 1];
        return fileName;
    }

    private String humanReadableSize(long bytes) {
        if (bytes < 1024) return bytes + "B";

        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String unit = "KMGTPE".charAt(exp - 1) + "B";
        double size = bytes / Math.pow(1024, exp);

        return String.format("%.1f%s", size, unit);
    }
}
