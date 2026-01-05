package com.nova.backend.timelapse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimelapseCommand {
    private String command;
    private long interval;
    private long duration;
    private int width;
    private int height;
}
