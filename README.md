# Project Submission & Review Dashboard - Backend API

A robust, enterprise-grade RESTful API built with **Express.js**, **TypeScript**, and **Prisma ORM** (PostgreSQL) implementing JWT Role-Based Access Control (RBAC).

## Architecture Highlights

- **Feature-Based Modular Structure**: Organized under `src/modules/` with isolated controllers, services, routes, and validation schemas.
- **Prisma Multi-File Schemas**: Leveraging `prismaSchemaFolder` preview feature (`base.prisma`, `user.prisma`, `submission.prisma`, `review.prisma`).
- **Database Schema Modeling**: Schema with `user_id`, `review_date`, and snake_case table mappings.
- **Custom Production Middlewares**:
  - `catch-async`: Robust unhandled promise wrapper.
  - `user-guard`: JWT authentication & RBAC middleware (`STUDENT`, `MENTOR`, `ADMIN`).
  - `postgres-error`: Handles PostgreSQL / Prisma errors (e.g. `P2002` duplicate unique key, `P2025` not found, `P2003` foreign key violation).
  - `global-error`: Centralized error format with status code and error messages.
  - `not-found`: 404 handler for invalid routes.
  - `rate-limiter`: Anti-spam submission throttling (10 requests / 15 mins).
  - `validate-request`: Zod request body & query validation.

## API Endpoints (`/api/v1`)

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Register a new Student account.
- `POST /api/v1/auth/login` - Authenticate user & retrieve JWT token.
- `GET /api/v1/auth/me` - Retrieve current authenticated profile.

### Submissions (`/api/v1/submissions`)
- `POST /api/v1/submissions` - Submit project (Student only, rate-limited, duplicate checks).
- `GET /api/v1/submissions/my-submissions` - View personal submissions and review feedbacks (Student only).
- `GET /api/v1/submissions` - Paginated review list with server-side filters & search (Mentor & Admin only).
- `GET /api/v1/submissions/:id` - Fetch submission details by ID.

### Reviews (`/api/v1/reviews`)
- `POST /api/v1/reviews/:submissionId` - Approve or reject project with feedback (Mentor & Admin only).
- `GET /api/v1/reviews/:submissionId` - Get all review feedback history for a submission.

### Statistics (`/api/v1/stats`)
- `GET /api/v1/stats/dashboard` - Aggregated stats (Total, Pending, Approved, Rejected, Approval Rate).

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/review_dashboard?schema=public"
   JWT_SECRET="your-jwt-secret"
   ```
3. Generate Prisma client & apply migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```
4. Seed demo admin and mentor credentials:
   ```bash
   npm run db:seed
   ```
   Default accounts:
   - **Admin / Mentor**: `mentor@example.com` / `mentor1234`
   - **Student**: `student@example.com` / `student1234`
5. Start development server:
   ```bash
   npm run dev
   ```
