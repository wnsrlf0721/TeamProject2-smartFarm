package com.nova.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashHeaderDTO {
    private Long farmId;
    private String farmName;
    private int slot;
    private String plantType;
    private String status;  // 재배중 / 종료 등
    private int dday;       // D-day (서버 계산값)
    private LocalDateTime lastUpdatedAt; // 마지막 센서 로그 시간
}
