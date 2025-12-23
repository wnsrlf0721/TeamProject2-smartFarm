package com.nova.backend.actuator.service;

import com.nova.backend.actuator.dto.ActuatorLogResponseDTO;
import com.nova.backend.actuator.dto.WateringRequestDTO;
import com.nova.backend.actuator.dto.WateringResponseDTO;
import com.nova.backend.actuator.entity.ActuatorLogEntity;
import com.nova.backend.actuator.repository.ActuatorLogRepository;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.mqtt.MyPublisher;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActuatorServiceImpl implements ActuatorService {
    private final ActuatorLogRepository actuatorLogRepository;
    private final FarmRepository farmRepository;
    private final ModelMapper modelMapper;
    private final MyPublisher publisher;


    @Override
    public WateringResponseDTO water(WateringRequestDTO request) {
        // farm 조회
        FarmEntity farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new IllegalArgumentException("Farm not found"));

        // 엑추에이터 로그 생성
        ActuatorLogEntity log = ActuatorLogEntity.builder()
                .farm(farm)
                .actuatorType("PUMP")
                .action("ON")
                .currentValue(request.getWaterLevel())
                .createdAt(LocalDateTime.now())
                .build();

        // 로그 저장
        actuatorLogRepository.save(log);

        // 응답 반환
        return WateringResponseDTO.builder()
                .success(true)
                .executedAt(LocalDateTime.now())
                .message("Watering executed successfully")
                .build();
    }

    @Override
    public List<ActuatorLogResponseDTO> getActuatorLogs(Long farmId) {
        FarmEntity farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm not found"));

        return actuatorLogRepository.findByFarmOrderByCreatedAtDesc(farm)
                .stream()
                .map(entity -> modelMapper.map(entity, ActuatorLogResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public WateringResponseDTO waterPlant(Long farmId, WateringRequestDTO request) {
        // 실제로는 MQTT publish / Raspberry Pi 제어
        // 지금은 "요청이 왔다"는 로그만 남김

        FarmEntity farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm not found"));

        ActuatorLogEntity log = ActuatorLogEntity.builder()
                .farm(farm)
                .sensorType("SOIL_MOISTURE")
                .actuatorType("PUMP")
                .action("ON")
                .currentValue(
                        request != null ? request.getWaterLevel() : 0f
                )
                .createdAt(LocalDateTime.now())
                .build();

        actuatorLogRepository.save(log); // !!!!!핵심

        return WateringResponseDTO.builder()
                .success(true)
                .executedAt(LocalDateTime.now())
                .message("물주기 명령이 정상적으로 실행되었습니다.")
                .build();
    }
    @Override
    public void control(FarmEntity farm, String actType, String action, String sensorType, float sensorValue){
        // Actuator DB에 저장
        ActuatorLogEntity log = ActuatorLogEntity.builder()
                .farm(farm)
                .actuatorType(actType)
                .action(action)
                .sensorType(sensorType)
                .currentValue(sensorValue)
                .build();
        actuatorLogRepository.save(log);

        // Actuator Publish
        String payload = String.format("{\"action\":\"%s\"}",action);
        String topic = String.format("%s/%d/%s",farm.getNova().getNovaSerialNumber(), farm.getSlot(),actType);
        System.out.println("Request Message: " + payload);
        System.out.println("Request Topic: " + topic);
        publisher.sendToMqtt(payload,topic);
    }
    @Override
    public void controlBlind(Long farmId, String action, float lightValue) {
        FarmEntity farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm을 찾을 수 없습니다."));
        // 1) 디비로그 저장
        ActuatorLogEntity log = ActuatorLogEntity.builder()
                .farm(farm)
                .actuatorType("BLIND")
                .action(action) // "OPEN" or "CLOSE"
                .sensorType("light")
                .currentValue(lightValue)
                .createdAt(LocalDateTime.now())
                .build();

        actuatorLogRepository.save(log);

        // 2) 서보 각도 결정 (원하는 값으로 조정)
        int angle = "OPEN".equalsIgnoreCase(action) ? 90 : 0;
        // 3) MQTT payload는 "문자열(JSON)"로
        String payload = String.format(
                "{\"action\":\"%s\",\"angle\":%d,\"farmId\":%d}",
                action.toUpperCase(),
                angle,
                farmId
        );
        // 4) MQTT publish
        publisher.sendToMqtt(payload, "home/actuator/blind");
//        MyPublisher.(
//                "actuator/blind/" + farmId,
//                action
//        );
    }
}
