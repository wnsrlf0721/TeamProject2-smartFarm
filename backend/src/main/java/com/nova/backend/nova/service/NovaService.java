package com.nova.backend.nova.service;

import com.nova.backend.nova.dto.NovaResponseDTO;

import java.util.List;

public interface NovaService {
    List<NovaResponseDTO> getNovaListByUserId(int userId);

}
