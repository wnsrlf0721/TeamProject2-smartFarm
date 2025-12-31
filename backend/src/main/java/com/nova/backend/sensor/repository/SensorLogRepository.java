package com.nova.backend.sensor.repository;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.sensor.entity.SensorLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 현재 실시간 센서값 + 히스토리 조회
@Repository
public interface SensorLogRepository extends JpaRepository<SensorLogEntity,Long> {
    // 최신 1개
    Optional<SensorLogEntity> findTopByFarmOrderByRecordTimeDesc(FarmEntity farm);

    // 최근 100개 (그래프에 찍을거)
    List<SensorLogEntity> findTop100ByFarmOrderByRecordTimeDesc(FarmEntity farm);
}
