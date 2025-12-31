package com.nova.backend.user.dto;


import lombok.Data;

@Data
public class SignupRequestDTO {
    private String loginId;
    private String password;
    private String name;
    private String email;
    private String phoneNumber;
    private String postalCode;
    private String address;
    private String addressDetail;
    //user은 기본값
}
