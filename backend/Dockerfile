# ===================================================================
# Stage 1: Build Application with Maven and Java 17
# ===================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy Maven POM and pre-fetch dependencies for Docker cache optimization
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code
COPY src ./src

# Package production fat JAR
RUN mvn clean package -DskipTests=true -B

# ===================================================================
# Stage 2: Minimal Production Runtime Container
# ===================================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create dedicated unprivileged system group & user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create persistent storage folder and grant ownership
RUN mkdir -p /var/data/projectkit/uploads && chown -R appuser:appgroup /var/data/projectkit

# Copy fat JAR from build stage
COPY --from=builder /build/target/projectkit-backend-*.jar app.jar
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

# Expose default port (Render will override via $PORT)
EXPOSE 8081

# JVM flags tuned for container resource limits
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Production launch command
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=prod -jar app.jar"]
