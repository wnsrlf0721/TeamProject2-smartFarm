# Raspberry Pi Smart Home IoT System

이 프로젝트는 라즈베리파이 4를 기반으로 다양한 센서(온습도, 조도, 수위, CO2)와 카메라를 제어하고, MQTT 프로토콜을 통해 데이터를 전송하는 스마트 홈 시스템입니다.

## 🛠 하드웨어 구성

* **Main Board**: Raspberry Pi 4 Model B
* **Sensors**:
    * DHT11 (온습도)
    * MCP3208 ADC (토양 수분 센서, 조도 센서 연결)
    * HC-SR04 (초음파 센서 -> 물통 수위 측정)
    * MH-Z19 (CO2 센서)
* **Actuators**: LED (+ 다른 디바이스 추가 예정)
* **Camera**: Raspberry Pi Camera Module (Picamera2 사용)

## ⚙️ 사전 설정 (Raspberry Pi Configuration)

이 프로젝트를 실행하기 전에 라즈베리파이 설정에서 다음 인터페이스를 활성화해야 합니다.

1.  터미널에서 설정 진입: `sudo raspi-config`
2.  **3. Interface Options** 선택
3.  다음 항목들을 **Enable(활성화)**:
    * **Camera** (혹은 Legacy Camera가 아닌 libcamera 사용 설정)
    * **SPI** (MCP3008 통신용)
    * **I6 Serial Port** 
    (MH-Z19 CO2 센서용, *
    "Would you like a login shell to be accessible over serial?" -> No (아니오) 선택
    "Would you like the serial port hardware to be enabled?" -> Yes (예) 선택 *)
4.  재부팅: `sudo reboot`

## 시스템 패키지 설치
Python 라이브러리 설치 전, 필요한 시스템 패키지를 설치합니다.

```
sudo apt-get update
sudo apt-get install -y libgpiod2 python3-libcamera python3-kms++
```

## 🚀 설치 및 실행 가이드 (Installation)

### 자동 설치 스크립트 실행

**파일명: `setup.sh`**

```
# 파일 실행
./setup.sh
```

## setup.sh가 실행되는 구성요소

### 1. 시스템 패키지 설치
Python 라이브러리 설치 전, 필요한 시스템 패키지를 설치합니다.

```
sudo apt-get update
sudo apt-get install -y libgpiod2 python3-libcamera python3-kms++
```
### 2. 가상환경(venv) 생성 및 활성화

시스템 파이썬과 분리된 환경을 구성합니다.

```
# 가상환경 생성 (이름: .venv)
python3 -m venv .venv --system-site-packages

# 가상환경 활성화
source .venv/bin/activate
```

### 3. 라이브러리 설치

requirements.txt에 명시된 의존성 패키지를 설치합니다.

```
pip install --upgrade pip
pip install -r requirements.txt
```


## 설정 변경 (Configuration)
mymqtt.py 파일 내의 MQTT Broker IP 주소를 본인의 환경에 맞게 수정해야 합니다.

```
# mymqtt.py
...
self.client.connect("YOUR_MQTT_BROKER_IP", 1883, 60)
...
publisher.single(..., hostname="YOUR_MQTT_BROKER_IP")
```
## ▶️ 실행 (Usage)
가상환경이 활성화된 상태에서 main.py를 실행하여 시스템을 가동합니다.

## 📂 파일 구조 설명
```
main.py: 프로그램의 진입점(Entry Point). MqttWorker를 실행합니다.

mymqtt.py: MQTT 통신을 관리하며 센서 스레드와 카메라 스레드를 총괄합니다.

sensor.py: 각 센서(DHT11, MCP3008, Ultrasonic, CO2)별 스레드 클래스가 정의되어 있습니다.

mycamera.py: Picamera2를 이용해 영상을 캡처하고 Base64로 인코딩하여 스트리밍을 준비합니다.

led.py: GPIO를 이용한 LED 제어 클래스입니다.
```