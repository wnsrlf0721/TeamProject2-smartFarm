package com.nova.backend.user.service;

public interface PhoneAuthService {

    String sendAuthCode(String phoneNumber);

    boolean verifyAuthCode(String phoneNumber, String code);
}
