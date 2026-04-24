FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apk add --no-cache maven && mvn clean package -DskipTests

EXPOSE 8081

CMD ["java", "-jar", "target/user-service-0.0.1-SNAPSHOT.jar"]