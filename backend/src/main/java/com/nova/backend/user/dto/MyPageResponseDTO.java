package com.nova.backend.user.dto;

import com.nova.backend.nova.dto.NovaResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPageResponseDTO {
    private UsersResponseDTO usersResponseDTO;
    private List<NovaResponseDTO> novaResponseDTOList;
}
