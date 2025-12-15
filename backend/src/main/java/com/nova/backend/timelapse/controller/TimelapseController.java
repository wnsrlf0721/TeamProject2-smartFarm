package com.nova.backend.timelapse.controller;

import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.service.TimelapseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timelapse")
@RequiredArgsConstructor
@CrossOrigin
public class TimelapseController {
    private final TimelapseService timelapseService;

    @GetMapping("/view")
    public List<TimelapseResponseDTO> getTimelapseListByFarmId(@RequestParam("farmId") String farmId) {
        return timelapseService.getTimelapseListByFarmId(Long.parseLong(farmId));
    }

    @PostMapping("/create")
    public void createTimelapse(@RequestBody List<TimelapseRequestDTO> timelapseRequestDTOList) {
        timelapseService.createTimelapse(timelapseRequestDTOList);
    }
}
