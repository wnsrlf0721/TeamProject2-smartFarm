package com.nova.backend.timelapse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimelapseRequestDTO {
    private long farmId;
    private Long stepId;
    private String timelapseName;
    private int fps;
    private int duration;
    private int captureInterval;
    private String resolution;
    private String state;
}
