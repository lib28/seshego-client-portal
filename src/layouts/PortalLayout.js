import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../../assets/seshego-logo.png";
import { useAuth } from "../context/AuthContext";

export default function PortalLayout({ children }) {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) => "nav-pill" + (isActive ? " active" : "");

  // Role-based tabs
  const isAdmin = role === "admin";
  const isClient = role === "client";
  const isEmployee = role === "employee";

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          {/* LEFT */}
          <div className="topbar-left">
            <div className="brand">
              <div className="brand-logo-wrap">
                <img src={logo} alt="Seshego Consulting" className="brand-logo" />
              </div>

              <div className="brand-text">
                <div className="brand-name">Seshego Consulting</div>
                <div className="brand-sub">
                  {isAdmin ? "Admin" : isEmployee ? "Employee" : "Client"} Portal
                </div>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <nav className="topbar-center" aria-label="Portal navigation">
            <NavLink to="/app" end className={navClass}>
              Overview
            </NavLink>

            <NavLink to="/app/documents" className={navClass}>
              Documents
            </NavLink>

            {isClient && (
              <NavLink to="/app/onboarding" className={navClass}>
                Onboarding
              </NavLink>
            )}

            {(isClient || isAdmin) && (
              <NavLink to="/app/qa" className={navClass}>
                Q&amp;A
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/app/admin/onboarding" className={navClass}>
                Admin Review
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/app/admin/documents/new" className={navClass}>
                Upload
              </NavLink>
            )}
          </nav>

          {/* RIGHT */}
          <div className="topbar-right">
            <button className="btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="page-wrap">{children}</main>
    </div>
  );
}
