package com.nova.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersRequestDTO {
    private Long userId;
    private String loginId;
    private String password;
    private String name;
    private String email;
    private String phoneNumber;
    private String postalCode;
    private String address;
    private String addressDetail;
}
