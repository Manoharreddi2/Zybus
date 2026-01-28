# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables for Render
ENV PORT=8080
ENV JAVA_OPTS="-Xmx256m -Xms128m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
