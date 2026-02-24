from datetime import date, datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ── Enums ──────────────────────────────────────────────

class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


# ── Employee Schemas ───────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Attendance Schemas ─────────────────────────────────

class AttendanceCreate(BaseModel):
    employee_id: int = Field(..., description="Internal DB id of the employee")
    date: date
    status: AttendanceStatus


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str

    model_config = {"from_attributes": True}


class EmployeeAttendanceSummary(BaseModel):
    employee: EmployeeResponse
    total_present: int
    total_absent: int
    records: List[AttendanceResponse]


# ── Dashboard Schemas ──────────────────────────────────

class DepartmentCount(BaseModel):
    department: str
    count: int


class DashboardResponse(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    departments: List[DepartmentCount]


class RecentAttendanceRecord(BaseModel):
    id: int
    employee_name: str
    employee_code: str
    date: date
    status: str
