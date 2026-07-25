FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-reportes/pom.xml /app/microservice-reportes/pom.xml
COPY ./microservice-reportes/.mvn /app/microservice-reportes/.mvn
COPY ./microservice-reportes/mvnw /app/microservice-reportes/mvnw

WORKDIR /app/microservice-reportes

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-reportes/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-reportes/target/microservice-reportes-0.0.1-SNAPSHOT.jar .

EXPOSE 8099

CMD ["java", "-jar", "microservice-reportes-0.0.1-SNAPSHOT.jar"]