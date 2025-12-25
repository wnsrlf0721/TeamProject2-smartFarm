package com.nova.backend.preset.repository;

import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// 현재 적용 단계 조회( 팜마다 )
public interface PresetStepRepository extends JpaRepository<PresetStepEntity,Long> {
    List<PresetStepEntity> findByPreset(PresetEntity preset);
    List<PresetStepEntity> findByPreset_PresetId(Long presetId);
    Optional<PresetStepEntity> findFirstByPreset_PresetIdOrderByGrowthStepAsc(Long presetId);
    Optional<PresetStepEntity> findByPreset_PresetIdAndGrowthStep(Long presetId, int growthStep);
}
