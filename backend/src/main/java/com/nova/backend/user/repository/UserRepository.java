package com.nova.backend.user.repository;

import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UsersEntity, Long> {

    //로그인용(LoginId로 조회)
    UsersEntity findByLoginId(String loginId);

    //Id 찾기(이름 + 이메일)
    UsersEntity findByNameAndEmail(String name, String email);

    //Id 찾기(이름 + 전화번호)
    UsersEntity findByNameAndPhoneNumber(String name, String phoneNumber);

    //  이메일 존재 여부 확인 (비밀번호 찾기용)
    boolean existsByEmail(String email);

    // 비밀번호 재설정 (이메일)
    UsersEntity findByEmail(String email);

    //  비밀번호 재설정 (전화번호)
    UsersEntity findByPhoneNumber(String phoneNumber);

    UsersEntity findByUserId(Long userId);
}
