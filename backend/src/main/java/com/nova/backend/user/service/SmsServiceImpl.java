package com.nova.backend.user.service;

import com.nova.backend.config.SmsConfig;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.*;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    private final SmsConfig smsConfig;
    private final Random random = new Random();

    //  phoneNumber → 인증정보 저장소 (메모리)
    private final Map<String, SmsAuthCode> authStore = new ConcurrentHashMap<>();

    //  인증번호 유효시간 (3분)
    private static final long EXPIRE_TIME = 3 * 60 * 1000;

    /**
     * 인증번호 생성 + SMS 발송 + 저장
     */
    @Override
    public void sendAuthCode(String phoneNumber) {

        // SOLAPI 초기화
        DefaultMessageService messageService =
                NurigoApp.INSTANCE.initialize(
                        smsConfig.getApiKey(),
                        smsConfig.getApiSecret(),
                        "https://api.solapi.com"
                );

        // 6자리 인증번호 생성
        String authCode = String.valueOf(100000 + random.nextInt(900000));

        // SMS 메시지 생성
        Message message = new Message();
        message.setFrom(smsConfig.getFromNumber());
        message.setTo(phoneNumber);
        message.setText("[NOVA] 인증번호는 " + authCode + " 입니다. (3분 유효)");

        try {
            messageService.send(message);
        } catch (NurigoMessageNotReceivedException |
                 NurigoEmptyResponseException |
                 NurigoUnknownException e) {
            throw new RuntimeException("SMS 전송 실패", e);
        }

        //  인증번호 저장 (항상 최신으로 덮어쓰기)
        authStore.put(phoneNumber,
                new SmsAuthCode(authCode, System.currentTimeMillis()));

        // 개발 중 확인용 로그
        System.out.println(" SMS 인증번호(테스트): " + authCode);
    }

    /**
     * 인증번호 검증
     */
    @Override
    public boolean verifyAuthCode(String phoneNumber, String code) {

        SmsAuthCode auth = authStore.get(phoneNumber);
        if (auth == null) return false;

        // ⏱ 만료 체크
        if (System.currentTimeMillis() - auth.createdAt > EXPIRE_TIME) {
            authStore.remove(phoneNumber);
            return false;
        }

        //  코드 비교
        if (!auth.code.equals(code)) {
            return false;
        }

        //  성공 → 사용한 인증번호 제거
        authStore.remove(phoneNumber);
        return true;
    }

    //  내부 인증정보 객체
    @Data
    @AllArgsConstructor
    private static class SmsAuthCode {
        private String code;
        private long createdAt;
    }
}
