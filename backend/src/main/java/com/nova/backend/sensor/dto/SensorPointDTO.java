package com.nova.backend.sensor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SensorPointDTO {
    private String time;  // "HH:mm"
    private float value; // y축 (온도/습도/토양수분/광량/이산화탄소 중 1)
}
