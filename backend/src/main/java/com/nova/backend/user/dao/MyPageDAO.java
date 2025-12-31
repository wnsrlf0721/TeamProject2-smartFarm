package com.nova.backend.user.dao;

import com.nova.backend.user.entity.UsersEntity;

public interface MyPageDAO {
    UsersEntity findByUserId(long id);
}
