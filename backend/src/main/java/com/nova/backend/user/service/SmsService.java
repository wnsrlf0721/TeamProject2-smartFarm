package com.nova.backend.user.service;

public interface SmsService {

    // 인증번호 전송
    void sendAuthCode(String phoneNumber);

    // 인증번호 검증
    boolean verifyAuthCode(String phoneNumber, String code);
}
