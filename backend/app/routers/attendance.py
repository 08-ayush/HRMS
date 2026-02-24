from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from app.database import get_db
from app.models import Attendance, Employee
from app.schemas import (
    AttendanceCreate,
    AttendanceResponse,
    EmployeeAttendanceSummary,
    EmployeeResponse,
    RecentAttendanceRecord,
)

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.get("/recent", response_model=list[RecentAttendanceRecord])
def get_recent_attendance(db: Session = Depends(get_db)):
    """Return the 10 most recent attendance records with employee names."""
    rows = (
        db.query(Attendance, Employee)
        .join(Employee, Attendance.employee_id == Employee.id)
        .order_by(Attendance.date.desc(), Attendance.id.desc())
        .limit(10)
        .all()
    )
    return [
        RecentAttendanceRecord(
            id=att.id,
            employee_name=emp.full_name,
            employee_code=emp.employee_id,
            date=att.date,
            status=att.status,
        )
        for att, emp in rows
    ]


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee on a given date."""
    # Verify employee exists
    emp = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    # Check duplicate
    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == payload.employee_id,
            Attendance.date == payload.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance for this employee on {payload.date} already exists.",
        )

    record = Attendance(**payload.model_dump())
    db.add(record)
    try:
        db.commit()
        db.refresh(record)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate attendance record.",
        )
    return record


@router.get("/{employee_id}", response_model=EmployeeAttendanceSummary)
def get_attendance(
    employee_id: int,
    date_from: Optional[date] = Query(None, description="Filter start date"),
    date_to: Optional[date] = Query(None, description="Filter end date"),
    db: Session = Depends(get_db),
):
    """Get attendance records for a specific employee with optional date filtering."""
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)

    if date_from:
        query = query.filter(Attendance.date >= date_from)
    if date_to:
        query = query.filter(Attendance.date <= date_to)

    records = query.order_by(Attendance.date.desc()).all()

    total_present = sum(1 for r in records if r.status == "Present")
    total_absent = sum(1 for r in records if r.status == "Absent")

    return EmployeeAttendanceSummary(
        employee=emp,
        total_present=total_present,
        total_absent=total_absent,
        records=records,
    )
