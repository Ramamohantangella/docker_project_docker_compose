FROM maven:3.9.4-openjdk-17-alpine

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 8082

CMD ["java", "-jar", "target/todo-service-0.0.1-SNAPSHOT.jar"]