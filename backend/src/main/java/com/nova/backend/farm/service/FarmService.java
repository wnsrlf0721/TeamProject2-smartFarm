package com.nova.backend.farm.service;

import com.nova.backend.farm.dto.FarmRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.dto.FarmTimelapseResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FarmService {
    //2. Farm List NovaId 로 가져오기
    List<FarmResponseDTO> getFarmListByNovaId(Long novaId);
    FarmTimelapseResponseDTO createFarm(FarmRequestDTO farmRequestDTO, MultipartFile image);
}
