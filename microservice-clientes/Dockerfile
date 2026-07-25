FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-clientes/pom.xml /app/microservice-clientes/pom.xml
COPY ./microservice-clientes/.mvn /app/microservice-clientes/.mvn
COPY ./microservice-clientes/mvnw /app/microservice-clientes/mvnw

WORKDIR /app/microservice-clientes

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-clientes/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-clientes/target/microservice-clientes-0.0.1-SNAPSHOT.jar .

EXPOSE 8093

CMD ["java", "-jar", "microservice-clientes-0.0.1-SNAPSHOT.jar"]