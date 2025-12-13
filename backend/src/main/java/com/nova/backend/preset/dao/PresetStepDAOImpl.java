package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetStep;
import com.nova.backend.preset.repository.PresetStepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PresetStepDAOImpl implements PresetStepDAO {

    private final PresetStepRepository presetStepRepository;

    @Override
    public PresetStep save(PresetStep presetStep) {
        return presetStepRepository.save(presetStep);
    }

    @Override
    public Optional<PresetStep> findById(int stepId) {
        return presetStepRepository.findById(stepId);
    }

    @Override
    public List<PresetStep> findAllByPresetId(int presetId) {
        return presetStepRepository.findByPreset_PresetId(presetId);
    }

    @Override
    public void deleteById(int stepId) {
        presetStepRepository.deleteById(stepId);
    }
}