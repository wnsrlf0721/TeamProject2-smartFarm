package com.nova.backend.preset.dao;

import com.nova.backend.preset.entity.PresetStepEntity;
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
    public PresetStepEntity save(PresetStepEntity presetStep) {
        return presetStepRepository.save(presetStep);
    }

    @Override
    public Optional<PresetStepEntity> findById(Long stepId) {
        return presetStepRepository.findById(stepId);
    }

    @Override
    public List<PresetStepEntity> findAllByPresetId(Long presetId) {
//        return presetStepRepository.findByPreset_PresetId(presetId);
        return null;
    }

    @Override
    public void deleteById(Long stepId) {
        presetStepRepository.deleteById(stepId);
    }
}