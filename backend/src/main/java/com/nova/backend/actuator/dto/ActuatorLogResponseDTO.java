package com.nova.backend.actuator.dto;

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
public class ActuatorLogResponseDTO {
    private String actuatorType; // pump, fan 등
    private String action;       // ON / OFF
    private Float currentValue;
    private LocalDateTime createdAt;
}
