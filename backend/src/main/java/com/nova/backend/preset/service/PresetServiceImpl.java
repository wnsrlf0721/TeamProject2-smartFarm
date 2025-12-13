package com.nova.backend.preset.service;

import com.nova.backend.preset.dao.PresetDAO;
import com.nova.backend.preset.dto.PresetRequestDTO;
import com.nova.backend.preset.dto.PresetResponseDTO;
import com.nova.backend.preset.entity.Preset;
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
        Preset preset = mapper.map(presetRequestDTO, Preset.class);
        presetDAO.insertPreset(preset);
    }

    @Override
    public List<PresetResponseDTO> findPresetListByUserId(int userId) {
        List<Preset> presetListByUserId = presetDAO.findPresetListByUserId(userId);

        return presetListByUserId.stream().map(preset -> mapper.map(preset,PresetResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void updatePreset() {

    }

    @Override
    public void deletePreset() {

    }
}
