FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-gateway/pom.xml /app/microservice-gateway/pom.xml
COPY ./microservice-gateway/.mvn /app/microservice-gateway/.mvn
COPY ./microservice-gateway/mvnw /app/microservice-gateway/mvnw

WORKDIR /app/microservice-gateway

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-gateway/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-gateway/target/microservice-gateway-0.0.1-SNAPSHOT.jar .

EXPOSE 8085

CMD ["java", "-jar", "microservice-gateway-0.0.1-SNAPSHOT.jar"]