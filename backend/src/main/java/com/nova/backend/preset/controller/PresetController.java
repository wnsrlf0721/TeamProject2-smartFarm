package com.nova.backend.preset.controller;


import com.nova.backend.preset.dto.PresetResponseDTO;
import com.nova.backend.preset.dto.StepResponseDTO;
import com.nova.backend.preset.service.PresetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/preset")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PresetController {
    private final PresetService presetService;
    @GetMapping("/list")
    public List<PresetResponseDTO> getPresetListByUserId(@RequestParam("userId") Long userId){
        return presetService.findPresetListByUserId(userId);
    }
    @GetMapping("/step")
    public List<StepResponseDTO> getPresetWithSteps(@RequestParam("presetId") Long presetId){
        return presetService.getPresetWithSteps(presetId);
    }
}
