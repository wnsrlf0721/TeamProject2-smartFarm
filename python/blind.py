import json
import time
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

class Blind:
    def __init__(self,pin):
        # ===== GPIO 설정 =====
        SERVO_PIN = pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(SERVO_PIN, GPIO.OUT)

        self.pwm = GPIO.PWM(SERVO_PIN, 50)  # 50Hz
        self.pwm.start(0)
        self.pwm.ChangeDutyCycle(2.5)
        
    def set_angle(self, angle):
        # 입력값 제한 (0~90도)
        if angle > 90: angle = 90
        if angle < 0: angle = 0
        
        print(f"모터 각도 이동: {angle}도")
        
        # 듀티 사이클 계산 보정 (2.5 ~ 12.5)
        duty = 2.5 + (angle / 18)
        self.pwm.ChangeDutyCycle(duty)
        
        # 모터가 물리적으로 이동할 시간을 충분히 줌 (블라인드 무게 고려)
        time.sleep(0.8) 
        
        # 모터 떨림 방지 (신호 끊기)
        self.pwm.ChangeDutyCycle(0)
        

    # ===== MQTT 콜백 =====
    def on_connect(client, userdata, flags, rc):
        print("MQTT Connected")
        client.subscribe("home/actuator/blind")

    def on_message(self, msg):
        print("받은 메시지:", msg)
        action = msg.get("action", "")
        if action == "OPEN":
            angle = 90  # 블라인드 열기
        elif action == "CLOSE":
            angle = 0  # 블라인드 닫기
        self.set_angle(angle)

# ===== MQTT 연결 =====
# client = mqtt.Client()
# client.on_connect = on_connect
# client.on_message = on_message

# client.connect("192.168.14.12", 1883, 60)
# client.loop_forever()
if __name__ == "__main__":
    blind = Blind(16)  # 서보모터 (블라인드)                                                                                                                                                                                
    try:
        while True:
            blind.set_angle(90)  # 블라인드 열기
            time.sleep(5)
            blind.set_angle(0)   # 블라인드 닫기
            time.sleep(5)
    except KeyboardInterrupt:
        pass