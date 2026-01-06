// src/pages/EmployeeDashboard.js
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const norm = (s) => String(s || "active").trim().toLowerCase();

  useEffect(() => {
    const loadDocs = async () => {
      if (!user) return;

      try {
        // Primary: employeeId (uid)
        let q = query(collection(db, "documents"), where("employeeId", "==", user.uid));
        let snap = await getDocs(q);

        // Fallback: employeeEmail
        if (snap.empty) {
          q = query(collection(db, "documents"), where("employeeEmail", "==", user.email));
          snap = await getDocs(q);
        }

        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDocuments(docs);
      } catch (e) {
        console.error("EmployeeDashboard load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [user]);

  const counts = useMemo(() => {
    const total = documents.length;
    const active = documents.filter((d) => norm(d.status) !== "archived").length;
    const archived = documents.filter((d) => norm(d.status) === "archived").length;
    return { total, active, archived };
  }, [documents]);

  const recentDocs = useMemo(() => {
    const toMillis = (v) => {
      if (!v) return 0;
      if (typeof v?.toMillis === "function") return v.toMillis();
      const t = new Date(v).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    return [...documents]
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
      .slice(0, 8);
  }, [documents]);

  const StatusPill = ({ status }) => {
    const s = norm(status);
    // employees might have: active / updated / archived / pending
    return <span className={`status-pill ${s}`}>{s}</span>;
  };

  return (
    <div className="page portal-page">
      {/* HEADER */}
      <div className="page-header" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            Company Policies
          </h1>
          <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
            Secure access to internal policies for <span className="mono">{user?.email}</span>
          </p>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-secondary btn-sm" onClick={() => navigate("/employee")}>
            Refresh
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="card glass stat-card">
          <div className="stat-label">Total Policies</div>
          <div className="stat-value">{loading ? "…" : counts.total}</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Documents shared with you
          </div>
        </div>

        <div className="card glass stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value">{loading ? "…" : counts.active}</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Current policies and guidelines
          </div>
        </div>

        <div className="card glass stat-card">
          <div className="stat-label">Archived</div>
          <div className="stat-value">{loading ? "…" : counts.archived}</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Older versions / retired docs
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card glass table-card">
        {loading ? (
          <div className="table-empty">Loading policies…</div>
        ) : recentDocs.length === 0 ? (
          <div className="table-empty">
            <div className="empty-title">No policies shared yet</div>
            <div className="muted" style={{ marginTop: 6 }}>
              Contact admin if you need access to company policy documents.
            </div>
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
                {recentDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-title">{doc.title || "Untitled"}</div>
                      <div className="doc-sub muted">{doc.fileName || "—"}</div>
                    </td>
                    <td>
                      <StatusPill status={doc.status || "active"} />
                    </td>
                    <td className="right">
                      {doc.fileUrl ? (
                        <a
                          className="btn-secondary btn-sm"
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="muted" style={{ padding: 14, fontSize: 12 }}>
              Note: If you require additional policies or role-specific resources, please request access
              from the admin.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
