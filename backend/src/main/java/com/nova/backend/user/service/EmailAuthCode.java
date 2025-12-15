package com.nova.backend.user.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailAuthCode {

    private String code;      // 인증번호
    private long createdAt;   // 생성 시간 (millis)
}
