# ✅ Python 3.11 기반의 가벼운 공식 이미지 사용
FROM python:3.11-slim

# ✅ 작업 디렉토리 설정
WORKDIR /app

# ✅ 필수 라이브러리 설치
COPY requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt

# ✅ 전체 프로젝트 복사
COPY . /app  # 🚀 fastapi 폴더까지 포함하여 복사

# ✅ FastAPI 실행
WORKDIR /app/fastapi  # ⚡ FastAPI 실행 위치 설정
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "18000"]
