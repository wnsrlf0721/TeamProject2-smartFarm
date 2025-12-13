package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetStep;

import java.util.List;
import java.util.Optional;

public interface PresetStepDAO {
    PresetStep save(PresetStep presetStep);
    Optional<PresetStep> findById(int stepId);
    List<PresetStep> findAllByPresetId(int presetId);
    void deleteById(int stepId);
}
