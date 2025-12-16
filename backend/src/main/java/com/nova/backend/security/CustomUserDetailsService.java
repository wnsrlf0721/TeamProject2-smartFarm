    package com.nova.backend.security;

    import com.nova.backend.user.entity.UsersEntity;
    import com.nova.backend.user.repository.UserRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.security.core.authority.SimpleGrantedAuthority;
    import org.springframework.security.core.userdetails.*;
    import org.springframework.stereotype.Service;

    import java.util.List;

    @Service
    @RequiredArgsConstructor
    public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId)
            throws UsernameNotFoundException {

        UsersEntity user = userRepository.findByLoginId(loginId);

        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }

        //  role 형태 중요: ROLE_USER / ROLE_ADMIN
        List<SimpleGrantedAuthority> roles =
                List.of(new SimpleGrantedAuthority(user.getRole()));

        return new CustomUserDetails(user, roles);
    }
    }
