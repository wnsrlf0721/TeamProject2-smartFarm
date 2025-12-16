package com.nova.backend.user.service;

import com.nova.backend.user.dto.FindIdRequestDTO;
import com.nova.backend.user.dto.LoginRequestDTO;
import com.nova.backend.user.dto.ResetPasswordDTO;
import com.nova.backend.user.dto.SignupRequestDTO;
import com.nova.backend.user.entity.UsersEntity;

public interface UserService { // 서비스 에 인증 2개

    //회원가입
    void signUp(SignupRequestDTO dto);
    //로그인
    UsersEntity login(LoginRequestDTO dto);
    //iD찾기
    String findUserId(FindIdRequestDTO dto);
    //비밀번호 재설정
    void resetPassword(ResetPasswordDTO dto);
    // 아이디 중복확인
    boolean existsLoginId(String loginId);

    UsersEntity findByLoginId(String loginId);

    void resetPasswordByLoginId(String loginId, String newPassword);
}
