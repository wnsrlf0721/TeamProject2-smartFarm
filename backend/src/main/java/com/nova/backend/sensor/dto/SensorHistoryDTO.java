package com.nova.backend.sensor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SensorHistoryDTO {
    // 그래프용 센서 이력
    private List<SensorPointDTO> temperature;
    private List<SensorPointDTO> humidity;
    private List<SensorPointDTO> soilMoisture;
    private List<SensorPointDTO> light;
    private List<SensorPointDTO> co2;
}
