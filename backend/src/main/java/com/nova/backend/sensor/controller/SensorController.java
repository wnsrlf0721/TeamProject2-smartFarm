package com.nova.backend.sensor.controller;

import com.nova.backend.sensor.dto.SensorCurrentDTO;
import com.nova.backend.sensor.dto.SensorHistoryDTO;
import com.nova.backend.sensor.entity.SensorLogEntity;
import com.nova.backend.sensor.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/sensor")
@RequiredArgsConstructor
public class SensorController {
    private final SensorService sensorService;

    @PostMapping("/log")
    public ResponseEntity<SensorCurrentDTO> saveSensorLog(
            @RequestBody SensorLogEntity sensorLog
    ) {
        sensorService.saveSensorLog(sensorLog);

        SensorCurrentDTO current =
                sensorService.getCurrentSensor(
                        sensorLog.getFarm().getFarmId()
                );

        return ResponseEntity.ok().build();
    }

    //현재 센서값 조회 (최신 1건) - 대시보드 상단용
    @GetMapping("/current")
    public ResponseEntity<SensorCurrentDTO> getCurrentSensor(
            @RequestParam Long farmId
    ) {
        SensorCurrentDTO result = sensorService.getCurrentSensor(farmId);
        return ResponseEntity.ok(result);
    }

    //센서 히스토리 조회 - 그래프용 (최근 100개)
    @GetMapping("/history")
    public ResponseEntity<SensorHistoryDTO> getSensorHistory(
            @RequestParam Long farmId
    ) {
        SensorHistoryDTO result = sensorService.getSensorHistory(farmId);
        return ResponseEntity.ok(result);
    }
}
