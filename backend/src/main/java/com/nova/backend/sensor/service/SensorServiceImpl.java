package com.nova.backend.sensor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nova.backend.alarm.service.AlarmService;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.sensor.dao.SensorLogDAO;
import com.nova.backend.sensor.dto.SensorCurrentDTO;
import com.nova.backend.sensor.dto.SensorHistoryDTO;
import com.nova.backend.sensor.dto.SensorPointDTO;
import com.nova.backend.sensor.entity.SensorLogEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SensorServiceImpl implements SensorService {
    private final SensorLogDAO sensorLogDAO;
    private final FarmRepository farmRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;
    private final AlarmService alarmService;

    @Override
    @Transactional
    public void controlSensorData(String payload, String novaSerialNumber, int slot) throws JsonProcessingException {
        //novaNumber랑 slot을 통해 farm Entity를 찾아오는 메서드 구현 -> return farm
        //farm을 payload에 추가하고, 해당 payload를 SensorEntity로 mapper
        FarmEntity farm = farmRepository.findByNova_NovaSerialNumberAndSlot(novaSerialNumber, slot)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Farm"));
        SensorCurrentDTO sensorDTO = objectMapper.readValue(payload, SensorCurrentDTO.class);
        SensorLogEntity sensorLog = modelMapper.map(sensorDTO, SensorLogEntity.class);
        sensorLog.setFarm(farm);
        saveSensorLog(sensorLog);
    }

    @Override
    @Transactional
    public void saveSensorLog(SensorLogEntity sensorLog) {
        if (sensorLog == null || sensorLog.getFarm() == null) {
            throw new IllegalArgumentException("SensorLog 또는 Farm 정보가 없습니다.");
        }
        // 센서 로그값 저장
        sensorLogDAO.save(sensorLog);
        // 프리셋 기준 판단
        checkThreshold(sensorLog);
    }

    @Override
    public SensorCurrentDTO getCurrentSensor(Long farmId) {
        FarmEntity farm = farmRepository.findById(farmId).orElse(null);
        if (farm == null) return null;
        SensorLogEntity log = sensorLogDAO.findLatestByFarm(farm);
        if (log == null) return null;
        SensorCurrentDTO dto = new SensorCurrentDTO();
        dto.setTemp(log.getTemp());
        dto.setHumidity(log.getHumidity());
        dto.setSoilMoisture(log.getSoilMoisture());
        dto.setLightPower(log.getLightPower());
        dto.setCo2(log.getCo2());
        dto.setWaterLevel(log.getWaterLevel());

        return dto;
        // Entity → DTO
//        return modelMapper.map(log, SensorCurrentDTO.class);
    }

    @Override
    public SensorHistoryDTO getSensorHistory(Long farmId) {
        FarmEntity farm = farmRepository.findById(farmId).orElse(null);
        if (farm == null) return null;
        List<SensorLogEntity> logs =
                sensorLogDAO.findRecentLogsByFarm(farm);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return SensorHistoryDTO.builder()
                .temperature(toPoints(logs, formatter, "temp"))
                .humidity(toPoints(logs, formatter, "humidity"))
                .soilMoisture(toPoints(logs, formatter, "soilMoisture"))
                .light(toPoints(logs, formatter, "light"))
                .co2(toPoints(logs, formatter, "co2"))
                .build();
    }

    @Override
    public void createSensorAlarm(FarmEntity farm, String type, String title, String message) {
        alarmService.createSensorAlarm(
                farm,
                "SENSOR",
                title,
                message
        );
    }

    // 그래프용 공통 변환 메소드
    private List<SensorPointDTO> toPoints(
            List<SensorLogEntity> logs,
            DateTimeFormatter formatter,
            String type
    ) {
        return logs.stream()
                .map(log -> SensorPointDTO.builder()
                        .time(log.getRecordTime().format(formatter))
                        .value(getValue(log, type))
                        .build()
                )
                .collect(Collectors.toList());
    }

    private float getValue(SensorLogEntity log, String type) {
        return switch (type) {
            case "temp" -> log.getTemp();
            case "humidity" -> log.getHumidity();
            case "soilMoisture" -> log.getSoilMoisture();
            case "light" -> log.getLightPower();
            case "co2" -> log.getCo2();
            default -> 0f;
        };
    }

    private float getMin(String json) {
        try {
            return (float) new ObjectMapper()
                    .readTree(json)
                    .get("min")
                    .asDouble();
        } catch (Exception e) {
            throw new IllegalArgumentException("min 파싱 실패: " + json);
        }
    }

    private float getMax(String json) {
        try {
            return (float) new ObjectMapper()
                    .readTree(json)
                    .get("max")
                    .asDouble();
        } catch (Exception e) {
            throw new IllegalArgumentException("max 파싱 실패: " + json);
        }
    }

    private void checkThreshold(SensorLogEntity log) {
        FarmEntity farm = log.getFarm();
        if (farm == null) return;
        PresetStepEntity step = farm.getPresetStep();
        if (step == null) return;
        // 온도
        if (log.getTemp() < step.getTemp().getMin() || log.getTemp() > step.getTemp().getMax()) {
            alarmService.createSensorAlarm(
                    farm,
                    "SENSOR",
                    "온도 이상",
                    "온도가 기준 범위를 벗어났습니다. (현재 온도: " + log.getTemp() + "℃)"
            );
        }
        // 습도
        if (log.getHumidity() < step.getTemp().getMin() || log.getHumidity() > step.getTemp().getMax()) {
            alarmService.createSensorAlarm(
                    farm,
                    "SENSOR",
                    "습도 이상",
                    "습도가 기준 범위를 벗어났습니다. (현재 습도: " + log.getHumidity() + "%)"
            );
        }
        // 토양 수분
        if (log.getSoilMoisture() < step.getSoilMoisture().getMin() || log.getSoilMoisture() > step.getSoilMoisture().getMax()) {
            alarmService.createSensorAlarm(
                    farm,
                    "SENSOR",
                    "토양 수분 이상",
                    "토양 수분이 기준 범위를 벗어났습니다. (현재 토양 수분: " + log.getSoilMoisture() + "%)"
            );
        }
        // 광량
        if (log.getLightPower() < step.getLightPower().getMin() || log.getLightPower() > step.getLightPower().getMax()) {
            alarmService.createSensorAlarm(
                    farm,
                    "SENSOR",
                    "광량 이상",
                    "광량이 기준 범위를 벗어났습니다. (현재 광량: " + log.getLightPower() + "%)"
            );
        }
        // CO2
        if (log.getCo2() < step.getCo2().getMin() || log.getCo2() > step.getCo2().getMax()) {
            alarmService.createSensorAlarm(
                    farm,
                    "SENSOR",
                    "CO₂ 이상",
                    "CO₂ 수치가 기준 범위를 벗어났습니다. (현재 CO₂: " + log.getCo2() + "%)"
            );
        }
    }
}