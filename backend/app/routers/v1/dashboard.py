from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.database import get_db
from app.models import Employee, Attendance, AttendanceStatus
from pydantic import BaseModel
from typing import List

router = APIRouter()


class DashboardStats(BaseModel):
    total_employees: int
    today_present: int
    today_absent: int
    today_total: int
    recent_activity: List[dict]


@router.get("")
def get_dashboard_stats(db: Session = Depends(get_db)) -> DashboardStats:
    today = date.today()
    
    total_employees = db.query(func.count(Employee.id)).scalar() or 0
    
    today_attendance = db.query(Attendance).filter(Attendance.date == today).all()
    today_present = sum(1 for a in today_attendance if a.status == AttendanceStatus.PRESENT)
    today_absent = sum(1 for a in today_attendance if a.status == AttendanceStatus.ABSENT)
    today_total = len(today_attendance)
    
    recent_activity = (
        db.query(Attendance)
        .order_by(Attendance.created_at.desc())
        .limit(10)
        .all()
    )
    
    activity_list = []
    for att in recent_activity:
        employee = db.query(Employee).filter(Employee.id == att.employee_id).first()
        activity_list.append({
            "id": att.id,
            "employee_id": att.employee_id,
            "employee_name": employee.full_name if employee else "Unknown",
            "employee_employee_id": employee.employee_id if employee else "",
            "date": att.date.isoformat(),
            "status": att.status.value,
            "created_at": att.created_at.isoformat() if att.created_at else None,
        })
    
    return DashboardStats(
        total_employees=total_employees,
        today_present=today_present,
        today_absent=today_absent,
        today_total=today_total,
        recent_activity=activity_list
    )
