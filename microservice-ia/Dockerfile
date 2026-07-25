FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-ia/pom.xml /app/microservice-ia/pom.xml
COPY ./microservice-ia/.mvn /app/microservice-ia/.mvn
COPY ./microservice-ia/mvnw /app/microservice-ia/mvnw

WORKDIR /app/microservice-ia

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-ia/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-ia/target/microservice-ia-0.0.1-SNAPSHOT.jar .

EXPOSE 8097

CMD ["java", "-jar", "microservice-ia-0.0.1-SNAPSHOT.jar"]