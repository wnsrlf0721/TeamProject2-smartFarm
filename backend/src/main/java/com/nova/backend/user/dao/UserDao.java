package com.nova.backend.user.dao;


import com.nova.backend.user.entity.UsersEntity;

public interface UserDao {

    UsersEntity save(UsersEntity user);
    UsersEntity findByLoginId(String loginId);
    UsersEntity findByNameAndEmail(String name, String email);
    UsersEntity findByNameAndPhoneNumber(String name, String phoneNumber);
    UsersEntity findById(Long id);
}
