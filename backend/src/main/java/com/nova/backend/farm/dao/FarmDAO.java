package com.nova.backend.farm.dao;

import com.nova.backend.farm.entity.FarmEntity;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface FarmDAO {
    Optional<FarmEntity> save(FarmEntity farmEntity);
    List<FarmEntity> findListByNovaId(Long novaId);
    List<FarmEntity> findFarmsPresetStepsByNovaId(Long novaId);
    Optional<FarmEntity> findById(Long farmId);
    FarmEntity findByNova_NovaIdAndSlot(Long novaId, int slot);
    List<FarmEntity> findFarmListToGrow(Timestamp now);
}
