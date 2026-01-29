# HRMS Lite

A lightweight HR app for managing employees and daily attendance. Full-stack take-home built with FastAPI and React—deployed and wired end-to-end.

**Live app:** [assesment-henna.vercel.app](https://assesment-henna.vercel.app/)  
**Backend API:** [assesment-vozq.onrender.com](https://assesment-vozq.onrender.com) · **Health:** [assesment-vozq.onrender.com/health](https://assesment-vozq.onrender.com/health)  
**Repo:** [github.com/ISHANKSHARMA146/assesment](https://github.com/ISHANKSHARMA146/assesment)

---

## What was asked

The brief was to build a **web-based HRMS Lite** so an admin can:

| Area | Requirement |
|------|-------------|
| **Employees** | Add (Employee ID, Full Name, Email, Department), view list, delete |
| **Attendance** | Mark attendance (date + Present/Absent), view records per employee |
| **Backend** | RESTful APIs, DB persistence, validation, proper HTTP codes & error messages |
| **Frontend** | Professional UI, clean layout, loading/empty/error states |
| **Deploy** | Live frontend + hosted backend + public repo + README (overview, tech stack, run locally, assumptions) |
| **Bonus** | Filter attendance by date, total present days, dashboard summary |

---

## What I built

### Core (per brief)

- **Employee management** — Add employee (ID, name, email, department from a **fixed dropdown**), view list, delete. Department dropdown keeps data consistent and makes filtering reliable.
- **Attendance** — Mark present/absent per employee per date; view history with **date range** and **department multiselect** filters.
- **REST API** — All operations under `/api/v1`; Pydantic validation; custom exceptions mapped to HTTP codes; consistent error shape.
- **UI** — Clean layout, loading states, empty states, error toasts, confirm before delete.

### Extra (bonus + polish)

- **Dashboard** — Total employees, today’s present/absent, recent activity, quick actions (e.g. “Add employee” → opens form on Employees page).
- **Employee search** — `GET /api/v1/employees?search=...` (name, ID, or email); search in the UI.
- **Attendance filters** — Date range + department multiselect in the API and in the history view.
- **Onboarding** — Welcome overlay for first-time users; guided tour (step-by-step); “Tour” in the nav to restart.
- **Health check** — `GET /health` for deployment and monitoring.
- **Keep-alive** — Frontend pings `/health` every 40s so the free-tier backend stays warm for reviewers.

---

## How I built it — steps I took

1. **Scoped the work** — Read the brief, listed must-haves vs bonus, and kept the solution within 6–8 hours without over-engineering.
2. **Backend first** — Set up the FastAPI project, chose a layered design (routers → services → repositories), and implemented models, schemas, and endpoints for employees and attendance. Added API versioning (`/api/v1`) and a health endpoint from the start.
3. **Database** — Designed the schema (employees + attendance with FK and unique constraint on `employee_id` + `date`), used SQLAlchemy and Pydantic for validation. Kept SQLite for local dev and PostgreSQL for production so reviewers can run it without a DB install.
4. **Frontend** — Created the React + TypeScript app with Vite and Tailwind, split UI into reusable components and custom hooks for data. Wired forms, tables, search, and filters to the API with a single Axios client and normalized error handling.
5. **Deploy** — Hosted the backend (and PostgreSQL) on Render and the frontend on Vercel, set env vars and CORS, and fixed Python/runtime and dependency issues (Python 3.11, pydantic versions, psycopg2) so the build and app run correctly.
6. **Polish** — Added the welcome overlay and tour, seed script for dummy data, and a 40s keep-alive so the live app stays responsive for reviewers.

---

## Architecture & folder structure

I kept a clear separation of concerns so the codebase stays maintainable and testable.

### Backend (`backend/`)

- **`app/routers/v1/`** — HTTP layer only: parse request, call service, return response. No business or DB logic.
- **`app/services/`** — Business logic: rules like “no duplicate attendance for same employee+date”, “delete employee → delete attendance”. Easy to unit-test.
- **`app/repositories/`** — All DB access: queries and persistence. Services don’t touch SQLAlchemy directly.
- **`app/models.py`** — SQLAlchemy models (Employee, Attendance) and DB constraints.
- **`app/schemas.py`** — Pydantic request/response and validation.
- **`app/exceptions.py`** — Domain exceptions mapped to HTTP status in `main.py`.
- **`app/config.py`** — Settings from env (Pydantic BaseSettings). No hardcoded URLs or secrets.
- **`scripts/`** — Seed script (full app) and standalone seed (psycopg2 + dotenv only) for populating the deployed DB from a machine where the full stack isn’t installed.

**Why this is efficient:** Changes to API shape, business rules, or DB stay localized. New features follow the same pattern. The structure matches what I’d expect in a production codebase and makes it easy for another developer to onboard.

### Frontend (`frontend/src/`)

- **`components/`** — Reusable UI (Button, Input, Modal, etc.) and page-level components (Dashboard, EmployeeList, AttendanceManagement). Components focus on UI; data comes from hooks or props.
- **`hooks/`** — `useEmployees`, `useAttendance`, `useDashboard`: fetch data, handle loading/error, expose actions. Keeps components thin and logic testable.
- **`services/api.ts`** — Single Axios instance, base URL from env, response interceptor to normalize errors (including FastAPI validation errors) into a consistent shape.
- **`utils/`** — Constants (e.g. departments), date helpers, tour steps. No magic strings in components.
- **`types/`** — Shared TypeScript types for API and UI.

**Why this is efficient:** Data flow is predictable; API and types are centralized; adding a new page or feature reuses the same patterns.

---

## Coding practices I followed

- **No secrets in code** — Config and URLs from env; `.env` in `.gitignore`; `.env.example` for required vars.
- **Type safety** — Type hints on the backend; strict TypeScript and shared types on the frontend. No `any` in the app code.
- **Validation** — Pydantic on every API input; client-side validation before submit. Backend is the source of truth.
- **Errors** — Custom exceptions and a single handler so all API errors return a consistent `detail` shape. Frontend parses that and shows clear messages (including validation errors) in the UI.
- **DB integrity** — Unique constraint on `(employee_id, date)` for attendance; cascade delete for employees. Prevents duplicates and orphaned rows even if the app has a bug.
- **Structured logging** — Startup, create/delete, and errors logged; no `print()` or `console.log` in production paths.
- **Idempotent / safe flows** — Confirm before delete; seed script skips existing data and uses `ON CONFLICT DO NOTHING` where appropriate.
- **Deployment-ready** — Health endpoint, CORS restricted to frontend origin, Python/runtime and dependencies pinned so the build is reproducible.

---

## Database — where and why

- **Local dev:** SQLite (`backend/hrms_lite.db`). No PostgreSQL install needed; file created on first run. Configured via `DATABASE_URL` in `backend/.env`.
- **Production:** PostgreSQL on Render (same account as the backend). Internal URL for the Web Service; external URL used only for running the seed script from my machine. Tables created via SQLAlchemy `Base.metadata.create_all` on startup (no migrations in this scope).
- **Schema:** `employees` (id, employee_id, full_name, email, department, created_at) and `attendance` (id, employee_id FK, date, status, created_at). Unique on `(employee_id, date)` and cascade delete so deleting an employee removes their attendance.
- **Seed data:** `backend/scripts/seed_standalone.py` — only needs `python-dotenv` and `psycopg2-binary`; reads `DATABASE_URL` from `backend/.env` and inserts 10 employees and 14 days of attendance. Safe to run multiple times (uses `ON CONFLICT DO NOTHING` for attendance).

---

## Deployment — where and why

- **Frontend:** Vercel. Root directory set to `frontend`; build uses `npm run build`; output is `dist`. `VITE_API_BASE_URL` set in Vercel to the live backend URL so the app talks to the deployed API. `vercel.json` defines the SPA rewrites.
- **Backend:** Render Web Service. Root directory **must be `backend`** (so `requirements.txt` and `psycopg2-binary` are found). Build: `pip install -r requirements.txt`; start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Python 3.11 via `backend/.python-version`. Env: `DATABASE_URL` (Render Postgres internal URL); `CORS_ORIGINS` optional (code also allows `https://*.vercel.app` so Vercel and preview deploys work). **Port:** Render sets `PORT` (e.g. 10000); the app listens on `$PORT`. External traffic uses HTTPS on 443; the port in logs is internal only.
- **Why:** Matches the suggested stack (Vercel + Render), keeps frontend and backend separate, and uses env-based config so the same repo works locally and in production.

---

## Why I’m a strong fit for this role

- I delivered a **complete, deployable solution** — live frontend and backend, clear README, and runnable seed flow so reviewers can test with real data.
- I applied **production-style structure** (layers, versioning, health, logging, error handling) without over-building, which aligns with maintaining and evolving real systems.
- I **debugged deployment issues** (Python version, pydantic/psycopg2, CORS, cold starts) and documented setup and troubleshooting in LOCAL_SETUP.md.
- I kept **code quality and consistency** (types, validation, no secrets in code, consistent errors) so the codebase is easy to review and extend—similar to what’s needed for code-focused evaluation and iteration in LLM workflows.
- I **scoped and prioritized** — core requirements first, then bonus features and polish, so the result is stable and reviewable within the time box.

---

## What I’d add next (not in the spec)

- **Auth** — Simple login/session or JWT so multiple users or roles could use the app.
- **Pagination** — For employees and attendance lists when data grows.
- **Tests** — Pytest for services/repositories; React Testing Library for critical flows.
- **Migrations** — Alembic (or similar) for schema changes instead of `create_all` only.
- **Audit / activity log** — Who created/updated what and when, for compliance or debugging.

I didn’t include these in the current deliverable because they weren’t required and I wanted to keep the solution focused and deployable within the brief.

---

## Stack

| | |
|---|--|
| **Frontend** | React 18, TypeScript, Tailwind, Vite |
| **Backend** | FastAPI, SQLAlchemy |
| **DB** | PostgreSQL (Render prod), SQLite (local) |
| **Deploy** | Vercel (frontend), Render (backend + Postgres) |

---

## API (v1)

| Method | Endpoint | Notes |
|--------|----------|--------|
| `GET` | `/health` | Liveness |
| `POST` | `/api/v1/employees` | Body: `employee_id`, `full_name`, `email`, `department` |
| `GET` | `/api/v1/employees` | Optional `?search=` (name, ID, email) |
| `DELETE` | `/api/v1/employees/{id}` | Cascades to attendance |
| `POST` | `/api/v1/attendance` | Body: `employee_id`, `date`, `status` |
| `GET` | `/api/v1/attendance` | Optional `employee_id`, `from`, `to`, `departments` |
| `GET` | `/api/v1/dashboard` | Stats + recent activity |

JSON in/out; errors use a consistent `detail` (or validation) shape.

---

## Assumptions & scope

- **Assumptions:** Single admin, no auth (per spec). Dates ISO `YYYY-MM-DD`; one attendance row per employee per day; no future dates. Employee ID 3–20 chars (alphanumeric + `_`/`-`). Department from fixed set: Engineering, Product, HR, Sales, Marketing, Design, Operations, Finance.
- **Out of scope:** Auth, pagination, reporting, export, notifications.

---

## For reviewers

- **Live app:** [assesment-henna.vercel.app](https://assesment-henna.vercel.app/) — try add employee, search, mark attendance, filter by date/department, delete. First load may take a few seconds if the backend was sleeping (free tier).
- **Health:** [assesment-vozq.onrender.com/health](https://assesment-vozq.onrender.com/health) for uptime checks.
- **Duplicates:** Attendance unique on `(employee_id, date)` in DB + service checks.
- **Cascade:** Deleting an employee removes their attendance rows.
- **Errors:** Same JSON error shape and sensible status codes across endpoints.

**Setup, run locally, seed data, deploy:** see **[LOCAL_SETUP.md](LOCAL_SETUP.md)**.

---

## License

MIT
