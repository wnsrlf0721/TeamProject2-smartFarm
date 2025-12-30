package com.nova.backend.timelapse.service;

import com.nova.backend.timelapse.dto.TimelapseRequestDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface TimelapseService {
    List<TimelapseResponseDTO> getTimelapseListByFarmId(long farmId);
    void createTimelapse(List<TimelapseRequestDTO> timelapseRequestDTOList);
    void startTimelapseForFarm(long farmId);
    void saveImage(String novaSerialNumber, int slot, String payload);
    void completeStep(String novaSerialNumber, int slot, String payload);

}
