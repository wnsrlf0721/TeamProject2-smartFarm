package com.nova.backend.user.service;

import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordServiceImpl implements PasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // =========================
    // 공통 비밀번호 검증
    // =========================
    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }

        if (password.length() < 8 || password.length() > 16) {
            throw new IllegalArgumentException("비밀번호는 8~16자여야 합니다.");
        }
    }

    // =========================
    // 이메일 존재 여부 확인
    // =========================
    @Override
    public void checkEmailExists(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("존재하지 않는 이메일입니다.");
        }
    }

    // =========================
    // 비밀번호 재설정 (email 기준)
    // =========================
    @Override
    public void resetPasswordByEmail(String email, String newPassword) {

        validatePassword(newPassword);

        UsersEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // =========================
    // 비밀번호 재설정 (phone 기준)
    // =========================
    @Override
    public void resetPasswordByPhone(String phoneNumber, String newPassword) {

        validatePassword(newPassword);

        UsersEntity user = userRepository.findByPhoneNumber(phoneNumber);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
