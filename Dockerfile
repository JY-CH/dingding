# ✅ Python 3.11 기반의 가벼운 공식 이미지 사용
FROM python:3.11-slim

# ✅ 작업 디렉토리 설정
WORKDIR /app  # 전체 앱 폴더

# ✅ 필수 라이브러리 설치
COPY requirements.txt ./  
RUN pip install --no-cache-dir -r requirements.txt

# ✅ FastAPI 애플리케이션 복사
COPY fastapi /app/fastapi  # ⚡ FastAPI 관련 폴더 복사

# ✅ FastAPI 실행 (폴더 경로 맞추기)
WORKDIR /app/fastapi  # FastAPI 실행 위치 변경
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "18000"]
