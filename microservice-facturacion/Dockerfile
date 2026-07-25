FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-facturacion/pom.xml /app/microservice-facturacion/pom.xml
COPY ./microservice-facturacion/.mvn /app/microservice-facturacion/.mvn
COPY ./microservice-facturacion/mvnw /app/microservice-facturacion/mvnw

WORKDIR /app/microservice-facturacion

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-facturacion/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-facturacion/target/microservice-facturacion-0.0.1-SNAPSHOT.jar .

EXPOSE 8094

CMD ["java", "-jar", "microservice-facturacion-0.0.1-SNAPSHOT.jar"]