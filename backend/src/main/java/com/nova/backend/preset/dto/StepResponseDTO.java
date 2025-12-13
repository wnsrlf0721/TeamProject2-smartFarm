package com.nova.backend.preset.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepResponseDTO {
    private int stepId;
    private PresetResponseDTO preset;
    private int growthStep;
    private int periodDays;
}
