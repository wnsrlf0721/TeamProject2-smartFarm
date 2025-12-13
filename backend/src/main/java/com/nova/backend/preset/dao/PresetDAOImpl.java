package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.Preset;
import com.nova.backend.preset.repository.PresetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
@RequiredArgsConstructor
public class PresetDAOImpl implements PresetDAO {
    private final PresetRepository presetRepository;

    @Override
    public void insertPreset(Preset preset) {
        presetRepository.save(preset);
    }

    @Override
    public List<Preset> findPresetListByUserId(int userId) {
        return presetRepository.findByUserId(userId);
    }

    @Override
    public void updatePreset() {
        
    }

    @Override
    public void deletePreset() {

    }
}
