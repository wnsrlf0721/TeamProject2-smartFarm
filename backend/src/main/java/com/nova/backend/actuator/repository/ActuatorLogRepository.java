package com.nova.backend.actuator.repository;

import com.nova.backend.actuator.entity.ActuatorLogEntity;
import com.nova.backend.farm.entity.FarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 작치 작동 로그 조회
@Repository
public interface ActuatorLogRepository extends JpaRepository<ActuatorLogEntity,Long> {
    // 최신 20개 ?? 정도 로그
    List<ActuatorLogEntity> findTop20ByFarmOrderByCreatedAtDesc(FarmEntity farm);
    // 특정 팜의 모든 엑추에이터 로그 최신순 (히스토리용, 필요 시)
    List<ActuatorLogEntity> findByFarmOrderByCreatedAtDesc(FarmEntity farm);
}
