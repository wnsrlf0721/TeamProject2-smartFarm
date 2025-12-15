package com.nova.backend.user.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String loginId;
    private String password;
}
