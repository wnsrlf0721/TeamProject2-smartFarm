echo "=== 라즈베리파이 스마트홈 환경 설정을 시작합니다 ==="

# 1. 시스템 업데이트 및 필수 라이브러리 설치
echo "[1/4] 시스템 패키지 업데이트 및 libcamera 설치..."
sudo apt-get update
sudo apt-get install -y libgpiod2 python3-libcamera python3-kms++

# 2. 가상환경 생성
echo "[2/4] 파이썬 가상환경(.venv) 생성 중..."
# picamera2 등 시스템 패키지 호환성을 위해 system-site-packages 옵션 사용 권장
python3 -m venv .venv --system-site-packages
source .venv/bin/activate

# 3. 가상환경 활성화 및 라이브러리 설치
echo "[3/4] 라이브러리 설치 중..."
pip install --upgrade pip
pip install -r requirements.txt

echo "=== 설치가 완료되었습니다. ==="
echo "실행 방법: source venv/bin/activate 입력 후 python main.py 실행"