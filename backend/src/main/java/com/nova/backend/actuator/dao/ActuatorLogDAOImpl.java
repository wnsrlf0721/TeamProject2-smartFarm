package com.nova.backend.actuator.dao;

import com.nova.backend.actuator.entity.ActuatorLogEntity;
import com.nova.backend.actuator.repository.ActuatorLogRepository;
import com.nova.backend.farm.entity.FarmEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
@RequiredArgsConstructor
public class ActuatorLogDAOImpl implements ActuatorLogDAO {
    private final ActuatorLogRepository actuatorLogRepository;

    @Override
    public void save(ActuatorLogEntity actuatorLog) {
        actuatorLogRepository.save(actuatorLog);
    }

    @Override
    public List<ActuatorLogEntity> findRecentByFarm(FarmEntity farm) {
        return actuatorLogRepository.findTop20ByFarmOrderByCreatedAtDesc(farm);
    }
}
