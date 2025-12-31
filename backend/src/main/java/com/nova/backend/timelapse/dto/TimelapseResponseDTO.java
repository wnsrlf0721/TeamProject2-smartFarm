package com.nova.backend.timelapse.dto;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.preset.dto.StepResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimelapseResponseDTO {
    private int settingId;
    private FarmResponseDTO farm;
    private int stepId;
    private String timelapseName;
    private int fps;
    private int duration;
    private int captureInterval;
    private String resolution;
    private String state;

    private List<TimelapseVideoResponseDTO> videoList;

    public TimelapseResponseDTO(int settingId, FarmResponseDTO farm, String timelapseName, List<TimelapseVideoResponseDTO> videoList) {
        this.settingId = settingId;
        this.farm = farm;
        this.timelapseName = timelapseName;
        this.videoList = videoList;
    }
}
