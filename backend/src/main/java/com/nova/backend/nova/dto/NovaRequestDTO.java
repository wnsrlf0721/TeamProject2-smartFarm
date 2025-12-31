package com.nova.backend.nova.dto;

import com.nova.backend.user.dto.UsersRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NovaRequestDTO {
    private int novaId;
    private UsersRequestDTO user;
    private String novaSerialNumber;
    private String status;
}
