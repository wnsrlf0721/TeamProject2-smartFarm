package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetStepEntity;

import java.util.List;
import java.util.Optional;

public interface PresetStepDAO {
    PresetStepEntity save(PresetStepEntity presetStep);
    Optional<PresetStepEntity> findById(Long stepId);
    List<PresetStepEntity> findAllByPresetId(Long presetId);
    void deleteById(Long stepId);
}
