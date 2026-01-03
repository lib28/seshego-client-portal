import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ClientDocuments() {
  const user = auth.currentUser;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Prefer clientId
        let q = query(collection(db, "documents"), where("clientId", "==", user.uid));
        let snapshot = await getDocs(q);

        // Fallback: clientEmail
        if (snapshot.empty) {
          q = query(collection(db, "documents"), where("clientEmail", "==", user.email));
          snapshot = await getDocs(q);
        }

        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDocuments(docs);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const filtered = useMemo(() => {
    const norm = (s) => String(s || "").toLowerCase();

    return documents
      .filter((d) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          norm(d.title).includes(q) ||
          norm(d.fileName).includes(q) ||
          norm(d.status).includes(q)
        );
      })
      .filter((d) => {
        if (statusFilter === "all") return true;
        return norm(d.status) === statusFilter;
      });
  }, [documents, search, statusFilter]);

  const counts = useMemo(() => {
    const norm = (s) => String(s || "pending").toLowerCase();
    const total = documents.length;
    const pending = documents.filter((d) => norm(d.status) === "pending").length;
    const approved = documents.filter((d) => norm(d.status) === "approved").length;
    const signed = documents.filter((d) => norm(d.status) === "signed").length;
    return { total, pending, approved, signed };
  }, [documents]);

  return (
    <div className="page portal-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Documents</h1>
          <p className="muted">
            View and download your assigned documents.
            {!loading && (
              <>
                {" "}• <span className="mono">{filtered.length}</span> of{" "}
                <span className="mono">{counts.total}</span> shown
              </>
            )}
          </p>
        </div>

        {/* Small summary pills (like a SaaS toolbar) */}
        <div className="pill-row">
          <span className="pill">Total: <b>{loading ? "…" : counts.total}</b></span>
          <span className="pill">Pending: <b>{loading ? "…" : counts.pending}</b></span>
          <span className="pill">Approved: <b>{loading ? "…" : counts.approved}</b></span>
          <span className="pill">Signed: <b>{loading ? "…" : counts.signed}</b></span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card glass toolbar">
        <div className="toolbar-left">
          <input
            className="search-input"
            placeholder="Search by title, file name or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="signed">Signed</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button
            className="btn-secondary"
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card glass table-card">
        {loading ? (
          <div className="table-empty">Loading documents…</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">
            <div className="empty-title">No documents found</div>
            <div className="muted">
              Try a different search term or change the status filter.
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>File</th>
                  <th className="right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-title">{doc.title || "Untitled"}</div>
                      <div className="doc-sub muted">
                        {doc.fileName || "No file name"}
                      </div>
                    </td>

                    <td>
                      <span className={`status-pill ${String(doc.status || "pending").toLowerCase()}`}>
                        {String(doc.status || "pending").toUpperCase()}
                      </span>
                    </td>

                    <td>
                      {doc.fileUrl ? (
                        <a className="link" href={doc.fileUrl} target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : (
                        <span className="muted">No file</span>
                      )}
                    </td>

                    <td className="right">
                      {doc.fileUrl ? (
                        <a className="btn-secondary btn-sm" href={doc.fileUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      ) : (
                        <button className="btn-secondary btn-sm" disabled>
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
