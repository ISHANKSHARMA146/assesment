# HRMS Lite

Small HR app: manage employees and track daily attendance. Add people, mark present/absent, search and filter. Built as a full-stack take-home with FastAPI and React.

**Live app:** [Your Vercel URL] · **API:** [Your Backend URL] · **Repo:** [Your GitHub Link]

---

## What’s in it

- **Employees** — Add (ID, name, email, department from a dropdown), view list, search by name/ID/email, delete. Departments are fixed so filtering stays consistent.
- **Attendance** — Mark present/absent per employee per day; view history with date range and department filters (multiselect).
- **Dashboard** — Headcount, today’s present/absent, recent activity, quick links to add employee or mark attendance.
- **Tour** — Optional first-time walkthrough; “Tour” in the nav restarts it.
- **UX** — Loading/empty/error states, toasts, confirm before delete or bulk mark.

Backend is layered (routers → services → repositories), versioned at `/api/v1`, with a health check at `/health`. Frontend uses React + TypeScript, custom hooks for data, and a single API client with normalized errors. Config and secrets live in env; no hardcoded URLs or credentials.

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

JSON in/out. Errors use a consistent `detail` (or validation) shape.

---

## Assumptions

- Single admin; no auth (per spec).
- Dates ISO `YYYY-MM-DD`; attendance one row per employee per day; no future dates.
- Employee ID 3–20 chars, alphanumeric + `_`/`-`. Department from a fixed set (Engineering, Product, HR, Sales, Marketing, Design, Operations, Finance).

---

## Out of scope (on purpose)

No auth, no pagination (aimed at small teams), no reporting/export/notifications.

---

## For reviewers

- **Health:** `GET /health` for uptime checks.
- **Duplicates:** Attendance unique on `(employee_id, date)` in DB + service checks.
- **Cascade:** Delete employee → attendance rows removed.
- **Search/filters:** Employees `?search=`, attendance `employee_id`, `from`, `to`, `departments`.
- **Errors:** Same JSON error shape and sensible status codes across endpoints.

Setup, run locally, seed data, and deploy steps are in **[LOCAL_SETUP.md](LOCAL_SETUP.md)**.

---

## License

MIT
