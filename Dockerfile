FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY canteen-backend/ ./canteen-backend/
RUN apk add --no-cache maven && cd canteen-backend && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/canteen-backend/target/canteen-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
