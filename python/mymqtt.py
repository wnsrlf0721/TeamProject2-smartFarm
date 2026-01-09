import paho.mqtt.client as client
import RPi.GPIO as gpio
from threading import Thread
from sensor import DHTSensor, MCPSensor, UltrasonicSensor, CO2Sensor
from pump import Pump
from actuator import Actuator
from blind import Blind
from heater import Heater
from mycamera import TimeLapseCamera
import paho.mqtt.publish as publisher
import json
import time
import base64

# subscribe 할 토픽 리스트
sub_topics = [
    ("+/+/LED",1),
    ("+/+/FAN",1),
    ("+/+/HUMIDIFIER",1),
    ("+/+/PUMP",1),
    ("+/+/HEATER",1),
    ("+/+/BLIND",1),
    ("+/+/TIMELAPSE",1)
]

# publish 할 토픽은 센서밖에 없고, nova 시리얼 넘버와 slot을 기반으로 Farm을 찾음
nova_serial = "NOVA-FARM-001"
slot = 3
pub_topic = f"{nova_serial}/{slot}"

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
        self.fan = Actuator(21) # P.21 핀에 FAN
        self.humidifier = Actuator(20) # P.20 핀에 가습기
        self.blind = Blind(16) # 서보모터 p.16 핀 (블라인드)
        self.heater = Heater(12)    # 히터 (P.12 핀)
        
        
        self.ledCO2 = Actuator(24) # P.13 핀에 LED
        self.ledHeater = Actuator(23) # P.13 핀에 LED
        self.ledHumidifier = Actuator(18) # P.13 핀에 LED
        
        # 타임랩스 카메라 객체 생성
        self.timelapse_camera = None

    def mqtt_publish_photo(self, data):
        global pub_topic

        if "status" in data:
            self.client.publish(
                f"{pub_topic}/timelapse/{data['status']}",
                json.dumps(data)
            )
            print(f"타임랩스 상태 전송: {data['status']}")
            return

        payload = {
            "index": data["index"],
            "image": base64.b64encode(data["image"]).decode("utf-8")
        }

        self.client.publish(
            f"{pub_topic}/timelapse/frame",
            json.dumps(payload)
        )

        print(f"{data['index']}번 프레임 전송 완료")

    def start_timelapse(self):
        Thread(
            target=self.timelapse_camera.start_timelapse,
            args=(self.mqtt_publish_photo,)
        ).start()

    # broker 서버와 연결 후 실행 될 콜백메서드 - rc가 0이면 접속 성공, sub_topics 구독 신청
    def on_connect(self, client, userdata, flags, rc):
        global sub_topics
        print(client, userdata, flags)
        print("connect...: "+str(rc))
        if rc==0: #연결성공하면 구독신청
            client.subscribe(sub_topics)
        else:
            print("연결실패.....")

    # sub_topics 메시지가 수신되면 자동으로 호출되는 메서드
    def handle_message(self, topic, payload):
        global nova_serial, slot
        
        try:
            my_val = payload.decode("utf-8")
            print(f"[Thread] 처리 시작: {topic} -> {my_val}")
            
            topicArr = topic.split("/")
            
            # 팜 번호가 맞는지 체크
            if topicArr[0] == nova_serial and int(topicArr[1]) == slot:
                
                # JSON 파싱 시도
                data = None
                try:
                    data = json.loads(my_val)
                except:
                    pass # JSON이 아닌 경우

                device = topicArr[2]

                if device == "LED":
                    self.led.control_msg(data)
                    
                elif device == "FAN":
                    action = data.get("action", "").upper().split("/")[1]
                    if action == "CO2":
                        self.ledCO2.on()
                    elif action == "HEATER":
                        self.ledHeater.on()
                    elif action == "HUMIDIFIER":
                        self.ledHumidifier.on()
                        
                    self.fan.control_msg(data)
                    
                    if action == "CO2":
                        self.ledCO2.off()
                    elif action == "HEATER":
                        self.ledHeater.off()
                    elif action == "HUMIDIFIER":
                        self.ledHumidifier.off()
                    
                elif device == "HUMIDIFIER":
                    self.humidifier.control_msg(data)
                    
                elif device == "BLIND":
                    self.blind.on_message(data) 
                    
                elif device == "PUMP":
                    self.pump.run_pump()
                    
                elif device == "HEATER":
                    action = data.get("action", "").upper()
                    if action == "ON":
                        self.heater.on()
                    elif action == "OFF":
                        self.heater.off()
                        
                elif device == "TIMELAPSE":
                    data = json.loads(my_val)

                    if data["command"] == "start":
                        print("웹 요청으로 타임랩스 시작")

                        interval = data["interval"]
                        duration = data["duration"]
                        width = data["width"]
                        height = data["height"]
                        print(f"interval: {interval}, duration: {duration}, width: {width}, height: {height}")

                        total_photos = int(duration / interval)

                        self.timelapse_camera = TimeLapseCamera(
                            interval=interval,
                            total_photos=total_photos,
                            width=width,
                            height=height
                        )

                        self.start_timelapse()

                    elif data["command"] == "stop":
                        print("웹 요청으로 타임랩스 중지")
                        if self.timelapse_camera:
                            self.timelapse_camera.stop()
                        
        except Exception as e:
            print(f"메시지 처리 중 에러 발생: {e}")

    # 2. on_message는 스레드 생성 역할만 수행
    def on_message(self, client, userdata, message):
        print(f"메시지 수신 (Topic: {message.topic})")
        
        # 메시지 내용을 스레드에 전달 (target=실행할함수, args=(인자,))
        task_thread = Thread(target=self.handle_message, args=(message.topic, message.payload))
        
        # 데몬 스레드로 설정
        task_thread.daemon = True 
        task_thread.start()
           

    # publish 메시지를 보내는 메서드
    # 센서가 수집하는 모든 데이터를 5초 간격으로 한번에 모아서 전송하는 방식
    def publish_all_sensor_data(self):
        global pub_topic
        while True:
            try:
                # 각 센서마다 데이터 갱신하기
                payload = {
                    "temp": self.dht.data["temp"],
                    "humidity": self.dht.data["humi"],
                    "soilMoisture": self.mcp.data["soil_moisture"],
                    "lightPower": self.mcp.data["lightpower"],
                    "waterLevel": self.water_level.data["water_level"],
                    "co2": self.co2.data["co2"]
                }

                json_str = json.dumps(payload)
                self.client.publish(pub_topic + "/sensor", json_str)
                print(f"Sent ALL Data: {json_str}")
            except Exception as e:
                print(f"Publish Error: {e}")

            time.sleep(5) # 5초마다 반복 전송

    # MQTT 서버연결을 하는 메서드 - 사용자정의
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            self.client.connect("192.168.14.116",1883,60) # broker 서버 IP 설정
            self.client.loop_start()
            self.publish_all_sensor_data()
        except KeyboardInterrupt:
            pass
        finally:
            print("종료")
    
    def clean(self):
        print("\n[시스템 종료] 자원을 정리합니다...")
        
        # 1. MQTT 연결 종료
        try:
            self.client.loop_stop() # 백그라운드 루프 중지
            self.client.disconnect() # 서버 연결 끊기
            print("- MQTT 연결 종료 완료")
        except Exception as e:
            print(f"- MQTT 종료 중 에러: {e}")

        # 2. GPIO 핀 초기화 (모든 액추에이터 끄기)
        try:
            gpio.cleanup()
            print("- GPIO Cleanup 완료")
        except Exception as e:
            print(f"- GPIO Cleanup 중 에러: {e}")