import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
});

/* ── Employees ───────────────────────────────────────── */

export const getEmployees = () => API.get("/api/employees/");

export const createEmployee = (data) => API.post("/api/employees/", data);

export const deleteEmployee = (id) => API.delete(`/api/employees/${id}`);

export const getEmployee = (id) => API.get(`/api/employees/${id}`);

/* ── Attendance ──────────────────────────────────────── */

export const markAttendance = (data) => API.post("/api/attendance/", data);

export const getAttendance = (employeeId, params = {}) =>
    API.get(`/api/attendance/${employeeId}`, { params });

export const getRecentAttendance = () => API.get("/api/attendance/recent");

/* ── Dashboard ───────────────────────────────────────── */

export const getDashboard = () => API.get("/api/dashboard/");

export default API;
