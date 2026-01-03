import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;

      try {
        // Prefer clientId (uid)
        let q = query(
          collection(db, "documents"),
          where("clientId", "==", user.uid)
        );
        let snapshot = await getDocs(q);

        // Fallback if you store clientEmail
        if (snapshot.empty) {
          q = query(
            collection(db, "documents"),
            where("clientEmail", "==", user.email)
          );
          snapshot = await getDocs(q);
        }

        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const norm = (s) => String(s || "pending").toLowerCase();

  const counts = useMemo(() => {
    const total = documents.length;
    const pending = documents.filter((d) => norm(d.status) === "pending").length;
    const approved = documents.filter((d) => norm(d.status) === "approved").length;
    const signed = documents.filter((d) => norm(d.status) === "signed").length;
    return { total, pending, approved, signed };
  }, [documents]);

  const recentDocs = useMemo(() => {
    // If you later add createdAt timestamp, sort by it.
    // For now: keep order from Firestore (or simple title sort)
    return [...documents].slice(0, 5);
  }, [documents]);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Client Dashboard</h1>
          <p className="muted">
            Welcome back, <span className="mono">{user?.email}</span>
          </p>
        </div>

        <div className="page-header-right">
          <button
            className="btn-primary"
            onClick={() => navigate("/client/documents")}
          >
            View Documents
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card glass stat-card">
          <div className="stat-label">Total Documents</div>
          <div className="stat-value">{loading ? "…" : counts.total}</div>
          <div className="stat-sub muted">All shared documents</div>
        </div>

        <div className="card glass stat-card">
          <div className="stat-label">
            <span className="icon-pill">📥</span> Pending
          </div>
          <div className="stat-value">{loading ? "…" : counts.pending}</div>
          <div className="stat-sub muted">Awaiting action</div>
        </div>

        <div className="card glass stat-card">
          <div className="stat-label">
            <span className="icon-pill">✅</span> Approved
          </div>
          <div className="stat-value">{loading ? "…" : counts.approved}</div>
          <div className="stat-sub muted">Ready to proceed</div>
        </div>

        <div className="card glass stat-card">
          <div className="stat-label">
            <span className="icon-pill">✍️</span> Signed
          </div>
          <div className="stat-value">{loading ? "…" : counts.signed}</div>
          <div className="stat-sub muted">Completed</div>
        </div>
      </div>

      {/* Two-column area */}
      <div className="grid-2">
        {/* Quick actions */}
        <div className="card glass panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Quick Actions</div>
              <div className="muted">Jump to common tasks</div>
            </div>
          </div>

          <div className="panel-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/client/documents")}
            >
              View My Documents
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/client/onboarding")}
            >
              Company Onboarding
            </button>
          </div>
        </div>

        {/* Recent documents */}
        <div className="card glass panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Recent Documents</div>
              <div className="muted">Latest items shared with you</div>
            </div>

            <button
              className="btn-secondary btn-sm"
              onClick={() => navigate("/client/documents")}
            >
              See all
            </button>
          </div>

          {loading ? (
            <div className="table-empty">Loading documents…</div>
          ) : recentDocs.length === 0 ? (
            <div className="empty-box">
              <div className="empty-title">No documents yet</div>
              <div className="empty-sub">
                When documents are shared with you, they’ll appear here.
              </div>
              <button
                className="btn-primary"
                onClick={() => navigate("/client/onboarding")}
              >
                Start onboarding
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Status</th>
                    <th className="right">File</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map((d) => {
                    const status = norm(d.status);
                    return (
                      <tr key={d.id}>
                        <td>
                          <div className="doc-title">{d.title || "Untitled"}</div>
                          <div className="doc-sub muted">{d.fileName || "—"}</div>
                        </td>
                        <td>
                          <span className={`status-pill status-${status}`}>
                            {String(d.status || "pending").toUpperCase()}
                          </span>
                        </td>
                        <td className="right">
                          {d.fileUrl ? (
                            <a
                              className="btn-secondary btn-sm"
                              href={d.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            <span className="muted">No file</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
