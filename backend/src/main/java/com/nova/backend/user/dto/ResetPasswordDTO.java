package com.nova.backend.user.dto;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private Long userId;
    private String newPassword;
}
