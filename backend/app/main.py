from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routers.v1 import health, employees, attendance, dashboard
from app.exceptions import (
    HRMSException,
    EmployeeNotFoundError,
    DuplicateEmployeeError,
    DuplicateAttendanceError,
    InvalidDateError
)
from app.utils.logger import logger
from app.database import init_db

app = FastAPI(title="HRMS Lite API", version="1.0.0")

cors_origins_list = settings.cors_origins if isinstance(settings.cors_origins, list) else [settings.cors_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


@app.exception_handler(HRMSException)
async def hrms_exception_handler(request: Request, exc: HRMSException):
    status_code = 400
    if isinstance(exc, EmployeeNotFoundError):
        status_code = 404
    
    return JSONResponse(
        status_code=status_code,
        content={"detail": str(exc)}
    )


@app.on_event("startup")
async def startup_event():
    init_db()
    logger.info("HRMS Lite API started")


app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(dashboard.router, prefix=settings.api_v1_prefix + "/dashboard", tags=["dashboard"])
app.include_router(employees.router, prefix=settings.api_v1_prefix + "/employees", tags=["employees"])
app.include_router(attendance.router, prefix=settings.api_v1_prefix + "/attendance", tags=["attendance"])
