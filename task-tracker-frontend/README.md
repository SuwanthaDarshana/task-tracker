# 📝 Mini Task Tracker - Frontend

A modern, responsive single-page application built with **React 19**, **TypeScript**, and **Tailwind CSS v4** for managing personal tasks. Features **in-memory token storage** for XSS protection, **silent session refresh** via HttpOnly cookies, and **automatic 401 retry with request queueing**. Designed to work seamlessly with the Task Tracker Backend API.

---

## 🚀 Key Features

* **Secure Authentication**: Login and registration with **dual-token** architecture — access token in memory, refresh token in HttpOnly cookie.
* **Silent Session Restore**: Automatic session restoration on page reload without re-login.
* **401 Auto-Refresh**: Axios response interceptor transparently refreshes expired tokens; concurrent failed requests are queued and retried.
* **Task Management**: Full CRUD operations — create, view, edit, and delete tasks.
* **Status Workflow**: Move tasks through `To Do → In Progress → Done` with one-click status transitions.
* **Search & Filter**: Real-time search by title/description, filter by status, and sort by multiple criteria.
* **Client-Side Pagination**: Smooth pagination with configurable page sizes.
* **Responsive Design**: Fully responsive layout with Tailwind CSS utility-first styling.
* **Toast Notifications**: User-friendly feedback for all actions using react-toastify.
* **Optimistic Updates**: Instant UI updates; server re-fetch only on error.
* **Keyboard Accessibility**: Escape key closes modals.

---

## 🛠️ Tech Stack

* **React**: 19.2
* **TypeScript**: 5.9
* **Build Tool**: Vite 7.3
* **Styling**: Tailwind CSS 4
* **HTTP Client**: Axios
* **Routing**: React Router v7
* **Notifications**: react-toastify

---

## ⚙️ Prerequisites

* **Node.js**: 18+
* **npm** (or yarn/pnpm)
* **Backend API** running on `http://localhost:8090`

---

## 📂 Project Structure

```text
src/
├── api/           # Axios config (in-memory token, request/response interceptors) & API services
├── components/    # Reusable UI components (TaskCard, Modals, FilterBar, etc.)
├── context/       # React Context for auth (silent refresh, CustomEvent bridge)
├── pages/         # Route-level page components (Login, Register, Dashboard)
├── types/         # TypeScript type definitions
├── App.tsx        # Root component with routing + loading spinner
└── main.tsx       # Application entry point
```

---

## 🛠️ Getting Started

### 1. Navigate to frontend directory
```bash
cd task-tracker-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the frontend directory:
```env
VITE_API_URL=http://localhost:8090/api/v1
```

### 4. Start the development server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## 🔗 API Integration

The frontend connects to the backend REST API at the URL specified by `VITE_API_URL`. Ensure the backend is running before starting the frontend.

### Authentication Flow
1. Register a new account or login with existing credentials
2. Backend returns a **short-lived JWT access token** in the response body + sets a **long-lived refresh token** in an **HttpOnly, SameSite cookie**
3. Access token is stored **in memory only** (JavaScript variable, NOT localStorage) for XSS protection
4. All API requests automatically include the `Authorization: Bearer <token>` header via Axios request interceptor
5. On **page refresh**, a silent `POST /auth/refresh` call uses the HttpOnly cookie to restore the session without re-login
6. When the access token **expires**, the Axios response interceptor catches the 401, queues concurrent requests, refreshes the token, and retries all queued requests transparently
7. Auth state is managed via React Context (`AuthProvider`) with a `CustomEvent` bridge between the Axios module and React components
8. Protected routes display a "Restoring session..." spinner during silent refresh, then redirect unauthenticated users to login
