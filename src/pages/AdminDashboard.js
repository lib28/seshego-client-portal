// src/pages/AdminDashboard.js
import { Link } from "react-router-dom";
import { useMemo } from "react";

export default function AdminDashboard() {
  // Demo stats (replace later with Firestore counts)
  const stats = useMemo(
    () => [
      { label: "Pending approvals", value: 4, hint: "New client onboarding waiting" },
      { label: "Active clients", value: 18, hint: "Approved client accounts" },
      { label: "Documents", value: 42, hint: "Policies, statements, templates" },
      { label: "Open requests", value: 3, hint: "Client questions / actions" },
    ],
    []
  );

  const quickActions = [
    {
      title: "Review onboarding",
      desc: "Approve / reject new client registrations.",
      to: "/admin/onboarding",
      icon: "✅",
      tone: "primary",
    },
    {
      title: "Upload documents",
      desc: "Add policies, compliance docs, statements.",
      to: "/admin/documents/new",
      icon: "📄",
      tone: "secondary",
    },
    {
      title: "Manage users",
      desc: "Create roles (admin / client / employee).",
      to: "/admin/users",
      icon: "👤",
      tone: "secondary",
      disabled: true, // enable later when you create the page
    },
    {
      title: "System status",
      desc: "Audit log, platform health, permissions.",
      to: "/admin/audit",
      icon: "🛡️",
      tone: "secondary",
      disabled: true, // enable later
    },
  ];

  const modules = [
    {
      title: "Risk management",
      items: [
        "Risk register oversight",
        "Incident reporting & follow-up",
        "Service provider performance tracking",
      ],
    },
    {
      title: "Compliance & governance",
      items: [
        "FAIS / regulatory workflows",
        "Rule drafting & approvals",
        "Policy distribution control",
      ],
    },
    {
      title: "Employee & client protection",
      items: [
        "Secure document access",
        "Role-based visibility",
        "Identity / access reviews",
      ],
    },
    {
      title: "Financial, regulatory & advisory services",
      items: [
        "Client submissions & assessments",
        "Reporting packs / statements",
        "Consulting engagement tracking",
      ],
    },
    {
      title: "Trust, security & accountability",
      items: [
        "Audit trail (who did what)",
        "Data retention controls",
        "Approval and sign-off records",
      ],
    },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Admin Control Panel</h1>
          <p className="page-subtitle">
            Central operations dashboard — manage onboarding, documents, roles and compliance workflows.
          </p>
        </div>

        <div className="page-actions">
          <Link className="btn btn-primary" to="/admin/onboarding">
            Review onboarding
          </Link>
          <Link className="btn btn-ghost" to="/admin/documents/new">
            Upload document
          </Link>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-4">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-hint">{s.hint}</div>
          </div>
        ))}
      </section>

      {/* Quick actions tiles */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Quick actions</h2>
          <div className="section-note">Most used admin actions for daily operations</div>
        </div>

        <div className="grid grid-4">
          {quickActions.map((a) => (
            <ActionTile key={a.title} {...a} />
          ))}
        </div>
      </section>

      {/* Operational modules */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Operational modules</h2>
          <div className="section-note">How the platform is structured (demo-ready)</div>
        </div>

        <div className="grid grid-3">
          {modules.map((m) => (
            <div key={m.title} className="card">
              <div className="card-title">{m.title}</div>
              <ul className="list">
                {m.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Admin notes / next steps */}
      
    </div>
  );
}

function ActionTile({ title, desc, to, icon, tone = "secondary", disabled }) {
  const className =
    "tile " +
    (tone === "primary" ? "tile-primary" : "tile-secondary") +
    (disabled ? " tile-disabled" : "");

  if (disabled) {
    return (
      <div className={className} role="button" aria-disabled="true">
        <div className="tile-icon">{icon}</div>
        <div className="tile-title">{title}</div>
        <div className="tile-desc">{desc}</div>
        <div className="tile-foot">Coming soon</div>
      </div>
    );
  }

  return (
    <Link className={className} to={to}>
      <div className="tile-icon">{icon}</div>
      <div className="tile-title">{title}</div>
      <div className="tile-desc">{desc}</div>
      <div className="tile-foot">Open</div>
    </Link>
  );
}
