package com.nova.backend.user.dto;

import com.nova.backend.nova.dto.NovaRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPageRequestDTO {
    private UsersRequestDTO usersRequestDTO;
    private List<NovaRequestDTO> novaRequestDTOList;
}
