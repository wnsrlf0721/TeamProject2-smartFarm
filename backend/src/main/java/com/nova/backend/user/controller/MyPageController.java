package com.nova.backend.user.controller;

import com.nova.backend.farm.dto.FarmResponseDTO;
import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseResponseDTO;
import com.nova.backend.timelapse.dto.TimelapseVideoResponseDTO;
import com.nova.backend.user.dao.MyPageDAO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import com.nova.backend.user.dto.MyPageTimelapseResponseDTO;
import com.nova.backend.user.service.MyPageService;
import com.nova.backend.user.service.MyPageServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
@CrossOrigin
public class MyPageController {
    private final MyPageService myPageService;
    private final MyPageServiceImpl myPageServiceImpl;

    @GetMapping("/view")
    public MyPageResponseDTO findByUserId(@RequestParam("userId") Long userId) {
        return myPageService.findByUserId(userId);
    }

    @PostMapping("/edit")
    public void updateMyPage(@RequestBody MyPageRequestDTO myPageRequestDTO) {
        myPageService.updateMyPage(myPageRequestDTO);
    }

    @GetMapping("/timela")
    public List<TimelapseVideoResponseDTO> getTimeLapseDTOList(@RequestParam("userId") String userId) {
        return null;
    }

    @GetMapping("/timelapse")
    public List<TimelapseResponseDTO> getTimelapseDTOList(@RequestParam("farmId") String farmId) {
        return myPageServiceImpl.getByFarm(Integer.parseInt(farmId));
    }
}
