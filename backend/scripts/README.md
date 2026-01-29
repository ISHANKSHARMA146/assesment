# Backend scripts

## Seed fake data (10 employees + attendance)

**From backend directory:**
```bash
cd backend
python scripts/seed_data.py
```

**From project root:**
```bash
python backend/scripts/seed_data.py
```

- Creates 10 employees: EMP001–EMP010 with realistic names, unique emails, and departments.
- Adds attendance for the last 14 days (mix of Present/Absent).
- Uses `DATABASE_URL` from `backend/.env`. To populate your **deployed** DB (e.g. Render), set `DATABASE_URL` in `backend/.env` to your production URL and run the same command from your machine.
- Safe to run multiple times: skips employees that already exist (no duplicates).
