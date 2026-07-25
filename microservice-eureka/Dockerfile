FROM eclipse-temurin:17-alpine as builder

WORKDIR /app

# 1. COPIAR EL POM PADRE PRIMERO
COPY ./pom.xml /app/pom.xml

# 2. COPIAR LOS ARCHIVOS DEL MICROSERVICIO
COPY ./microservice-eureka/pom.xml /app/microservice-eureka/pom.xml
COPY ./microservice-eureka/.mvn /app/microservice-eureka/.mvn
COPY ./microservice-eureka/mvnw /app/microservice-eureka/mvnw

# 3. MOVERSE AL DIRECTORIO DEL MICROSERVICIO
WORKDIR /app/microservice-eureka

# 4. DESCARGAR DEPENDENCIAS
RUN ./mvnw clean package -Dmaven.test.skip -Dmaven.main.skip -Dspring-boot.repackage.skip && rm -r ./target/

# 5. COPIAR CÓDIGO FUENTE
COPY ./microservice-eureka/src ./src

# 6. COMPILAR Y EMPAQUETAR
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-alpine

WORKDIR /app

RUN mkdir -p ./logs

COPY --from=builder /app/microservice-eureka/target/microservice-eureka-0.0.1-SNAPSHOT.jar .

EXPOSE 8761

CMD ["java", "-jar", "microservice-eureka-0.0.1-SNAPSHOT.jar"]