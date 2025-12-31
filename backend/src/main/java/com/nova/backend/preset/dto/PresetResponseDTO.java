package com.nova.backend.preset.dto;

import com.nova.backend.user.dto.UsersResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresetResponseDTO {
    private Long presetId;
    private String plantType;
    private String presetName;
    private String presetImageUrl;
    private UsersResponseDTO user;
}
