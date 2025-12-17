package com.nova.backend.preset.dto;

import com.nova.backend.preset.entity.EnvRange;
import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PresetInfoDTO {
    private Long presetId;
    private String presetName;
    private String plantType;

    private int growthStep;
    private int periodDays;

    // 센서 기준값 (json 그대로 전달)
    private EnvRange temp;
    private EnvRange humidity;
    private EnvRange lightPower;
    private EnvRange co2;
    private EnvRange soilMoisture;

    public static PresetInfoDTO from(PresetEntity preset, PresetStepEntity step) {
        return PresetInfoDTO.builder()
                .presetId(preset.getPresetId())
                .presetName(preset.getPresetName())
                .plantType(preset.getPlantType())
                .growthStep(step.getGrowthStep())
                .periodDays(step.getPeriodDays())
                .temp(step.getTemp())
                .humidity(step.getHumidity())
                .lightPower(step.getLightPower())
                .co2(step.getCo2())
                .soilMoisture(step.getSoilMoisture())
                .build();
    }
}
