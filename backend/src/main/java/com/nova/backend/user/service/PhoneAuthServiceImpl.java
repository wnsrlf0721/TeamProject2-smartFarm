package com.nova.backend.user.service;

import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PhoneAuthServiceImpl implements PhoneAuthService {

    private final Map<String, PhoneAuthCode> authStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @Override
    public String sendAuthCode(String phoneNumber) {
        String code = String.valueOf(100000 + random.nextInt(900000));
        authStore.put(phoneNumber, new PhoneAuthCode(code, System.currentTimeMillis()));
        return code;
    }

    @Override
    public boolean verifyAuthCode(String phoneNumber, String code) {
        PhoneAuthCode auth = authStore.get(phoneNumber);
        if (auth == null) return false;

        if (System.currentTimeMillis() - auth.createdAt > 180000) {
            authStore.remove(phoneNumber);
            return false;
        }

        boolean ok = auth.code.equals(code);
        if (ok) authStore.remove(phoneNumber);
        return ok;
    }

    @AllArgsConstructor
    static class PhoneAuthCode {
        String code;
        long createdAt;
    }
}
