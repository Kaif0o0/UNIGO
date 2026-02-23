# Frontend - Studora Project Summary

The frontend of Studora is a modern, responsive Single Page Application (SPA) built with React and Vite, focusing on a clean, "minimal study gear" aesthetic with a mobile-first approach.

## 🛠️ Tech Stack & Libraries

| Library | Purpose |
| :--- | :--- |
| **React (Vite)** | Core framework for building the user interface. |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **React Router DOM** | Declarative routing for navigation between pages. |
| **Axios** | Promise-based HTTP client for making API requests. |
| **Lucide React** | Beautifully simple, pixel-perfect icons. |
| **Chart.js / React-Chartjs-2** | Data visualization for student analytics/stats. |

## 🧠 State Management (Context API)

- **`AuthContext.jsx`**: Manages user login state, registration, and persistent sessions via LocalStorage. Includes an Axios Interceptor to auto-logout on 401 (stale session).
- **`NotificationContext.jsx`**: Handles real-time-like notifications by polling the backend for new messages.

## 📂 Key Features & Flow

### 1. Global Layout (`App.jsx`)
- Uses a **flex-column** layout with a fixed `BottomNav`.
- Implements `overflow-x: hidden` at the app level to fix mobile Safari scrolling bugs.

### 2. User Experience Flow
- **Navigation**: Uses `react-router-dom` for seamless transitions between Store, Mentors, Inbox, and Account.
- **Responsive Navbar**: A custom fixed bottom navigation bar optimized for mobile devices with safe-area support.
- **API Integration**: All calls use the `VITE_API_URL` environment variable for easy switching between local development and production.

### 3. Messaging UI
- **Inbox**: Lists all active conversations with previews of the last message.
- **Chat**: A dedicated chat interface with auto-scrolling and message grouping by sender.
