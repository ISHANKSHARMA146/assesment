# Local setup & deployment

Everything you need to run HRMS Lite locally, seed data, and deploy.

---

## Prerequisites

- **Node.js 18+** and npm (or yarn)
- **Python 3.9+**
- **PostgreSQL 14+** (optional; you can use SQLite for local dev)

---

## Run locally

### Option A — PostgreSQL

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

In `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Then:

```bash
npm run dev
```

Frontend: **http://localhost:3000**

---

### Option B — SQLite (no PostgreSQL)

In `backend/.env` use:

```env
DATABASE_URL=sqlite:///./hrms_lite.db
CORS_ORIGINS=["http://localhost:3000"]
```

Run backend and frontend as in Option A. The app creates `backend/hrms_lite.db` on first run.

---

## Quick checks

- **Health:** http://localhost:8000/health → `{"status":"ok", ...}`
- **API docs:** http://localhost:8000/docs
- **App:** http://localhost:3000

---

## Seed fake data (10 employees + attendance)

From **backend** (or project root with `python backend/scripts/seed_data.py`):

```bash
cd backend
python scripts/seed_data.py
```

Creates 10 employees (EMP001–EMP010) and attendance for the last 14 days. Uses `DATABASE_URL` from `backend/.env`. To populate a **deployed** DB, set `DATABASE_URL` in `backend/.env` to your production URL and run the same command from your machine.

---

## Deploy frontend (Vercel)

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com). Set **Root Directory** to `frontend`.
2. In Vercel → Project → Settings → Environment Variables, add:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** your live backend URL (e.g. `https://your-app.onrender.com`) — no trailing slash.
   - Apply to Production (and Preview if you want).
3. Deploy. Vercel uses the repo’s `frontend/vercel.json` (build, output, SPA rewrites).
4. On your backend host (Render/Railway etc.), set `CORS_ORIGINS` to include your Vercel URL (e.g. `["https://your-app.vercel.app"]`).

---

## Deploy backend (Render / Railway)

- Use a **Web Service**; build command and start command depend on the host (e.g. `pip install -r requirements.txt` and `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- Add a **PostgreSQL** database and set `DATABASE_URL` in the service env.
- Set `CORS_ORIGINS` to your frontend URL(s) (e.g. Vercel).

---

## Before you submit

1. Deploy frontend and backend; set `VITE_API_BASE_URL` in the frontend build env to your live API URL.
2. Replace the placeholder URLs in **README.md** (live frontend, backend, repo).
3. Test the live app end-to-end: add employee, search, mark attendance, filter, delete.
4. Ensure the repo is public or access-enabled for reviewers.

---

## Troubleshooting

**Backend won’t start**

- Port 8000 in use? Change port or stop the other process.
- `.env` present in `backend/`? Copy from `.env.example` and fill values.
- Venv activated? `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux).

**Frontend can’t reach backend**

- Backend running on 8000? Check http://localhost:8000/health.
- `frontend/.env` has `VITE_API_BASE_URL=http://localhost:8000`?
- CORS: backend `CORS_ORIGINS` must include your frontend origin (e.g. `http://localhost:3000`).
