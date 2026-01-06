// src/pages/ClientDashboard.js
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const userEmail = auth?.currentUser?.email || "client@company.com";

  // Sample data (replace with Firestore later)
  const portfolioItems = useMemo(
    () => [
      {
        title: "Retirement Saving",
        subtitle:
          "Pension & Life Assurance Scheme (Southern & Eastern Cape)",
        valueLabel: "Fund balance",
        value: "R13 141",
      },
      {
        title: "Risk Consulting",
        subtitle: "Cover & policy structure review (summary)",
        valueLabel: "Status",
        value: "Active",
      },
    ],
    []
  );

  const recentDocs = useMemo(
    () => [
      { name: "Investment Policy Statement (IPS)", date: "2026-01-05" },
      { name: "Governance & Compliance Overview", date: "2026-01-03" },
      { name: "Risk Review Summary", date: "2025-12-21" },
    ],
    []
  );

  return (
    <div className="dash-wrap">
      {/* WELCOME STRIP */}
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <div>
            <div className="dash-hello">Hello, {userEmail}</div>
            <div className="dash-sub">Welcome to Seshego Consulting</div>
          </div>

          <button
            className="dash-help-btn"
            type="button"
            onClick={() => navigate("/client/qa")}
            aria-label="Support"
            title="Support"
          >
            Support
          </button>
        </div>
      </section>

      {/* TILE GRID */}
      <section className="dash-section">
        <div className="tile-grid">
          <Tile
            title="My portfolio"
            subtitle="Overview & services"
            icon="📁"
            onClick={() => scrollToId("portfolio")}
          />
          <Tile
            title="Requests"
            subtitle="Submissions & approvals"
            icon="✅"
            onClick={() => scrollToId("requests")}
          />
          <Tile
            title="Documents"
            subtitle="View & download"
            icon="📄"
            onClick={() => navigate("/client/documents")}
          />
          <Tile
            title="Tools & support"
            subtitle="FAQs & help"
            icon="🧰"
            onClick={() => navigate("/client/qa")}
          />

          {/* ✅ NEW: EMPLOYEES TILE */}
          <Tile
            title="Employees"
            subtitle="Manage & view staff"
            icon="👥"
            onClick={() => navigate("/client/employees")}
          />
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="dash-section" id="portfolio">
        <div className="dash-row">
          <h2 className="dash-h2">My portfolio</h2>
          <button className="dash-link-btn" onClick={() => scrollToId("portfolio")}>
            See more
          </button>
        </div>

        <div className="card-grid">
          {portfolioItems.map((item, idx) => (
            <div className="card" key={idx}>
              <div className="card-head">
                <div>
                  <div className="card-title">{item.title}</div>
                  <div className="card-sub">{item.subtitle}</div>
                </div>

                <button
                  className="card-arrow"
                  type="button"
                  onClick={() => alert("Later: open portfolio details")}
                  aria-label="Open"
                  title="Open"
                >
                  ›
                </button>
              </div>

              <div className="card-metric">
                <div className="metric-label">{item.valueLabel}</div>
                <div className="metric-value">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REQUESTS */}
      <section className="dash-section" id="requests">
        <h2 className="dash-h2">Requests</h2>

        <div className="card soft">
          <div className="soft-row">
            <div>
              <div className="soft-title">Onboarding status</div>
              <div className="soft-sub">Pending review by admin</div>
            </div>

            <span className="pill pill-warn">Pending</span>
          </div>

          <div className="soft-actions">
            <button
              className="btn-primary"
              type="button"
              onClick={() => navigate("/client/onboarding")}
            >
              View details
            </button>

            <button
              className="btn-ghost"
              type="button"
              onClick={() => navigate("/client/qa")}
            >
              Ask a question
            </button>
          </div>
        </div>
      </section>

      {/* RECENT DOCS */}
      <section className="dash-section">
        <h2 className="dash-h2">Recent documents</h2>

        <div className="card">
          <div className="list">
            {recentDocs.map((d, i) => (
              <div className="list-row" key={i}>
                <div>
                  <div className="list-title">{d.name}</div>
                  <div className="list-sub">Updated: {d.date}</div>
                </div>

                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => navigate("/client/documents")}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   Components + helpers
========================= */

function Tile({ title, subtitle, icon, onClick }) {
  return (
    <button className="tile" type="button" onClick={onClick}>
      <div className="tile-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="tile-title">{title}</div>
      <div className="tile-sub">{subtitle}</div>
    </button>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
