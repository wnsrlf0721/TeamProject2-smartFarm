import cv2
import threading
import time
import io

class TimeLapseCamera:
    def __init__(self, interval=5, total_photos=20):
        self.interval = interval
        self.total_photos = total_photos
        self.thread = None
        self.frames = []  # 촬영된 이미지를 메모리에 저장 (옵션)
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise RuntimeError("카메라를 열 수 없습니다.")

    def start_timelapse(self, callback=None):
        """callback: 각 사진이 촬영될 때 호출되는 함수 (ex. MQTT 전송용)"""
        if self.thread is None or not self.thread.is_alive():
            self.thread = threading.Thread(target=self._capture_timelapse, args=(callback,))
            self.thread.start()

    def _capture_timelapse(self, callback):
        print("타임랩스 촬영 시작")
        for i in range(1, self.total_photos + 1):
            ret, frame = self.cap.read()
            if not ret:
                print(f"사진 {i} 촬영 실패")
                continue

            # OpenCV 이미지를 JPEG로 변환
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                print(f"사진 {i} 인코딩 실패")
                continue
            image_bytes = buffer.tobytes()

            # 촬영 후 callback 호출
            if callback:
                callback(image_bytes, i)

            time.sleep(self.interval)

        self.cap.release()
        print("타임랩스 촬영 완료")

        # 촬영 완료 시 callback 호출 (None, 또는 특별 메시지)
        if callback:
            callback(None, "done")