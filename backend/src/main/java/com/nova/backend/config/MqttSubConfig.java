package com.nova.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.integration.channel.PublishSubscribeChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;

import java.util.UUID;

@Configuration
public class MqttSubConfig {
    @Value("${spring.mqtt.client-id}")
    private String clientId;
    @Value("${spring.mqtt.topic.sensor}")
    private String sensorTopic;

    // 수신 채널 생성
    @Bean
    public MessageChannel mqttInputChannel() {
        return new PublishSubscribeChannel();
    }

    // --- SubConfig 클래스 생성 이후 sensorTopic 확인하기 ---
    @PostConstruct
    public void init() {
        System.out.println("======================================================");
        System.out.println(">>> MqttSubConfig 로딩됨! 구독 토픽: " + sensorTopic);
        System.out.println("======================================================");
    }

    // --- MQTT 어댑터 (브로커 -> 채널로 센서 데이터 가져오기) ---
    @Bean
    public MessageProducer inboundAdapter(MqttPahoClientFactory mqttClientFactory) {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId + "_sub"
                        + UUID.randomUUID().toString(),
                        mqttClientFactory, sensorTopic);
        // 채널 어댑터에 필요한 설정 세팅
        adapter.setCompletionTimeout(5000); //default 30초 -> 5초로 변경
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel()); // mqttInputChannel로 전송
        return adapter;
    }
    // --- 채널에 데이터가 들어오는지 확인하는 코드 (디버깅용) ---
    // MqttService가 없어도 이 코드가 있으면 메시지 도착 시 로그가 찍힙니다.
//    @Bean
//    public IntegrationFlow logFlow() {
//        return f -> f.channel("mqttInputChannel")
//                .handle(m -> {
//                    System.out.println(">>> [디버깅] 채널 통과 중: " + m.getPayload());
//                });
//    }
}