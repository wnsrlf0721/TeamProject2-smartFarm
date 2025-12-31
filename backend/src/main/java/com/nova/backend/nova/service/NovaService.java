package com.nova.backend.nova.service;

import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.user.entity.UsersEntity;

import java.util.List;

public interface NovaService {
    List<NovaResponseDTO> getNovaListByUserId(Long userId);

}
