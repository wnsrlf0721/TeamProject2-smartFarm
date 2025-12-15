package com.nova.backend.timelapse.service;

import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface TimelapseService {
    List<TimelapseResponseDTO> getTimelapseListByFarmId(long farmId);
    void createTimelapse(List<TimelapseRequestDTO> timelapseRequestDTOList);
}
