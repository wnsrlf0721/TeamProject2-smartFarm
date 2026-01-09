# from gpiozero import OutputDevice

# class Heater:
#     def __init__(self, pin=21):
#         # Active-LOW 릴레이
#         self.relay = OutputDevice(pin, active_high=False)
#         print("히터 초기화 완료 (OFF)")

#     def on(self):
#         print("🔥 히터 ON")
#         self.relay.on()

#     def off(self):
#         print("❄️ 히터 OFF")
#         self.relay.off()

#     def cleanup(self):
#         self.relay.off()
#         print("히터 안전 종료")
import time
from gpiozero import OutputDevice

class Heater:
    def __init__(self, pin=21):
        self.relay = OutputDevice(pin, active_high=False)
        self.last_on_time = 0
        self.MIN_INTERVAL = 300      # 5분 (재가열 최소 간격)
        self.FIRST_ON_DURATION = 30 # 최초 가열 시간(초)
        print("히터 초기화 완료")

    def on(self):
        now = time.time()

        # 너무 최근에 켰으면 무시
        if now - self.last_on_time < self.MIN_INTERVAL:
            print("⏳ 히터 재가열 요청 무시 (쿨다운 중)")
            return

        print("🔥 히터 최초 가열 ON")
        self.relay.on()
        time.sleep(self.FIRST_ON_DURATION)
        self.relay.off()

        self.last_on_time = now
        print("🔥 히터 최초 가열 완료")

    def off(self):
        print("❄️ 히터 OFF")
        self.relay.off()

    def cleanup(self):
        self.relay.off()