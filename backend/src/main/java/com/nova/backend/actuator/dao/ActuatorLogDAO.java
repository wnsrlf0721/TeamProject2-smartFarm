package com.nova.backend.actuator.dao;

import com.nova.backend.actuator.entity.ActuatorLogEntity;
import com.nova.backend.farm.entity.FarmEntity;

import java.util.List;

public interface ActuatorLogDAO {
    // 엑추에이터 로그 저장 (물주기, 자동제어 등)
    void save(ActuatorLogEntity actuatorLog);

    // 특정 팜의 최근 엑추에이터 로그 조회 (대시보드용)
    List<ActuatorLogEntity> findRecentByFarm(FarmEntity farm);
}
