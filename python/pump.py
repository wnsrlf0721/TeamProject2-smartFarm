import RPi.GPIO as GPIO
import time
from threading import Lock

class Pump():
    def __init__(self):
        self.IN1_PIN = 5
        self.IN2_PIN = 6
        self.PUMP_DURATION = 5   # 펌프 작동 시간 (초)

        self._pump_lock = Lock()
        self._pump_running = False

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.IN1_PIN, GPIO.OUT)
        GPIO.setup(self.IN2_PIN, GPIO.OUT)

    def run_pump(self):
        with self._pump_lock:
            if self._pump_running:
                print("펌프 이미 작동 중, 무시")
                return

            print("펌프 ON")
            self._pump_running = True
            GPIO.output(self.IN1_PIN, GPIO.HIGH)
            GPIO.output(self.IN2_PIN, GPIO.LOW)

            time.sleep(self.PUMP_DURATION)

            GPIO.output(self.IN1_PIN, GPIO.LOW)
            GPIO.output(self.IN2_PIN, GPIO.LOW)
            self._pump_running = False
            print("펌프 OFF")

    def cleanup(self):
        GPIO.cleanup()