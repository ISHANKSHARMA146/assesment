from sqlalchemy.orm import Session
from app.repositories import employee_repo
from app.models import Employee
from app.schemas import EmployeeCreate
from app.exceptions import DuplicateEmployeeError, EmployeeNotFoundError
from app.utils.logger import logger


def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
    existing_by_id = employee_repo.get_employee_by_employee_id(db, employee_data.employee_id)
    if existing_by_id:
        raise DuplicateEmployeeError(f"Employee ID '{employee_data.employee_id}' already exists")
    
    existing_by_email = employee_repo.get_employee_by_email(db, employee_data.email)
    if existing_by_email:
        raise DuplicateEmployeeError(f"Email '{employee_data.email}' already exists")
    
    employee = employee_repo.create_employee(db, employee_data)
    logger.info(f"Employee created: {employee.employee_id}")
    return employee


def get_all_employees(db: Session) -> list[Employee]:
    return employee_repo.get_all_employees(db)


def get_employee_by_id(db: Session, id: int) -> Employee:
    employee = employee_repo.get_employee_by_id(db, id)
    if not employee:
        raise EmployeeNotFoundError(f"Employee with ID {id} not found")
    return employee


def delete_employee(db: Session, id: int) -> None:
    employee = employee_repo.get_employee_by_id(db, id)
    if not employee:
        raise EmployeeNotFoundError(f"Employee with ID {id} not found")
    
    employee_repo.delete_employee(db, id)
    logger.info(f"Employee deleted: {employee.employee_id}")


def search_employees(db: Session, search_query: str) -> list[Employee]:
    if not search_query or not search_query.strip():
        return employee_repo.get_all_employees(db)
    return employee_repo.search_employees(db, search_query.strip())
