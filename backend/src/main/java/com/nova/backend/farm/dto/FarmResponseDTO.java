package com.nova.backend.farm.dto;

import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.preset.dto.StepResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmResponseDTO {
    private Long farmId;
    private String farmName;
    private int slot;

    private NovaResponseDTO nova;
    private StepResponseDTO presetStep;

    private Timestamp createdTime;
    private Timestamp updateTime;

    public FarmResponseDTO(Long farmId, String farmName) {
        this.farmId = farmId;
        this.farmName = farmName;
    }
}
