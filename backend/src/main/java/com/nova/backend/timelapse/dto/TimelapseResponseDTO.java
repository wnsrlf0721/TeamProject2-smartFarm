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
    private int farmId;
    private int stepId;
    private String timelapseName;
    private int fps;
    private int duration;
    private int captureInterval;
    private String resolution;
    private String state;

    private List<TimelapseVideoResponseDTO> videoList;
}
