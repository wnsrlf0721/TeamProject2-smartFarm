package com.nova.backend.sensor.dto;

import lombok.*;

// 현재 센서 상태 (sensor_log 최신 1건)
//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SensorCurrentDTO {
    private float temp;
    private float humidity;
    private float soilMoisture;
    private float lightPower;
    private float co2;
    private float waterLevel;


}
