package com.nova.backend.timelapse.controller;

import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.service.TimelapseService;
import com.nova.backend.timelapse.service.TimelapseVideoService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/timelapse")
@RequiredArgsConstructor
@CrossOrigin
public class TimelapseController {
    private final TimelapseService timelapseService;
    private final TimelapseVideoService timelapseVideoService;

    @GetMapping("/view")
    public List<TimelapseResponseDTO> getTimelapseListByFarmId(@RequestParam("farmId") String farmId) {
        return timelapseService.getTimelapseListByFarmId(Long.parseLong(farmId));
    }

    @PostMapping("/create")
    public void createTimelapse(@RequestBody List<TimelapseRequestDTO> timelapseRequestDTOList) {
        if (timelapseRequestDTOList == null || timelapseRequestDTOList.isEmpty()) {
            return;
        }
        timelapseService.createTimelapse(timelapseRequestDTOList);
        long farmId = timelapseRequestDTOList.get(0).getFarmId();
        timelapseService.startTimelapseForFarm(farmId);
    }

    @GetMapping("/video/{settingId}")
    public void redirectVideo(
            @PathVariable long settingId,
            HttpServletResponse response
    ) throws IOException {

        // DB에서 실제 파일명 조회
        String filePath = timelapseVideoService.getVideo(settingId);
        // 예: /timelapse_12.mp4

        response.sendRedirect("/video-files/" + filePath);
    }
}
