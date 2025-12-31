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
public class AlarmDTO {
    private Long pAlarmId;
    private String alarmType;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private Boolean isRead;
}
