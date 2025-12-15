package com.nova.backend.user.dto;

import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPageTimelapseResponseDTO {
    private long novaId;
    private String novaSerialNumber;
    private List<TimelapseResponseDTO> timelapseResponseDTOList;
}
