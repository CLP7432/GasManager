FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-users/pom.xml /app/microservice-users/pom.xml
COPY ./microservice-users/.mvn /app/microservice-users/.mvn
COPY ./microservice-users/mvnw /app/microservice-users/mvnw

WORKDIR /app/microservice-users

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-users/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-users/target/microservice-users-0.0.1-SNAPSHOT.jar .

EXPOSE 8081

CMD ["java", "-jar", "microservice-users-0.0.1-SNAPSHOT.jar"]