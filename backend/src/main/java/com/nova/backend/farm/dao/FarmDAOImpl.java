package com.nova.backend.farm.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FarmDAOImpl implements FarmDAO{
    private final FarmRepository farmRepository;
    @Override
    public void save(FarmEntity farmEntity) {
        farmRepository.save(farmEntity);
    }

    @Override
    public List<FarmEntity> findListByNovaId(Long novaId) {
        return farmRepository.findByNova_NovaId(novaId);
    }
    @Override
    public List<FarmEntity> findFarmsPresetStepsByNovaId(Long novaId){
        return farmRepository.findFarmsWithDetailsByNovaId(novaId);
    }

    @Override
    public Optional<FarmEntity> findById(Long farmId) {
        return farmRepository.findById(farmId);
    }
}
