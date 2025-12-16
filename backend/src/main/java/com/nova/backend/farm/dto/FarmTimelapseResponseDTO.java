package com.nova.backend.farm.dto;

import com.nova.backend.preset.dto.StepResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmTimelapseResponseDTO {
    private long id;
    private StepResponseDTO presetStep;
}
