# HRMS Lite

A lightweight HR app for managing employees and daily attendance. Built as a full-stack take-home (FastAPI + React).

**Live app:** [Your Vercel URL] · **Repo:** [github.com/ISHANKSHARMA146/assesment](https://github.com/ISHANKSHARMA146/assesment)

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

- **Employee management** — Add employee (ID, name, email, **department dropdown**), view list, delete. Department is a fixed dropdown so data stays consistent and filters work cleanly.
- **Attendance** — Mark present/absent per employee per date; view history. Filter by **date range** and **department(s)** (multiselect).
- **REST API** — All operations under `/api/v1`; Pydantic validation; custom exceptions → HTTP codes; consistent error shape.
- **UI** — Clean layout, loading spinners, empty states, error toasts, confirm before delete.

### Extra (bonus + polish)

- **Dashboard** — Total employees, today’s present/absent, recent activity, quick actions (e.g. “Add employee” → opens form on Employees page).
- **Employee search** — `GET /api/v1/employees?search=...` (name, ID, or email); search box in the UI.
- **Attendance filters** — Date range + department multiselect in the API and in the history view.
- **Onboarding tour** — First-time walkthrough; “Tour” in the nav to restart.
- **Health check** — `GET /health` for deployment/reviewer checks.

### How it’s built

- **Backend:** Routers → Services → Repositories (no DB logic in routes). API versioning, structured logging, DB unique constraint on `(employee_id, date)` for attendance, cascade delete for employees.
- **Frontend:** React + TypeScript, custom hooks for data, single API client with normalized errors. Config from env (`VITE_API_BASE_URL`); no hardcoded URLs.

---

## Stack

| | |
|---|--|
| **Frontend** | React 18, TypeScript, Tailwind, Vite |
| **Backend** | FastAPI, SQLAlchemy |
| **DB** | PostgreSQL (prod) or SQLite (local) |
| **Deploy** | Vercel (frontend), Render/Railway (backend) |

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

- **Try the live app:** Add an employee, search, mark attendance, filter by date/department, delete — all flows should work.
- **Health:** `GET /health` for uptime.
- **Duplicates:** Attendance unique on `(employee_id, date)` in DB + service.
- **Cascade:** Deleting an employee removes their attendance.
- **Errors:** Same JSON error shape and sensible status codes.

**Setup, run locally, seed data, deploy:** see **[LOCAL_SETUP.md](LOCAL_SETUP.md)**.

---

## License

MIT
