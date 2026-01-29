from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.schemas import AttendanceCreate, AttendanceResponse, AttendanceQuery
from app.services import attendance_service
from app.exceptions import (
    DuplicateAttendanceError, 
    InvalidDateError, 
    EmployeeNotFoundError
)

router = APIRouter()


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)) -> AttendanceResponse:
    try:
        return attendance_service.mark_attendance(db, attendance)
    except (DuplicateAttendanceError, InvalidDateError, EmployeeNotFoundError) as e:
        status_code = status.HTTP_400_BAD_REQUEST
        if isinstance(e, EmployeeNotFoundError):
            status_code = status.HTTP_404_NOT_FOUND
        raise HTTPException(
            status_code=status_code,
            detail=str(e)
        )


@router.get("", response_model=List[AttendanceResponse])
def get_attendance(
    employee_id: Optional[int] = Query(None),
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    departments: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
) -> List[AttendanceResponse]:
    return attendance_service.get_attendance(db, employee_id, from_date, to_date, departments)
