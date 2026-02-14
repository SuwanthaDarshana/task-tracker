# 📝 Mini Task Tracker - Frontend

A modern, responsive single-page application built with **React 19**, **TypeScript**, and **Tailwind CSS v4** for managing personal tasks. Designed to work seamlessly with the Task Tracker Backend API.

---

## 🚀 Key Features

* **User Authentication**: Secure login and registration with JWT token-based authentication.
* **Task Management**: Full CRUD operations — create, view, edit, and delete tasks.
* **Status Workflow**: Move tasks through `To Do → In Progress → Done` with one-click status transitions.
* **Search & Filter**: Real-time search by title/description, filter by status, and sort by multiple criteria.
* **Client-Side Pagination**: Smooth pagination with configurable page sizes.
* **Responsive Design**: Fully responsive layout with Tailwind CSS utility-first styling.
* **Toast Notifications**: User-friendly feedback for all actions using react-toastify.
* **Optimistic Updates**: Instant UI updates with background server synchronization.

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
├── api/           # Axios config and API service functions
├── components/    # Reusable UI components (TaskCard, Modals, etc.)
├── context/       # React Context for authentication state
├── pages/         # Route-level page components
├── types/         # TypeScript type definitions
├── App.tsx        # Root component with routing setup
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
2. JWT token is stored in localStorage
3. All API requests automatically include the `Authorization: Bearer <token>` header
4. Token is managed via React Context (`AuthProvider`)
