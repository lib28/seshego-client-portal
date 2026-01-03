import { useMemo, useState } from "react";

export default function ClientQA() {
  const [query, setQuery] = useState("");

  const faqs = useMemo(
    () => [
      {
        q: "Where do I find my documents?",
        a: "Go to My Documents in the top menu. All files shared with you will appear there.",
      },
      {
        q: "I can’t see any documents yet. What should I do?",
        a: "Your admin needs to upload and assign documents to your account. If you still don’t see anything, confirm your login email with the admin.",
      },
      {
        q: "Can I upload or edit documents?",
        a: "No. Clients have view-only access. Only the admin can upload and assign documents.",
      },
      {
        q: "What file types are supported?",
        a: "Currently PDF files only.",
      },
      {
        q: "Who do I contact for help?",
        a: "Contact your admin or support contact for your account.",
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
          <p className="muted">Quick help and common questions.</p>
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
