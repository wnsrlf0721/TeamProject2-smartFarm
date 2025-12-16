package com.nova.backend.alarm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
// 알람 조회용 DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmResponseDTO {
    private Long alarmId;

    private String alarmType;
    private String title;
    private String message;

    private LocalDateTime createdAt;
    private boolean isRead;
}
