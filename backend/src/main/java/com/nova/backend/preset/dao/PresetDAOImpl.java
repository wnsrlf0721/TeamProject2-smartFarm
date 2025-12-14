package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.repository.PresetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
@RequiredArgsConstructor
public class PresetDAOImpl implements PresetDAO {
    private final PresetRepository presetRepository;

    @Override
    public void insertPreset(PresetEntity presetEntity) {
        presetRepository.save(presetEntity);
    }

    @Override
    public List<PresetEntity> findPresetListByUserId(Long userId) {
        return presetRepository.findCustomOrSystemPresets(userId);
    }

    @Override
    public void updatePreset() {
        
    }

    @Override
    public void deletePreset() {

    }
}
