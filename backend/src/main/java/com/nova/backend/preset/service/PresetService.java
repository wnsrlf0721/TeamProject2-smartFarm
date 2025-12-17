package com.nova.backend.preset.service;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.preset.dto.PresetInfoDTO;
import com.nova.backend.preset.dto.PresetRequestDTO;
import com.nova.backend.preset.dto.PresetResponseDTO;
import com.nova.backend.preset.dto.StepResponseDTO;

import java.util.List;

public interface PresetService {
    void insertPreset(PresetRequestDTO preset);
    List<PresetResponseDTO> findPresetListByUserId(Long userId);
    void updatePreset();
    void deletePreset();
    List<StepResponseDTO> getPresetWithSteps(Long presetId);
    PresetInfoDTO getPresetInfo(FarmEntity farm);
}
