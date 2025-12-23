import paho.mqtt.client as client
import RPi.GPIO as gpio
from threading import Thread
from sensor import DHTSensor, MCPSensor, UltrasonicSensor, CO2Sensor
from pump import Pump
from actuator import Actuator
from blind import Blind
from mycamera import TimeLapseCamera
import paho.mqtt.publish as publisher
import json
import time

# subscribe 할 토픽 리스트
sub_topics = [
    ("+/+/LED",1),
    ("+/+/FAN",1),
    ("+/+/HUMI",1),
    ("+/+/PUMP",1),
    ("+/+/HEATER",1),
    ("+/+/BLIND",1),
]

# publish 할 토픽은 센서밖에 없고, nova 시리얼 넘버와 slot을 기반으로 Farm을 찾음
nova_serial = "NOVA-FARM-001"
slot = 2
pub_topic = f"{nova_serial}/{slot}/sensor"

class MqttWorker:
    #생성자에서 mqtt통신할 수 있는 객체생성, 필요한 다양한 객체생성, 콜백함수 등록
    def __init__(self):
        self.client = client.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        #self.client.on_disconnect = self.on_disconnect

        # 센서 객체 생성 및 측정 스레드 시작(start)
        # dht: 온/습도, mcp: 토양/조도, water_level: 수위, co2: 이산화탄소
        self.dht = DHTSensor()
        self.dht.start()
        self.mcp = MCPSensor()
        self.mcp.start()
        self.water_level = UltrasonicSensor()
        self.water_level.start()
        self.co2 = CO2Sensor()
        self.co2.start()
        # 6가지의 데이터를 주기적으로 측정

        # 액추에이터 객체 생성 및 제어
        self.pump = Pump() # 물 펌프
        self.led = Actuator(13) # P.13 핀에 LED
        self.fan = Actuator(5) # P.5 핀에 FAN
        self.humidifier = Actuator(10) # P.10 핀에 가습기
        self.blind = Blind() # 서보모터 (블라인드)
        # 히터 액추 추가 예정
        
        # 타임랩스 카메라 객체 생성
        # self.timelapse_camera = TimeLapseCamera(interval=5, total_photos=20)

    def mqtt_publish_photo(self, image_bytes, index):
        """카메라 callback에서 호출"""
        if image_bytes is None and index == "done":
            # 촬영 완료 메시지
            publisher.single("heaves/home/web/timelapse/done", "complete", hostname="192.168.14.116")
            print("타임랩스 촬영 완료 메시지 전송")
        else:
            publisher.single("heaves/home/web/timelapse/photo", image_bytes, hostname="192.168.14.116")
            print(f"사진 {index} 전송 완료")

    def start_timelapse(self):
        # 카메라 촬영 시작, callback 등록
        Thread(target=self.timelapse_camera.start_timelapse, args=(self.mqtt_publish_photo,)).start()

    # broker 서버와 연결 후 실행될 콜백메서드 - rc가 0이면 접속 성공, sub_topics 구독 신청
    def on_connect(self, client, userdata, flags, rc):
        global sub_topics
        print(client, userdata, flags)
        print("connect...: "+str(rc))
        if rc==0: #연결성공하면 구독신청
            client.subscribe(sub_topics)
        else:
            print("연결실패.....")

    # sub_topics 메시지가 수신되면 자동으로 호출되는 메서드
    def on_message(self,client, userdata, message):
        global nova_serial, slot
        my_val = message.payload.decode("utf-8")
        print(message.topic + "===========", my_val)
        
        # 토픽을 "/" 기준으로 나누어 어떤 액추에이터에 관한 토픽인지 구분
        topicArr = message.topic.split("/")
        if(topicArr[0]==nova_serial and int(topicArr[1])==slot):
            if topicArr[2] == "LED":
                self.led.control_msg(my_val)
            elif topicArr[2] == "FAN":
                self.fan.control_msg(my_val)
            elif topicArr[2] == "HUMI":
                self.humidifier.control_msg(my_val)
            elif topicArr[2] == "BLIND":
                self.blind.on_message(my_val)
            elif topicArr[2] == "PUMP":
                print(my_val)
                # if my_val == "pump_on":
                #     print("웹 요청으로 펌프 작동")
                #     self.pump.run_pump()
            elif topicArr[2] == "timelapse":
                if my_val == "start":
                    print("웹 요청으로 타임랩스 시작")
                    self.start_timelapse()

                    # MyCamera의 getStreaming 을 호출해서 프레임을 publish
                    self.is_streaming = True
                    print("start")
                    self.cam_thread = Thread(target=self.send_camera_frame)
                    self.cam_thread.start()
                elif my_val == "end":
                    print("end")
                    self.is_streaming = False

    # publish 메시지를 보내는 메서드
    # 센서가 수집하는 모든 데이터를 한번에 모아서 전송하는 방식
    def publish_all_sensor_data(self):
        global pub_topic
        while True:
            try:
                # 각 센서 객체에서 최신 데이터 가져오기
                payload = {
                    "temp": self.dht.data["temp"],
                    "humidity": self.dht.data["humi"],
                    "soilMoisture": self.mcp.data["soil_moisture"],
                    "lightPower": self.mcp.data["lightpower"],
                    "waterLevel": self.water_level.data["water_level"],
                    "co2": self.co2.data["co2"]
                }

                json_str = json.dumps(payload)
                self.client.publish(pub_topic, json_str)
                print(f"Sent ALL Data: {json_str}")
            except Exception as e:
                print(f"Publish Error: {e}")

            time.sleep(5) # 5초마다 반복 전송

    # MQTT 서버연결을 하는 메서드 - 사용자정의
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            self.client.connect("192.168.14.116",1883,60)
            self.client.loop_start()
            self.publish_all_sensor_data()
        except KeyboardInterrupt:
            pass
        finally:
            print("종료")