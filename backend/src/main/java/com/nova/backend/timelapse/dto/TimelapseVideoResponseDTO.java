package com.nova.backend.timelapse.dto;

import com.nova.backend.timelapse.entity.TimelapseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimelapseVideoResponseDTO {
    private int videoId;
    private TimelapseResponseDTO timelapseResponseDTO;
    private String videoFilePath;
    private Timestamp createdAt;
    private String size;
}
