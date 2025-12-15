package com.nova.backend.user.service;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import com.nova.backend.user.dto.MyPageTimelapseResponseDTO;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface MyPageService {
    MyPageResponseDTO findByUserId(Long userId);
    void updateMyPage(MyPageRequestDTO myPageRequestDTO);
    List<MyPageTimelapseResponseDTO> getTimelapseVideoResponseDTO(long userId);
}
