import time
import board # 데이터 송신용 board모듈 - 라즈베리파이나 아두이노에서 핀에 정보를 추상화
from threading import Thread # Thread를 통한 주기적인 통신 데이터 전송
import json # 데이터를 json 타입으로 전송

# DHTSensor
import adafruit_dht # 해당 라이브러리를 활용해서 DHT11 온습도 센서를 제어
# MCPSensor
import busio
import digitalio
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn
# MH-Z19 (이산화탄소 센서 라이브러리)
import mh_z19

class DHTSensor(Thread):
    def __init__(self, client):
        Thread.__init__(self)
        self.mydht11 = adafruit_dht.DHT11(board.D25)
        self.client = client
        
    def run(self):
        while True:
            try:
                humidity_data = self.mydht11.humidity
                temperature_data = self.mydht11.temperature
                # 보낼 데이터를 json으로 만들어서 보내기
                # 1. 보낼 데이터를 딕셔너리 형태로 만들기
                data_payload = {
                    "temp": temperature_data,
                    "humi": humidity_data
                }
                # 2. 딕셔너리를 json문자열로 변환
                json_str = json.dumps(data_payload)
                
                self.client.publish("home/sensor/dht11",json_str)
                time.sleep(5)
            except RuntimeError as err:
                print(err)
# MCP칩을 사용하는 센서를 받아오는 클래스
# 조도 센서, 토양 수분 센서
class MCPSensor(Thread):
    def __init__(self, client, pump_callback=None):
        Thread.__init__(self)
        self.client = client
        self.pump_callback = pump_callback  # 펌프 ON 함수
        
        # 1. SPI 버스 생성 (하드웨어 SPI 사용)
        self.spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
        
        # 2. Chip Select 핀 설정 (여기서는 GPIO 5번 핀 사용)
        self.cs = digitalio.DigitalInOut(board.D5)
        
        # 3. MCP3208 객체 생성
        self.mcp = MCP.MCP3008(self.spi, self.cs)
        
        # 채널 설정 (CH0: 토양 수분 센서, CH1: 조도 센서)
        self.soil = AnalogIn(self.mcp, MCP.P0)
        self.light = AnalogIn(self.mcp, MCP.P1)

    def run(self):
        # [캘리브레이션 값] : 공기 중(건조)일 때 값이 높고, 물 속(습함)일 때 값이 낮습니다.
        soil_dry = 60000  # 완전히 말랐을 때의 값
        soil_wet = 25000  # 물에 담갔을 때의 값
        
        light_max = 65000 # 조도에서 나올 수 있는 값
        while True:
            try:
                # 토양 수분 센서 
                soil_value = self.soil.value                
                # # 범위 제한 (Clamp)
                # if soil_value > soil_dry: soil_value = soil_dry
                # if soil_value < soil_wet: soil_value = soil_wet
                # 퍼센트 변환
                moisture_percent = (soil_dry - soil_value) / (soil_dry - soil_wet) * 100

                # 조도 센서
                light_value = self.light.value
                # 퍼센트 변환
                light_percent = min((light_value / light_max) * 100, 100)
                
                data_payload = {
                    "soil_percent": moisture_percent,
                    "soil_value": soil_value, # 원본 값. 디버깅 용으로 값을 측정,
                    "light_percent": light_percent,
                    "light_value": light_value,
                }
                
                json_str = json.dumps(data_payload)
                self.client.publish("home/sensor/mcp", json_str)

                # 토양 수분 부족 시 펌프 ON
                if self.pump_callback and moisture_percent < 30:  # 임계값 30%
                    print("토양 건조, 펌프 작동")
                    self.pump_callback()
                
                time.sleep(5)
            except RuntimeError as err:
                print(err)
                
# 초음파센서를 통해 수위 측정
class UltrasonicSensor(Thread): 
    def __init__(self, client):
        Thread.__init__(self)
        self.client = client
        
        # 핀 설정 (D23 -> Trig, D24 -> Echo 사용)
        self.trig = digitalio.DigitalInOut(board.D23)
        self.trig.direction = digitalio.Direction.OUTPUT
        
        self.echo = digitalio.DigitalInOut(board.D24)
        self.echo.direction = digitalio.Direction.INPUT
        
        # [설정] 물통 사이즈 (단위: cm)
        self.max_level = 20.0  # 물통 바닥에서 센서까지의 전체 높이
        self.min_level = 2.0      # 물이 가득 찼을 때 센서와의 최소 거리 (센서 특성상 2cm 이내는 측정 불가)

    def get_distance(self):
        # 1. 초음파 발사 (10us 펄스)
        self.trig.value = True
        time.sleep(0.00001)
        self.trig.value = False

        pulse_start = time.time()
        pulse_end = time.time()

        # 2. Echo 핀이 High가 될 때까지 대기 (발사 시작)
        timeout = time.time() + 0.04 # 타임아웃 설정
        while self.echo.value == 0:
            pulse_start = time.time()
            if pulse_start > timeout: return None

        # 3. Echo 핀이 Low가 될 때까지 대기 (돌아옴)
        while self.echo.value == 1:
            pulse_end = time.time()
            if pulse_end > timeout: return None

        # 4. 거리 계산 (거리 = 시간 * 속도 / 2)
        # 소리의 속도: 343m/s = 34300cm/s
        pulse_duration = pulse_end - pulse_start
        distance = pulse_duration * 17150
        return round(distance, 1)

    def run(self):
        while True:
            try:
                dist = self.get_distance()
                
                if dist is not None:
                    # 값이 튀는 것을 방지하기 위한 범위 제한
                    if dist > self.max_level: dist = self.max_level
                    if dist < self.min_level: dist = self.min_level
                    
                    # 수위 높이 계산 (전체 - 빈공간)
                    water_height = self.max_level - dist
                    max_water_height = self.max_level - self.min_level
                    
                    # 퍼센트 변환
                    water_percent = (water_height / max_water_height) * 100
                    
                    # 0~100 사이로 보정
                    if water_percent < 0: water_percent = 0
                    if water_percent > 100: water_percent = 100

                    payload = {
                        "water_level": round(water_percent, 1),
                        "distance_cm": dist # 디버깅용 거리
                    }
                    
                    self.client.publish("home/sensor/water", json.dumps(payload))
                
                time.sleep(5) # 측정 주기
                
            except Exception as e:
                print(f"Ultrasonic Error: {e}")
                time.sleep(2)

class CO2Sensor(Thread):
    def __init__(self, client):
        Thread.__init__(self)
        self.client = client
        # mh-z19 라이브러리가 내부적으로 시리얼 포트를 관리 -> Serial 객체 생성 X

    def run(self):
        while True:
            try:
                # 1. 라이브러리 함수로 데이터 읽기 (딕셔너리 형태 반환)
                sensor_data = mh_z19.read(serial_console_untouched=True)
                
                # 반환 예시: {'co2': 450} 또는 데이터가 없으면 {} 빈 딕셔너리
                
                if sensor_data and 'co2' in sensor_data:
                    co2_ppm = sensor_data['co2']
                    
                    payload = {
                        "co2_ppm": co2_ppm
                    }
                    
                    self.client.publish("home/sensor/co2", json.dumps(payload))
                
                else:
                    print("CO2 Data Read Failed")

            except Exception as e:
                print(f"CO2 Sensor Error: {e}")
            time.sleep(5)