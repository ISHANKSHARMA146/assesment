"""
Standalone seed script: only needs psycopg2-binary and python-dotenv.
Use this when the full app (pydantic/SQLAlchemy) won't install on your Python (e.g. 3.13).

  cd backend
  pip install python-dotenv psycopg2-binary
  python scripts/seed_standalone.py

Uses DATABASE_URL from backend/.env. Safe to run multiple times (skips existing).
"""

import os
import random
from pathlib import Path
from datetime import date, timedelta

BACKEND_DIR = Path(__file__).resolve().parent.parent
os.chdir(BACKEND_DIR)

try:
    from dotenv import load_dotenv
    load_dotenv(BACKEND_DIR / ".env")
except ImportError:
    pass

try:
    import psycopg2
except ImportError:
    print("Install: pip install psycopg2-binary python-dotenv")
    raise

DEPARTMENTS = [
    "Engineering", "Product", "HR", "Sales",
    "Marketing", "Design", "Operations", "Finance",
]
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


def main():
    random.seed(42)
    url = os.getenv("DATABASE_URL")
    if not url or not url.startswith("postgresql"):
        print("Set DATABASE_URL in backend/.env to your PostgreSQL URL.")
        return

    print("HRMS Lite – standalone seed (PostgreSQL)")
    print("Using DATABASE_URL from backend/.env\n")

    conn = psycopg2.connect(url)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # 1. Employees
        print("1. Seeding employees (10)...")
        emp_ids = {}  # employee_id -> db id
        for eid, full_name, email_local in FAKE_EMPLOYEES:
            cur.execute("SELECT id FROM employees WHERE employee_id = %s", (eid,))
            row = cur.fetchone()
            if row:
                emp_ids[eid] = row[0]
                print(f"  Skip (exists): {eid} {full_name}")
                continue
            dept = random.choice(DEPARTMENTS)
            email = f"{email_local}@company.com"
            cur.execute(
                """INSERT INTO employees (employee_id, full_name, email, department)
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (eid, full_name, email, dept),
            )
            pk = cur.fetchone()[0]
            emp_ids[eid] = pk
            print(f"  Created: {eid} {full_name} ({dept}) {email}")
        conn.commit()

        # 2. Attendance (last 14 days)
        print("\n2. Seeding attendance (last 14 days)...")
        today = date.today()
        count = 0
        for eid, _, _ in FAKE_EMPLOYEES:
            pk = emp_ids[eid]
            for d in range(14):
                att_date = today - timedelta(days=d)
                status = "PRESENT" if random.random() < 0.85 else "ABSENT"
                cur.execute(
                    """INSERT INTO attendance (employee_id, date, status)
                       VALUES (%s, %s, %s::attendancestatus)
                       ON CONFLICT (employee_id, date) DO NOTHING""",
                    (pk, att_date, status),
                )
                if cur.rowcount > 0:
                    count += 1
        conn.commit()
        print(f"  Added {count} attendance rows.")
        print("\nDone.")
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
