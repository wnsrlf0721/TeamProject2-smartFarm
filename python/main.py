from mymqtt import MqttWorker
import time
import RPi.GPIO as GPIO
if __name__ == "__main__":
    try:
        mqtt = MqttWorker()
        mqtt.mymqtt_connect()
    except KeyboardInterrupt:
        # 사용자가 Ctrl+C를 눌렀을 때 실행
        print("\n강제 종료 감지!")
        if mqtt is not None:
            mqtt.clean() # mymqtt.py에 작성한 정리 함수 호출
            
    except Exception as e:
        # 그 외 에러 발생 시
        print(f"에러 발생: {e}")
        if mqtt is not None:
            mqtt.clean()
            
    finally:
        # 마지막 보루: 혹시 모를 잔여 GPIO 정리
        # (mqtt.clean()에서 이미 했겠지만 안전을 위해)
        try:
            GPIO.cleanup()
        except:
            pass