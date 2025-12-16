package com.nova.backend.timelapse.service;

import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.mqtt.MyPublisher;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.preset.repository.PresetStepRepository;
import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
import com.nova.backend.timelapse.entity.TimelapseVideoEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import com.nova.backend.farm.entity.FarmEntity;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TimelapseServiceImpl implements TimelapseService {
    private final TimelapseDAO timelapseDAO;
    private final FarmRepository farmRepository;
    private final PresetStepRepository presetStepRepository;
    private final FarmDAO farmDAO;
    private final ModelMapper modelMapper;
    private final MyPublisher publisher;

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
                    entity.setCaptureInterval(dto.getCaptureInterval());
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
        TimelapseEntity firstStep = timelapseDAO.findByFarmEntity_FarmId(farmId).stream()
                .filter(s -> s.getPresetStepEntity() != null)
                .sorted((a, b) -> Integer.compare(a.getSettingId(), b.getSettingId()))
                .findFirst().orElse(null);

        if (firstStep != null) {
            firstStep.setState("PROCESSING");
            timelapseDAO.save(firstStep);
            publisher.sendToMqtt("start", "home/timelapse/command/" + firstStep.getSettingId());
        }
    }

    @Override
    /** 사진 저장 처리 */
    public void saveImage(long settingId, String base64Data) {
        try {
            timelapseDAO.saveImageAndUpdateDB(base64Data, settingId);

            TimelapseEntity setting = timelapseDAO.findById(settingId);
            if (!"PROCESSING".equals(setting.getState())) {
                setting.setState("PROCESSING");
                timelapseDAO.save(setting);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    /** 단계 완료 처리 및 영상 생성 */
    public void completeStep(long settingId) {
        try {
            // 현재 단계 완료 처리
            TimelapseEntity current = timelapseDAO.findById(settingId);
            current.setState("COMPLETED");
            timelapseDAO.save(current);

            // 영상 생성
            TimelapseVideoEntity video = timelapseDAO.createVideoFromImages(settingId);
            if (video != null) {
                publisher.sendToMqtt("done", "home/timelapse/command/" + settingId);
            }

            // 다음 단계 가져오기
            TimelapseEntity nextStep = timelapseDAO.findNextStep(settingId);
            if (nextStep != null) {
                nextStep.setState("PROCESSING");
                timelapseDAO.save(nextStep);
                publisher.sendToMqtt("start", "home/timelapse/command/" + nextStep.getSettingId());
            } else {
                // 전체 영상 생성
                TimelapseEntity fullSetting = timelapseDAO.findFullVideoSetting(current.getFarmEntity().getFarmId());
                if (fullSetting != null) {
                    timelapseDAO.createVideoFromImages(fullSetting.getSettingId());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
