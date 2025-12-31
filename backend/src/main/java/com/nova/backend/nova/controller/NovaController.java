package com.nova.backend.nova.controller;

import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.nova.service.NovaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nova")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NovaController {
    private final NovaService novaService;
    @GetMapping("/list")
    public List<NovaResponseDTO> getNovaListByUserId(@RequestParam Long userId) {
        return novaService.getNovaListByUserId(userId);
    }
}
