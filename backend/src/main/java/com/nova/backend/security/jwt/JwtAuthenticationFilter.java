package com.nova.backend.security.jwt;

import com.nova.backend.security.CustomUserDetails;
import com.nova.backend.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();

        return uri.startsWith("/api/users/login")
                || uri.startsWith("/api/users/signup")
                || uri.startsWith("/api/users/email")
                || uri.startsWith("/api/users/password"); // 반드시 추가
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
//            System.out.println("====== JwtAuthenticationFilter START ======");
//            System.out.println(" 요청 URI: " + request.getRequestURI());

            // 이미 인증된 경우
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
//                System.out.println(" 이미 인증됨 → 필터 패스");
                filterChain.doFilter(request, response);
                return;
            }

            // Authorization 헤더 확인
            String authHeader = request.getHeader("Authorization");
//            System.out.println("Authorization Header = " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                System.out.println(" Authorization 헤더 없음 또는 Bearer 아님");
                filterChain.doFilter(request, response);
                return;
            }

            // 토큰 추출
            String token = authHeader.substring(7);
//            System.out.println("JWT Token = " + token);

            // 토큰 검증
            boolean valid = jwtTokenProvider.validateToken(token);
//            System.out.println("JWT validate 결과 = " + valid);

            if (!valid) {
//                System.out.println(" JWT 검증 실패");
                filterChain.doFilter(request, response);
                return;
            }

            // loginId 추출
            String loginId = jwtTokenProvider.getLoginId(token);
//            System.out.println("loginId from token = " + loginId);

            // 사용자 조회
            CustomUserDetails userDetails =
                    (CustomUserDetails) userDetailsService.loadUserByUsername(loginId);

//            System.out.println("UserDetails username = " + userDetails.getUsername());
//            System.out.println("UserDetails authorities = " + userDetails.getAuthorities());

            // 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            // SecurityContext 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);

//            System.out.println(" SecurityContext 인증 저장 완료");
//            System.out.println("SecurityContext auth = "
//                    + SecurityContextHolder.getContext().getAuthentication());

        } catch (Exception e) {
//            System.out.println(" JwtAuthenticationFilter ERROR");
            e.printStackTrace();
            SecurityContextHolder.clearContext();
        }

//        System.out.println("====== JwtAuthenticationFilter END ======");
        filterChain.doFilter(request, response);
    }
}
