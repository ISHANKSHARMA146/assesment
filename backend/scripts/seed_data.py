"""
Seed script: creates 10 fake employees and optional attendance records.
Run from backend directory: python scripts/seed_data.py
Or from project root: python backend/scripts/seed_data.py

Uses DATABASE_URL from backend/.env (works locally or against deployed DB).
"""

import os
import sys
from pathlib import Path
from datetime import date, timedelta
import random

# Ensure backend is on path and .env is loaded (works from any cwd)
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
os.chdir(BACKEND_DIR)

try:
    from dotenv import load_dotenv
    load_dotenv(BACKEND_DIR / ".env")
except ImportError:
    pass

from app.database import SessionLocal, init_db
from app.models import Employee, Attendance, AttendanceStatus


# Same departments as frontend (keep in sync with DEPARTMENT_OPTIONS)
DEPARTMENTS = [
    "Engineering",
    "Product",
    "HR",
    "Sales",
    "Marketing",
    "Design",
    "Operations",
    "Finance",
]

# 10 fake users: (employee_id, full_name, email_suffix for uniqueness)
FAKE_EMPLOYEES = [
    ("EMP001", "Alex Chen", "alex.chen"),
    ("EMP002", "Jordan Smith", "jordan.smith"),
    ("EMP003", "Sam Williams", "sam.williams"),
    ("EMP004", "Riley Davis", "riley.davis"),
    ("EMP005", "Morgan Taylor", "morgan.taylor"),
    ("EMP006", "Casey Brown", "casey.brown"),
    ("EMP007", "Jamie Lee", "jamie.lee"),
    ("EMP008", "Quinn Martinez", "quinn.martinez"),
    ("EMP009", "Skyler Johnson", "skyler.johnson"),
    ("EMP010", "Taylor Wilson", "taylor.wilson"),
]


def seed_employees(db, domain: str = "company.com") -> list[Employee]:
    """Create 10 employees if they don't exist. Returns created or existing."""
    created = []
    for employee_id, full_name, email_local in FAKE_EMPLOYEES:
        existing = db.query(Employee).filter(Employee.employee_id == employee_id).first()
        if existing:
            print(f"  Skip (exists): {employee_id} {full_name}")
            created.append(existing)
            continue
        email = f"{email_local}@{domain}"
        department = random.choice(DEPARTMENTS)
        emp = Employee(
            employee_id=employee_id,
            full_name=full_name,
            email=email,
            department=department,
        )
        db.add(emp)
        db.commit()
        db.refresh(emp)
        created.append(emp)
        print(f"  Created: {employee_id} {full_name} ({department}) {email}")
    return created


def seed_attendance(db, employees: list[Employee], days_back: int = 14) -> None:
    """Add attendance for the last `days_back` days (mix of Present/Absent)."""
    today = date.today()
    for emp in employees:
        for d in range(days_back):
            att_date = today - timedelta(days=d)
            existing = (
                db.query(Attendance)
                .filter(Attendance.employee_id == emp.id, Attendance.date == att_date)
                .first()
            )
            if existing:
                continue
            # ~85% present, 15% absent
            status = AttendanceStatus.PRESENT if random.random() < 0.85 else AttendanceStatus.ABSENT
            att = Attendance(employee_id=emp.id, date=att_date, status=status)
            db.add(att)
        db.commit()
    print(f"  Added attendance for last {days_back} days for {len(employees)} employees.")


def main() -> None:
    random.seed(42)  # Reproducible fake data
    print("HRMS Lite – seed data")
    print("Using DATABASE_URL from backend/.env")
    init_db()
    db = SessionLocal()
    try:
        print("\n1. Seeding employees (10)...")
        employees = seed_employees(db)
        print("\n2. Seeding attendance (last 14 days)...")
        seed_attendance(db, employees, days_back=14)
        print("\nDone.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
