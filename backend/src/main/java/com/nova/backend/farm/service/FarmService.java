package com.nova.backend.farm.service;

import com.nova.backend.farm.dto.FarmResponseDTO;

import java.util.List;

public interface FarmService {
    //2. Farm List NovaId 로 가져오기
    List<FarmResponseDTO> getFarmListByNovaId(int novaId);
}
