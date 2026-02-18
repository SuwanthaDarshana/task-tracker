# 📝 Mini Task Tracker - Backend

This is a robust, full-stack ready backend implementation for a Task Tracker application, built using **Spring Boot 3** and **MySQL**. It is designed with professional standards, featuring a **modern dual-token authentication system** (JWT access tokens + HttpOnly cookie refresh tokens with rotation and theft detection), clean architectural layering, and interactive API documentation.

---

## 🚀 Key Features

* **Dual-Token Authentication**: Short-lived JWT access tokens + long-lived **refresh tokens** in **HttpOnly, SameSite cookies** with **token rotation** and **theft detection**.
* **Ownership Verification**: `@AuthenticationPrincipal` combined with service-layer checks prevent IDOR attacks — users can only access their own tasks.
* **Task Management**: Full CRUD operations (Create, Read, Update, Delete) linked to specific users.
* **Data Integrity**: Input validation using **Jakarta Bean Validation**.
* **Scalable Architecture**: Strict separation of concerns using the Controller-Service-Repository pattern with interfaces.
* **Caffeine Caching**: High-performance in-memory caching with `@Cacheable` / `@CacheEvict` for read-heavy operations.
* **Scheduled Cleanup**: `@Scheduled` cron job purges expired refresh tokens daily at 3 AM.
* **Hardened Error Handling**: `@RestControllerAdvice` with **@Slf4j** logging — generic messages to clients, real errors logged server-side.
* **Interactive Documentation**: Fully configured **Swagger UI** with JWT Authorization support.
* **Real-world Security**: Password encryption using **BCrypt**, configurable CORS origins, and secure cookie settings.

---

## 🛠️ Tech Stack

* **Java**: 17
* **Framework**: Spring Boot 3.4.4
* **Database**: MySQL 8.0+
* **Security**: Spring Security, JWT (jjwt 0.11.5), HttpOnly cookie refresh tokens
* **Caching**: Caffeine via spring-boot-starter-cache
* **Build Tool**: Maven

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* **JDK 17**
* **MySQL Server**
* **Maven** (or use the provided `mvnw` wrapper)

---

## 📂 Project Structure

This project follows the **Clean Layering** principle to ensure maintainability:

```text
src/main/java/com/miraisense/task_tracker_backend/
├── config/        # Security, OpenAPI, CORS, and App configurations
├── controller/    # REST API endpoints (Auth & Task)
├── dto/           # Data Transfer Objects for clean API contracts
├── entity/        # JPA Entities (User, Task, RefreshToken)
├── exception/     # Global exception handling with @Slf4j logging
├── repository/    # Data access layer (incl. RefreshTokenRepository)
├── security/      # JWT filter and Token service
└── service/       # Business logic (incl. RefreshTokenService)
```

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SuwanthaDarshana/task-tracker
```


### 2. Database Configuration
1.  Create a MySQL database named: `task_tracker_db`.
2.  The application uses environment variables for database credentials. Ensure these are set or updated in `src/main/resources/application.properties`:
    * `DB_USERNAME`: Your MySQL username
    * `DB_PASSWORD`: Your MySQL password
    * `JWT_SECRET`: A secure random string (minimum 32 characters)
    * `JWT_EXPIRATION`: Access token validity (e.g., `86400000` for 24 hours)
    * `REFRESH_TOKEN_EXPIRATION`: Refresh token validity in ms (optional — defaults to 7 days)

### 3. Database Scripts (Mandatory)
Navigate to the `src/dbscript/` folder to find the following scripts:
* `schema.sql`: Run this first to create the `users`, `tasks`, and `refresh_tokens` tables.
* `data.sql`: Run this to insert sample data, including a default user.
    * **Sample User Login**: `admin@example.com` / `password123`

### 4. Running the App

#### Navigate to backend directory
```bash
cd task-tracker-backend
```

#### Run the application
```bash
mvn spring-boot:run
```


---

## 📖 API Documentation (Swagger)

The project includes an interactive documentation UI which allows you to explore and test the endpoints directly from your browser.

👉 **URL:** [http://localhost:8090/swagger-ui.html](http://localhost:8090/swagger-ui.html)

### 🔐 How to Authenticate
Since the Task endpoints are protected, you must follow these steps to authorize your requests in Swagger:

1. **Login**: Go to the `auth-controller` section and execute the `/api/v1/auth/login` endpoint with valid credentials.
2. **Copy Token**: From the success response, copy the value of the `token` field.
3. **Authorize**: 
   * Click the green **"Authorize"** button located at the top right of the Swagger page.
   * In the text box, type `Bearer ` followed by your token (e.g., `Bearer eyJhbG...`).
   * Click **Authorize**, then click **Close**.
4. **Test**: You are now authenticated! You can proceed to test the `task-controller` endpoints.

### 📍 Key Endpoints Summary

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/v1/auth/register` | Create a new user account |
| **Auth** | POST | `/api/v1/auth/login` | Authenticate and receive JWT + refresh token cookie |
| **Auth** | POST | `/api/v1/auth/refresh` | Exchange refresh token cookie for a new access token |
| **Auth** | POST | `/api/v1/auth/logout` | Revoke all refresh tokens and clear cookie |
| **Task** | POST | `/api/v1/tasks/{userId}` | Create a new task for a user |
| **Task** | GET | `/api/v1/tasks/user/{userId}` | Fetch all tasks for a specific user |
| **Task** | PUT | `/api/v1/tasks/{taskId}` | Update an existing task |
| **Task** | DELETE | `/api/v1/tasks/{taskId}` | Remove a task |

---