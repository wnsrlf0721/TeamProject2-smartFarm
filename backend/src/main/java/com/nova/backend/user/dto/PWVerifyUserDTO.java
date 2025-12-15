package com.nova.backend.user.dto;

import lombok.Data;

@Data
public class PWVerifyUserDTO {

    private String name;
    private String email;
    private String phoneNumber;
}
