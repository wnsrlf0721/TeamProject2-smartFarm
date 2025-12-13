package com.nova.backend.farm.controller;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.service.FarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/farm")
@RequiredArgsConstructor
public class FarmController {
    private final FarmService farmService;
    @GetMapping("/list")
    public List<FarmResponseDTO> getFarmListByNovaId(@RequestParam("novaId") int novaId) {
        return farmService.getFarmListByNovaId(novaId);
    }

}
