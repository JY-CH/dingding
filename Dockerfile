# ✅ Python 3.11 기반의 가벼운 공식 이미지 사용
FROM python:3.11-slim

# ✅ 작업 디렉토리 설정
WORKDIR /app

# ✅ 필수 라이브러리 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ✅ 애플리케이션 코드 복사
COPY . .

# ✅ Uvicorn을 사용하여 FastAPI 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
