FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-iot/pom.xml /app/microservice-iot/pom.xml
COPY ./microservice-iot/.mvn /app/microservice-iot/.mvn
COPY ./microservice-iot/mvnw /app/microservice-iot/mvnw

WORKDIR /app/microservice-iot

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-iot/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-iot/target/microservice-iot-0.0.1-SNAPSHOT.jar .

EXPOSE 8098

CMD ["java", "-jar", "microservice-iot-0.0.1-SNAPSHOT.jar"]