package com.nova.backend.farm.controller;

import com.nova.backend.farm.dto.FarmRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.service.FarmService;
import com.sun.tools.jconsole.JConsoleContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @PostMapping(value = "/create", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> createFarm(
            @RequestPart("request") FarmRequestDTO farmRequestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image){

        farmService.createFarm(farmRequestDTO, image);
        return ResponseEntity.ok("팜 생성 완료!");
    }

}