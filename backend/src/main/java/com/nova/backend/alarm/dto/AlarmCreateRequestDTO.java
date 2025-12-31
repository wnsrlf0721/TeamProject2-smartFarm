package com.nova.backend.alarm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// 알람 생성 내부용  - 서비스 내부에서 알람 생성 규격 통일화에 사용
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmCreateRequestDTO {
    private Long userId;
    private Long farmId;
    private Long stepId;
    private Long presetId;
    private String alarmType;
    private String title;
    private String message;
    private String extraData;
}
