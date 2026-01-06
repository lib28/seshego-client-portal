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

  const navClass = ({ isActive }) =>
    "site-nav-link" + (isActive ? " active" : "");

  return (
    <div className="site-shell">
      <header className="site-topbar">
        <div className="site-topbar-inner">
          {/* Brand */}
          <div className="site-brand">
            <img className="site-logo" src={logo} alt="Seshego Consulting" />
            <div className="site-brand-text">
              <div className="site-brand-name">Seshego Consulting</div>
              <div className="site-brand-sub">Admin Portal</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="site-nav">
            <NavLink to="/admin" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/documents/new" className={navClass}>
              Documents
            </NavLink>
            <NavLink to="/admin/onboarding" className={navClass}>
              Onboarding
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="site-actions">
            <button className="site-btn site-btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="site-content">{children}</main>
    </div>
  );
}
