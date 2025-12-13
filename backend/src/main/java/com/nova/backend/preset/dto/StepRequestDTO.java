package com.nova.backend.preset.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StepRequestDTO {
    private int growthStep;
    private int periodDays;
    private Float temp;
    private Float humidity;
    private Float lightPower;
    private Float co2;
    private Float soilMoisture;
}
