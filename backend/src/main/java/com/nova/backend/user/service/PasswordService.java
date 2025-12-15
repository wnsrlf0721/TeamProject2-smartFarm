package com.nova.backend.user.service;

public interface PasswordService {

    void checkEmailExists(String email);

    void resetPassword(String email, String newPassword);

    void resetPasswordByPhone(String phone, String newPassword);
}
