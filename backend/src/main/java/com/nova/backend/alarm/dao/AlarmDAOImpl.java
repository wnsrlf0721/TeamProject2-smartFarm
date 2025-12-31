package com.nova.backend.alarm.dao;

import com.nova.backend.alarm.entity.PlantAlarmEntity;
import com.nova.backend.alarm.repository.PlantAlarmRepository;
import com.nova.backend.farm.entity.FarmEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
@RequiredArgsConstructor
public class AlarmDAOImpl implements AlarmDAO {
    private final PlantAlarmRepository plantAlarmRepository;

    @Override
    public void save(PlantAlarmEntity alarm) {
        plantAlarmRepository.save(alarm);
    }

    @Override
    public List<PlantAlarmEntity> findRecentByFarm(FarmEntity farm) {
        return plantAlarmRepository.findTop10ByFarmOrderByCreatedAtDesc(farm);
    }

    @Override
    public List<PlantAlarmEntity> findTodayByFarm(FarmEntity farm, LocalDateTime start, LocalDateTime end) {
        return plantAlarmRepository.findByFarmAndCreatedAtBetweenOrderByCreatedAtDesc(farm,start,end);
    }

    @Override
    public List<PlantAlarmEntity> findUnreadByFarm(FarmEntity farm) {
        return plantAlarmRepository.findByFarmAndIsReadFalseOrderByCreatedAtDesc(farm);
    }

    @Override
    public List<PlantAlarmEntity> findAllByFarm(FarmEntity farm) {
        return plantAlarmRepository.findByFarmOrderByCreatedAtDesc(farm);
    }

}
