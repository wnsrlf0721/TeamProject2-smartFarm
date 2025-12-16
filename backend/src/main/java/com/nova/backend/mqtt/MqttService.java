package com.nova.backend.mqtt;

import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.nova.backend.sensor.entity.SensorLogEntity;
import com.nova.backend.sensor.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class MqttService {
    private final MyPublisher publisher;
    private final TimelapseService timelapseService;
    private final SensorService sensorService;

    int count=0;
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<String> message) {
        // 메시지 페이로드(내용)
        String payload = message.getPayload();
        // 헤더에서 토픽 정보 가져오기
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);

        System.out.println("Received Message: " + payload);
        System.out.println("Received Topic: " + topic);
        String[] topicList = topic.split("/");
        String novaSerialNumber = topicList[0];
        int slot = Integer.parseInt(topicList[1]);
        try {
            sensorService.controlSensorData(payload,novaSerialNumber,slot);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        try {
            if (topic.startsWith("home/timelapse/photo/")) {
                long settingId = Long.parseLong(topic.substring("home/timelapse/photo/".length()));
                timelapseService.saveImage(settingId, payload);

            } else if (topic.startsWith("home/timelapse/done/")) {
                long settingId = Long.parseLong(topic.substring("home/timelapse/done/".length()));
                timelapseService.completeStep(settingId);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


//        if(count%3==0){
//            System.out.println("조건만족");
//            String pub_msg = count%2==0?"led_on":"led_off";
//            publisher.sendToMqtt(pub_msg,pub_topic);
//        }
    }
//    private final MessageChannel mqttOutboundChannel;
//
//    public void publish(String topic, String payload) {
//        Message<String> message = MessageBuilder.withPayload(payload)
//                .setHeader(MqttHeaders.TOPIC, topic)
//                .build();
//        mqttOutboundChannel.send(message);
//    }
}