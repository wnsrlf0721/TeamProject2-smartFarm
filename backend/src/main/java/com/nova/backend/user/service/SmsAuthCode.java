package com.nova.backend.user.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SmsAuthCode {
    private String code;
    private long createdAt;
}
