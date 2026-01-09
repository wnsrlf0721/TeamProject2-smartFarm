package com.nova.backend.timelapse.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.mqtt.MyPublisher;
import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.preset.repository.PresetStepRepository;
import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.nova.backend.timelapse.dto.TimelapseCommand;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseImageEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import com.nova.backend.farm.entity.FarmEntity;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TimelapseServiceImpl implements TimelapseService {
    private final TimelapseDAO timelapseDAO;
    private final FarmRepository farmRepository;
    private final PresetStepRepository presetStepRepository;
    private final NovaDAO novaDAO;
    private final FarmDAO farmDAO;
    private final ModelMapper modelMapper;
    private final MyPublisher publisher;
    private final ObjectMapper objectMapper;
    private final TimelapseVideoService timelapseVideoService;

    public List<TimelapseResponseDTO> getTimelapseListByFarmId(long farmId) {
        List<TimelapseEntity> timelapseList = timelapseDAO.findByFarmEntity_FarmId(farmId);

        return timelapseList.stream()
                .map(timelapse -> {
                    TimelapseResponseDTO dto = modelMapper.map(timelapse, TimelapseResponseDTO.class);

                    List<TimelapseVideoResponseDTO> videos = timelapse.getVideoList().stream()
                                    .map(video -> modelMapper.map(video, TimelapseVideoResponseDTO.class))
                                    .toList();

                    dto.setVideoList(videos); // DTO에 List 추가
                    return dto;
                })
                .toList();
    }

    @Override
    @Transactional
    public void createTimelapse(List<TimelapseRequestDTO> timelapseRequestDTOList) {

        List<TimelapseEntity> entityList = timelapseRequestDTOList.stream()
                .map(dto -> {

                    FarmEntity farm = farmRepository.findById(dto.getFarmId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "존재하지 않는 farmId: " + dto.getFarmId()));

                    PresetStepEntity step = null;

                    // ✅ stepId가 있는 경우만 조회
                    if (dto.getStepId() != null) {
                        step = presetStepRepository.findById(dto.getStepId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                        "존재하지 않는 stepId: " + dto.getStepId()));
                    }

                    TimelapseEntity entity = new TimelapseEntity();
                    entity.setFarmEntity(farm);
                    entity.setPresetStepEntity(step); // ⭐ null 허용
                    entity.setTimelapseName(dto.getTimelapseName());
                    entity.setFps(dto.getFps());
                    entity.setDuration(dto.getDuration());
                    if (step == null) {
                        entity.setCaptureInterval(dto.getCaptureInterval());
                    } else if (step != null) {
//                        entity.setCaptureInterval(step.getPeriodDays() * 60 / (dto.getFps() * dto.getDuration()));
                        entity.setCaptureInterval(step.getPeriodDays() * 86400 / (dto.getFps() * dto.getDuration()));
                    }
                    entity.setResolution(dto.getResolution());
                    entity.setState(dto.getState());

                    return entity;
                })
                .collect(Collectors.toList());

        timelapseDAO.createTimelapse(entityList);
    }

    @Override
    /** 특정 농장 타임랩스 시작 */
    public void startTimelapseForFarm(long farmId) {
        FarmEntity farmEntity = farmDAO.findById(farmId).orElseThrow(() -> new IllegalArgumentException());
        TimelapseEntity processing = timelapseDAO.findByFarmEntity_FarmIdAndState(farmId, "PROCESSING");
        if (processing != null) {
            System.out.println("이미 PROCESSING 중인 타임랩스 존재:" + processing.getSettingId());
            return;
        }

        TimelapseEntity firstStep = timelapseDAO.findByFarmEntity_FarmId(farmId).stream()
                .filter(s -> s.getPresetStepEntity() != null)
                .sorted((a, b) -> Integer.compare(a.getSettingId(), b.getSettingId()))
                .findFirst().orElse(null);

        if (firstStep != null) {
            firstStep.setState("PROCESSING");
            timelapseDAO.save(firstStep);

            try {
                // 테스트 용으로 촬영 기간 수정한 코드
                // TimelapseCommand에서 Duration은 촬영 기간을 의미
                // DB에서는 일(day) 단위로 저장돼 있지만 값을 전달할 때 초로 변환해야 돼서 86400을 곱함
                // 지금은 테스트 용으로 분 단위로 변경 60을 곱함
                // 관련 코드들도 동일하게 수정 -> 95라인, 246라인
                String[] widthAndHeight = firstStep.getResolution().split("x");
                TimelapseCommand command = new TimelapseCommand(
                        "start",
                        firstStep.getCaptureInterval(),
//                        firstStep.getDuration() * 60,
                        firstStep.getDuration() * 86400,
                        Integer.parseInt(widthAndHeight[0]),
                        Integer.parseInt(widthAndHeight[1]));
                String payload = objectMapper.writeValueAsString(command);
                String topic = String.format("%s/%d/TIMELAPSE",farmEntity.getNova().getNovaSerialNumber(), farmEntity.getSlot());

                publisher.sendToMqtt(payload, topic);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    /** 사진 저장 처리 */
    public void saveImage(String novaSerialNumber, int slot, String payload) {
        try {
            long novaId = novaDAO.findNovaIdByNovaSerialNumber(novaSerialNumber).getNovaId();
            FarmEntity farmEntity = farmDAO.findByNova_NovaIdAndSlot(novaId, slot);
            long farmId = farmEntity.getFarmId();

            // ✅ 현재 진행 중인 타임랩스 기준
            TimelapseEntity setting =
                    timelapseDAO.findByFarmEntity_FarmIdAndState(farmId, "PROCESSING");

            if (setting == null) {
                System.out.println("PROCESSING 상태의 타임랩스가 없음");
                return;
            }

            JsonNode json = objectMapper.readTree(payload);

            int index = json.get("index").asInt();
            String base64Image = json.get("image").asText();

            // 1️⃣ base64 → byte[]
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // 2️⃣ 저장 경로 생성
            String baseDir = "/data/timelapse";
            String dirPath = baseDir + "/farm_" + farmId + "/setting_" + setting.getSettingId();
            Files.createDirectories(Paths.get(dirPath));

            // 3️⃣ 파일명 생성
            String fileName = String.format("frame_%06d.jpg", index);
            Path filePath = Paths.get(dirPath, fileName);

            // 🔒 중복 방지 (MQTT 재전송 / 재부팅 대비)
            if (Files.exists(filePath)) {
                System.out.println("이미 존재하는 프레임: " + filePath);
                return;
            }

            // 4️⃣ 파일 저장
            try {
                Files.write(filePath, imageBytes);
            } catch (IOException e) {
                System.out.println("이미지 파일 저장 실패: " + filePath);
                return;
            }

            // 5️⃣ DB에는 경로만 저장
            TimelapseImageEntity timelapseImageEntity = new TimelapseImageEntity(setting, filePath.toString());
            timelapseDAO.saveImagePath(timelapseImageEntity);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    /** 단계 완료 처리 및 영상 생성 */
    public void completeStep(String novaSerialNumber, int slot, String payload) {
        try {
            // 1️⃣ Nova → Farm 조회
            long novaId = novaDAO.findNovaIdByNovaSerialNumber(novaSerialNumber).getNovaId();
            FarmEntity farmEntity = farmDAO.findByNova_NovaIdAndSlot(novaId, slot);
            long farmId = farmEntity.getFarmId();

            // 2️⃣ 현재 PROCESSING 중인 step 조회
            TimelapseEntity current =
                    timelapseDAO.findByFarmEntity_FarmIdAndState(farmId, "PROCESSING");

            if (current == null) {
                System.out.println("완료 처리할 PROCESSING step 없음");
                return;
            }

            long settingId = current.getSettingId();

            // 3️⃣ 현재 step 완료 처리
            current.setState("COMPLETED");
            timelapseDAO.save(current);

            // 4️⃣ 로컬 이미지 → 영상 생성
            timelapseVideoService.renderVideo(settingId);

            // 5️⃣ 다음 step 조회
            TimelapseEntity nextStep = timelapseDAO.findNextStep(settingId);
            if (nextStep != null) {
                nextStep.setState("PROCESSING");
                timelapseDAO.save(nextStep);

                try {
                    String[] widthAndHeight = nextStep.getResolution().split("x");
                    TimelapseCommand command = new TimelapseCommand(
                            "start",
                            nextStep.getCaptureInterval(),
//                            nextStep.getDuration() * 60,
                            nextStep.getDuration() * 86400,
                            Integer.parseInt(widthAndHeight[0]),
                            Integer.parseInt(widthAndHeight[1])
                            );
                    String nextPayload = objectMapper.writeValueAsString(command);
                    String topic = String.format("%s/%d/TIMELAPSE",novaSerialNumber, slot);

                    publisher.sendToMqtt(nextPayload, topic);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            } else {
                // 6️⃣ 모든 step 종료 → 전체 타임랩스 생성
                TimelapseEntity fullSetting =
                        timelapseDAO.findFullVideoSetting(farmId);

                if (fullSetting != null) {
                    timelapseVideoService.mergeStepVideos(farmId, fullSetting.getSettingId());
                    fullSetting.setState("COMPLETED");
                    timelapseDAO.save(fullSetting);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
