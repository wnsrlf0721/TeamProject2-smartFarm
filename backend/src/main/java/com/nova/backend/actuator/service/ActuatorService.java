package com.nova.backend.actuator.service;

import com.nova.backend.actuator.dto.ActuatorLogResponseDTO;
import com.nova.backend.actuator.dto.ActuatorTypeDTO;
import com.nova.backend.actuator.dto.WateringRequestDTO;
import com.nova.backend.actuator.dto.WateringResponseDTO;
import com.nova.backend.farm.entity.FarmEntity;

import java.util.List;

public interface ActuatorService {
    // 엑추에이터 로그 조회 (farm 기준)
    List<ActuatorLogResponseDTO> getActuatorLogs(Long farmId);

    // 물주기
    WateringResponseDTO waterPlant(Long farmId, WateringRequestDTO request);

    // 전체 액추에이터 동작
    void control(FarmEntity farm, String actType, String action, String sensorType, float sensorValue);

    // 광량 블라인드용
    void controlBlind(Long farmId, String action, float lightValue);
}
