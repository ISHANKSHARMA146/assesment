from sqlalchemy.orm import Session
from typing import Optional, List
from app.repositories import attendance_repo, employee_repo
from app.models import Attendance
from app.schemas import AttendanceCreate
from app.exceptions import (
    DuplicateAttendanceError, 
    InvalidDateError, 
    EmployeeNotFoundError
)
from app.utils.logger import logger
from datetime import date


def mark_attendance(db: Session, attendance_data: AttendanceCreate) -> Attendance:
    employee = employee_repo.get_employee_by_id(db, attendance_data.employee_id)
    if not employee:
        raise EmployeeNotFoundError(f"Employee with ID {attendance_data.employee_id} not found")
    
    if attendance_data.date > date.today():
        raise InvalidDateError("Date cannot be in the future")
    
    is_duplicate = attendance_repo.check_duplicate_attendance(
        db, attendance_data.employee_id, attendance_data.date
    )
    if is_duplicate:
        raise DuplicateAttendanceError(
            f"Attendance already marked for employee {attendance_data.employee_id} on {attendance_data.date}"
        )
    
    attendance = attendance_repo.create_attendance(db, attendance_data)
    logger.info(f"Attendance marked: Employee {attendance_data.employee_id}, Date {attendance_data.date}, Status {attendance_data.status}")
    return attendance


def get_attendance(
    db: Session, 
    employee_id: Optional[int] = None, 
    from_date: Optional[date] = None, 
    to_date: Optional[date] = None,
    departments: Optional[List[str]] = None
) -> list[Attendance]:
    if employee_id:
        return attendance_repo.get_attendance_by_employee(db, employee_id, from_date, to_date)
    return attendance_repo.get_all_attendance(db, from_date, to_date, departments)
