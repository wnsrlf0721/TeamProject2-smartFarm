package com.nova.backend.farm.controller;

import com.nova.backend.farm.dto.FarmRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.dto.FarmTimelapseResponseDTO;
import com.nova.backend.farm.dto.FarmUpdateReqDTO;
import com.nova.backend.farm.service.FarmService;
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
    public FarmTimelapseResponseDTO createFarm(
            @RequestPart("request") FarmRequestDTO farmRequestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image){

        return farmService.createFarm(farmRequestDTO, image);
    }
    @PutMapping(value = "/update/{farmId}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> updateFarm(
            @PathVariable("farmId") Long farmId,
            @RequestPart("request") FarmUpdateReqDTO updateDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            farmService.updateFarm(updateDTO, image,farmId);
            return ResponseEntity.ok("Farm updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }
    @DeleteMapping("/delete/{farmId}")
    public ResponseEntity<String> deleteFarm(@PathVariable("farmId") Long farmId){
        try {
            farmService.deleteFarmById(farmId);
            return ResponseEntity.ok("Successfully updated stepId to null");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}