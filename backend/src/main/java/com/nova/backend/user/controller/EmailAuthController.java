package com.nova.backend.user.controller;

import com.nova.backend.user.dto.EmailAuthRequestDTO;
import com.nova.backend.user.service.EmailAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/email")
@RequiredArgsConstructor
public class EmailAuthController {

    private final EmailAuthService emailAuthService;

    /**
     *  이메일 인증번호 발송
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendAuthCode(
            @RequestBody EmailAuthRequestDTO dto
    ) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("이메일을 입력해주세요.");
        }

        emailAuthService.sendAuthCode(dto.getEmail());
        return ResponseEntity.ok("인증번호가 이메일로 전송되었습니다.");
    }

    /**
     * 이메일 인증번호 검증
     */
    @PostMapping("/verify")
    public ResponseEntity<String> verifyAuthCode(
            @RequestBody EmailAuthRequestDTO dto
    ) {
        if (dto.getEmail() == null || dto.getCode() == null) {
            return ResponseEntity.badRequest()
                    .body("이메일과 인증번호를 입력해주세요.");
        }

        boolean verified = emailAuthService.verifyAuthCode(
                dto.getEmail(),
                dto.getCode()
        );

        if (!verified) {
            return ResponseEntity.badRequest()
                    .body("인증번호가 올바르지 않습니다.");
        }

        return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
    }
}
