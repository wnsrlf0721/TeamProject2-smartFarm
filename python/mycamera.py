import threading
import time
import io
from picamera2 import Picamera2
import base64 # binary 데이터를 텍스트 문자열로 바꿔주는 역할 -> 데이터를 웹에서 깨지지 않고 볼 수 있도록 포장

class MyCamera:
    frame = None
    thread = None
    
    # 외부에서 frame을 요청하기 위해서 호출되는 메서드
    # => 스레드로 스트리밍되는 frame을 외부로 보내는 역할
    def getStreaming(self):
        # 호출될때마다 스레드 객체를 생성하지 않고 처음에 한 번만 스레드를 만들기 위한 작업
        if MyCamera.thread is None:
            MyCamera.thread = threading.Thread(target=self.streaming)
            MyCamera.thread.start()
            #frame에 이미지가 저장되지 않으면 다음으로 넘어갈 수 없도록 작업()
            #스레드를 start를 하면 바로 실행이 되는데, 사진 안 찍힌 상태에서 (카메라초기화작업) 리턴되는 것을 막기위해 작업
            while MyCamera.frame is None:
                time.sleep(0.01) # 프레임이 none상태면 넘어가지 못하도록 딜레이
                
        return MyCamera.frame
        
    # 스레드에서 실행될 메서드
    # 자바 static 메서드 개념과 동일 -> 매개변수로 클래스 자신의 정보를 받는다. cls로 받음
    @classmethod
    def streaming(cls):
        # 1. 카메라 세팅하고 촬영
        device = Picamera2()
        # 빠르게 연속으로 이미지를 만들어내야 하기 때문에 카메라를 매번 초기화를 시키지 않고 이미 워밍업이 되어있는 상태에서 작업을 하기위해 create_video_configuration으로 작업
        # 카메라 센서를 계속 켜놓고 촬영하기 위해서 필요한 값들을 유지시켜놓고 작업하기 위해
        config = device.create_video_configuration(main={"format":"RGB888", "size": (360,240)})
        device.configure(config)
        
        device.start()
        
        #상하좌우를 반전시킬 수 있도록 작업 - start 이후 설정
        device.hfilp = True
        device.vfilp = True
        
        time.sleep(1)
        # 메모리에 임시공간을 만들고 프레임을 저장하고 작업 -> 초당 20장씩 쓰고 읽고를 sd 카드(IO) 에서 작업하면 속도가 느리다.
        stream = io.BytesIO()
        # 2. 지속적으로 카메라로 촬용된 사진 변경하기
        # 카메라가 촬영하는 장면을 한 프레임씩 캡쳐해서 jpeg로 압축하고 메모리공간의 임시저장소에 저장
        # 1초에 20프레임을 만들어낼 수 있도록 작업
        try:
            while True:
                device.capture_file(stream,format="jpeg")
                # 메모리에 만들어놓은 임시공간인 스트림에서 데이터를 읽어서 frame에 저장
                # 스트림의 끝에 포커스가 맞춰져 있기 때문에 그 위치부터 데이터를 읽으면 저장된 데이터가 없으므로 포커스를 맨 앖으로 이동시켜 데이터를 읽어야 한다.
                stream.seek(0)
                raw_data =stream.read()
                # 이미지를 변환 - 바이너리데이터를 네트워크로 전송하기 위해서 Base64로 인코딩
                base64_bytes = base64.b64encode(raw_data)
                cls.frame = base64_bytes.decode("utf-8")
                #스트림 초기화(다음 촬영을 위해 - 스트림의 모든 데이터 지우기)
                stream.seek(0)
                stream.truncate()
                time.sleep(0.05)
            
        except Exception as e:
            print(f"카메라 스트리밍 오류: {e}")
            device.stop()
        except KeyboardInterrupt:
            pass