from pydantic import BaseModel, EmailStr, Field, field_validator, field_serializer
from datetime import date, datetime
from typing import Optional
from app.models import AttendanceStatus


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=3, max_length=20)
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=2, max_length=50)
    
    @field_validator('employee_id')
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Employee ID must be alphanumeric (may include _ or -)')
        return v


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime
    
    @field_serializer('created_at')
    def serialize_created_at(self, value: datetime) -> str:
        return value.isoformat() if value else ""
    
    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus
    
    @field_validator('date')
    @classmethod
    def validate_date(cls, v: date) -> date:
        if v > date.today():
            raise ValueError('Date cannot be in the future')
        return v


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str
    created_at: datetime
    
    @field_serializer('date')
    def serialize_date(self, value: date) -> str:
        return value.isoformat() if value else ""
    
    @field_serializer('created_at')
    def serialize_created_at(self, value: datetime) -> str:
        return value.isoformat() if value else ""
    
    class Config:
        from_attributes = True


class AttendanceQuery(BaseModel):
    employee_id: Optional[int] = None
    from_date: Optional[date] = None
    to_date: Optional[date] = None


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
