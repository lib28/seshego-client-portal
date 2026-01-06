// src/pages/ClientQA.js
import { useMemo, useState } from "react";

export default function ClientQA() {
  // Demo data (we’ll connect to Firestore later)
  const [tickets, setTickets] = useState(() => [
    {
      id: "TCK-1001",
      subject: "Upload of policy document",
      category: "Documents",
      priority: "Normal",
      status: "Answered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // ~1 day ago
      lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 3),
      messages: [
        {
          by: "Client",
          text: "Hi, can you confirm which policy document applies to our fund?",
          at: new Date(Date.now() - 1000 * 60 * 60 * 26),
        },
        {
          by: "Seshego Support",
          text: "Noted. Please check the latest uploaded Policies pack in your Documents section. If anything is missing, we can add it.",
          at: new Date(Date.now() - 1000 * 60 * 60 * 3),
        },
      ],
    },
    {
      id: "TCK-1002",
      subject: "Onboarding approval timeline",
      category: "Onboarding",
      priority: "High",
      status: "Open",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 5),
      messages: [
        {
          by: "Client",
          text: "How long does onboarding approval usually take?",
          at: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState(tickets[0]?.id || null);

  const [form, setForm] = useState({
    subject: "",
    category: "General",
    priority: "Normal",
    message: "",
    allowContact: true,
  });

  const [sending, setSending] = useState(false);

  const active = useMemo(
    () => tickets.find((t) => t.id === activeId) || null,
    [tickets, activeId]
  );

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status !== "Answered").length;
    const answered = tickets.filter((t) => t.status === "Answered").length;
    return { open, answered, total: tickets.length };
  }, [tickets]);

  const set = (key) => (e) => {
    const val = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: val }));
  };

  const createTicket = async (e) => {
    e.preventDefault();

    if (!form.subject.trim()) return alert("Please enter a subject.");
    if (!form.message.trim()) return alert("Please enter your question/message.");

    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 700));

      const id = "TCK-" + Math.floor(1000 + Math.random() * 8999);
      const now = new Date();

      const newTicket = {
        id,
        subject: form.subject.trim(),
        category: form.category,
        priority: form.priority,
        status: "Open",
        createdAt: now,
        lastUpdate: now,
        messages: [
          {
            by: "Client",
            text: form.message.trim(),
            at: now,
          },
        ],
      };

      setTickets((prev) => [newTicket, ...prev]);
      setActiveId(id);

      setForm({
        subject: "",
        category: "General",
        priority: "Normal",
        message: "",
        allowContact: true,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSending(false);
    }
  };

  const addReply = async (text) => {
    const msg = String(text || "").trim();
    if (!msg) return;

    // Demo: add reply as Client note
    const now = new Date();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== activeId) return t;
        return {
          ...t,
          status: "Open",
          lastUpdate: now,
          messages: [...t.messages, { by: "Client", text: msg, at: now }],
        };
      })
    );
  };

  const closeTicket = () => {
    const now = new Date();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, status: "Answered", lastUpdate: now }
          : t
      )
    );
  };

  return (
    <div className="qa-wrap">
      {/* Header */}
      <section className="qa-hero">
        <div className="qa-hero-inner">
          <div>
            <div className="qa-title">Q&amp;A / Support</div>
            <div className="qa-sub">
              Submit questions, track responses, and keep an audit trail of requests.
            </div>
          </div>

          <div className="qa-stats">
            <StatPill label="Open" value={stats.open} />
            <StatPill label="Answered" value={stats.answered} />
            <StatPill label="Total" value={stats.total} />
          </div>
        </div>
      </section>

      <section className="qa-grid">
        {/* Left: Create ticket + Ticket list */}
        <div className="qa-left">
          <div className="qa-card">
            <div className="qa-card-head">
              <div className="qa-card-title">Submit a question</div>
              <div className="qa-card-sub">
                Choose a category and priority so the right team picks it up.
              </div>
            </div>

            <form onSubmit={createTicket} className="qa-form">
              <div className="qa-field">
                <div className="qa-label">Subject</div>
                <input
                  className="qa-input"
                  value={form.subject}
                  onChange={set("subject")}
                  placeholder="e.g., Compliance documentation required"
                />
              </div>

              <div className="qa-two">
                <div className="qa-field">
                  <div className="qa-label">Category</div>
                  <select className="qa-input" value={form.category} onChange={set("category")}>
                    <option>General</option>
                    <option>Onboarding</option>
                    <option>Documents</option>
                    <option>Compliance & Governance</option>
                    <option>Risk Management</option>
                    <option>Security / Access</option>
                    <option>Advisory Services</option>
                  </select>
                </div>

                <div className="qa-field">
                  <div className="qa-label">Priority</div>
                  <select className="qa-input" value={form.priority} onChange={set("priority")}>
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="qa-field">
                <div className="qa-label">Message</div>
                <textarea
                  className="qa-textarea"
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Describe the request. Include relevant details and deadlines."
                  rows={4}
                />
              </div>

              <label className="qa-check">
                <input
                  type="checkbox"
                  checked={form.allowContact}
                  onChange={set("allowContact")}
                />
                <span>Allow support team to contact me for clarification.</span>
              </label>

              <div className="qa-actions">
                <button className="btn-ghost" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  Back to top
                </button>

                <button className="btn-primary" type="submit" disabled={sending}>
                  {sending ? "Submitting…" : "Submit request"}
                </button>
              </div>
            </form>
          </div>

          <div className="qa-card">
            <div className="qa-card-head">
              <div className="qa-card-title">My requests</div>
              <div className="qa-card-sub">Click a ticket to view details.</div>
            </div>

            <div className="qa-ticketlist">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  className={"qa-ticket" + (t.id === activeId ? " active" : "")}
                  onClick={() => setActiveId(t.id)}
                  type="button"
                >
                  <div className="qa-ticket-top">
                    <div className="qa-ticket-subject">{t.subject}</div>
                    <span className={"qa-badge " + badgeClass(t.status)}>{t.status}</span>
                  </div>
                  <div className="qa-ticket-meta">
                    <span className="qa-pill">{t.id}</span>
                    <span className="qa-pill">{t.category}</span>
                    <span className={"qa-pill " + priorityClass(t.priority)}>{t.priority}</span>
                    <span className="qa-time">Updated {fmtTimeAgo(t.lastUpdate)}</span>
                  </div>
                </button>
              ))}
              {tickets.length === 0 && <div className="qa-empty">No requests yet.</div>}
            </div>
          </div>
        </div>

        {/* Right: Ticket detail */}
        <div className="qa-right">
          <div className="qa-card">
            {!active ? (
              <div className="qa-empty">Select a ticket to view details.</div>
            ) : (
              <>
                <div className="qa-detail-head">
                  <div>
                    <div className="qa-detail-title">{active.subject}</div>
                    <div className="qa-detail-sub">
                      {active.id} • {active.category} • Created {fmtDate(active.createdAt)}
                    </div>
                  </div>

                  <div className="qa-detail-actions">
                    <span className={"qa-badge " + badgeClass(active.status)}>{active.status}</span>
                    <button className="btn-danger btn-sm" type="button" onClick={closeTicket}>
                      Mark answered
                    </button>
                  </div>
                </div>

                <div className="qa-thread">
                  {active.messages.map((m, idx) => (
                    <div key={idx} className={"qa-msg " + (m.by === "Client" ? "client" : "support")}>
                      <div className="qa-msg-top">
                        <div className="qa-msg-by">{m.by}</div>
                        <div className="qa-msg-at">{fmtDateTime(m.at)}</div>
                      </div>
                      <div className="qa-msg-text">{m.text}</div>
                    </div>
                  ))}
                </div>

                <ReplyBox onSend={addReply} />
              </>
            )}
          </div>

          <div className="qa-card">
            <div className="qa-card-head">
              <div className="qa-card-title">Quick guidance</div>
              <div className="qa-card-sub">What to include in a request</div>
            </div>

            <ul className="qa-guide">
              <li><b>What:</b> describe the request clearly.</li>
              <li><b>Why:</b> compliance / governance / risk reason.</li>
              <li><b>When:</b> deadline or urgency.</li>
              <li><b>Docs:</b> reference any document name / version.</li>
              <li><b>Access:</b> note if certain roles should see it.</li>
            </ul>

            <div className="qa-footnote">
              We’ll connect this to Firestore so admins can respond inside the platform and keep an audit log.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   Helpers / small components
========================= */
function StatPill({ label, value }) {
  return (
    <div className="qa-stat">
      <div className="qa-stat-label">{label}</div>
      <div className="qa-stat-value">{value}</div>
    </div>
  );
}

function ReplyBox({ onSend }) {
  const [text, setText] = useState("");
  return (
    <div className="qa-reply">
      <div className="qa-label">Add a reply</div>
      <textarea
        className="qa-textarea"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your reply…"
      />
      <div className="qa-actions" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setText("")}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            onSend(text);
            setText("");
          }}
        >
          Send reply
        </button>
      </div>
    </div>
  );
}

function badgeClass(status) {
  if (status === "Answered") return "ok";
  if (status === "Open") return "warn";
  return "muted";
}

function priorityClass(p) {
  if (p === "Urgent") return "pri-urgent";
  if (p === "High") return "pri-high";
  return "";
}

function fmtDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function fmtDateTime(d) {
  const dt = new Date(d);
  return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtTimeAgo(d) {
  const dt = new Date(d).getTime();
  const now = Date.now();
  const mins = Math.max(1, Math.round((now - dt) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
