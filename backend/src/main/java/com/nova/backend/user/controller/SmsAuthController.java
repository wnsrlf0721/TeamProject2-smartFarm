package com.nova.backend.user.controller;

import com.nova.backend.user.service.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/password/phone")
@RequiredArgsConstructor
public class SmsAuthController {

    private final SmsService smsService;

    /**
     *  인증번호 전송
     */
    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody Map<String, String> req) {
        String phoneNumber = req.get("phoneNumber");

        smsService.sendAuthCode(phoneNumber);

        return ResponseEntity.ok("인증번호가 전송되었습니다.");
    }

    /**
     *  인증번호 검증
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> req) {

        boolean ok = smsService.verifyAuthCode(
                req.get("phoneNumber"),
                req.get("code")
        );

        if (!ok) {
            return ResponseEntity.badRequest()
                    .body("인증번호가 올바르지 않거나 만료되었습니다.");
        }

        return ResponseEntity.ok("전화번호 인증 완료");
    }
}
