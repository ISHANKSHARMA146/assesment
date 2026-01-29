from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Attendance, Employee
from app.schemas import AttendanceCreate
from typing import List, Optional
from datetime import date


def create_attendance(db: Session, attendance_data: AttendanceCreate) -> Attendance:
    attendance = Attendance(
        employee_id=attendance_data.employee_id,
        date=attendance_data.date,
        status=attendance_data.status
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


def get_attendance_by_employee(
    db: Session, 
    employee_id: int, 
    from_date: Optional[date] = None, 
    to_date: Optional[date] = None
) -> List[Attendance]:
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if from_date:
        query = query.filter(Attendance.date >= from_date)
    if to_date:
        query = query.filter(Attendance.date <= to_date)
    
    return query.order_by(Attendance.date.desc()).all()


def get_all_attendance(
    db: Session, 
    from_date: Optional[date] = None, 
    to_date: Optional[date] = None,
    departments: Optional[List[str]] = None
) -> List[Attendance]:
    query = db.query(Attendance)
    
    if from_date:
        query = query.filter(Attendance.date >= from_date)
    if to_date:
        query = query.filter(Attendance.date <= to_date)
    
    if departments and len(departments) > 0:
        query = query.join(Employee).filter(Employee.department.in_(departments))
    
    return query.order_by(Attendance.date.desc()).all()


def check_duplicate_attendance(db: Session, employee_id: int, date: date) -> bool:
    attendance = db.query(Attendance).filter(
        and_(Attendance.employee_id == employee_id, Attendance.date == date)
    ).first()
    return attendance is not None
