import { useEffect, useState } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../api";
import {
    Loader,
    EmptyState,
    ErrorBanner,
    SuccessBanner,
    Modal,
    ConfirmModal,
} from "../components/Shared";

const initialForm = { employee_id: "", full_name: "", email: "", department: "" };

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchEmployees = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getEmployees();
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to load employees.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Auto-clear success
    useEffect(() => {
        if (success) {
            const t = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(t);
        }
    }, [success]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        // Client-side validation
        if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
            setFormError("All fields are required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setFormError("Please enter a valid email address.");
            return;
        }

        setSubmitting(true);
        try {
            await createEmployee(form);
            setSuccess("Employee added successfully!");
            setForm(initialForm);
            setShowAdd(false);
            fetchEmployees();
        } catch (err) {
            setFormError(err.response?.data?.detail || "Failed to add employee.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteEmployee(deleteTarget.id);
            setSuccess(`Employee "${deleteTarget.full_name}" deleted.`);
            setDeleteTarget(null);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete employee.");
            setDeleteTarget(null);
        }
    };

    return (
        <>
            <div className="page-header">
                <h2>Employees</h2>
                <p>Manage your team members</p>
            </div>

            <div className="page-body">
                {success && <SuccessBanner message={success} />}
                {error && <ErrorBanner message={error} onRetry={fetchEmployees} />}

                <div className="card">
                    <div className="card-header">
                        <h3>All Employees ({employees.length})</h3>
                        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                            + Add Employee
                        </button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {loading ? (
                            <Loader />
                        ) : employees.length === 0 ? (
                            <EmptyState
                                icon="👥"
                                title="No employees yet"
                                message="Click 'Add Employee' to get started."
                            />
                        ) : (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Employee ID</th>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Joined</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp) => (
                                            <tr key={emp.id}>
                                                <td>
                                                    <strong>{emp.employee_id}</strong>
                                                </td>
                                                <td>{emp.full_name}</td>
                                                <td style={{ color: "var(--text-secondary)" }}>{emp.email}</td>
                                                <td>
                                                    <span className="badge dept">{emp.department}</span>
                                                </td>
                                                <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                                                    {new Date(emp.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => setDeleteTarget(emp)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showAdd && (
                <Modal title="Add New Employee" onClose={() => setShowAdd(false)}>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {formError && <ErrorBanner message={formError} />}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Employee ID</label>
                                    <input
                                        className="form-control"
                                        name="employee_id"
                                        placeholder="e.g., EMP-001"
                                        value={form.employee_id}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <input
                                        className="form-control"
                                        name="department"
                                        placeholder="e.g., Engineering"
                                        value={form.department}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    className="form-control"
                                    name="full_name"
                                    placeholder="John Doe"
                                    value={form.full_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    className="form-control"
                                    name="email"
                                    type="email"
                                    placeholder="john@company.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? "Saving…" : "Add Employee"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <ConfirmModal
                    title="Delete Employee"
                    message={
                        <>
                            Are you sure you want to delete <strong>{deleteTarget.full_name}</strong> (
                            {deleteTarget.employee_id})? This will also remove all their attendance records.
                        </>
                    }
                    danger
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </>
    );
}
