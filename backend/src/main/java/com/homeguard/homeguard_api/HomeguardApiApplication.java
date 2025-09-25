package com.homeguard.homeguard_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * HomeGuard AI API Application - Main Spring Boot Application Class
 * 
 * This is the main entry point for the HomeGuard AI backend API service.
 * It's a Spring Boot application that provides RESTful APIs for the HomeGuard AI
 * security system, including user management, home monitoring, security settings,
 * and real-time security alerts.
 * 
 * Key Features:
 * - Spring Boot auto-configuration for rapid development
 * - RESTful API endpoints for mobile app integration
 * - JPA/Hibernate for database operations
 * - Spring Security for authentication and authorization
 * - Flyway for database migrations
 * - PostgreSQL database integration
 * - Actuator endpoints for monitoring and health checks
 * 
 * Application Architecture:
 * - Model Layer: JPA entities (User, Home, AppSettings, SecuritySettings)
 * - Service Layer: Business logic and data processing
 * - Controller Layer: REST API endpoints
 * - Repository Layer: Data access and database operations
 * - Security Layer: Authentication, authorization, and security policies
 * 
 * Database Integration:
 * - Uses PostgreSQL as the primary database
 * - Flyway manages database schema migrations
 * - JPA/Hibernate handles object-relational mapping
 * - Automatic timestamp management for audit trails
 * 
 * Security Features:
 * - Spring Security integration for authentication
 * - Role-based access control (USER, ADMIN)
 * - JWT token-based authentication (planned)
 * - Input validation and sanitization
 * - SQL injection prevention through JPA
 * 
 * API Endpoints (planned):
 * - /api/users - User management and authentication
 * - /api/homes - Home/property management
 * - /api/security - Security settings and monitoring
 * - /api/alerts - Security alerts and notifications
 * - /api/settings - Application and user preferences
 * 
 * Mobile App Integration:
 * - Provides REST APIs for React Native mobile app
 * - Real-time security monitoring and alerts
 * - User preference synchronization
 * - Security system control and configuration
 * 
 * Development Notes:
 * - Run with: mvn spring-boot:run
 * - Default port: 8080 (configurable in application.properties)
 * - Health check: http://localhost:8080/actuator/health
 * - API documentation: http://localhost:8080/swagger-ui.html (if Swagger is added)
 */
@SpringBootApplication
public class HomeguardApiApplication {

	/**
	 * Main method - Application entry point
	 * 
	 * This method starts the Spring Boot application and initializes all the necessary
	 * components including the embedded web server, database connections, and security
	 * configurations.
	 * 
	 * @param args Command line arguments passed to the application
	 *             - Can include Spring profiles (--spring.profiles.active=dev)
	 *             - Can include server port (--server.port=8080)
	 *             - Can include database configuration overrides
	 * 
	 * Application Startup Process:
	 * 1. Spring Boot auto-configuration scans for components
	 * 2. Database connection is established using application.properties
	 * 3. Flyway migrations are executed to set up database schema
	 * 4. JPA entities are mapped to database tables
	 * 5. Spring Security configuration is loaded
	 * 6. REST controllers are registered and mapped
	 * 7. Embedded Tomcat server starts on configured port
	 * 8. Application is ready to accept HTTP requests
	 * 
	 * Example usage:
	 * - java -jar homeguard-api.jar
	 * - java -jar homeguard-api.jar --spring.profiles.active=prod
	 * - java -jar homeguard-api.jar --server.port=9090
	 */
	public static void main(String[] args) {
		SpringApplication.run(HomeguardApiApplication.class, args);
	}

}
