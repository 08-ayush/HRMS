from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Employee, Attendance
from app.schemas import DashboardResponse, DepartmentCount

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Return high-level dashboard stats."""
    today = date.today()

    total_employees = db.query(func.count(Employee.id)).scalar() or 0

    present_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Present")
        .scalar()
        or 0
    )

    absent_today = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.date == today, Attendance.status == "Absent")
        .scalar()
        or 0
    )

    dept_rows = (
        db.query(Employee.department, func.count(Employee.id))
        .group_by(Employee.department)
        .order_by(Employee.department)
        .all()
    )
    departments = [
        DepartmentCount(department=d, count=c) for d, c in dept_rows
    ]

    return DashboardResponse(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        departments=departments,
    )
