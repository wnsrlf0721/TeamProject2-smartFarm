package com.nova.backend.user.service;

public interface EmailAuthService {

    // 인증번호 전송
    void sendAuthCode(String email);

    // 인증번호 검증
    boolean verifyAuthCode(String email, String code);
}
