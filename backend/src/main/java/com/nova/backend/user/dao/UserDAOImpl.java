package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserDAOImpl implements UserDao {

    private final UserRepository userRepository;

    @Override
    public UsersEntity save(UsersEntity user) {
        return userRepository.save(user);
    }

    @Override
    public UsersEntity findByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId);
    }

    @Override
    public UsersEntity findByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email);
    }

    @Override
    public UsersEntity findByNameAndPhoneNumber(String name, String phoneNumber) {
        return userRepository.findByNameAndPhoneNumber(name, phoneNumber);
    }

    @Override
    public UsersEntity findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }


}
