from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas import EmployeeCreate, EmployeeResponse
from app.services import employee_service
from app.exceptions import EmployeeNotFoundError, DuplicateEmployeeError

router = APIRouter()


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)) -> EmployeeResponse:
    try:
        return employee_service.create_employee(db, employee)
    except DuplicateEmployeeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("", response_model=List[EmployeeResponse])
def get_employees(
    search: Optional[str] = Query(None, description="Search employees by name, ID, or email"),
    db: Session = Depends(get_db)
) -> List[EmployeeResponse]:
    if search:
        return employee_service.search_employees(db, search)
    return employee_service.get_all_employees(db)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(id: int, db: Session = Depends(get_db)) -> None:
    try:
        employee_service.delete_employee(db, id)
    except EmployeeNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
