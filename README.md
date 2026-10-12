# Smart Campus Canteen Pre-Ordering & Live Token System

A full-stack campus dining and food pre-ordering application built with Spring Boot 3 and React 19. The system eliminates lunch-hour queues, reduces cafeteria congestion, and provides a real-time Kitchen Display System (KDS) along with a public Live TV Token Board.

---

## Architecture Overview

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Axios (Port 5173)
* **Backend**: Java 21, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, JWT (Port 8081)
* **Database**: In-memory H2 database (or Cloud PostgreSQL / MySQL)
* **Authentication**: Stateless JSON Web Tokens (JWT) with Role-Based Access Control (`ROLE_STUDENT` & `ROLE_STAFF`)

---

## Core Features

1. **Student Pre-Ordering**:
   * Digital menu with categories (Breakfast, Lunch, Snacks, Beverages) and live availability badges.
   * Tray/Cart with customizable quantities and pickup window scheduler.
   * Unique sequential digital token generation upon checkout.
   * Live 3-stage progress tracking (`Placed` → `Cooking in Kitchen` → `Ready for Pickup`).

2. **Kitchen Staff Live Board**:
   * Real-time kitchen ticket pipeline with live status KPI counters.
   * Quick stage filters (`All`, `Placed`, `Preparing`, `Ready`).
   * One-click ticket transitions: `Start Cooking 🍳`, `Mark Ready 🔔`, `Handed Over ✔`.
   * Menu stock inventory toggle (In Stock / Sold Out).

3. **Public TV Display Board**:
   * Fullscreen high-contrast live token board designed for canteen wall-mounted TVs.
   * Split columns showing Preparing tokens vs. Ready for Pickup tokens.
   * Real-time auto-polling every 3 seconds without authentication requirement.

---

## Getting Started

### Prerequisites
* Java JDK 21+
* Node.js 18+ and npm
* Maven (or use bundled JAR)

### Quick Launch (Windows)
Double-click `start-all.bat` in the project root to start both backend and frontend simultaneously.

### Manual Launch

#### 1. Backend
```bash
cd canteen-backend
java -jar target/canteen-backend-0.0.1-SNAPSHOT.jar
# or via Maven
mvn spring-boot:run
```
Backend runs on: `http://localhost:8081`

#### 2. Frontend
```bash
cd canteen-frontend
npm install
npm run dev -- --port 5173
```
Frontend runs on: `http://localhost:5173`

---

## Pre-Seeded Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `password123` |
| **Kitchen Staff** | `staff@campus.edu` | `password123` |

---

## REST API Summary

* `POST /api/auth/register` - Create student or staff account
* `POST /api/auth/login` - Authenticate & obtain JWT
* `GET /api/menu` - Fetch active menu items
* `GET /api/menu/all` - Fetch all dishes including sold out (Staff only)
* `PATCH /api/menu/{id}/toggle` - Toggle stock availability (Staff only)
* `POST /api/orders` - Place meal order (Student only)
* `GET /api/orders/my-orders` - Fetch student order history (Student only)
* `GET /api/staff/orders` - Fetch active kitchen queue (Staff only)
* `PATCH /api/staff/orders/{id}/status` - Advance order status (Staff only)
* `GET /api/display/live-tokens` - Public TV display tokens
