package com.nova.backend.preset.service;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.preset.dao.PresetDAO;
import com.nova.backend.preset.dao.PresetStepDAO;
import com.nova.backend.preset.dto.PresetInfoDTO;
import com.nova.backend.preset.dto.PresetRequestDTO;
import com.nova.backend.preset.dto.PresetResponseDTO;
import com.nova.backend.preset.dto.StepResponseDTO;
import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresetServiceImpl implements PresetService{
    private final PresetDAO presetDAO;
    private final PresetStepDAO presetStepDAO;
    private final ModelMapper mapper;
    @Override
    public void insertPreset(PresetRequestDTO presetRequestDTO) {
        PresetEntity presetEntity = mapper.map(presetRequestDTO, PresetEntity.class);
        presetDAO.insertPreset(presetEntity);
    }

    @Override
    public List<PresetResponseDTO> findPresetListByUserId(Long userId) {
        List<PresetEntity> presetEntityListByUserId = presetDAO.findPresetListByUserId(userId);

        return presetEntityListByUserId.stream().map(preset -> mapper.map(preset,PresetResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void updatePreset() {

    }

    @Override
    public void deletePreset() {

    }

    @Override
    public List<StepResponseDTO> getPresetWithSteps(Long presetId) {
        return presetStepDAO.findAllByPresetId(presetId).stream()
                .map(entity-> mapper.map(entity,StepResponseDTO.class))
                .toList();
    }

    @Override
    public PresetInfoDTO getPresetInfo(FarmEntity farm) {
        PresetStepEntity step = farm.getPresetStep(); // 현재 step
        PresetEntity preset = step.getPreset();

        return PresetInfoDTO.from(preset, step);
    }

}
