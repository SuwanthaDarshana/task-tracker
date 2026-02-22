# 📝 Mini Task Tracker — Full Stack Application

A full-stack Task Tracker application featuring a **Spring Boot 3** REST API backend with a **modern dual-token authentication system** (JWT access tokens + HttpOnly cookie refresh tokens) and a **React 19** single-page frontend styled with **Tailwind CSS v4**. Users can register, log in, and manage personal tasks through a clean, modern interface — with **server-side ownership verification**, **token rotation with theft detection**, and **silent session restoration**.

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Frontend** | [https://task-tracker-green-three.vercel.app](https://task-tracker-green-three.vercel.app) |
| **Backend API** | [https://task-tracker-backend-production-bbd0.up.railway.app](https://task-tracker-backend-production-bbd0.up.railway.app) |
| **Swagger UI** | [https://task-tracker-backend-production-bbd0.up.railway.app/swagger-ui.html](https://task-tracker-backend-production-bbd0.up.railway.app/swagger-ui.html) |

> Hosted on **Vercel** (frontend) + **Railway** (backend) + **Aiven MySQL** (database) — 100% free tier.

---

## 🚀 Key Features

### Backend
* **Dual-Token Authentication** — Short-lived JWT access tokens + long-lived refresh tokens in HttpOnly cookies with token rotation and theft detection
* **Ownership Verification** — `@AuthenticationPrincipal` + service-layer checks prevent IDOR attacks; users can only access their own tasks
* **Task CRUD** — Create, Read, Update, Delete tasks linked to specific users
* **Input Validation** — Jakarta Bean Validation on all DTOs
* **Layered Architecture** — Controller → Service → Repository pattern with interfaces
* **Caffeine Caching** — High-performance in-memory cache with `@Cacheable` / `@CacheEvict`
* **Scheduled Cleanup** — `@Scheduled` cron job purges expired refresh tokens daily
* **Hardened Error Handling** — `@RestControllerAdvice` with `@Slf4j` logging; generic messages to clients, real errors logged server-side
* **API Documentation** — Interactive Swagger UI with JWT authorization support
* **Password Encryption** — BCrypt hashing via Spring Security
* **Configurable CORS & Cookie Security** — Per-environment configuration via application properties

### Frontend
* **In-Memory Token Storage** — Access token stored in a JS variable (not localStorage) for XSS protection
* **Silent Session Refresh** — Automatic session restoration on page reload via HttpOnly cookie
* **401 Auto-Refresh with Request Queueing** — Transparent token refresh; concurrent failed requests are queued and retried
* **Single Page Application** — React 19 with React Router v7
* **TypeScript** — Fully typed codebase for safety and maintainability
* **Status Workflow** — Move tasks through `To Do → In Progress → Done` with one click
* **Search, Filter & Sort** — Real-time search by title/description, filter by status, sort by multiple criteria
* **Client-Side Pagination** — Smooth pagination with page size of 6
* **Responsive Design** — Tailwind CSS v4 utility-first styling
* **Toast Notifications** — User feedback for all actions via react-toastify
* **Optimistic Updates** — Instant UI updates; server re-fetch only on error

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.4.4, Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0+ |
| **Auth** | JWT access tokens + HttpOnly cookie refresh tokens, BCrypt |
| **API Docs** | Swagger / springdoc-openapi |
| **Frontend** | React 19.2, TypeScript 5.9, Vite 7.3 |
| **Styling** | Tailwind CSS 4 |
| **HTTP Client** | Axios |
| **Routing** | React Router v7 |
| **Notifications** | react-toastify |
| **Build Tools** | Maven (backend), npm + Vite (frontend) |

---

## ⚙️ Prerequisites

* **JDK 17**
* **MySQL Server** (8.0+)
* **Maven** (or use the provided `mvnw` wrapper)
* **Node.js** (18+) and **npm**

---

## 📂 Project Structure

```text
task-tracker/
├── task-tracker-backend/
│   └── src/main/java/com/miraisense/task_tracker_backend/
│       ├── config/        # Security, OpenAPI, and App configurations
│       ├── controller/    # REST API endpoints (Auth & Task)
│       ├── dto/           # Data Transfer Objects
│       ├── entity/        # JPA Entities (User, Task, RefreshToken)
│       ├── exception/     # Global exception handling with @Slf4j
│       ├── repository/    # Data access layer (incl. RefreshTokenRepository)
│       ├── security/      # JWT filter and Token service
│       └── service/       # Business logic (incl. RefreshTokenService)
│
├── task-tracker-frontend/
│   └── src/
│       ├── api/           # Axios config (in-memory token, interceptors) & API services
│       ├── components/    # Reusable UI components (TaskCard, Modals, etc.)
│       ├── context/       # React Context for auth (silent refresh, custom events)
│       ├── pages/         # Route-level page components (Login, Register, Dashboard)
│       ├── types/         # TypeScript type definitions
│       ├── App.tsx        # Root component with routing setup
│       └── main.tsx       # Application entry point
```

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SuwanthaDarshana/task-tracker
cd task-tracker
```

---

### 2. Backend Setup

#### 2.1 Database Configuration
1. Create a MySQL database named `task_tracker_db`.
2. Set the following **environment variables** (or create an `.env` file in the backend root):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `my-super-secret-key-that-is-long` |
| `JWT_EXPIRATION` | Token validity in milliseconds | `86400000` (24 hours) |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token validity in ms (optional) | `604800000` (7 days, default) |

#### 2.2 Database Scripts (Optional)
SQL scripts are provided in `task-tracker-backend/src/dbscript/`:
* **`schema.sql`** — Creates the `users`, `tasks`, and `refresh_tokens` tables
* **`data.sql`** — Inserts sample data with a default user

> **Sample User**: `admin@example.com` / `password123`

*Note: Since `spring.jpa.hibernate.ddl-auto=update` is configured, tables are auto-created on first run. The scripts are provided as a reference or for manual setup.*

#### 2.3 Run the Backend
```bash
cd task-tracker-backend
mvn spring-boot:run
```

The backend will start on: **http://localhost:8090**

---

### 3. Frontend Setup

#### 3.1 Environment Configuration
Create a `.env` file in the `task-tracker-frontend/` directory:
```env
VITE_API_URL=http://localhost:8090/api/v1
```

#### 3.2 Install Dependencies & Run
```bash
cd task-tracker-frontend
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 📖 API Documentation (Swagger)

Once the backend is running, view the interactive API docs at:

👉 **[http://localhost:8090/swagger-ui.html](http://localhost:8090/swagger-ui.html)**

### 🔐 How to Authenticate in Swagger
1. Execute `/api/v1/auth/login` with valid credentials
2. Copy the `token` from the response
3. Click the **"Authorize"** button (top right)
4. Enter `Bearer <your-token>` and click **Authorize**
5. All protected endpoints are now accessible

### 📍 API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/v1/auth/register` | Create a new user account |
| **Auth** | POST | `/api/v1/auth/login` | Authenticate and receive JWT + refresh token cookie |
| **Auth** | POST | `/api/v1/auth/refresh` | Exchange refresh token cookie for new access token |
| **Auth** | POST | `/api/v1/auth/logout` | Revoke all refresh tokens + clear cookie |
| **Task** | POST | `/api/v1/tasks/{userId}` | Create a new task for a user |
| **Task** | GET | `/api/v1/tasks/user/{userId}` | Fetch all tasks (paginated) |
| **Task** | GET | `/api/v1/tasks/{taskId}` | Fetch a single task by ID |
| **Task** | PUT | `/api/v1/tasks/{taskId}` | Update an existing task |
| **Task** | DELETE | `/api/v1/tasks/{taskId}` | Delete a task |

---

## 📦 Available Scripts

### Backend
| Command | Description |
| :--- | :--- |
| `mvn spring-boot:run` | Start the Spring Boot server |
| `mvn clean package` | Build a production JAR |

### Frontend
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## 🔗 Authentication Flow

1. User registers or logs in via the frontend
2. Backend validates credentials and returns a **short-lived JWT access token** in the response body + sets a **long-lived refresh token** in an **HttpOnly, SameSite cookie**
3. Access token is stored **in memory only** (JavaScript variable, NOT localStorage) for XSS protection
4. All subsequent API requests include the `Authorization: Bearer <token>` header automatically via Axios request interceptor
5. On **page refresh**, a silent refresh call (`POST /auth/refresh`) uses the HttpOnly cookie to restore the session without re-login
6. When the access token **expires during usage**, the Axios response interceptor catches the 401, queues concurrent requests, refreshes the token, and retries all queued requests transparently
7. **Token rotation**: Every refresh invalidates the old refresh token and issues a new one
8. **Theft detection**: If a revoked refresh token is reused, ALL tokens for that user are revoked immediately
9. Protected frontend routes show a "Restoring session..." spinner during silent refresh, then redirect unauthenticated users to login
