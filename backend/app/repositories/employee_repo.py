from sqlalchemy.orm import Session
from app.models import Employee
from app.schemas import EmployeeCreate
from typing import List, Optional


def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
    employee = Employee(
        employee_id=employee_data.employee_id,
        full_name=employee_data.full_name,
        email=employee_data.email,
        department=employee_data.department
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def get_all_employees(db: Session) -> List[Employee]:
    return db.query(Employee).all()


def get_employee_by_id(db: Session, id: int) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.id == id).first()


def get_employee_by_employee_id(db: Session, employee_id: str) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def get_employee_by_email(db: Session, email: str) -> Optional[Employee]:
    return db.query(Employee).filter(Employee.email == email).first()


def delete_employee(db: Session, id: int) -> bool:
    employee = get_employee_by_id(db, id)
    if employee:
        db.delete(employee)
        db.commit()
        return True
    return False


def search_employees(db: Session, search_query: str) -> List[Employee]:
    search_term = f"%{search_query.lower()}%"
    return db.query(Employee).filter(
        (Employee.full_name.ilike(search_term)) |
        (Employee.employee_id.ilike(search_term)) |
        (Employee.email.ilike(search_term))
    ).all()
