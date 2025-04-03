FROM openjdk:22

ARG WEBSOCKETSERVER=*.jar

COPY ${WEBSOCKETSERVER} backend.jar

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "websocketserver.jar"]