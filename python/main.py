from mymqtt import MqttWorker
import time
if __name__ == "__main__":
    try:
        mqtt = MqttWorker()
        mqtt.mymqtt_connect()
    except KeyboardInterrupt:
        pass