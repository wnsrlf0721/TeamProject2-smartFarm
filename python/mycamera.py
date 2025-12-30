import cv2
import threading
import time
from picamera2 import Picamera2

class TimeLapseCamera:
    _lock = threading.Lock()  # 카메라 동시 접근 방지
    
    def __init__(self, interval, total_photos, width, height):
        self.interval = interval
        self.total_photos = total_photos
        self.width = width
        self.height = height
        self.sleep_time = 2  # 카메라 워밍업 시간
        self.thread = None
        self.running = True
        self.camera = None  # 초기화는 _init_camera()에서

    def _init_camera(self):
        """카메라 초기화 및 워밍업"""
        with TimeLapseCamera._lock:
            # 이전 카메라 객체가 있으면 해제
            if self.camera is not None:
                try:
                    self.camera.stop()
                    self.camera.close()
                except Exception as e:
                    print("이전 카메라 종료 중 오류:", e)
                self.camera = None

            try:
                self.camera = Picamera2()
                config = self.camera.create_still_configuration(
                    main={"size": (self.width, self.height)}
                )
                self.camera.configure(config)
                self.camera.start()
                time.sleep(self.sleep_time)
                print(f"카메라 초기화 완료: {self.width} x {self.height}")
            except RuntimeError as e:
                print("카메라 초기화 실패:", e)
                self.camera = None

    def stop(self):
        print("타임랩스 중지 요청")
        self.running = False

    def start_timelapse(self, callback=None):
        """callback: 각 사진이 촬영될 때 호출되는 함수"""
        self.running = True
        if self.thread is None or not self.thread.is_alive():
            self.thread = threading.Thread(
                target=self._capture_timelapse,
                args=(callback,),
                daemon=True
            )
            self.thread.start()

    def _capture_timelapse(self, callback):
        print("타임랩스 촬영 시작")
        self._init_camera()
        if not self.camera:
            print("카메라를 사용할 수 없어 타임랩스 종료")
            return

        for i in range(1, self.total_photos + 1):
            if not self.running:
                print("타임랩스 중단됨")
                break

            try:
                # 프레임 캡처 (numpy array)
                frame = self.camera.capture_array()

                # ✅ 색상 보정
                frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

                # ✅ 상하좌우 반전
                frame = cv2.flip(frame, -1)

                # OpenCV로 JPEG 인코딩
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 60]
                ret, buffer = cv2.imencode(".jpg", frame, encode_param)

                if not ret:
                    print(f"사진 {i} 인코딩 실패")
                    continue

                image_bytes = buffer.tobytes()

                # 콜백 호출 (MQTT 전송용)
                if callback:
                    callback({
                        "index": i,
                        "image": image_bytes
                    })

                print(f"사진 {i} 촬영 성공")
                time.sleep(self.interval)

            except Exception as e:
                print(f"사진 {i} 촬영 중 오류 발생:", e)

        # 촬영 완료 시 카메라 해제
        with TimeLapseCamera._lock:
            if self.camera:
                try:
                    self.camera.stop()
                    self.camera.close()
                except Exception as e:
                    print("카메라 종료 중 오류:", e)
                self.camera = None
        print("타임랩스 촬영 완료")

        # 완료 상태 콜백
        if callback:
            callback({
                "status": "done" if self.running else "stopped"
            })