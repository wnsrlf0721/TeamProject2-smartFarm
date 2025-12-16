package com.nova.backend.actuator.service;

import com.nova.backend.actuator.dto.ActuatorLogResponseDTO;
import com.nova.backend.actuator.dto.WateringRequestDTO;
import com.nova.backend.actuator.dto.WateringResponseDTO;

import java.util.List;

public interface ActuatorService {
    // 수동 물주기 실행
    WateringResponseDTO water(WateringRequestDTO request);

    // 엑추에이터 로그 조회 (farm 기준)
    List<ActuatorLogResponseDTO> getActuatorLogs(Long farmId);

    // 물주기
    WateringResponseDTO waterPlant(Long farmId, WateringRequestDTO request);

    // 광량 블라인드용
    void controlBlind(Long farmId, String action, float lightValue);
}
