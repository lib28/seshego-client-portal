// src/pages/ClientDocuments.js
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ClientDocuments() {
  const navigate = useNavigate();

  // Sample docs (replace with Firestore later)
  const recentDocs = useMemo(
    () => [
      { id: "ips", name: "Investment Policy Statement (IPS)", date: "2026-01-05" },
      { id: "gov", name: "Governance & Compliance Overview", date: "2026-01-03" },
      { id: "risk", name: "Risk Review Summary", date: "2025-12-21" },
      { id: "benefits", name: "Benefits Structure Summary", date: "2025-12-18" },
      { id: "rules", name: "Fund Rules Draft (Extract)", date: "2025-12-12" },
    ],
    []
  );

  return (
    <div className="dash-wrap">
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <div>
            <div className="dash-hello">My Documents</div>
            <div className="dash-sub">View and download your approved documents</div>
          </div>

          <button
            className="dash-help-btn"
            type="button"
            onClick={() => navigate("/client")}
            title="Back to dashboard"
          >
            Back
          </button>
        </div>
      </section>

      <section className="dash-section">
        <h2 className="dash-h2">Available documents</h2>

        <div className="card">
          <div className="list">
            {recentDocs.map((d, i) => (
              <div className="list-row" key={d.id || `${d.name}-${i}`}>
                <div>
                  <div className="list-title">{d.name}</div>
                  <div className="list-sub">Updated: {d.date}</div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => alert(`Demo: Open "${d.name}"`)}
                  >
                    Open
                  </button>

                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => alert(`Demo: Download "${d.name}"`)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
            *Demo mode: documents are placeholders for presentation. Firestore/Storage will be connected next.
          </p>
        </div>
      </section>
    </div>
  );
}
