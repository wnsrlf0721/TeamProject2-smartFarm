package com.nova.backend.farm.repository;

import com.nova.backend.farm.Entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FarmRepository extends JpaRepository<Farm,Integer> {
    List<Farm> findByNova_NovaId(int novaId);
    @Query("SELECT f FROM Farm f " +
            "JOIN FETCH f.presetStep s " +
            "JOIN FETCH s.preset p " +
            "WHERE f.nova.novaId = :novaId")
    List<Farm> findFarmsWithDetailsByNovaId(@Param("novaId") int novaId);
}
