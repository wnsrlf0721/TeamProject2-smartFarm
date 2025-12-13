package com.nova.backend.preset.controller;


import com.nova.backend.preset.service.PresetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/preset")
@RequiredArgsConstructor
public class PresetController {
    private final PresetService presetService;
}
