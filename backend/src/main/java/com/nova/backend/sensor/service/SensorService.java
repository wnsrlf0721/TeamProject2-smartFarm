package com.nova.backend.sensor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.sensor.dto.SensorCurrentDTO;
import com.nova.backend.sensor.dto.SensorHistoryDTO;
import com.nova.backend.sensor.entity.SensorLogEntity;

public interface SensorService {
    // 센서데이터 저장 (라즈베리파이 > 서버) >> 나중에 mqtt에서 해야될듯?
    void saveSensorLog(SensorLogEntity sensorLog);

    // 현재 센서값 조회 (최신 1개) - 대시보드 센서바 표시용
    SensorCurrentDTO getCurrentSensor(Long farmId);

    // 센서값 히스토리 조회 (최신 100개) - 대시보드 그래프용
    SensorHistoryDTO getSensorHistory(Long farmId);

    // 알람 생성
    void createSensorAlarm(
            FarmEntity farm,
            String type,
            String title,
            String message
    );
    // Mqtt에서 넘어온 Sensor 값을 처리하는 메서드
    void controlSensorData(String payload, String novaSerialNumber, int slot) throws JsonProcessingException;
}
