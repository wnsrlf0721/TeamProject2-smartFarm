package com.nova.backend.preset.dto;

import com.nova.backend.preset.entity.EnvRange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepRequestDTO {
    private PresetResponseDTO preset;
    private int growthStep;
    private int periodDays;
    private EnvRange temp;
    private EnvRange humidity;
    private EnvRange lightPower;
    private EnvRange co2;
    private EnvRange soilMoisture;
}
