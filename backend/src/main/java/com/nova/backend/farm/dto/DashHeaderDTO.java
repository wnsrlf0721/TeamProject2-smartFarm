package com.nova.backend.farm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

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
    private LocalDate startDate; // 재배 시작일
    private LocalDate expectedHarvestDate; // 예상 수확일
    private Timestamp updateTime;
}
