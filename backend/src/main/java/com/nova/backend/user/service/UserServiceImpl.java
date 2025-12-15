package com.nova.backend.user.service;

import com.nova.backend.user.dao.UserDao;
import com.nova.backend.user.dto.FindIdRequestDTO;
import com.nova.backend.user.dto.LoginRequestDTO;
import com.nova.backend.user.dto.ResetPasswordDTO;
import com.nova.backend.user.dto.SignupRequestDTO;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder; // 추가

    @Override
    public void signUp(SignupRequestDTO dto) {
        UsersEntity exist = userDao.findByLoginId(dto.getLoginId());
        if (exist != null) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        UsersEntity user = new UsersEntity();
        user.setLoginId(dto.getLoginId());
        user.setName(dto.getName());

        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPostalCode(dto.getPostalCode());
        user.setAddress(dto.getAddress());
        user.setAddressDetail(dto.getAddressDetail());
        user.setCreateDate(LocalDateTime.now());
        user.setRole("user");
        user.setLoginType("normal");

        userDao.save(user);
    }

    @Override
    public UsersEntity login(LoginRequestDTO dto) {
        UsersEntity user = userDao.findByLoginId(dto.getLoginId());
        if (user == null) {
            throw new RuntimeException("아이디가 존재하지 않습니다.");
        }

        // 암호화된 비밀번호 비교
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다");
        }

        user.setLastLoginDate(LocalDateTime.now());
        userDao.save(user);
        return user;
    }

    @Override
    public String findUserId(FindIdRequestDTO dto) {

        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            UsersEntity user = userDao.findByNameAndEmail(dto.getName(), dto.getEmail());
            if (user == null) {
                throw new RuntimeException("이름 또는 이메일이 일치하지 않습니다.");
            }
            return user.getLoginId();
        }

        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isEmpty()) {
            UsersEntity user = userDao.findByNameAndPhoneNumber(dto.getName(), dto.getPhoneNumber());
            if (user == null) {
                throw new RuntimeException("이름 또는 전화번호가 일치하지 않습니다.");
            }
            return user.getLoginId();
        }

        throw new RuntimeException("이메일 또는 전화번호를 입력해주세요.");
    }

    @Override
    public void resetPassword(ResetPasswordDTO dto) {

        UsersEntity user = userDao.findById(dto.getUserId());
        if (user == null) {
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        // 비밀번호 재설정도 암호화
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userDao.save(user);
    }

    @Override
    public boolean existsLoginId(String loginId) {
        return userDao.findByLoginId(loginId) != null;
    }
}
