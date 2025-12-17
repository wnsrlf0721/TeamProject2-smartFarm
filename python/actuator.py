import RPi.GPIO as GPIO
import time

class Actuator:
    def __init__(self, pin):
        self.pin = pin

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)
        GPIO.output(self.pin, GPIO.LOW) # 초기 상태 OFF

    def onTime(self, duration=1): # 특정 시간만큼 액추에이터가 작동되도록
            GPIO.output(self.pin, GPIO.HIGH)
            time.sleep(duration)
            GPIO.output(self.pin, GPIO.LOW)

    def on(self):
        """장치 켜기 (High 신호)"""
        GPIO.output(self.pin, GPIO.HIGH)

    def off(self):
        """장치 끄기 (Low 신호)"""
        GPIO.output(self.pin, GPIO.LOW)

    def control_msg(self,msg):
        if msg=="on":
            self.onTime(5) #5초 on
        elif msg=="off":
            self.off()

    def clean(self):
        GPIO.cleanup()