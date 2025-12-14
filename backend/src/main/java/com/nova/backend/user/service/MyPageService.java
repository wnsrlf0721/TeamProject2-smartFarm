package com.nova.backend.user.service;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface MyPageService {
    MyPageResponseDTO findByUserId(Long userId);
    void updateMyPage(MyPageRequestDTO myPageRequestDTO);
    List<FarmResponseDTO> getTimeLapseDTOList(@RequestParam("userId") int userId);
}
