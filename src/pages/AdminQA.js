import { useMemo, useState } from "react";

export default function AdminQA() {
  const [query, setQuery] = useState("");

  const faqs = useMemo(
    () => [
      {
        q: "How do I share a document with a client or employee?",
        a: "Go to Add Document, select the user from the dropdown (client or employee), upload the PDF, and submit.",
      },
      {
        q: "Why can’t a user see their document?",
        a: "Confirm the user's Firestore profile exists in users/{uid} and the document is assigned correctly.",
      },
      {
        q: "What file types can I upload?",
        a: "Currently PDF only.",
      },
      {
        q: "How do roles work?",
        a: "Roles are stored in Firestore users/{uid} as role: admin | client | employee.",
      },
    ],
    []
  );

  const filtered = faqs.filter(
    (x) =>
      x.q.toLowerCase().includes(query.toLowerCase()) ||
      x.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page portal-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Q&amp;A</h1>
          <p className="muted">Admin help and common questions.</p>
        </div>
      </div>

      <div className="card glass" style={{ padding: 18 }}>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 600 }}>Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search questions..."
          />
        </div>

        {filtered.length === 0 ? (
          <div className="table-empty">No matching questions found.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((item, idx) => (
              <details
                key={idx}
                style={{
                  border: "1px solid rgba(15,23,42,0.10)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.70)",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 800 }}>
                  {item.q}
                </summary>
                <div className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
