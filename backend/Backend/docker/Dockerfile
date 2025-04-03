FROM openjdk:22

ARG BACKEND=*.jar

COPY ${BACKEND} backend.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "backend.jar"]