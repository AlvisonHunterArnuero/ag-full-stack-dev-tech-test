# TaskFlow — Task Management Application

A full-stack task management app built with **Fastify**, **PostgreSQL**, **React**, **Material UI**, and **TailwindCSS**.

## Architecture

```
AG SOFTWARE TEST/
├── backend/       # Fastify + Knex + PostgreSQL API
├── frontend/      # React + Vite + MUI + Tailwind
└── docker-compose.yml  # Full-stack container orchestration
```

### Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Node.js, Fastify 4, TypeScript                  |
| Database   | PostgreSQL 16, Knex.js (query builder + migrations) |
| Auth       | JWT (jsonwebtoken), bcrypt                      |
| Frontend   | React 18, Vite 7, TypeScript                    |
| UI         | Material UI v6, TailwindCSS v3                  |
| State      | TanStack Query v5 (server state), React Context (auth) |
| Routing    | React Router v6                                 |
| Docker     | Multi-stage builds, nginx for frontend          |

## Features

- 🔐 JWT authentication (register/login)
- 👥 Role-based access control (Admin / User)
- ✅ Create, update, delete, and list tasks
- 🔄 Toggle task completion (pending ↔ completed)
- 🔍 Filter tasks by status (all/pending/completed)
- 📄 Server-side pagination (6 tasks per page)
- 🎨 Premium dark-theme UI with animations
- 🐳 Full Docker container orchestration

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for database)

### Option 1: Docker (full stack)

```bash
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:3000

### Option 2: Local Development

#### 1. Start PostgreSQL

```bash
# From project root
cd backend
docker-compose up -d postgres
```

#### 2. Start Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit .env as needed
npm run dev
# API running at http://localhost:3000
```

#### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# UI running at http://localhost:5173
```

---

## Environment Variables (Backend)

| Variable       | Default                          | Description          |
|----------------|----------------------------------|----------------------|
| `DB_HOST`      | `localhost`                      | PostgreSQL host      |
| `DB_PORT`      | `5432`                           | PostgreSQL port      |
| `DB_USER`      | `postgres`                       | DB username          |
| `DB_PASSWORD`  | `postgres`                       | DB password          |
| `DB_NAME`      | `management_tasks_api`           | Database name        |
| `JWT_SECRET`   | `your-super-secret-key...`       | JWT signing secret   |
| `PORT`         | `3000`                           | API server port      |
| `FRONTEND_URL` | `http://localhost:5173`          | CORS allowed origin  |

---

## API Reference

### Authentication

| Method | Endpoint         | Description        | Auth Required |
|--------|------------------|--------------------|---------------|
| POST   | `/auth/register` | Create new account | No            |
| POST   | `/auth/login`    | Sign in            | No            |

**Register Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Login / Register Response:**
```json
{
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "user" },
  "token": "<jwt>"
}
```

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint     | Description                     | Query Params                          |
|--------|--------------|---------------------------------|---------------------------------------|
| GET    | `/tasks`     | List user's tasks (paginated)   | `status`, `page`, `limit`, `all`*     |
| GET    | `/tasks/:id` | Get a specific task             | —                                     |
| POST   | `/tasks`     | Create a task                   | —                                     |
| PUT    | `/tasks/:id` | Update a task                   | —                                     |
| DELETE | `/tasks/:id` | Delete a task                   | —                                     |

*`?all=true` is admin-only; lists all users' tasks.

**Create Task Body:**
```json
{
  "title": "Design landing page",
  "description": "Create mockups in Figma"
}
```

**Update Task Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Paginated List Response:**
```json
{
  "tasks": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Users (JWT required)

| Method | Endpoint    | Description                       | Role   |
|--------|-------------|-----------------------------------|--------|
| GET    | `/users`    | List all users                    | Admin  |
| GET    | `/users/me` | Get current user profile          | Any    |
| GET    | `/users/:id`| Get user by ID                    | Own/Admin |
| PUT    | `/users/:id`| Update user                       | Own/Admin |
| DELETE | `/users/:id`| Delete user                       | Admin  |

### Health Check

| Method | Endpoint  | Response                                  |
|--------|-----------|-------------------------------------------|
| GET    | `/health` | `{ "status": "ok", "timestamp": "..." }` |

---

## Database Migrations

Migrations run automatically on server startup. Migration files are in `backend/src/database/migrations/`:

| File                           | Description                         |
|--------------------------------|-------------------------------------|
| `001_initial.ts`               | Creates `users` and `tasks` tables  |
| `002_add_password_to_users.ts` | Adds `password` column to users     |
| `003_add_role_to_users.ts`     | Adds `role` column (admin/user)     |

---

## Architecture Decisions

1. **JWT over sessions** — Stateless auth suits REST APIs and scales horizontally without shared session storage.
2. **bcrypt for passwords** — Replaced the original SHA-256 hash with bcrypt for proper salted password hashing.
3. **Knex.js** — Raw query builder with full migration support; avoids ORM magic while keeping type safety.
4. **TanStack Query** — Handles caching, background refetching, and loading/error states for all API calls.
5. **React Context for auth** — Lightweight solution for auth state; no Redux needed for this scope.
6. **Server-side pagination** — Limits database load; implemented at the controller level with `limit`/`offset`.
7. **Role-based access** — `admin` role embedded in JWT allows backend to enforce access without extra DB queries per request.
8. **Vite proxy** — Dev server proxies `/api` to backend, avoiding CORS issues in development.
