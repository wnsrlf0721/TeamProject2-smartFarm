package com.nova.backend.timelapse.service;

import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.preset.repository.PresetRepository;
import com.nova.backend.preset.repository.PresetStepRepository;
import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.timelapse.entity.TimelapseEntity;
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
    private final ModelMapper modelMapper;

    public List<TimelapseResponseDTO> getTimelapseListByFarmId(int farmId) {
        List<TimelapseEntity> timelapseList = timelapseDAO.findWithVideosByFarmId(farmId);

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

                    PresetStepEntity step = presetStepRepository.findById(dto.getStepId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "존재하지 않는 stepId: " + dto.getStepId()));

                    TimelapseEntity entity = new TimelapseEntity();
                    entity.setFarmEntity(farm);              // ⭐ 필수
                    entity.setPresetStepEntity(step);        // ⭐ 필수
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
}
