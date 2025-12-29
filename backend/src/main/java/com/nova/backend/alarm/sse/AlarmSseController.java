package com.nova.backend.alarm.sse;

import com.nova.backend.alarm.dto.AlarmResponseDTO;
import com.nova.backend.security.CustomUserDetails;
import com.nova.backend.security.jwt.JwtTokenProvider;
import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// SSE 구독 API
// 프론트에서 한 번만 연결하는 API
// 한 번 요청을 통해 구독하면 연결이 지속된다고 함(sse가)
@RestController
@RequestMapping("/alarm")
@RequiredArgsConstructor
public class AlarmSseController {

    private final AlarmSseEmitterManager emitterManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
            @RequestParam("token") String token) {
        System.out.println("✅ SSE subscribe called");
        // 1. Bearer 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 2. 토큰 검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰");
        }

        // 3. loginId 추출
        String loginId = jwtTokenProvider.getLoginId(token);

        // 4. 사용자 조회
        UsersEntity user = userRepository.findByLoginId(loginId);
        if (user == null) {
            throw new RuntimeException("사용자 없음");
        }
        System.out.println("✅ SSE subscribe userId=" + user.getUserId());

        // 5. SSE 연결
        return emitterManager.connect(user.getUserId());
    }

    @GetMapping("/test-send")
    public void testSend(@RequestParam Long userId, @RequestParam Long farmId) {
        AlarmResponseDTO dto = new AlarmResponseDTO();
        dto.setAlarmId(999L);
        dto.setTitle("테스트 알람");
        dto.setMessage("🔥 SSE 테스트 메시지!");
        dto.setCreatedAt(LocalDateTime.now());
        dto.setFarmId(farmId);
        dto.setFarmName("테스트 팜");
        dto.setAlarmType("SENSOR");

        emitterManager.send(userId, dto);
    }
}
