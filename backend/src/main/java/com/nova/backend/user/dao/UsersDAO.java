package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;

public interface UsersDAO {
    UsersEntity findByUserId(Long userId);
    void update(UsersEntity myPageEntity);
}
