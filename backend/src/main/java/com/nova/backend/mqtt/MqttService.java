package com.nova.backend.mqtt;

import lombok.RequiredArgsConstructor;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttService {
    private final MyPublisher publisher;
    int count=0;
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<String> message) {
        // 메시지 페이로드(내용)
        String payload = message.getPayload();
        // 헤더에서 토픽 정보 가져오기
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);

        System.out.println("Received Message: " + payload);
        System.out.println("Received Topic: " + topic);

        // 여기서 DB에 저장하거나 로직을 수행하면 됩니다.
        if (topic.equals("home/sensor/dht11")) {
            System.out.println(">>> 온습도 센서 데이터 처리 로직 수행");
            // JSON 파싱 후 온습도 DB 저장 등...

        } else if (topic.equals("home/sensor/mcp")) {
            System.out.println(">>> MCP 데이터 처리 로직 수행");
            // JSON 파싱 후 토양 수분 DB 저장 등...
        }
        else if (topic.equals("home/sensor/water")) {
            System.out.println(">>> 초음파 데이터 처리 로직 수행");
            // JSON 파싱 후 토양 수분 DB 저장 등...
        }
        else if (topic.equals("home/sensor/co2")) {
            System.out.println(">>> 이산화탄소 데이터 처리 로직 수행");
            // JSON 파싱 후 토양 수분 DB 저장 등...
        }
        count++;
        System.out.println(count);
        String pub_topic = "heaves/home/web/led";
        if(count%3==0){
            System.out.println("조건만족");
            String pub_msg = count%2==0?"led_on":"led_off";
            publisher.sendToMqtt(pub_msg,pub_topic);
        }
    }
//    private final MessageChannel mqttOutboundChannel;

//    public void publish(String topic, String payload) {
//        Message<String> message = MessageBuilder.withPayload(payload)
//                .setHeader(MqttHeaders.TOPIC, topic)
//                .build();
//        mqttOutboundChannel.send(message);
//    }
}