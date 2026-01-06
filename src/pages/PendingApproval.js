import { Link } from "react-router-dom";
import logo from "../assets/seshego-logo.png";

export default function PendingApproval() {
  return (
    <div className="portal-bg">
      <div className="portal-frame">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <div className="brand">
                <img src={logo} alt="Seshego" className="brand-logo" />
                <div className="brand-text">
                  <div className="brand-name">Seshego Consulting</div>
                  <div className="brand-sub">Onboarding Submitted</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="portal-content">
          <div className="page portal-page">
            <div className="card glass" style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Thanks — submission received</h2>
              <p className="muted">
                Your account is awaiting admin approval. Once approved, you can log in
                and access your portal.
              </p>
              <Link className="btn-primary" to="/login">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
