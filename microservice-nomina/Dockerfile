FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-nomina/pom.xml /app/microservice-nomina/pom.xml
COPY ./microservice-nomina/.mvn /app/microservice-nomina/.mvn
COPY ./microservice-nomina/mvnw /app/microservice-nomina/mvnw

WORKDIR /app/microservice-nomina

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-nomina/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-nomina/target/microservice-nomina-0.0.1-SNAPSHOT.jar .

EXPOSE 8095

CMD ["java", "-jar", "microservice-nomina-0.0.1-SNAPSHOT.jar"]