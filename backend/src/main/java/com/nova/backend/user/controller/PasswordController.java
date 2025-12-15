package com.nova.backend.user.controller;

import com.nova.backend.user.service.EmailAuthService;
import com.nova.backend.user.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/password")
@RequiredArgsConstructor
public class PasswordController {

    private final EmailAuthService emailAuthService;
    private final PasswordService passwordService;


    // 이메일 인증번호 전송
    @PostMapping("/email/send")
    public ResponseEntity<?> sendEmailAuth(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        passwordService.checkEmailExists(email);
        emailAuthService.sendAuthCode(email);

        return ResponseEntity.ok("인증번호가 이메일로 전송되었습니다.");
    }


    // 이메일 인증번호 검증
    @PostMapping("/email/verify")
    public ResponseEntity<?> verifyEmailAuth(@RequestBody Map<String, String> req) {

        boolean ok = emailAuthService.verifyAuthCode(
                req.get("email"),
                req.get("code")
        );

        if (!ok) {
            return ResponseEntity.badRequest()
                    .body("인증번호가 올바르지 않거나 만료되었습니다.");
        }

        return ResponseEntity.ok("이메일 인증 완료");
    }


    //  이메일 비밀번호 재설정
    @PostMapping("/email/reset")
    public ResponseEntity<?> resetPasswordByEmail(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String password = req.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body("요청 값이 올바르지 않습니다.");
        }

        passwordService.resetPassword(email, password);

        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }

    // 전화번호 비밀번호 재설정

    @PostMapping("/phone/reset")
    public ResponseEntity<?> resetPasswordByPhone(@RequestBody Map<String, String> req) {

        String phoneNumber = req.get("phoneNumber");
        String password = req.get("password");

        if (phoneNumber == null || password == null) {
            return ResponseEntity.badRequest()
                    .body("요청 값이 올바르지 않습니다.");
        }

        passwordService.resetPasswordByPhone(phoneNumber, password);

        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }
}
