FROM openjdk:17-jdk-slim

# JAR 파일 복사 (변수 제거)
COPY backend/build/libs/*.jar app.jar

# 실행 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]
