package com.nova.backend.farm.controller;

import com.nova.backend.farm.dto.DashboardRequestDTO;
import com.nova.backend.farm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/farm")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardRequestDTO> getDashboard(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                dashboardService.getDashboard(farmId)
        );
    }
}
