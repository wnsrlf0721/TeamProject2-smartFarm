package com.nova.backend.preset.dto;


import com.nova.backend.preset.entity.EnvRange;
import com.nova.backend.preset.entity.PresetStepEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StepResponseDTO {
    private int stepId;
    private PresetResponseDTO preset;
    private int growthStep;
    private int periodDays;

    private EnvRange temp;
    private EnvRange humidity;
    private EnvRange lightPower;
    private EnvRange co2;
    private EnvRange soilMoisture;

    public static StepResponseDTO from(PresetStepEntity e) {
        return StepResponseDTO.builder()
                .stepId(e.getStepId()) // DB PK (1,2,3…)
                .growthStep(e.getGrowthStep())
                .periodDays(e.getPeriodDays())
                .temp(e.getTemp())
                .humidity(e.getHumidity())
                .lightPower(e.getLightPower())
                .co2(e.getCo2())
                .soilMoisture(e.getSoilMoisture())
                .build();
    }
}
