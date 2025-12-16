import RPi.GPIO as GPIO
import time
from threading import Lock

IN1_PIN = 17
IN2_PIN = 27
PUMP_DURATION = 5   # 펌프 작동 시간 (초)

_pump_lock = Lock()
_pump_running = False

GPIO.setmode(GPIO.BCM)
GPIO.setup(IN1_PIN, GPIO.OUT)
GPIO.setup(IN2_PIN, GPIO.OUT)

def run_pump():
    global _pump_running
    with _pump_lock:
        if _pump_running:
            print("펌프 이미 작동 중, 무시")
            return
        
        print("펌프 ON")
        _pump_running = True
        GPIO.output(IN1_PIN, GPIO.HIGH)
        GPIO.output(IN2_PIN, GPIO.LOW)
        
        time.sleep(PUMP_DURATION)
        
        GPIO.output(IN1_PIN, GPIO.LOW)
        GPIO.output(IN2_PIN, GPIO.LOW)
        _pump_running = False
        print("펌프 OFF")

def cleanup():
    GPIO.cleanup()