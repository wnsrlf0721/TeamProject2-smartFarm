package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MyPageDAOImpl implements MyPageDAO {
    private final UserRepository userRepository;

    @Override
    public UsersEntity findByUserId(long id) {
        return userRepository.findByUserId(id) ;
    }
}
