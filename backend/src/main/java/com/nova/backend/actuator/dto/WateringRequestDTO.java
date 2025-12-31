package com.nova.backend.actuator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WateringRequestDTO {
    private Long farmId;
    private Float waterLevel; // 물 양 (optional)
}
