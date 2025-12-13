package com.nova.backend.farm.dao;

import com.nova.backend.farm.Entity.Farm;

import java.util.List;

public interface FarmDAO {
    void save(Farm farm);
    List<Farm> findListByNovaId(int novaId);
    List<Farm> findFarmsPresetStepsByNovaId(int novaId);
}
