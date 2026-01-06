// src/pages/ClientOnboarding.js
import { useMemo, useState } from "react";

export default function ClientOnboarding() {
  // Demo mode (we’ll connect to Firestore later)
  const [status, setStatus] = useState("draft"); // draft | pending | approved | rejected
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    registrationOrVat: "",
    industry: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    riskNotes: "",
    complianceNotes: "",
    popiaConsent: false,
  });

  const progress = useMemo(() => {
    const required = [
      "companyName",
      "registrationOrVat",
      "industry",
      "contactPerson",
      "email",
      "phone",
      "address",
      "province",
    ];
    const filled = required.filter((k) => String(form[k] || "").trim().length > 0).length;
    const pct = Math.round((filled / required.length) * 100);
    return { filled, total: required.length, pct };
  }, [form]);

  const set = (key) => (e) => {
    const val = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.popiaConsent) {
      alert("Please confirm POPIA / data processing consent before submitting.");
      return;
    }

    // Basic validation
    const must = ["companyName", "registrationOrVat", "industry", "contactPerson", "email", "phone"];
    for (const k of must) {
      if (!String(form[k] || "").trim()) {
        alert(`Please complete: ${labelFor(k)}`);
        return;
      }
    }

    setLoading(true);
    try {
      // Demo: pretend we saved to Firestore
      await new Promise((r) => setTimeout(r, 700));
      setStatus("pending");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const resetDraft = () => {
    setStatus("draft");
  };

  const statusMeta = getStatusMeta(status);

  return (
    <div className="onb-wrap">
      {/* Hero / status strip */}
      <section className="onb-hero">
        <div className="onb-hero-inner">
          <div>
            <div className="onb-title">Onboarding</div>
            <div className="onb-sub">
              Submit onboarding and compliance details for review.
            </div>
          </div>

          <div className={"onb-status " + statusMeta.cls}>
            <div className="onb-status-dot" />
            <div>
              <div className="onb-status-label">{statusMeta.label}</div>
              <div className="onb-status-sub">{statusMeta.sub}</div>
            </div>
          </div>
        </div>

        <div className="onb-progress">
          <div className="onb-progress-top">
            <div className="onb-progress-title">Completion</div>
            <div className="onb-progress-meta">
              {progress.filled}/{progress.total} ({progress.pct}%)
            </div>
          </div>
          <div className="onb-bar">
            <div className="onb-bar-fill" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="onb-grid">
        {/* Left: Form */}
        <div className="onb-card">
          <div className="onb-card-head">
            <div className="onb-card-title">Client details</div>
            <div className="onb-card-sub">
              This information supports risk, governance, and service delivery.
            </div>
          </div>

          <form onSubmit={submit} className="onb-form">
            <div className="onb-two">
              <Field label="Company name" value={form.companyName} onChange={set("companyName")} />
              <Field
                label="Registration / VAT"
                value={form.registrationOrVat}
                onChange={set("registrationOrVat")}
              />
            </div>

            <div className="onb-two">
              <Field label="Industry" value={form.industry} onChange={set("industry")} />
              <Field label="Province" value={form.province} onChange={set("province")} />
            </div>

            <div className="onb-two">
              <Field label="Contact person" value={form.contactPerson} onChange={set("contactPerson")} />
              <Field label="Email" type="email" value={form.email} onChange={set("email")} />
            </div>

            <div className="onb-two">
              <Field label="Phone" value={form.phone} onChange={set("phone")} />
              <Field label="Address" value={form.address} onChange={set("address")} />
            </div>

            <div className="onb-divider" />

            <div className="onb-card-head" style={{ marginTop: 6 }}>
              <div className="onb-card-title">Risk & compliance notes</div>
              <div className="onb-card-sub">
                Optional notes to help your consultant prepare.
              </div>
            </div>

            <Textarea
              label="Risk management notes (optional)"
              value={form.riskNotes}
              onChange={set("riskNotes")}
              placeholder="e.g., risk events, areas of concern, key stakeholders…"
            />

            <Textarea
              label="Compliance / governance notes (optional)"
              value={form.complianceNotes}
              onChange={set("complianceNotes")}
              placeholder="e.g., trustee requirements, reporting cadence, policy updates…"
            />

            <label className="onb-check">
              <input
                type="checkbox"
                checked={form.popiaConsent}
                onChange={set("popiaConsent")}
              />
              <span>
                I consent to processing of information for onboarding and service delivery (POPIA).
              </span>
            </label>

            <div className="onb-actions">
              {status === "pending" ? (
                <>
                  <button className="btn-ghost" type="button" onClick={resetDraft}>
                    Edit (set back to draft)
                  </button>
                  <button className="btn-primary" type="button" onClick={() => alert("Demo: View submission")}>
                    View submission
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Back to top
                  </button>
                  <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? "Submitting…" : "Submit for review"}
                  </button>
                </>
              )}
            </div>

            <div className="onb-footnote">
              <b>Note:</b> After submission, status becomes <b>Pending Review</b> until an admin approves.
            </div>
          </form>
        </div>

        {/* Right: Help / Checklist */}
        <div className="onb-side">
          <div className="onb-card">
            <div className="onb-card-head">
              <div className="onb-card-title">What happens next</div>
              <div className="onb-card-sub">Operational onboarding flow</div>
            </div>

            <ul className="onb-list">
              <li>
                <b>Submit onboarding</b> — client provides required details.
              </li>
              <li>
                <b>Admin review</b> — compliance & governance checks.
              </li>
              <li>
                <b>Approval</b> — client access is confirmed for documents/services.
              </li>
              <li>
                <b>Ongoing updates</b> — policies, documents, and communications.
              </li>
            </ul>

            <div className="onb-pill-row">
              <span className="onb-pill">Risk management</span>
              <span className="onb-pill">Compliance & governance</span>
              <span className="onb-pill">Trust & security</span>
            </div>
          </div>

          <div className="onb-card">
            <div className="onb-card-head">
              <div className="onb-card-title">Checklist</div>
              <div className="onb-card-sub">Recommended minimum</div>
            </div>

            <div className="onb-checklist">
              <CheckItem ok={!!form.companyName} text="Company name" />
              <CheckItem ok={!!form.registrationOrVat} text="Registration / VAT" />
              <CheckItem ok={!!form.contactPerson} text="Contact person" />
              <CheckItem ok={!!form.email} text="Email" />
              <CheckItem ok={!!form.phone} text="Phone" />
              <CheckItem ok={!!form.address} text="Address" />
              <CheckItem ok={!!form.province} text="Province" />
              <CheckItem ok={form.popiaConsent} text="POPIA consent" />
            </div>

            <div className="onb-footnote">
              We’ll connect this page to Firestore so you can see your submitted record and admin feedback.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   Small components
========================= */
function Field({ label, value, onChange, type = "text" }) {
  return (
    <div className="onb-field">
      <div className="onb-label">{label}</div>
      <input className="onb-input" type={type} value={value} onChange={onChange} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="onb-field">
      <div className="onb-label">{label}</div>
      <textarea
        className="onb-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
      />
    </div>
  );
}

function CheckItem({ ok, text }) {
  return (
    <div className={"onb-checkitem" + (ok ? " ok" : "")}>
      <span className="onb-checkdot" />
      <span>{text}</span>
    </div>
  );
}

function getStatusMeta(status) {
  if (status === "approved") {
    return { label: "Approved", sub: "Your onboarding has been approved.", cls: "approved" };
  }
  if (status === "rejected") {
    return { label: "Rejected", sub: "Please review requested changes.", cls: "rejected" };
  }
  if (status === "pending") {
    return { label: "Pending review", sub: "Submitted and waiting for admin review.", cls: "pending" };
  }
  return { label: "Draft", sub: "Complete and submit for review.", cls: "draft" };
}

function labelFor(key) {
  const map = {
    companyName: "Company name",
    registrationOrVat: "Registration / VAT",
    industry: "Industry",
    contactPerson: "Contact person",
    email: "Email",
    phone: "Phone",
    address: "Address",
    province: "Province",
  };
  return map[key] || key;
}
