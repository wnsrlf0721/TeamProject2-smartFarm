import json
import time
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

class Blind:
    def __init__(self):
        # ===== GPIO 설정 =====
        SERVO_PIN = 18
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(SERVO_PIN, GPIO.OUT)

        self.pwm = GPIO.PWM(SERVO_PIN, 50)  # 50Hz
        self.pwm.start(0)

    def set_angle(self,angle):
        duty = 2 + (angle / 18)
        self.pwm.ChangeDutyCycle(duty)
        time.sleep(0.5)
        self.pwm.ChangeDutyCycle(0)

    # ===== MQTT 콜백 =====
    def on_connect(client, userdata, flags, rc):
        print("MQTT Connected")
        client.subscribe("home/actuator/blind")

    def on_message(self, msg):
        print("받은 메시지:", msg)

        data = json.loads(msg.payload.decode())
        angle = data.get("angle", 0)

        self.set_angle(angle)

# ===== MQTT 연결 =====
# client = mqtt.Client()
# client.on_connect = on_connect
# client.on_message = on_message

# client.connect("192.168.14.12", 1883, 60)
# client.loop_forever()