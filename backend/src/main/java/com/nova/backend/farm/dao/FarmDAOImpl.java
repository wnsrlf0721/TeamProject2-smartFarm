package com.nova.backend.farm.dao;

import com.nova.backend.farm.Entity.Farm;
import com.nova.backend.farm.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FarmDAOImpl implements FarmDAO{
    private final FarmRepository farmRepository;
    @Override
    public void save(Farm farm) {
        farmRepository.save(farm);
    }

    @Override
    public List<Farm> findListByNovaId(int novaId) {
        return farmRepository.findByNova_NovaId(novaId);
    }
    @Override
    public List<Farm> findFarmsPresetStepsByNovaId(int novaId){
        return farmRepository.findFarmsWithDetailsByNovaId(novaId);
    }

}
