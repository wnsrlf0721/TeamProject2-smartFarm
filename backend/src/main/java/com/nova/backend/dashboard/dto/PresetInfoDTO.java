package com.nova.backend.dashboard.dto;

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

    private int growthStep;
    private int periodDays;

    // 센서 기준값 (json 그대로 전달)
    private String temperatureRange;
    private String humidityRange;
    private String lightRange;
    private String co2Range;
    private String soilMoistureRange;
}
