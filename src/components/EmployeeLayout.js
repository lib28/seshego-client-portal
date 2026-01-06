import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/seshego-logo.png";

export default function EmployeeLayout({ children }) {
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
          <div className="site-brand">
            <img className="site-logo" src={logo} alt="Seshego Consulting" />
            <div className="site-brand-text">
              <div className="site-brand-name">Seshego Consulting</div>
              <div className="site-brand-sub">Employee Portal</div>
            </div>
          </div>

          <nav className="site-nav">
            <NavLink to="/employee" end className={navClass}>
              Policies
            </NavLink>
          </nav>

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
