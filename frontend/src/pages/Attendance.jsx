import { useEffect, useState } from "react";
import { getEmployees, markAttendance, getAttendance } from "../api";
import {
    Loader,
    EmptyState,
    ErrorBanner,
    SuccessBanner,
} from "../components/Shared";

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState("");
    const [attendanceData, setAttendanceData] = useState(null);

    const [loadingEmps, setLoadingEmps] = useState(true);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Mark form
    const [markDate, setMarkDate] = useState(new Date().toISOString().split("T")[0]);
    const [markStatus, setMarkStatus] = useState("Present");
    const [marking, setMarking] = useState(false);
    const [markError, setMarkError] = useState("");

    // Filters
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Fetch employees list
    useEffect(() => {
        (async () => {
            try {
                const res = await getEmployees();
                setEmployees(res.data);
            } catch {
                setError("Failed to load employees.");
            } finally {
                setLoadingEmps(false);
            }
        })();
    }, []);

    // Auto-clear success
    useEffect(() => {
        if (success) {
            const t = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(t);
        }
    }, [success]);

    // Fetch attendance when employee changes
    const fetchAttendance = async (empId, from, to) => {
        if (!empId) return;
        setLoadingRecords(true);
        setError("");
        try {
            const params = {};
            if (from) params.date_from = from;
            if (to) params.date_to = to;
            const res = await getAttendance(empId, params);
            setAttendanceData(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to load attendance.");
        } finally {
            setLoadingRecords(false);
        }
    };

    useEffect(() => {
        if (selectedEmp) fetchAttendance(selectedEmp, dateFrom, dateTo);
        else setAttendanceData(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEmp]);

    const handleFilter = () => {
        if (selectedEmp) fetchAttendance(selectedEmp, dateFrom, dateTo);
    };

    const handleClearFilter = () => {
        setDateFrom("");
        setDateTo("");
        if (selectedEmp) fetchAttendance(selectedEmp, "", "");
    };

    // Mark attendance
    const handleMark = async (e) => {
        e.preventDefault();
        setMarkError("");

        if (!selectedEmp) {
            setMarkError("Please select an employee first.");
            return;
        }

        setMarking(true);
        try {
            await markAttendance({
                employee_id: Number(selectedEmp),
                date: markDate,
                status: markStatus,
            });
            setSuccess(`Attendance marked: ${markStatus} on ${markDate}`);
            fetchAttendance(selectedEmp, dateFrom, dateTo);
        } catch (err) {
            setMarkError(err.response?.data?.detail || "Failed to mark attendance.");
        } finally {
            setMarking(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h2>Attendance</h2>
                <p>Track and manage daily attendance records</p>
            </div>

            <div className="page-body">
                {success && <SuccessBanner message={success} />}
                {error && <ErrorBanner message={error} />}

                {/* Employee Selector */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Select Employee</label>
                            {loadingEmps ? (
                                <Loader />
                            ) : employees.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                                    No employees found. Add employees first.
                                </p>
                            ) : (
                                <select
                                    className="form-control"
                                    value={selectedEmp}
                                    onChange={(e) => setSelectedEmp(e.target.value)}
                                    style={{ maxWidth: 400 }}
                                >
                                    <option value="">— Choose an employee —</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.full_name} ({emp.employee_id})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {selectedEmp && (
                    <>
                        {/* Mark Attendance Card */}
                        <div className="card" style={{ marginBottom: 20 }}>
                            <div className="card-header">
                                <h3>Mark Attendance</h3>
                            </div>
                            <div className="card-body">
                                {markError && <ErrorBanner message={markError} />}
                                <form onSubmit={handleMark}>
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label>Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={markDate}
                                                onChange={(e) => setMarkDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label>Status</label>
                                            <select
                                                className="form-control"
                                                value={markStatus}
                                                onChange={(e) => setMarkStatus(e.target.value)}
                                            >
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={marking}>
                                            {marking ? "Saving…" : "Mark Attendance"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Records Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3>
                                    Attendance Records
                                    {attendanceData && (
                                        <span
                                            style={{
                                                fontWeight: 400,
                                                fontSize: "0.82rem",
                                                color: "var(--text-secondary)",
                                                marginLeft: 10,
                                            }}
                                        >
                                            {attendanceData.total_present} present · {attendanceData.total_absent} absent
                                        </span>
                                    )}
                                </h3>
                            </div>

                            {/* Filter */}
                            <div style={{ padding: "16px 24px 0" }}>
                                <div className="filter-bar">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        placeholder="From"
                                    />
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        placeholder="To"
                                    />
                                    <button className="btn btn-primary btn-sm" onClick={handleFilter}>
                                        Filter
                                    </button>
                                    {(dateFrom || dateTo) && (
                                        <button className="btn btn-ghost btn-sm" onClick={handleClearFilter}>
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="card-body" style={{ paddingTop: 0 }}>
                                {loadingRecords ? (
                                    <Loader />
                                ) : !attendanceData || attendanceData.records.length === 0 ? (
                                    <EmptyState
                                        icon="📋"
                                        title="No attendance records"
                                        message="Mark attendance using the form above."
                                    />
                                ) : (
                                    <div className="table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.records.map((r) => (
                                                    <tr key={r.id}>
                                                        <td>{r.date}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${r.status === "Present" ? "present" : "absent"
                                                                    }`}
                                                            >
                                                                {r.status === "Present" ? "✓" : "✕"} {r.status}
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

                {!selectedEmp && !loadingEmps && employees.length > 0 && (
                    <EmptyState
                        icon="👆"
                        title="Select an employee"
                        message="Choose an employee above to view or manage their attendance."
                    />
                )}
            </div>
        </>
    );
}
