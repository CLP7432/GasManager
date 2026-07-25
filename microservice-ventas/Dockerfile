FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

COPY ./pom.xml /app/pom.xml
COPY ./microservice-ventas/pom.xml /app/microservice-ventas/pom.xml
COPY ./microservice-ventas/.mvn /app/microservice-ventas/.mvn
COPY ./microservice-ventas/mvnw /app/microservice-ventas/mvnw

WORKDIR /app/microservice-ventas

RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

COPY ./microservice-ventas/src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-ventas/target/microservice-ventas-0.0.1-SNAPSHOT.jar .

EXPOSE 8082

CMD ["java", "-jar", "microservice-ventas-0.0.1-SNAPSHOT.jar"]