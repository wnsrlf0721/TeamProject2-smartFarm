import time
import board # 데이터 송신용 board모듈 - 라즈베리파이나 아두이노에서 핀에 정보를 추상화
from threading import Thread # Thread를 통한 주기적인 통신 데이터 전송
# DHTSensor
import adafruit_dht # 해당 라이브러리를 활용해서 DHT11 온습도 센서를 제어
# MCPSensor
import adafruit_bitbangio as bitbangio
import digitalio
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn
# MH-Z19 (이산화탄소 센서 라이브러리)
import mh_z19
# 온습도 센서
class DHTSensor(Thread):
    def __init__(self):
        Thread.__init__(self)
        self.mydht11 = adafruit_dht.DHT11(board.D25)
        self.data = {"temp": 0.0, "humi": 0.0}

    def run(self):
        while True:
            try:
                self.data['humi'] = self.mydht11.humidity
                self.data['temp'] = self.mydht11.temperature
            except RuntimeError as err:
                print(err)
            time.sleep(2)
class MCPSensor(Thread):
    def __init__(self):
        Thread.__init__(self)
        self.daemon = True  # 메인 프로그램 종료 시 스레드도 자동 종료되도록 설정

        # [변경 1] 하드웨어 SPI(busio) -> 소프트웨어 SPI(bitbangio)로 변경
        # 물리 핀 위치는 그대로(19, 21, 23번) 유지하되, 명확한 GPIO 번호로 지정했습니다.
        # CLK(23번 핀) = board.D11
        # MISO(21번 핀) = board.D9
        # MOSI(19번 핀) = board.D10
        self.spi = bitbangio.SPI(board.D11, MISO=board.D9, MOSI=board.D10)
        
        # 2. Chip Select 핀 설정 (GPIO 8 / 물리 24번)
        self.cs = digitalio.DigitalInOut(board.D8)
        
        # 3. MCP3008 객체 생성
        self.mcp = MCP.MCP3008(self.spi, self.cs)
        
        # 채널 설정 (CH0: 토양 수분, CH1: 조도)
        self.soil = AnalogIn(self.mcp, MCP.P0)
        self.light = AnalogIn(self.mcp, MCP.P1)
        
        # 데이터 저장소
        self.data = {"soil_moisture": 0.0, "lightpower": 0.0}

    def run(self):
        # [중요] 테스트하면서 확인한 실제 값으로 이 부분을 미세 조정해주세요.
        soil_dry = 60000   # 공기 중 (건조)
        soil_wet = 25000   # 물 속 (습함)
        light_max = 65000  # 조도 최대치 (손전등 비췄을 때)
        
        while True:
            try:
                # --- 1. 토양 수분 센서 ---
                soil_value = self.soil.value
                
                # 범위 제한 (센서 값이 튀어서 캘리브레이션 범위를 벗어날 때 보정)
                if soil_value > soil_dry: soil_value = soil_dry
                if soil_value < soil_wet: soil_value = soil_wet
                
                # 퍼센트 변환 (건조할수록 값이 크므로 역수 계산 필요)
                # 분모가 0이 되는 에러 방지
                denominator = soil_dry - soil_wet
                if denominator == 0: denominator = 1
                
                moisture_percent = (soil_dry - soil_value) / denominator * 100
                self.data['soil_moisture'] = round(max(0, min(100, moisture_percent)), 1)

                # --- 2. 조도 센서 ---
                light_value = self.light.value
                
                # 퍼센트 변환
                light_percent = (light_value / light_max) * 100
                
                # 값 확인용 출력 (테스트 끝나면 주석 처리 가능)
                # print(f"Soil Raw: {soil_value} | Light Raw: {light_value}")
                
                self.data['lightpower'] = round(max(0, min(100, light_percent)), 1)

            except RuntimeError as err:
                print(f"센서 읽기 에러: {err}")
            except Exception as e:
                print(f"기타 에러: {e}")
                
            time.sleep(2)

# 초음파센서를 통해 수위 측정
class UltrasonicSensor(Thread):
    def __init__(self):
        Thread.__init__(self)

        # 핀 설정 (D23 -> Trig, D24 -> Echo 사용)
        self.trig = digitalio.DigitalInOut(board.D23)
        self.trig.direction = digitalio.Direction.OUTPUT

        self.echo = digitalio.DigitalInOut(board.D24)
        self.echo.direction = digitalio.Direction.INPUT

        # [설정] 물통 사이즈 (단위: cm)
        self.max_level = 20.0  # 물통 바닥에서 센서까지의 전체 높이
        self.min_level = 2.0      # 물이 가득 찼을 때 센서와의 최소 거리 (센서 특성상 2cm 이내는 측정 불가)
        self.data = {"water_level": 0.0}

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
        return round(distance, 1) # 소수점 한자리수 단위 출력

    def run(self):
        while True:
            try:
                dist = self.get_distance()

                if dist is not None:
                    # 수위 높이 계산 (전체 - 빈공간)
                    water_height = self.max_level - dist
                    max_water_height = self.max_level - self.min_level

                    # 퍼센트 변환
                    water_percent = (water_height / max_water_height) * 100
                    self.data['water_level']= round(max(0, min(100, water_percent)),1)

            except Exception as e:
                print(f"Ultrasonic Error: {e}")
            time.sleep(2) # 측정 주기

class CO2Sensor(Thread):
    def __init__(self):
        Thread.__init__(self)
        self.data = {"co2": 0.0}

    def run(self):
        while True:
            try:
                # 1. 라이브러리 함수로 데이터 읽기 (딕셔너리 형태 반환)
                sensor_data = mh_z19.read(serial_console_untouched=True)
                if sensor_data and 'co2' in sensor_data:
                    self.data["co2"] = sensor_data['co2']
                else:
                    print("CO2 Data Read Failed")

            except Exception as e:
                print(f"CO2 Sensor Error: {e}")
            time.sleep(2)