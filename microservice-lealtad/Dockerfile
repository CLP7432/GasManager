FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-lealtad/pom.xml /app/microservice-lealtad/pom.xml
COPY ./microservice-lealtad/.mvn /app/microservice-lealtad/.mvn
COPY ./microservice-lealtad/mvnw /app/microservice-lealtad/mvnw

WORKDIR /app/microservice-lealtad

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-lealtad/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-lealtad/target/microservice-lealtad-0.0.1-SNAPSHOT.jar .

EXPOSE 8100

CMD ["java", "-jar", "microservice-lealtad-0.0.1-SNAPSHOT.jar"]
