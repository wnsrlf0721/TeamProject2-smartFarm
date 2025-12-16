package com.nova.backend.user.controller;


import com.nova.backend.security.jwt.JwtTokenProvider;
import com.nova.backend.user.dto.FindIdRequestDTO;
import com.nova.backend.user.dto.LoginRequestDTO;
import com.nova.backend.user.dto.ResetPasswordDTO;
import com.nova.backend.user.dto.SignupRequestDTO;
import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequestDTO dto) {
        userService.signUp(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            UsersEntity user = userService.login(dto);

            String token = jwtTokenProvider.createToken(
                    user.getLoginId(),
                    user.getRole()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "userId", user.getUserId(),
                            "loginId", user.getLoginId(),
                            "name", user.getName(),
                            "role", user.getRole(),
                            "accessToken", token
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    //아이디 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody FindIdRequestDTO dto) {
        try {
            String loginId = userService.findUserId(dto);
            return ResponseEntity.ok(loginId);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

//    //비밀번호 찾기
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO dto) {
//        userService.resetPassword(dto);
//        return ResponseEntity.ok("비밀번호 변경 성공");
//    }

    @GetMapping("/check-loginid")
    public ResponseEntity<?> checkLoginId(@RequestParam String loginId) {

        boolean exists = userService.existsLoginId(loginId);

        if (exists) {
            return ResponseEntity.badRequest().body("이미 사용 중인 아이디입니다.");
        }

        return ResponseEntity.ok("사용 가능한 아이디입니다.");
    }

}
