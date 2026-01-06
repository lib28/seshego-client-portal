import { NavLink } from "react-router-dom";
import logo from "../assets/seshego-logo.png";

export default function PublicLayout({ children }) {
  return (
    <div className="public-shell">
      <header className="public-topbar">
        <div className="public-inner">
          <div className="public-left">
            <div className="public-brand">
              <img src={logo} alt="Seshego Consulting" className="public-logo" />
              <div className="public-brandtext">
                <div className="public-brandname">Seshego Consulting</div>
                <div className="public-brandsub">Secure Client Portal</div>
              </div>
            </div>
          </div>

          <nav className="public-nav" aria-label="Public navigation">
            <NavLink to="/" className="public-link">
              Home
            </NavLink>
            <a className="public-link" href="#products">
              Products
            </a>
            <a className="public-link" href="#funds">
              Services
            </a>
            <a className="public-link" href="#contact">
              Contact
            </a>
          </nav>

          <div className="public-actions">
            <NavLink to="/login" className="btn-outline">
              Login
            </NavLink>
            <NavLink to="/login" className="btn-primary">
              Access portal
            </NavLink>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
