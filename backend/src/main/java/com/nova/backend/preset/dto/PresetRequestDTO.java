package com.nova.backend.preset.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresetRequestDTO {
    private String plantType;
    private String presetName;
    private int userId;
    private List<StepRequestDTO> steps;
}
