# Use Java 21 JDK Alpine image as the base
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download Maven dependencies offline (faster build)
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY src src

# Build the application and skip tests for faster build
RUN ./mvnw package -DskipTests

# Expose port 8080 (same as in application.properties)
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]

# All sensitive values 
# (DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET,
# CHORE_ENCRYPT_KEY, FRONTEND_URL, SUPABASE keys)
# are set as environment variables in Render
