# AI-Driven Learning Platform

A full-stack web application where users select a learning category and sub-category, submit prompts to an AI engine, and receive generated lessons. Includes user authentication, learning history, and an admin dashboard.

**Built for Practec Assessment Project**

---

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Backend    | Node.js + Express + TypeScript      |
| Database   | MySQL 8.0                           |
| ORM        | TypeORM (with auto-sync)            |
| Auth       | JWT (bcryptjs + jsonwebtoken)       |
| AI Engine  | OpenAI GPT-4o                       |
| Frontend   | Angular 17 + TypeScript             |
| Docs       | Swagger / OpenAPI 3.0               |
| Infra      | Docker Compose (MySQL)              |
| Tests      | Jest + ts-jest                      |

---

## Project Structure

```
ai-learning-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Swagger config
│   │   ├── controllers/     # Auth, Category, Prompt, Admin
│   │   ├── middlewares/     # JWT auth & validation
│   │   ├── models/          # TypeORM entities (User, Category, SubCategory, Prompt)
│   │   ├── routes/          # Express routes with Swagger JSDoc
│   │   ├── services/        # OpenAI integration
│   │   ├── tests/           # Jest unit tests
│   │   ├── utils/           # Database seed script
│   │   └── server.ts        # Express entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── admin/       # admin.component.ts/html/scss
│       │   ├── auth/        # login & register components
│       │   └── dashboard/   # dashboard.component.ts/html/scss
│       ├── services/        # AuthService, ApiService
│       ├── guards/          # Auth & Admin route guards
│       ├── interceptors/    # JWT HTTP interceptor
│       └── models/          # TypeScript interfaces
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### 1. Start MySQL (Docker)

```bash
docker-compose up -d
```

This starts MySQL on port 3307 with database `ai_learning_platform`.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Edit backend/.env and replace the placeholder values
# with your own DB password, JWT secret, and OpenAI key.

# Build TypeScript
npm run build

# Seed the database (categories + admin user)
npx ts-node src/utils/seed.ts

# Start server
npm run dev
```

> Note: `backend/.env` is excluded from source control by `.gitignore`, so only `backend/.env.example` should be committed.

Backend runs on **http://localhost:3000**
Swagger docs at **http://localhost:3000/api-docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Angular dev server
ng serve
```

Frontend runs on **http://localhost:4200**

---

## Running Tests

```bash
cd backend
npm test
```

---

## Default Accounts

| Role  | Email               | Password  |
| ----- | ------------------- | --------- |
| Admin | admin@learning.com  | admin123  |

Register a new account via the UI to get a regular user.

---

## API Endpoints

### Auth
| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | /api/auth/register    | Register new user   |
| POST   | /api/auth/login       | Login & get JWT     |

### Categories (requires JWT)
| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| GET    | /api/categories                     | All categories + subs        |
| GET    | /api/categories/:id/sub-categories  | Sub-categories by category   |
| POST   | /api/categories                     | Create category (admin)      |
| POST   | /api/categories/:id/sub-categories  | Create sub-category (admin)  |

### Prompts (requires JWT)
| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | /api/prompts           | Submit prompt → AI lesson      |
| GET    | /api/prompts/history   | User's learning history (paginated) |

### Admin (requires JWT + admin role)
| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | /api/admin/users     | All users (paginated)                |
| GET    | /api/admin/prompts   | All prompts (paginated, filterable)  |

---

## Features

- **JWT Authentication** — register, login, protected routes
- **Role-based Access** — user vs admin permissions
- **AI-Powered Lessons** — OpenAI GPT-4o integration with fallback mock
- **Learning History** — paginated history per user
- **Admin Dashboard** — view all users and prompts, filter by user
- **Swagger API Docs** — interactive API documentation
- **Input Validation** — server-side request validation
- **Docker Support** — MySQL via Docker Compose
- **Unit Tests** — Jest tests for auth controller

---

## Seeded Categories

1. **Science** — Space, Physics, Biology, Chemistry
2. **Technology** — AI & ML, Web Development, Cybersecurity, Cloud Computing
3. **Mathematics** — Algebra, Calculus, Statistics, Geometry
4. **History** — Ancient History, World Wars, Middle Ages, Modern History
5. **Languages** — English Grammar, Hebrew, Spanish, French
