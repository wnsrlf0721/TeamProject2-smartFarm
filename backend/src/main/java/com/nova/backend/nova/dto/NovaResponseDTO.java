package com.nova.backend.nova.dto;

import com.nova.backend.user.dto.UsersResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NovaResponseDTO {
    private int novaId;
    private UsersResponseDTO user;
    private String novaSerialNumber;
    private String status;
}
