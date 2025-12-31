package com.nova.backend.sensor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SensorDashboardResponseDTO {
    // 박스카드, 그래프, 모달 실시간갱신 할겨
    private SensorCurrentDTO current; //현재센서상태 (센서바
    private SensorHistoryDTO history; //그래프요요 센서 기록

}
