# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance.

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Frontend  | React 19 + Vite               |
| Backend   | Python FastAPI + SQLAlchemy    |
| Database  | PostgreSQL                     |
| Styling   | Vanilla CSS (custom design system) |

## Features

### Core
- **Employee Management** – Add, view, and delete employees with unique ID and email validation
- **Attendance Tracking** – Mark daily attendance (Present/Absent) per employee
- **Attendance Records** – View attendance history with date range filtering

### Bonus
- **Dashboard** – Summary cards showing total employees, present/absent today, department count
- **Department Breakdown** – Table showing employee count per department
- **Present/Absent Totals** – Per-employee attendance summary (total present/absent days)
- **Date Filtering** – Filter attendance records by date range

## Project Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── config.py        # Environment-based configuration
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # Employee & Attendance models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   └── routers/
│   │       ├── employees.py # Employee CRUD endpoints
│   │       ├── attendance.py# Attendance endpoints
│   │       └── dashboard.py # Dashboard summary endpoint
│   ├── .env                 # Database credentials
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/index.js     # Axios API wrapper
    │   ├── components/      # Sidebar, Shared UI components
    │   ├── pages/           # Dashboard, Employees, Attendance
    │   ├── App.jsx          # Root app with routing
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Design system & global styles
    ├── .env                 # API base URL
    └── package.json
```

## Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL running on port 5433

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`.

### Environment Variables

**Backend (`backend/.env`)**
```
DB_HOST=localhost
DB_PORT=5433
DB_NAME=project
DB_USER=postgres
DB_PASSWORD=newpassword
```

**Frontend (`frontend/.env`)**
```
VITE_API_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint                      | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/api/employees/`             | List all employees                   |
| POST   | `/api/employees/`             | Create a new employee                |
| GET    | `/api/employees/{id}`         | Get employee by ID                   |
| DELETE | `/api/employees/{id}`         | Delete employee (cascades attendance)|
| POST   | `/api/attendance/`            | Mark attendance for a date           |
| GET    | `/api/attendance/{emp_id}`    | Get attendance records (filterable)  |
| GET    | `/api/dashboard/`             | Dashboard summary stats              |

## Assumptions & Limitations

- Single admin user (no authentication)
- Employee table auto-creates on server startup (no migrations needed)
- Attendance is unique per employee per date (no duplicate marking)
- Leave management, payroll, and advanced HR features are out of scope
