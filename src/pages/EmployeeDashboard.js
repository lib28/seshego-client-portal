import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function EmployeeDashboard() {
  const user = auth.currentUser;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      if (!user) return;

      try {
        let q = query(
          collection(db, "documents"),
          where("employeeId", "==", user.uid)
        );

        let snap = await getDocs(q);

        // fallback if using email
        if (snap.empty) {
          q = query(
            collection(db, "documents"),
            where("employeeEmail", "==", user.email)
          );
          snap = await getDocs(q);
        }

        setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [user]);

  return (
    <div className="page portal-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Policies</h1>
          <p className="muted">
            Documents shared with you by the company
          </p>
        </div>
      </div>

      <div className="card glass table-card">
        {loading ? (
          <div className="table-empty">Loading documents…</div>
        ) : documents.length === 0 ? (
          <div className="table-empty">
            No policies have been shared with you yet.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Status</th>
                <th className="right">File</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="doc-title">{doc.title}</div>
                    <div className="doc-sub muted">{doc.fileName}</div>
                  </td>
                  <td>
                    <span className={`status-pill ${doc.status}`}>
                      {doc.status?.toUpperCase()}
                    </span>
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
        )}
      </div>
    </div>
  );
}
