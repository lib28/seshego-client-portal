import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDocuments = async () => {
      const snap = await getDocs(collection(db, "documents"));
      setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadDocuments();
  }, []);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return documents;

    return documents.filter((d) => {
      const title = (d.title || "").toLowerCase();
      const email = (d.clientEmail || "").toLowerCase();
      return title.includes(q) || email.includes(q);
    });
  }, [documents, search]);

  const total = documents.length;
  const showing = filteredDocs.length;

  return (
    <div className="page portal-page">
      {/* Header */}
      <div className="page-header page-header-split">
        <div>
          <h1 className="page-title">My Documents</h1>
          <p className="muted">
            Manage client documents and workflow.
            <span className="meta"> • {showing} of {total} shown</span>
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/admin/documents/new")}
          >
            + Create Document
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card glass toolbar-card">
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search by title or client email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-right">
            <span className="pill pill-neutral">
              <span className="pill-label">Total</span>
              <span className="pill-value">{total}</span>
            </span>
            <span className="pill pill-neutral">
              <span className="pill-label">Results</span>
              <span className="pill-value">{showing}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card glass table-card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="col-title">Title</th>
                <th className="col-client">Client</th>
                <th className="col-status">Status</th>
                <th className="col-file">File</th>
                <th className="col-actions right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    <div className="empty-box">
                      <div className="empty-title">No documents found</div>
                      <div className="empty-sub">
                        Try a different search, or create a new document.
                      </div>
                      <button
                        className="btn-primary"
                        onClick={() => navigate("/admin/documents/new")}
                      >
                        + Create Document
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const statusRaw = doc.status || "pending";
                  const status = String(statusRaw).toLowerCase();

                  return (
                    <tr key={doc.id} className="table-row-hover">
                      <td className="title">
                        <div className="cell-title">
                          {doc.title || "Untitled"}
                        </div>
                        <div className="cell-sub muted">
                          Document ID: <span className="mono">{doc.id}</span>
                        </div>
                      </td>

                      <td className="mono">{doc.clientEmail || "—"}</td>

                      <td>
                        <span className={`status-pill status-${status}`}>
                          {String(statusRaw).toUpperCase()}
                        </span>
                      </td>

                      <td>
                        {doc.fileUrl ? (
                          <a
                            className="link link-strong"
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View file →
                          </a>
                        ) : (
                          <span className="muted">No file</span>
                        )}
                      </td>

                      <td className="right">
                        <div className="actions">
                          <button className="btn-secondary btn-sm">
                            Mark approved
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
