FROM maven:3.9.9-eclipse-temurin-21 as build
WORKDIR /app
COPY . . 
RUN mvn clean package -DskipTests
FROM openjdk:21-jdk-slim

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","./app.jar"]
