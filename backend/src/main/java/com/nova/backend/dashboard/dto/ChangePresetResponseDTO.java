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
public class ChangePresetResponseDTO {
    private Long farmId;
    private Long presetId;
    private String presetName;
    private Integer growthStep;
    private LocalDateTime changedAt;
}
