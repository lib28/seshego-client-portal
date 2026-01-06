// src/layouts/ClientLayout.js
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/seshego-logo.png";

export default function ClientLayout({ children }) {
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
                <div className="brand-sub">Client Portal</div>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <nav className="topbar-center" aria-label="Client navigation">
            <NavLink to="/client" end className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/client/documents" className={navClass}>
              My Documents
            </NavLink>

            <NavLink to="/client/onboarding" className={navClass}>
              Onboarding
            </NavLink>

            <NavLink to="/client/qa" className={navClass}>
              Q&amp;A
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
