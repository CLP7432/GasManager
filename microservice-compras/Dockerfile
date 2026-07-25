FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-compras/pom.xml /app/microservice-compras/pom.xml
COPY ./microservice-compras/.mvn /app/microservice-compras/.mvn
COPY ./microservice-compras/mvnw /app/microservice-compras/mvnw

WORKDIR /app/microservice-compras

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-compras/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-compras/target/microservice-compras-0.0.1-SNAPSHOT.jar .

EXPOSE 8096

CMD ["java", "-jar", "microservice-compras-0.0.1-SNAPSHOT.jar"]