// src/layouts/AdminLayout.js
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/seshego-logo.png";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) => "nav-pill" + (isActive ? " active" : "");

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
                <div className="brand-sub">Admin Portal</div>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <nav className="topbar-center" aria-label="Admin navigation">
            <NavLink to="/admin" end className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/documents/new" className={navClass}>
              My Documents
            </NavLink>

            <NavLink to="/admin/onboarding" className={navClass}>
              Onboarding
            </NavLink>
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
