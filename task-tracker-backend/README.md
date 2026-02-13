# 📝 Mini Task Tracker - Backend

This is a robust, full-stack ready backend implementation for a Task Tracker application, built using **Spring Boot 3** and **MySQL**. It is designed with professional standards, featuring **JWT Authentication**, clean architectural layering, and interactive API documentation.

---

## 🚀 Key Features

* **Secure Authentication**: User registration and login powered by **Spring Security** and **JWT**.
* **Task Management**: Full CRUD operations (Create, Read, Update, Delete) linked to specific users.
* **Data Integrity**: Input validation using **Jakarta Bean Validation**.
* **Scalable Architecture**: Strict separation of concerns using the Controller-Service-Repository pattern.
* **Interactive Documentation**: Fully configured **Swagger UI** with JWT Authorization support.
* **Real-world Security**: Password encryption using **BCrypt**.

---

## 🛠️ Tech Stack

* **Java**: 21
* **Framework**: Spring Boot 3.4.4
* **Database**: MySQL 8.0+
* **Security**: Spring Security & JSON Web Token (JWT)
* **Build Tool**: Maven

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* **JDK 21**
* **MySQL Server**
* **Maven** (or use the provided `mvnw` wrapper)

---

## 📂 Project Structure

This project follows the **Clean Layering** principle to ensure maintainability:

```text
src/main/java/com/miraisense/task_tracker_backend/
├── config/        # Security, OpenAPI, and App configurations
├── controller/    # REST API endpoints (Auth & Task)
├── dto/           # Data Transfer Objects for clean API contracts
├── entity/        # JPA Entities (Database Models)
├── exception/     # Global exception handling logic
├── repository/    # Data access layer
├── security/      # JWT filter and Token service
└── service/       # Business logic layer
```

## 🛠️ Getting Started

### 1. Clone the repository
git clone https://github.com/SuwanthaDarshana/task-tracker


### 2. Database Configuration
1.  Create a MySQL database named: `task_tracker_db`.
2.  The application uses environment variables for database credentials. Ensure these are set or updated in `src/main/resources/application.properties`:
    * `DB_USERNAME`: Your MySQL username
    * `DB_PASSWORD`: Your MySQL password
    * `JWT_SECRET`: A secure random string (minimum 32 characters)
    * `JWT_EXPIRATION`: Token validity (e.g., `86400000` for 24 hours)

### 3. Database Scripts (Mandatory)
Navigate to the `backend/dbscript/` folder to find the following scripts:
* `schema.sql`: Run this first to create the `users` and `tasks` tables.
* `data.sql`: Run this to insert sample data, including a default user.
    * **Sample User Login**: `admin@example.com` / `password123`

### 4. Running the App

#### Navigate to backend directory
*`cd task-tracker-backend`*

#### Run the application
*`mvn spring-boot:run`*


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
| **Auth** | POST | `/api/v1/auth/login` | Authenticate and receive JWT |
| **Task** | POST | `/api/v1/tasks/{userId}` | Create a new task for a user |
| **Task** | GET | `/api/v1/tasks/user/{userId}` | Fetch all tasks for a specific user |
| **Task** | PUT | `/api/v1/tasks/{taskId}` | Update an existing task |
| **Task** | DELETE | `/api/v1/tasks/{taskId}` | Remove a task |

---