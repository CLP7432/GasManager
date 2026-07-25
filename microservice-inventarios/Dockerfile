FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-inventarios/pom.xml /app/microservice-inventarios/pom.xml
COPY ./microservice-inventarios/.mvn /app/microservice-inventarios/.mvn
COPY ./microservice-inventarios/mvnw /app/microservice-inventarios/mvnw

WORKDIR /app/microservice-inventarios

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-inventarios/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-inventarios/target/microservice-inventarios-0.0.1-SNAPSHOT.jar .

EXPOSE 8092

CMD ["java", "-jar", "microservice-inventarios-0.0.1-SNAPSHOT.jar"]