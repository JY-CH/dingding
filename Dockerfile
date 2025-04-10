# Python 3.11 기반의 가벼운 공식 이미지 사용
FROM python:3.11.9

# 작업 디렉토리 설정
WORKDIR /app

# OpenCV를 위한 시스템 라이브러리 설치
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# FastAPI 디렉토리로 이동
WORKDIR /app/fastapi

# 필요한 파일들만 복사
COPY fastapi/requirements.txt .
COPY fastapi/main.py .
COPY fastapi/ai_handler.py .
COPY fastapi/websocket/ ./websocket/
COPY fastapi/models/ ./models/

# 모델 파일들 복사
COPY fastapi/wavenet_model.h5 .
COPY fastapi/best.pt .

# 환경 변수 설정
ENV PYTHONPATH=/app

# 필요한 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
