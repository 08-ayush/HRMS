import { NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Dashboard" },
    { to: "/employees", label: "Employees" },
    { to: "/attendance", label: "Attendance Records" },
];

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand">
                    <div className="brand-icon">👥</div>
                    HRMS Lite
                </div>

                <ul className="navbar-links">
                    {links.map((l) => (
                        <li key={l.to}>
                            <NavLink
                                to={l.to}
                                end={l.to === "/"}
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                {l.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
