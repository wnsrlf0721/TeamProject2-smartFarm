package com.nova.backend.alarm.dao;

import com.nova.backend.alarm.entity.PlantAlarmEntity;
import com.nova.backend.farm.entity.FarmEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface AlarmDAO {
    void save(PlantAlarmEntity alarm);
    List<PlantAlarmEntity> findRecentByFarm(FarmEntity farm);
    List<PlantAlarmEntity> findTodayByFarm(FarmEntity farm, LocalDateTime start, LocalDateTime end);
    List<PlantAlarmEntity> findUnreadByFarm(FarmEntity farm);
    List<PlantAlarmEntity> findAllByFarm(FarmEntity farm);
}
