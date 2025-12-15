package com.nova.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class EmailAuthServiceImpl implements EmailAuthService {

    private final JavaMailSender mailSender;
    private final Random random = new Random();

    /**
     * 이메일 : 인증정보(코드 + 생성시간)
     * (실서비스에서는 Redis / DB 권장)
     */
    private final Map<String, EmailAuthCode> authCodeStore = new ConcurrentHashMap<>();

    /**
     * 인증번호 메일 발송
     */
    @Override
    public void sendAuthCode(String email) {
        String authCode = generateAuthCode();

        // 항상 최신 인증번호로 덮어쓰기
        authCodeStore.put(
                email,
                new EmailAuthCode(authCode, System.currentTimeMillis())
        );

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("[NOVA] 이메일 인증번호");
        mail.setText(buildMailText(authCode));

        mailSender.send(mail);
    }

    /**
     * 인증번호 검증
     */
    @Override
    public boolean verifyAuthCode(String email, String code) {
        EmailAuthCode auth = authCodeStore.get(email);

        if (auth == null) {
            return false;
        }

        // 3분 만료 체크
        long now = System.currentTimeMillis();
        if (now - auth.getCreatedAt() > 3 * 60 * 1000) {
            authCodeStore.remove(email);
            return false;
        }

        // 코드 비교
        if (!auth.getCode().equals(code)) {
            return false;
        }

        // 인증 성공 → 제거
        authCodeStore.remove(email);
        return true;
    }

    /**
     * 6자리 인증번호 생성
     */
    private String generateAuthCode() {
        return String.valueOf(100000 + random.nextInt(900000));
    }

    /**
     * 메일 본문 생성
     */
    private String buildMailText(String authCode) {
        return """
                안녕하세요. NOVA 입니다.

                이메일 인증번호는 아래와 같습니다.

                인증번호 : %s

                (3분간 유효합니다)

                감사합니다.
                """.formatted(authCode);
    }
}
