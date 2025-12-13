package com.nova.backend.nova.controller;

import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.nova.service.NovaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/nova")
@RequiredArgsConstructor
public class NovaController {
    private final NovaService novaService;
    @GetMapping("/list")
    public List<NovaResponseDTO> getNovaListByUserId(@RequestParam("userId")int userId) {
        return novaService.getNovaListByUserId(userId);
    }
}
