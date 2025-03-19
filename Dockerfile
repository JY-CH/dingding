FROM openjdk:17-jdk-slim

# JAR 파일 변수 설정
ARG JAR_FILE=backend/build/libs/*.jar

# 애플리케이션 JAR 복사
COPY ${JAR_FILE} app.jar

# 실행 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]
