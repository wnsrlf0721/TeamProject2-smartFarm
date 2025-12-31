package com.nova.backend.actuator.controller;

import com.nova.backend.actuator.dto.ActuatorLogResponseDTO;
import com.nova.backend.actuator.dto.WateringRequestDTO;
import com.nova.backend.actuator.dto.WateringResponseDTO;
import com.nova.backend.actuator.service.ActuatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/actuator")
@RequiredArgsConstructor
public class ActuatorController {
    private final ActuatorService actuatorService;

    // 엑추에이터 로그 조회 (대시보드 하단)
    @GetMapping("/logs")
    public ResponseEntity<List<ActuatorLogResponseDTO>> getActuatorLogs(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                actuatorService.getActuatorLogs(farmId)
        );
    }

    // 대시보드 물주기 버튼 (POST)
    @PostMapping("/water")
    public ResponseEntity<WateringResponseDTO> waterPlant(
            @RequestParam Long farmId,
            @RequestBody(required = false) WateringRequestDTO request
    ) {
        System.out.println("✅ [Controller] waterPlant 호출됨 farmId=" + farmId);
        return ResponseEntity.ok(
                actuatorService.waterPlant(farmId, request)
        );
    }
}
