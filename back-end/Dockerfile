FROM openjdk:11-jre-slim
ARG JAR_FILE=build/libs/StreamingService-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} StreamingService-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/StreamingService-0.0.1-SNAPSHOT.jar"]