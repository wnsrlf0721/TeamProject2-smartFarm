package com.nova.backend.timelapse.controller;

import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.service.TimelapseService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        if (timelapseRequestDTOList == null || timelapseRequestDTOList.isEmpty()) {
            return;
        }
        timelapseService.createTimelapse(timelapseRequestDTOList);
        long farmId = timelapseRequestDTOList.get(0).getFarmId();
        timelapseService.startTimelapseForFarm(farmId);
    }

    @GetMapping("/video")
    public ResponseEntity<Resource> getVideo(@RequestParam("videoFilePath") String videoFilePath) throws IOException, MalformedURLException {
        String[] path = videoFilePath.split("/");
        String fileName = path[path.length - 1];
        String VIDEO_DIR = "C:/data/timelapse/video";

        Path filePath = Paths.get(VIDEO_DIR).resolve(fileName).normalize();
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        UrlResource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .contentType(MediaTypeFactory.getMediaType(fileName).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body((Resource) resource);
    }
}
