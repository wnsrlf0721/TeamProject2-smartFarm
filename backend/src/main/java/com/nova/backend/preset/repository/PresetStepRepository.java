package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.PresetStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresetStepRepository extends JpaRepository<PresetStep, Integer> {
    List<PresetStep> findByPresetEntity_PresetId(int presetId);
}
