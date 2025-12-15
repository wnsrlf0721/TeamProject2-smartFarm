package com.nova.backend.farm.repository;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.nova.entity.NovaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FarmRepository extends JpaRepository<FarmEntity,Long> {
    List<FarmEntity> findByNova_NovaId(Long novaId);
    @Query("SELECT f FROM FarmEntity f " +
            "JOIN FETCH f.presetStep s " +
            "JOIN FETCH s.preset p " +
            "WHERE f.nova.novaId = :novaId")
    List<FarmEntity> findFarmsWithDetailsByNovaId(@Param("novaId") Long novaId);

    // Nova(기기) 안에서 슬롯으로 팜 찾기
    Optional<FarmEntity> findByNovaAndSlot(NovaEntity nova, int slot);

    //    // slot만으로 찾고 싶다면 (기기에 슬롯이 unique라면)
//    Optional<FarmEntity> findBySlot(int slot);


}
