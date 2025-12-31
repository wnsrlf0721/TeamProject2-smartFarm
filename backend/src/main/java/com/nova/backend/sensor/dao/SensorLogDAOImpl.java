package com.nova.backend.sensor.dao;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.sensor.entity.SensorLogEntity;
import com.nova.backend.sensor.repository.SensorLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SensorLogDAOImpl implements SensorLogDAO {
    private final SensorLogRepository sensorLogRepository;

    @Override
    public void save(SensorLogEntity sensorLog) {
        sensorLogRepository.save(sensorLog);
    }

    @Override
    public SensorLogEntity findLatestByFarm(FarmEntity farm) {
        return sensorLogRepository
                .findTopByFarmOrderByRecordTimeDesc(farm)
                .orElse(null); //아직 센서로그 없으니까
    }

    @Override
    public List<SensorLogEntity> findRecentLogsByFarm(FarmEntity farm) {
        return sensorLogRepository.findTop100ByFarmOrderByRecordTimeDesc(farm);
    }
}
