package com.nova.backend.farm.dao;

import com.nova.backend.farm.entity.FarmEntity;

import java.util.List;
import java.util.Optional;

public interface FarmDAO {
    void save(FarmEntity farmEntity);
    List<FarmEntity> findListByNovaId(Long novaId);
    List<FarmEntity> findFarmsPresetStepsByNovaId(Long novaId);
    Optional<FarmEntity> findById(Long farmId);
}
