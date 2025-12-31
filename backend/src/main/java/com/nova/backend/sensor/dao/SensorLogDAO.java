package com.nova.backend.sensor.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.sensor.entity.SensorLogEntity;

import java.util.List;

public interface SensorLogDAO {
    // 센서 로그 저장
    void save(SensorLogEntity sensorLog);

    // 센서바에 사용할 현재 센서 값(상태) 1건
    SensorLogEntity findLatestByFarm(FarmEntity farm);

    // 센서 변화를 그래프용으로 사용할 로그 (시간순 정렬로 최근 n개)
    List<SensorLogEntity> findRecentLogsByFarm(FarmEntity farm);

}
