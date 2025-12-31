package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UsersDAOImpl implements UsersDAO {
    private final UserRepository userRepository;
    @Override
    public UsersEntity findByUserId(Long userId) {
        return userRepository.findByUserId(userId);
    }

    @Override
    public void update(UsersEntity usersEntity) {
        userRepository.save(usersEntity);
    }
}
