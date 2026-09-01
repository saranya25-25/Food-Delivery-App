# =========================================================
# BUILD STAGE
# =========================================================
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
# Copy Maven configuration
COPY pom.xml .
# Copy source code
COPY src ./src
# Build application
RUN apt-get update && \
    apt-get install -y maven && \
    mvn clean package -DskipTests
# =========================================================
# RUN STAGE
# =========================================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy generated Spring Boot JAR
COPY --from=builder /app/target/*.jar app.jar
# Render / Docker compatible port
EXPOSE 8080
# Start Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]