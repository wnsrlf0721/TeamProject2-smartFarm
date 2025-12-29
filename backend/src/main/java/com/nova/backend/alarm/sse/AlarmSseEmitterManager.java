package com.nova.backend.alarm.sse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// 연결을 서버가 직접 들고 있어야 함. >> Map<userId, SseEmitter>
@Component
public class AlarmSseEmitterManager {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    private static final long TIMEOUT = 60L * 60L * 1000; // 1시간

    public SseEmitter connect(Long userId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError(e -> emitters.remove(userId));
        // 연결하고 나서 바로 ping?
        try {
            emitter.send(
                    SseEmitter.event()
                            .name("connect")
                            .data("connected")
            );
        } catch (IOException e) {
            emitters.remove(userId);
        }
        return emitter;
    }

    public void send(Long userId, Object data) {
        System.out.println("🔥 SSE send to userId=" + userId + ", data=" + data);
        SseEmitter emitter = emitters.get(userId);
        if (emitter == null) {
            System.out.println("❌ emitter 없음 (연결 안됨)");
        return;}

        try {
            emitter.send(
                    SseEmitter.event()
                            .name("alarm")
                            .data(data)
            );
        } catch (IOException e) {
            emitters.remove(userId);
        }
    }
}
