package com.nova.backend.user.service;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PhoneVerifiedStore {

    // phoneNumber → 인증완료 여부
    private final Map<String, Boolean> verifiedStore = new ConcurrentHashMap<>();

    public void markVerified(String phoneNumber) {
        verifiedStore.put(phoneNumber, true);
    }

    public boolean isVerified(String phoneNumber) {
        return verifiedStore.getOrDefault(phoneNumber, false);
    }

    public void remove(String phoneNumber) {
        verifiedStore.remove(phoneNumber);
    }
}
