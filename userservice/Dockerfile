# =====================================================
# Stage 1: Build (Gradle + JDK 21)
# =====================================================
FROM gradle:8.11-jdk21-alpine AS build
WORKDIR /app
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
# Pre-download dependencies (cache layer)
RUN gradle dependencies --no-daemon || true
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# =====================================================
# Stage 2: Runtime (lightweight JRE)
# =====================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
