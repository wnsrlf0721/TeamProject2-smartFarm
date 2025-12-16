package com.nova.backend.user.service;

public interface PasswordService {

    void checkEmailExists(String email);

    void resetPasswordByEmail(String email, String newPassword);

    void resetPasswordByPhone(String phoneNumber, String newPassword);
}
