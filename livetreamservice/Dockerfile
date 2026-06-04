# =====================================================
# Stage 1: Build
# =====================================================
FROM gradle:8.12-jdk17-alpine AS build
WORKDIR /app
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# =====================================================
# Stage 2: Runtime
# =====================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-jar", "app.jar"]
