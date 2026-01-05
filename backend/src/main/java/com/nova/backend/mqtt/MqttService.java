package com.nova.backend.mqtt;

import com.nova.backend.timelapse.dao.TimelapseDAO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.nova.backend.sensor.entity.SensorLogEntity;
import com.nova.backend.sensor.service.SensorService;
import com.nova.backend.timelapse.service.TimelapseService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;
import com.nova.backend.timelapse.service.TimelapseService;
@Service
@RequiredArgsConstructor
public class MqttService {
    private final MyPublisher publisher;
    private final TimelapseService timelapseService;
    private final SensorService sensorService;

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<?> message) {
        // 메시지 페이로드(내용)
        Object payloadObj = message.getPayload();
        String payload = payloadObj instanceof byte[]
                ? new String((byte[]) payloadObj)
                : payloadObj.toString();
        // 헤더에서 토픽 정보 가져오기
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);

        System.out.println("Received Message: " + payload);
        System.out.println("Received Topic: " + topic);
        String[] topicList = topic.split("/");
        String novaSerialNumber = topicList[0];
        int slot = Integer.parseInt(topicList[1]);
        if (topic.contains("/timelapse/")) {
            String type = topicList[3]; // frame | done | stopped
            try {
                if ("frame".equals(type)) {
                    timelapseService.saveImage(novaSerialNumber, slot, payload);
                    System.out.println("================================================");
                    System.out.println(topicList[3]);
                    System.out.println("================================================");
                }
                else if ("done".equals(type)) {
                    timelapseService.completeStep(novaSerialNumber, slot, payload);
                    System.out.println("================================================");
                    System.out.println(topicList[3]);
                    System.out.println("================================================");
                }
                else if ("stopped".equals(type)) {
//                    timelapseService.stopTimelapse();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }
        try {
            sensorService.controlSensorData(payload,novaSerialNumber,slot);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}