package com.nova.backend.timelapse.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseImageEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import com.nova.backend.timelapse.repository.TimelapseImageRepository;
import com.nova.backend.timelapse.repository.TimelapseRepository;
import com.nova.backend.timelapse.repository.TimelapseVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Base64;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TimelapseDAOImpl implements TimelapseDAO {
    private final TimelapseRepository timelapseRepository;
    private final TimelapseVideoRepository timelapseVideoRepository;
    private final TimelapseImageRepository timelapseImageRepository;
    @Override
    public List<TimelapseEntity> findByFarmEntity_FarmId(long farmId) {
        return timelapseRepository.findByFarmEntity_FarmId(farmId);
    }

//    @Override
//    public List<TimelapseEntity> findByFarm(FarmEntity farmEntity) {
//        return timelapseRepository.findByFarmEntity(farmEntity);
//    }

    @Override
    public List<TimelapseVideoEntity> findBySettingId(int settingId) {
        return timelapseVideoRepository.findByTimelapseEntity_SettingId(settingId);
    }

    @Override
    public void createTimelapse(List<TimelapseEntity> timelapseEntityList) {
        timelapseRepository.saveAll(timelapseEntityList);
    }

    @Override
    public List<TimelapseImageEntity> findBySettingIdOrderByCreatedAtDesc(long settingId) {
        return timelapseImageRepository.findByTimelapseEntity_SettingIdOrderByCreatedAtDesc(settingId);
    }

    private final String saveDir = "/home/timelapse/images/";
    private final String videoDir = "/home/timelapse/videos/";
    private final String imageSaveDir = "/home/timelapse/images/";
    private final String videoSaveDir = "/home/timelapse/videos/";

    @Override
    public void saveImageAndUpdateDB(String base64Data, long settingId) throws Exception {
        byte[] bytes = Base64.getDecoder().decode(base64Data);
        String filename = System.currentTimeMillis() + ".jpg";

        File dir = new File(saveDir);
        if (!dir.exists()) dir.mkdirs();
        File file = new File(dir, filename);
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(bytes);
        }

        TimelapseEntity setting = timelapseRepository.findById((int) settingId)
                .orElseThrow(() -> new RuntimeException("설정 없음: " + settingId));

        TimelapseImageEntity image = new TimelapseImageEntity();
        image.setTimelapseEntity(setting);
        image.setImageFilePath(file.getAbsolutePath());

        timelapseImageRepository.save(image);
        System.out.println("Saved image: " + file.getAbsolutePath());
    }

    @Override
    public TimelapseVideoEntity createVideoFromImages(long settingId) throws Exception {
        TimelapseEntity setting = findById(settingId);
        List<TimelapseImageEntity> images = findBySettingIdOrderByCreatedAtDesc(settingId);
        if (images.isEmpty()) return null;

        String videoFilePath = videoSaveDir + System.currentTimeMillis() + ".mp4";
        File dir = new File(videoSaveDir);
        if (!dir.exists()) dir.mkdirs();

        StringBuilder inputTxt = new StringBuilder();
        for (TimelapseImageEntity img : images) {
            inputTxt.append("file '").append(img.getImageFilePath()).append("'\n");
        }

        File listFile = new File(videoSaveDir, "images.txt");
        try (FileOutputStream fos = new FileOutputStream(listFile)) {
            fos.write(inputTxt.toString().getBytes());
        }

        String cmd = "ffmpeg -y -f concat -safe 0 -i " + listFile.getAbsolutePath() +
                " -r " + setting.getFps() +
                " -pix_fmt yuv420p " + videoFilePath;
        Process p = Runtime.getRuntime().exec(cmd);
        p.waitFor();

        TimelapseVideoEntity video = new TimelapseVideoEntity();
        video.setTimelapseEntity(setting);
        video.setVideoFilePath(videoFilePath);
        video.setSize(setting.getResolution());
        timelapseVideoRepository.save(video);

        return video;
    }

    @Override
    public TimelapseEntity findById(long settingId) {
        return timelapseRepository.findById((int) settingId)
                .orElseThrow(() -> new RuntimeException("설정 없음: " + settingId));
    }

    @Override
    public void save(TimelapseEntity setting) {
        timelapseRepository.save(setting);
    }

    @Override
    public TimelapseEntity findNextStep(long currentSettingId) {
        return timelapseRepository.findFirstBySettingIdGreaterThanAndPresetStepEntityNotNullOrderBySettingId(currentSettingId)
                .orElse(null);
    }

    @Override
    public TimelapseEntity findFullVideoSetting(long farmId) {
        return timelapseRepository.findFirstByFarmEntity_FarmIdAndPresetStepEntityIsNull(farmId)
                .orElse(null);
    }
}
