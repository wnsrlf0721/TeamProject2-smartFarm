package com.nova.backend.preset.service;

import com.nova.backend.preset.dto.PresetRequestDTO;
import com.nova.backend.preset.dto.PresetResponseDTO;

import java.util.List;

public interface PresetService {
    void insertPreset(PresetRequestDTO preset);
    List<PresetResponseDTO> findPresetListByUserId(int userId);
    void updatePreset();
    void deletePreset();
}
