import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getRecentAttendance } from "../api";
import { Loader, ErrorBanner, EmptyState } from "../components/Shared";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [dashRes, recentRes] = await Promise.all([
                getDashboard(),
                getRecentAttendance(),
            ]);
            setData(dashRes.data);
            setRecent(recentRes.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="page-body"><Loader /></div>;

    return (
        <>
            <div className="page-body">
                {error && <ErrorBanner message={error} onRetry={fetchData} />}

                {data && (
                    <>
                        {/* ── Two-column sections ── */}
                        <div className="dashboard-sections">
                            {/* ── Employee Management ── */}
                            <div>
                                <h3 className="section-title">Employee Management</h3>
                                <div className="action-cards">
                                    <div className="action-card" onClick={() => navigate("/employees")}>
                                        <div className="card-icon blue">👥</div>
                                        <span className="card-title">Total Employees</span>
                                        <span className="card-value">{data.total_employees}</span>
                                    </div>
                                    <div className="action-card" onClick={() => navigate("/employees")}>
                                        <div className="card-icon green">➕</div>
                                        <span className="card-title">Add Employee</span>
                                        <span className="card-subtitle">New Employee</span>
                                    </div>
                                    <div className="action-card" onClick={() => navigate("/employees")}>
                                        <div className="card-icon purple">📋</div>
                                        <span className="card-title">Manage Employees</span>
                                        <span className="card-subtitle">View & Delete</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Attendance Tracking ── */}
                            <div>
                                <h3 className="section-title">Attendance Tracking</h3>
                                <div className="action-cards">
                                    <div className="action-card" onClick={() => navigate("/attendance")}>
                                        <div className="card-icon teal">✔</div>
                                        <span className="card-title">Mark Attendance</span>
                                        <span className="card-subtitle">Mark Present / Absent</span>
                                    </div>
                                    <div className="action-card">
                                        <div className="card-icon orange">📅</div>
                                        <span className="card-title">Today's Attendance</span>
                                        <span className="card-subtitle">
                                            {data.present_today} Present / {data.absent_today} Absent
                                        </span>
                                    </div>
                                    <div className="action-card" onClick={() => navigate("/attendance")}>
                                        <div className="card-icon blue">📄</div>
                                        <span className="card-title">View Records</span>
                                        <span className="card-subtitle">Attendance History</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Recent Attendance Table ── */}
                        <div className="card">
                            <div className="card-header">
                                <h3>Recent Attendance</h3>
                                <button className="btn-link" onClick={() => navigate("/attendance")}>
                                    View All →
                                </button>
                            </div>
                            <div className="card-body" style={{ padding: 0 }}>
                                {recent.length === 0 ? (
                                    <EmptyState
                                        icon="📋"
                                        title="No attendance records yet"
                                        message="Mark attendance to see records here."
                                    />
                                ) : (
                                    <div className="table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Employee</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recent.map((r) => (
                                                    <tr key={r.id}>
                                                        <td>{r.employee_name}</td>
                                                        <td>{r.date}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${r.status === "Present" ? "present" : "absent"
                                                                    }`}
                                                            >
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
