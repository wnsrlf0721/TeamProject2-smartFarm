package com.nova.backend.farm.service;

import com.nova.backend.farm.dto.FarmRequestDTO;
import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.farm.dto.FarmTimelapseResponseDTO;
import com.nova.backend.farm.dto.FarmUpdateReqDTO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FarmService {
    //2. Farm List NovaId 로 가져오기
    List<FarmResponseDTO> getFarmListByNovaId(Long novaId);
    FarmTimelapseResponseDTO createFarm(FarmRequestDTO farmRequestDTO, MultipartFile image);

    @Transactional
    void updateFarm(FarmUpdateReqDTO dto, MultipartFile image, Long farmId);

    void deleteFarmById(Long farmId);
    String uploadFarmImage(MultipartFile image, String url);

    // 다음 프리셋 스탭으로 업데이트 할 팜을 조회하는 메서드
    @Scheduled(fixedDelay = 30000) // 30초 마다 반복
    @Transactional
    void checkFarmStep();
}
