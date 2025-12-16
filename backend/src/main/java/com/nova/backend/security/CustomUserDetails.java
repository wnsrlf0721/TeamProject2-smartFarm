package com.nova.backend.security;

import com.nova.backend.user.entity.UsersEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {

    private final UsersEntity user;

    public CustomUserDetails(
            UsersEntity user,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(user.getLoginId(), user.getPassword(), authorities);
        this.user = user;
    }

    public UsersEntity getUser() {
        return user;
    }
}
