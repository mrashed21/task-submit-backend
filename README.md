# 🚀 Task Submission— Backend API

An enterprise-ready, robust RESTful API built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** for PostgreSQL. It powers a comprehensive Project Submission & Review Dashboard with multi-role access control (RBAC), anti-spam rate limiting, automated database migrations, and structured error handling.

---

## 📋 Table of Contents
- [Architecture & Highlights](#-architecture--highlights)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Database & Multi-File Prisma Schema](#-database--multi-file-prisma-schema)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Migration & Seeding](#database-migration--seeding)
  - [Running the Application](#running-the-application)
- [Demo Credentials](#-demo-credentials)
- [Middlewares & Security](#-middlewares--security)
- [NPM Scripts](#-npm-scripts)

---

## 🏛 Architecture & Highlights

- **Modular Feature Architecture**: Structured under `src/modules/` with isolated controllers, services, routes, and validation schemas for clean separation of concerns.
- **Prisma Multi-File Schema**: Employs the `prismaSchemaFolder` preview feature to cleanly organize models across `base.prisma`, `user.prisma`, `submission.prisma`, and `review.prisma`.
- **Role-Based Access Control (RBAC)**: Fine-grained authorization differentiating `STUDENT`, `MENTOR`, and `ADMIN` privileges.
- **Database Modeling with Snake_Case**: Clean relational schema mapping PostgreSQL table/column naming conventions (`user_id`, `review_date`, `created_at`, `updated_at`).
- **Comprehensive Error Handling**: Centralized error middleware handling custom `AppError` and auto-formatting Prisma error codes (`P2002` duplicate key, `P2025` record not found, `P2003` foreign key violation).
- **Anti-Spam Rate Limiting**: Intelligent throttling on critical actions like project submissions to prevent spam.
- **Zod Request Validation**: Strict compile-time and runtime type validation for all incoming request bodies and query parameters.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v4.21)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/) (v5.22)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Compatible with Neon, Supabase, AWS RDS, Docker)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation**: [Zod](https://zod.dev/)
- **Security & Utilities**: `cors`, `express-rate-limit`, `dotenv`, `tsx`

---

## 📂 Project Directory Structure

```text
backend/
├── prisma/
│   ├── schema/
│   │   ├── base.prisma          # Datasource & generator config
│   │   ├── user.prisma          # User & Role enum models
│   │   ├── submission.prisma    # Submission model & SubmissionStatus enum
│   │   └── review.prisma        # Review evaluation model
│   ├── migrations/              # Generated SQL migrations
│   └── seed.ts                  # Database seeding script
├── src/
│   ├── config/
│   │   └── env.ts               # Type-safe environment config
│   ├── errors/
│   │   └── app-error.ts         # Custom application error class
│   ├── middlewares/
│   │   ├── catch-async.ts       # Async handler exception wrapper
│   │   ├── global-error.ts      # Global centralized error handler
│   │   ├── not-found.ts         # 404 handler for unknown routes
│   │   ├── postgres-error.ts    # Prisma / PostgreSQL error mapper
│   │   ├── rate-limiter.ts      # Anti-spam rate limiting
│   │   ├── user-guard.ts        # JWT auth & RBAC route guard
│   │   └── validate-request.ts  # Zod schema validation middleware
│   ├── modules/
│   │   ├── auth/                # Register, login, profile (/api/v1/auth)
│   │   ├── review/              # Reviews & evaluations (/api/v1/reviews)
│   │   ├── stat/                # Dashboard metrics (/api/v1/stats)
│   │   └── submission/          # Project submissions (/api/v1/submissions)
│   ├── routes/
│   │   └── api-routes.ts        # Central route aggregator
│   ├── utils/
│   │   ├── jwt.ts               # JWT sign & verify helpers
│   │   ├── password.ts          # Password hash & comparison
│   │   ├── prisma.ts            # Singleton Prisma client instance
│   │   └── response.ts          # Standard JSON response formatter
│   ├── app.ts                   # Express application setup
│   └── server.ts                # HTTP server bootstrap & graceful shutdown
├── .env.example                 # Example environment variables
├── package.json
└── tsconfig.json
```

---

## 🗄 Database & Multi-File Prisma Schema

The schema takes advantage of Prisma's **Multi-File Schema** folder (`prisma/schema/`):

| Schema File | Models / Enums | Description |
| :--- | :--- | :--- |
| `base.prisma` | `datasource`, `generator` | PostgreSQL connection and client generation with `prismaSchemaFolder` |
| `user.prisma` | `User`, `Role` (`STUDENT`, `MENTOR`, `ADMIN`) | User credentials, roles, and relational hooks |
| `submission.prisma` | `Submission`, `SubmissionStatus` (`PENDING`, `APPROVED`, `REJECTED`) | Project name, repo URL, live link, description, and review associations |
| `review.prisma` | `Review` | Mentor feedback, approval/rejection decision, timestamp (`review_date`) |

---

## 🌐 API Endpoints Reference (`/api/v1`)

### Health Check
- `GET /health` — Check server health and operational status.
- `GET /` — API welcome message and documentation entry.

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new Student account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve current user profile |

### 2. Project Submissions (`/api/v1/submissions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/submissions` | Student | Submit project (Validates URL, checks duplicates, rate-limited) |
| `GET` | `/api/v1/submissions/my-submissions` | Student | Fetch current student's submission history with reviews |
| `GET` | `/api/v1/submissions` | Mentor, Admin | Fetch all submissions with search, status filtering, and pagination |
| `GET` | `/api/v1/submissions/:id` | Authenticated | Get detailed submission info by UUID |

### 3. Reviews & Evaluation (`/api/v1/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/reviews/:submissionId` | Mentor, Admin | Submit evaluation (`APPROVED` / `REJECTED`) with mentor feedback |
| `GET` | `/api/v1/reviews/:submissionId` | Authenticated | Retrieve review history for a specific submission |

### 4. Metrics & Statistics (`/api/v1/stats`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/stats/dashboard` | Mentor, Admin | Aggregated stats: Total, Pending, Approved, Rejected, and Approval Rate |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Connection String (Neon / Supabase / Local PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:5432/database_name?sslmode=require"

# JWT Authentication
JWT_SECRET="super-secret-jwt-key-2026-very-secure-phrase"
JWT_EXPIRES_IN="7d"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- PostgreSQL database instance (local or hosted, e.g. Neon, Supabase)

### Installation
```bash
# Clone the repository and navigate to backend
cd backend

# Install dependencies
npm install
```

### Database Migration & Seeding
```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Run Database Migrations
npm run prisma:migrate

# 3. Seed Database with Initial Users & Sample Submissions
npm run db:seed
```

### Running the Application
```bash
# Run in development mode (with hot-reload via tsx)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm run start
```
The server will start at: `http://localhost:5000` (API base: `http://localhost:5000/api/v1`)

---

## 👥 Demo Credentials

The database seeding script provides pre-configured accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin1234` | Full access to dashboard, submissions, reviews, and stats |
| **Mentor** | `mentor@example.com` | `mentor1234` | Access to mentor dashboard, evaluation modal, and metrics |
| **Student** | `student@example.com` | `student1234` | Access to submit projects and track personal submission history |

---

## 🛡 Middlewares & Security

- **JWT Authentication (`user-guard.ts`)**: Validates Bearer token from `Authorization` header and extracts user payload.
- **RBAC (`userGuard(Role.MENTOR, Role.ADMIN)`)**: Restricts endpoints to authorized roles only.
- **Anti-Spam Throttling (`rate-limiter.ts`)**: Limits project submission attempts to 10 submissions per 15-minute window per IP.
- **Postgres Error Mapping (`postgres-error.ts`)**: Converts raw database errors into user-friendly JSON messages:
  - `P2002`: Unique constraint violation (e.g., duplicate repo URL or email).
  - `P2025`: Record not found.
  - `P2003`: Foreign key constraint failure.
- **Zod Schema Validation (`validate-request.ts`)**: Validates `req.body`, `req.query`, and `req.params` against strict schemas.

---

## 📜 NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `tsx watch src/server.ts` | Start development server with file watch |
| `npm run build` | `tsc` | Compile TypeScript into `dist/` |
| `npm run start` | `node dist/server.js` | Run compiled production bundle |
| `npm run prisma:generate` | `prisma generate` | Generate Prisma client models |
| `npm run prisma:migrate` | `prisma migrate dev` | Apply migrations to database in dev |
| `npm run prisma:push` | `prisma db push` | Push schema state directly to database |
| `npm run db:seed` | `tsx prisma/seed.ts` | Populate database with seed data |
