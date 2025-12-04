# Лёгкий образ с Java 21 JRE
FROM eclipse-temurin:21-jre-alpine

# Директория внутри контейнера
WORKDIR /app

# Копируем собранный jar (любой .jar из build/libs)
COPY build/libs/*.jar app.jar

# На всякий случай — сюда можно прокидывать доп. JVM-опции
ENV JAVA_OPTS=""

# Порт приложения внутри контейнера
EXPOSE 8080

# Запуск Spring Boot с профилем укажем через переменную
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
