package com.nova.backend.preset.service;

import com.nova.backend.preset.dao.PresetDAO;
import com.nova.backend.preset.dto.PresetRequestDTO;
import com.nova.backend.preset.dto.PresetResponseDTO;
import com.nova.backend.preset.entity.PresetEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresetServiceImpl implements PresetService{
    private final PresetDAO presetDAO;
    private final ModelMapper mapper;
    @Override
    public void insertPreset(PresetRequestDTO presetRequestDTO) {
        PresetEntity presetEntity = mapper.map(presetRequestDTO, PresetEntity.class);
        presetDAO.insertPreset(presetEntity);
    }

    @Override
    public List<PresetResponseDTO> findPresetListByUserId(int userId) {
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
}
