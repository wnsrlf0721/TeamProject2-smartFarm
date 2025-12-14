package com.nova.backend.farm.controller;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.service.FarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farm")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FarmController {
    private final FarmService farmService;
    @GetMapping("/list")
    public List<FarmResponseDTO> getFarmListByNovaId(@RequestParam("novaId") Long novaId) {
        return farmService.getFarmListByNovaId(novaId);
    }

}