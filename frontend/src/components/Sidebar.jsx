import { NavLink } from "react-router-dom";

const links = [
    { to: "/", icon: "📊", label: "Dashboard" },
    { to: "/employees", icon: "👥", label: "Employees" },
    { to: "/attendance", icon: "📋", label: "Attendance" },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h1>
                    <span>HRMS</span> Lite
                </h1>
                <p>Human Resource Management</p>
            </div>

            <ul className="sidebar-nav">
                {links.map((l) => (
                    <li key={l.to}>
                        <NavLink
                            to={l.to}
                            end={l.to === "/"}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            <span className="nav-icon">{l.icon}</span>
                            {l.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
