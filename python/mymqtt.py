import paho.mqtt.client as client
import RPi.GPIO as gpio
from threading import Thread
from sensor import DHTSensor, MCPSensor, UltrasonicSensor, CO2Sensor
from led import LED
from mycamera import MyCamera
import paho.mqtt.publish as publisher

class MqttWorker:
    #생성자에서 mqtt통신할 수 있는 객체생성, 필요한 다양한 객체생성, 콜백함수 등록
    def __init__(self):
        self.client = client.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        #self.client.on_disconnect = self.on_disconnect
        # self.led_pins = [13,23]
        # self.led = list(LED(pin) for pin in self.led_pins)
        self.led = LED(13)
        self.dht11 = DHTSensor(self.client)
        self.dht11.start()
        self.mcp = MCPSensor(self.client)
        self.mcp.start()
        self.water_level = UltrasonicSensor(self.client)
        self.water_level.start()
        self.co2 = CO2Sensor(self.client)
        self.co2.start()
        
        # self.camera = MyCamera()
        # 스트리밍의 상태를 제어하기 위해 변수 생성
        # self.is_streaming = False
        # self.cam_thread = None
        
    # broker 연결 후 실행될 콜백메서드 - rc가 0이면 성공접속, 1이면 실패
    def on_connect(self, client, userdata, flags, rc):
        print(client, userdata, flags)
        print("connect...: "+str(rc))
        if rc==0: #연결성공하면 구독신청
            client.subscribe("heaves/home/web/#")
        else:
            print("연결실패.....")
            
    # 메시지가 수신되면 자동으로 호출되는 메서드
    def on_message(self,client, userdata, message):
        my_val = message.payload.decode("utf-8")
        print(message.topic + "===========", my_val)
        # device_type = my_val[0]
        # led_index = int(my_val[1])
        if message.topic == "heaves/home/web/led":
            if my_val == "led_on":
                self.led.led_on()
            elif my_val == "led_off":
                self.led.led_off()
        elif message.topic == "heaves/home/web/cam":
            if my_val == "start":
                # MyCamera의 getStreaming 을 호출해서 프레임을 publish
                self.is_streaming = True
                print("start")
                self.cam_thread = Thread(target=self.send_camera_frame)
                self.cam_thread.start()
            elif my_val == "end":
                print("end")
                self.is_streaming = False
    
    # 프레임을 지속적으로 publish하는 코드를 스레드로 실행
    def send_camera_frame(self):
        while self.is_streaming:
            try:
                frame = self.camera.getStreaming()
                publisher.single("heaves/home/web/cam",frame,hostname= "192.168.14.116")
            
            except Exception as e:
                print("영상 전송 중 에러: ",e)
                self.is_streaming = False
                break
        
            
    # MQTT 서버연결을 하는 메서드 - 사용자정의
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            self.client.connect("192.168.14.116",1883,60)
            # 내부적으로 paho.mqtt는 이벤트 기반
            # mqtt통신을 유지하기 위해선 지속적으로 broker와 연결을 테스트(ping 교환), 수신메시지를 읽기,
            # 연결이 끊어지면 재연결
            # 이 모든 작업이 처리되려면 별도의 실행흐름으로 스레드에서 이런 일들이 지속되도록 loop_forever를 
            # 스레드로 작업할 수 있도록 지정
            # loop_forever가 계속 통신을 유지해야 메시지가 도착하면 콜백으로 등록한 on_message가 호출
            # 지속적으로 통신을 유지하는 처리를 해야하므로 스레드로 작업
            self.client.loop_forever()
            # mymqtt_obj = Thread(target=self.client.loop_forever)
            # mymqtt_obj.start()
        except KeyboardInterrupt:
            pass
        finally:
            print("종료")