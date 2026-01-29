# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking daily attendance. Full-stack app built for clarity, maintainability, and production readiness.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Why These Choices](#why-these-choices)
- [Architecture](#architecture)
- [Design Decisions (and Why)](#design-decisions-and-why)
- [Coding Practices & Production Readiness](#coding-practices--production-readiness)
- [How to Run Locally](#how-to-run-locally)
- [API Reference](#api-reference)
- [Assumptions & Limitations](#assumptions--limitations)
- [Notes for Reviewers](#notes-for-reviewers)
- [Live Application & Repo](#live-application--repo)
- [Deploy on Vercel](#deploy-on-vercel)

---

## Project Overview

**What it is:** A web-based HR tool that lets an admin manage employee records and track daily attendance (mark present/absent, view history with filters).

**What it’s for:** This project was built as a technical assessment. The goal was to deliver a **clean, stable, and functional** application with clear architecture, proper error handling, and a professional UI—without over-engineering.

**Scope:** Employee CRUD (add, view, delete), attendance (mark + view with filters), optional dashboard and onboarding tour. No auth, leave, or payroll—as per requirements.

---

## Tech Stack

| Layer      | Choice                | Why |
|-----------|------------------------|-----|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite | React + TS for type safety and maintainability; Vite for fast dev/build; Tailwind for consistent, quick styling. |
| **Backend**  | FastAPI, Python 3.9+   | FastAPI for async support, automatic OpenAPI docs, and Pydantic validation out of the box. |
| **ORM / DB** | SQLAlchemy             | Clear model layer and DB portability. Works with PostgreSQL (production) and SQLite (local dev). |
| **Database** | PostgreSQL (prod), SQLite (local) | PostgreSQL for production; SQLite so reviewers can run locally without installing a database. |
| **Deployment** | Vercel (frontend), Render/Railway (backend) | Common, free-tier–friendly options that match the suggested stack. |

---

## Features

| Area | What’s included | Why |
|------|------------------|-----|
| **Employees** | Add (ID, name, email, **department dropdown**), view list, delete | Department as a fixed dropdown keeps data consistent and avoids typos; aligns with filtering later. |
| **Employee search** | Search by name, employee ID, or email | Makes the list usable as the number of employees grows. |
| **Attendance** | Mark per employee per date (Present/Absent), view history | Core requirement. |
| **Attendance filters** | Date range + **department multiselect** | Lets admins focus on a date range and/or specific departments (e.g. “Engineering + Product only”). |
| **Dashboard** | Total employees, today’s present/absent, recent activity, quick actions | Bonus feature for at-a-glance view and quick navigation (e.g. “Add employee” → opens Employees page with form). |
| **Onboarding tour** | Optional guided tour; “Tour” in header to restart | Helps first-time users discover main areas without cluttering the default flow. |
| **UX** | Loading states, empty states, error toasts, confirm before delete | So the app feels predictable and safe to use. |

---

## Why These Choices

- **Layered backend (Routers → Services → Repositories)**  
  Keeps HTTP, business rules, and database access separate. Easier to test and change one layer without touching the others.

- **API versioning (`/api/v1`)**  
  If we add v2 later, old clients keep working. No breaking changes for existing consumers.

- **Single source of truth for errors**  
  All API errors return a consistent shape; the frontend normalizes them (including FastAPI validation errors) and shows clear messages in the UI.

- **Fixed department list**  
  Ensures consistent values for filtering and reporting; no free-text typos.

- **DB constraints (e.g. unique employee+date)**  
  Prevents duplicate attendance even if the app has a bug; the database enforces integrity.

---

## Architecture

### Backend (high level)

```
HTTP Request → Router (validation, HTTP only)
                    → Service (business logic)
                         → Repository (DB only)
                              → Database
```

- **Routers:** Parse request, call service, return response. No business or DB logic.
- **Services:** Rules like “can’t mark attendance twice for same employee+date”, “delete employee → delete their attendance”.
- **Repositories:** All SQLAlchemy/queries live here. Services don’t touch the ORM directly.

### Frontend (high level)

- **Components:** UI only. Data and side effects live in hooks or props.
- **Hooks:** `useEmployees`, `useAttendance`, `useDashboard` — fetch data, handle loading/error, expose actions.
- **API layer:** Single Axios instance with interceptors to normalize errors and attach base URL.

### Project structure (what lives where)

| Backend | Role |
|---------|------|
| `routers/v1/` | Employees, attendance, dashboard, health endpoints |
| `services/` | Create/list/delete employees; mark/list attendance; dashboard stats |
| `repositories/` | DB queries for employees and attendance |
| `models.py` | SQLAlchemy models (Employee, Attendance) |
| `schemas.py` | Pydantic request/response and validation |
| `exceptions.py` | Custom exceptions mapped to HTTP status codes |

| Frontend | Role |
|----------|------|
| `components/` | Reusable UI (buttons, inputs, modals, tables, etc.) + page-level (Dashboard, EmployeeList, AttendanceManagement) |
| `hooks/` | Data fetching and state for employees, attendance, dashboard |
| `services/api.ts` | Axios instance + error normalization |
| `utils/` | Constants (e.g. departments), date helpers, tour steps |

---

## Design Decisions (and Why)

| Decision | Why |
|----------|-----|
| **Service + Repository pattern** | Separates “what the app does” from “how we talk to HTTP/DB”. Easier to test and evolve. |
| **API versioning (`/api/v1`)** | Safe path to introduce breaking changes later under a new version. |
| **Pydantic for all inputs** | Validates and parses before hitting services; invalid data is rejected with clear error messages. |
| **Centralized error handling** | Same error shape from every endpoint; frontend can show one consistent UX for errors. |
| **Custom React hooks for data** | Components stay thin; loading/error/refetch logic is reusable and testable. |
| **Query params for filtering** | RESTful and cacheable; e.g. `GET /attendance?from=...&to=...&departments=...` is self-describing. |
| **Unique constraint (employee_id, date)** | Prevents duplicate attendance in the DB even if the service is called twice by mistake. |
| **Cascade delete (employee → attendance)** | Deleting an employee automatically removes their attendance; no orphaned rows. |
| **Department dropdown + multiselect** | Dropdown keeps add-form data clean; multiselect in history lets users filter by one or many departments. |

---

## Coding Practices & Production Readiness

Practices followed so the codebase is maintainable, reviewable, and deployable.

| Area | Practice | Where |
|------|----------|--------|
| **Backend** | No secrets in code; config via `.env` and Pydantic `Settings` | `config.py`, `.env.example` |
| **Backend** | Type hints on public functions and return types | Services, routers, repos |
| **Backend** | Layered architecture: routers → services → repositories | `routers/`, `services/`, `repositories/` |
| **Backend** | Structured logging (startup, create/delete, errors); no `print()` | `utils/logger.py`, services |
| **Backend** | Custom exceptions mapped to HTTP status codes | `exceptions.py`, `main.py` |
| **Backend** | Pydantic for all request/response and validation | `schemas.py`, routers |
| **Backend** | DB constraints (e.g. unique employee+date) for integrity | `models.py` |
| **Frontend** | Strict TypeScript; no `any`; shared types in `types/` | `tsconfig.json`, `src/types/` |
| **Frontend** | API base URL from env (`VITE_API_BASE_URL`) | `utils/constants.ts`, `.env.example` |
| **Frontend** | Centralized API client and error normalization | `services/api.ts` |
| **Frontend** | Loading, empty, and error states in UI | Components, hooks |
| **Frontend** | Confirm before destructive actions (delete, bulk mark) | `ConfirmDialog` usage |
| **Both** | `.env` in `.gitignore`; `.env.example` for required vars | Root and `frontend/` `.gitignore` |
| **Both** | No `console.log` / `print()` in production code paths | Grep-clean |
| **Deploy** | Frontend build uses env at build time (Vite) | Set `VITE_API_BASE_URL` on Vercel |
| **Deploy** | Backend CORS restricted to frontend origin(s) | `CORS_ORIGINS` in backend `.env` |

---

## How to Run Locally

### Prerequisites

- **Node.js 18+** and **npm** (or yarn)
- **Python 3.9+**
- **PostgreSQL 14+** (optional for local dev; you can use **SQLite** — see below)

### Option A: With PostgreSQL

**Backend**

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hrms_lite
CORS_ORIGINS=["http://localhost:3000"]
```

Create the DB (e.g. `createdb hrms_lite`), then:

```bash
uvicorn app.main:app --reload
```

Backend: **http://localhost:8000**

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env
```

In `frontend/.env` set:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Then:

```bash
npm run dev
```

Frontend: **http://localhost:3000**

### Option B: SQLite (no PostgreSQL installed)

In `backend/.env` use:

```env
DATABASE_URL=sqlite:///./hrms_lite.db
CORS_ORIGINS=["http://localhost:3000"]
```

Run backend and frontend as above. The app will create `backend/hrms_lite.db` on first run. No need to create a database manually.

### Quick checks

- **Health:** [http://localhost:8000/health](http://localhost:8000/health) → `{"status":"ok", ...}`
- **API docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **App:** [http://localhost:3000](http://localhost:3000)

---

## API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/health` | Liveness/readiness for deployment and reviewers. |
| `POST` | `/api/v1/employees` | Create employee (body: `employee_id`, `full_name`, `email`, `department`). |
| `GET`  | `/api/v1/employees` | List all. Optional query: `?search=...` (name, ID, or email). |
| `DELETE` | `/api/v1/employees/{id}` | Delete employee (and their attendance). |
| `POST` | `/api/v1/attendance` | Mark attendance (body: `employee_id`, `date`, `status`). |
| `GET`  | `/api/v1/attendance` | List attendance. Optional: `employee_id`, `from`, `to`, `departments` (array). |
| `GET`  | `/api/v1/dashboard` | Dashboard stats: total employees, today’s present/absent, recent activity. |

All JSON. Errors return a consistent shape (e.g. `{ "detail": "..." }` or validation details).

---

## Assumptions & Limitations

**Assumptions**

- Single admin user; no authentication (per requirements).
- Dates in **YYYY-MM-DD** (ISO 8601).
- Employee ID: alphanumeric, 3–20 chars, may include `_` or `-`.
- Department: one of a fixed set (Engineering, Product, Design, Marketing, Operations, HR, Finance, Sales).
- Attendance: one record per employee per day; date cannot be in the future.

**Limitations (by design / out of scope)**

- No user authentication or roles.
- No pagination (suited to small teams).
- No advanced reporting, email notifications, or data export.

---

## Notes for Reviewers

- **Health:** `GET /health` — use for deployment checks.
- **Duplicates:** Attendance is enforced unique by DB constraint `(employee_id, date)` plus service checks.
- **Cascade:** Deleting an employee removes all their attendance rows.
- **Errors:** Endpoints use appropriate HTTP status codes and a consistent JSON error format.
- **Versioning:** All app APIs live under `/api/v1`.
- **Search:** `GET /api/v1/employees?search=...` filters by name, employee ID, or email (case-insensitive).
- **Filters:** `GET /api/v1/attendance` supports `employee_id`, `from`, `to`, and `departments`.
- **UI:** Dashboard, tour, department dropdown/multiselect, loading/empty/error and confirmation dialogs are implemented for a complete, reviewable flow.

---

## Live Application & Repo

| Link | URL |
|------|-----|
| **Live frontend** | [Your Vercel URL] |
| **Live backend API** | [Your Render/Railway URL] |
| **Health check** | [Your Backend URL]/health |
| **GitHub repository** | [Your GitHub Repository Link] |

**Before you submit:** Deploy frontend and backend, set the frontend build env to your live API URL, replace the placeholders above, and do a full pass (add employee, search, mark attendance, filter, delete) on the live app to ensure nothing is broken.

---

## Deploy on Vercel

The frontend is ready to deploy on Vercel with minimal setup.

1. **Push the repo** to GitHub and import the project in [Vercel](https://vercel.com) (use the `frontend` folder as the root, or deploy from repo root with “Root Directory” set to `frontend`).
2. **Set the build env var** in Vercel → Project → Settings → Environment Variables:
   - **Name:** `VITE_API_BASE_URL`  
   - **Value:** your live backend URL (e.g. `https://your-app.onrender.com`) — no trailing slash.  
   - Apply to **Production** (and Preview if you want).
3. **Build:** Vercel detects Vite and runs `npm run build`; output is `dist`. The repo includes a `frontend/vercel.json` that sets framework and rewrites so the SPA is served correctly.
4. **Backend CORS:** On your backend (Render/Railway/etc.), set `CORS_ORIGINS` to include your Vercel URL (e.g. `["https://your-app.vercel.app"]`) so the browser allows requests.

After deploy, open the Vercel URL and run through: add employee, search, mark attendance, filter, delete — to confirm everything works against the live API.

---

## License

MIT
