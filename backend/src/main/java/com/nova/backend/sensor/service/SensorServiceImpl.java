package com.nova.backend.sensor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nova.backend.actuator.dto.ActuatorTypeDTO;
import com.nova.backend.actuator.service.ActuatorService;
import com.nova.backend.alarm.service.AlarmService;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.preset.entity.EnvRange;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SensorServiceImpl implements SensorService {
    private final SensorLogDAO sensorLogDAO;
    private final FarmRepository farmRepository;
    private final ModelMapper modelMapper;
    private final AlarmService alarmService;
    private final ActuatorService actuatorService;
    private final ObjectMapper objectMapper;
    // 센서값 이상 상태 관리용 Map (알람 중복 방지용)
    // key: farmId + sensorType (ex: "1_TEMP")
    private static final Map<String, String> sensorAlarmState = new ConcurrentHashMap<>();

    private static final Map<String, ActuatorTypeDTO> ACTUATOR_MAP = new HashMap<>();
    static {
        // --- 온도 (Temp) ---
        // 온도가 높을 때 -> 팬 가동 (열 식힘)
        ACTUATOR_MAP.put("TEMP_HIGH", new ActuatorTypeDTO("FAN", "온도","ON/HEATER"));
        // 온도가 낮을 때 -> 히터 가동
        ACTUATOR_MAP.put("TEMP_LOW", new ActuatorTypeDTO("HEATER", "온도","ON"));

        // --- 습도 (Humidity) ---
        // 습도가 높을 때 -> 팬 가동 (환기/제습)
        ACTUATOR_MAP.put("HUMIDITY_HIGH", new ActuatorTypeDTO("FAN", "습도","ON/HUMIDIFIER"));
        // 습도가 낮을 때 -> 가습기 가동
        ACTUATOR_MAP.put("HUMIDITY_LOW", new ActuatorTypeDTO("HUMIDIFIER", "습도","ON"));

        // --- CO2 ---
        // CO2가 높을 때 -> 팬 가동 (환기)
        ACTUATOR_MAP.put("CO2_HIGH", new ActuatorTypeDTO("FAN", "CO2","ON/CO2"));
        // CO2가 낮을 때 -> (이미지에는 명확하지 않으나 보통 그대로 두거나 CO2 발생기 사용. 여기선 비워둠)
        ACTUATOR_MAP.put("CO2_LOW", new ActuatorTypeDTO("FAN", "CO2","ON/CO2"));

        // --- 조도/광량 (Light) ---
        // 광량이 높을 때 -> 블라인드 닫기 (차단)
        ACTUATOR_MAP.put("LIGHT_HIGH", new ActuatorTypeDTO("BLIND", "광량","CLOSE"));
        // 광량이 낮을 때 -> 블라인드 열기 (보광)
        ACTUATOR_MAP.put("LIGHT_LOW", new ActuatorTypeDTO("BLIND", "광량","OPEN"));

        // --- 토양 수분 (Soil Moisture) ---
        // 수분이 낮을 때 -> 워터 펌프 가동
        ACTUATOR_MAP.put("SOIL_MOISTURE_LOW", new ActuatorTypeDTO("PUMP", "토양 수분","ON"));
    }

    @Override
    @Transactional
    public void controlSensorData(String payload, String novaSerialNumber, int slot) throws JsonProcessingException {
        //novaNumber랑 slot을 통해 farm Entity를 찾아오는 메서드 구현 -> return farm
        //farm을 payload에 추가하고, 해당 payload를 SensorEntity로 mapper
        FarmEntity farm = farmRepository.findByNova_NovaSerialNumberAndSlot(novaSerialNumber, slot)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Farm"));
        SensorCurrentDTO sensorDTO = objectMapper.readValue(payload, SensorCurrentDTO.class);
        SensorLogEntity sensorLog = modelMapper.map(sensorDTO, SensorLogEntity.class);
        sensorLog.setFarm(farm); // farm 찾기
        saveSensorLog(sensorLog); // 디비에 저장
    }

    @Override
    @Transactional
    public void saveSensorLog(SensorLogEntity sensorLog) {
        if (sensorLog == null || sensorLog.getFarm() == null) {
            throw new IllegalArgumentException("SensorLog 또는 Farm 정보가 없습니다.");
        }
        FarmEntity farm = farmRepository.findById(sensorLog.getFarm().getFarmId()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Farm"));
        sensorLog.setFarm(farm);
        // 센서 로그값 저장
        sensorLogDAO.save(sensorLog);
        // 프리셋 기준 판단
        PresetStepEntity step = sensorLog.getFarm().getPresetStep();

        // 센서 데이터와 프리셋 데이터 비교 로직
        checkThreshold(farm,"TEMP",sensorLog.getTemp(),step.getTemp()); // 온도 처리 로직
        checkThreshold(farm,"HUMIDITY",sensorLog.getHumidity(),step.getHumidity()); // 습도 처리 로직
        checkThreshold(farm,"SOIL_MOISTURE",sensorLog.getSoilMoisture(),step.getSoilMoisture()); // 토양수분 처리 로직
        checkThreshold(farm,"LIGHT",sensorLog.getLightPower(),step.getLightPower()); // 광량 처리 로직
        checkThreshold(farm,"CO2",sensorLog.getCo2(),step.getCo2()); // Co2 처리 로직
//        checkThreshold(farm, "WATER", sensorLog.getWaterLevel(),step.getCo2()); // 이 수위 퍼센티지는 어떻게 판단해야하는가. 더미값 추가
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
    private void checkThreshold(FarmEntity farm, String sensorType, float sensorValue, EnvRange presetRange){
        String mapKey = "";
        String stateKey = farm.getFarmId() + "_" + sensorType;
        String alarmActive = sensorAlarmState.getOrDefault(stateKey,"normal");
        String sensorState = "normal";
        ActuatorTypeDTO act;
        // 프리셋 범위를 벗어났을 때
        if (sensorValue < presetRange.getMin() || sensorValue > presetRange.getMax()) {
            if(sensorValue<presetRange.getMin()){
                sensorState= "min";
                mapKey = sensorType.toUpperCase() + "_" + "LOW";
            }
            else if (sensorValue > presetRange.getMax()) {
                sensorState= "max";
                mapKey = sensorType.toUpperCase() + "_" + "HIGH";
            }
            if(mapKey.equals("SOIL_MOISTURE_HIGH"))
                return;
            act = ACTUATOR_MAP.get(mapKey);

            // 새로 들어온 알림이 기존 알림과 동일할 경우 알림 중복 방지 (실행 x)
            if (alarmActive.equals(sensorState)) {
                System.out.printf("중복 알림 방지, %s %s 값이 범위 내에 있지 않음.%n",farm.getFarmName(),sensorType);
            }
            else{
                // 최초로 벗어났을 때 알람 생성
                sensorAlarmState.put(stateKey, sensorState);
                // 식물 알림 DB 저장
                // 프리셋 범위보다 낮은 값이 측정되었을 때
                if (sensorState.equals("min")) {
                    String text = String.format("%s이 기준보다 낮습니다. (현재 %s: %.1f%%)", act.getSensorName(), sensorType, sensorValue);
                    System.out.println(text);
                    alarmService.createSensorAlarm(farm,
                            "SENSOR",
                            act.getSensorName() + " 부족",
                            text);
                }
                // 프리셋 범위보다 높은 값이 측정되었을 때
                else {
                    String text = String.format("%s이 기준보다 높습니다. (현재 %s: %.1f%%)", act.getSensorName(), sensorType, sensorValue);
                    System.out.println(text);
                    alarmService.createSensorAlarm(farm,
                            "SENSOR",
                            act.getSensorName() + " 과다",
                            text);
                }
            }
            // 액추에이터 실행
            actuatorService.control(
                    farm,
                    act.getActuatorType(),
                    act.getAction(),
                    sensorType,
                    sensorValue
            );
            return;
        }
        // 정상 범위 복귀 → 상태 초기화
        if (alarmActive.equals(sensorState)) {
            // 평소 정상 상태
            System.out.println(sensorType + ": " + sensorValue + " 값이 프리셋 정상범위 내에 있습니다.");
        } else {
            sensorAlarmState.remove(stateKey);
            System.out.println("🔄 알람 상태 초기화: " + stateKey);
        }
    }
    private String alarmKey(FarmEntity farm, String sensorType) {
        return farm.getFarmId() + ":" + sensorType;
    }
}
