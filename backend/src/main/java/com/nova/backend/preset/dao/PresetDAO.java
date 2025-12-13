package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.Preset;

import java.util.List;

public interface PresetDAO {
    void insertPreset(Preset preset);
    List<Preset> findPresetListByUserId(int userId);
    void updatePreset();
    void deletePreset();
}
