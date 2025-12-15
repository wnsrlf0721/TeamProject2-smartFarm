package com.nova.backend.user.dto;

import lombok.Data;

@Data
public class FindIdRequestDTO {
    private String name;
    private String email;
    private String phoneNumber;
}
