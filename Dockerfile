FROM openjdk:17-jdk-slim
WORKDIR /app
COPY backend/build/libs/*.jar app.jar
COPY backend/src/main/resources/application.yml application.yml 
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.config.location=application.yml"]
