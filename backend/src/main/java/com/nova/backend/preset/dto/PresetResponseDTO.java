package com.nova.backend.preset.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresetResponseDTO {
    private int presetId;
    private String plantType;
    private String presetName;
    private Integer userId;
}
