package com.nova.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UsersEntity {
    // PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // 로그인 ID
    @Column(name = "login_id", nullable = false, unique = true)
    private String loginId;

    // 비밀번호
    @Column(nullable = false)
    private String password;

    // 이름
    @Column(nullable = false)
    private String name;

    // 이메일
    @Column(nullable = false, unique = true)
    private String email;


    // 전화번호
    @Column(name = "phone_number", nullable = false,  unique = true)
    private String phoneNumber;

    // 우편번호 → DB에서는 postal_code
    @Column(name = "postal_code", nullable = false)
    private String postalCode;

    // 주소
    @Column(nullable = false)
    private String address;

    // 상세주소
    @Column(name = "address_detail", nullable = false)
    private String addressDetail;

    // 회원가입 날짜
    @Column(name = "create_date", nullable = false)
    private LocalDateTime createDate;

    // 최근 로그인 날짜
    @Column(name = "last_login_date")
    private LocalDateTime lastLoginDate;

    // 권한 (user/admin)
    @Column(nullable = false)
    private String role;

    // 로그인 타입(normal/google/kakao)
    @Column(name = "login_type", nullable = false)
    private String loginType;

    public UsersEntity(Long userId, String loginId, String password, String name, String email, String phoneNumber, String postalCode, String address, String addressDetail) {
        this.userId = userId;
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.postalCode = postalCode;
        this.address = address;
        this.addressDetail = addressDetail;
    }
}

