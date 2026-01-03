// src/pages/ClientOnboarding.js
import { useEffect, useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  { key: "company", title: "Company" },
  { key: "contact", title: "Contact" },
  { key: "address", title: "Address" },
  { key: "compliance", title: "VAT / Reg" },
];

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

export default function ClientOnboarding() {
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    vatOrReg: "",
  });

  const docRef = useMemo(() => {
    if (!user) return null;
    // ✅ One onboarding doc per user (easy to update / autosave)
    return doc(db, "onboardingSubmissions", user.uid);
  }, [user]);

  // Load existing draft if any
  useEffect(() => {
    const load = async () => {
      if (!docRef || !user) return;

      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setForm((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [docRef, user]);

  const update = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setSaveMsg("");
    setError("");
  };

  // Autosave (debounced)
  useEffect(() => {
    if (!docRef || loading) return;

    const t = setTimeout(async () => {
      try {
        setSaving(true);
        await setDoc(
          docRef,
          {
            ...form,
            uid: user?.uid || null,
            userEmail: user?.email || null,
            status: "pending", // admin can set approved/rejected later
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(), // harmless with merge, will keep first if already exists
          },
          { merge: true }
        );
        setSaveMsg("Saved");
      } catch (e) {
        console.error(e);
        setError("Could not save. Check your Firestore rules.");
      } finally {
        setSaving(false);
      }
    }, 600);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, docRef, loading]);

  const percent = Math.round(((step + 1) / STEPS.length) * 100);

  const validateStep = () => {
    const errs = [];

    if (step === 0) {
      if (!form.companyName.trim()) errs.push("Company name is required.");
    }

    if (step === 1) {
      if (!form.contactPerson.trim()) errs.push("Contact person is required.");
      if (!form.contactEmail.trim()) errs.push("Contact email is required.");
      if (form.contactEmail && !isEmail(form.contactEmail))
        errs.push("Contact email looks invalid.");
    }

    if (step === 2) {
      if (!form.addressLine1.trim()) errs.push("Address line 1 is required.");
      if (!form.city.trim()) errs.push("City is required.");
      if (!form.province.trim()) errs.push("Province is required.");
      if (!form.postalCode.trim()) errs.push("Postal code is required.");
    }

    if (step === 3) {
      // optional, but recommended
      // no hard validation here unless you want it required
    }

    if (errs.length) {
      setError(errs[0]);
      return false;
    }

    setError("");
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submitFinal = async () => {
    setError("");
    // Validate all key required fields before submit
    const required = [
      ["companyName", "Company name is required."],
      ["contactPerson", "Contact person is required."],
      ["contactEmail", "Contact email is required."],
      ["addressLine1", "Address line 1 is required."],
      ["city", "City is required."],
      ["province", "Province is required."],
      ["postalCode", "Postal code is required."],
    ];

    for (const [k, msg] of required) {
      if (!String(form[k] || "").trim()) {
        setError(msg);
        return;
      }
    }
    if (!isEmail(form.contactEmail)) {
      setError("Contact email looks invalid.");
      return;
    }

    try {
      setSaving(true);
      await setDoc(
        docRef,
        {
          ...form,
          uid: user?.uid || null,
          userEmail: user?.email || null,
          status: "submitted",
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSaveMsg("Submitted ✅");
    } catch (e) {
      console.error(e);
      setError("Could not submit. Check your Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page portal-page">
        <div className="card glass onboarding-card">
          <div className="table-empty">Loading onboarding…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page portal-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Onboarding</h1>
          <p className="muted">
            Please complete your details so we can set you up correctly.
          </p>
        </div>
        <div className="onboarding-save">
          <span className={`save-pill ${saving ? "saving" : "saved"}`}>
            {saving ? "Saving…" : saveMsg ? saveMsg : "Auto-save on"}
          </span>
        </div>
      </div>

      <div className="card glass onboarding-card">
        {/* Progress */}
        <div className="onboarding-progress">
          <div className="progress-top">
            <div className="steps">
              {STEPS.map((s, idx) => (
                <button
                  key={s.key}
                  className={
                    "step-chip " +
                    (idx === step ? "active " : "") +
                    (idx < step ? "done " : "")
                  }
                  onClick={() => setStep(idx)}
                  type="button"
                >
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-title">{s.title}</span>
                </button>
              ))}
            </div>
            <div className="progress-meta muted">{percent}%</div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* Error */}
        {error ? <div className="form-error">{error}</div> : null}

        {/* Step content */}
        <div className="onboarding-body">
          {step === 0 && (
            <section className="form-section">
              <h3 className="section-title">Company details</h3>
              <p className="muted section-sub">
                What should we list as the registered trading name?
              </p>

              <div className="form-grid">
                <div className="field">
                  <label>Company name</label>
                  <input
                    value={form.companyName}
                    onChange={(e) => update({ companyName: e.target.value })}
                    placeholder="e.g. Acme Holdings (Pty) Ltd"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="form-section">
              <h3 className="section-title">Primary contact</h3>
              <p className="muted section-sub">
                We’ll use this for onboarding communication and documents.
              </p>

              <div className="form-grid two">
                <div className="field">
                  <label>Contact person</label>
                  <input
                    value={form.contactPerson}
                    onChange={(e) => update({ contactPerson: e.target.value })}
                    placeholder="Full name"
                  />
                </div>

                <div className="field">
                  <label>Contact email</label>
                  <input
                    value={form.contactEmail}
                    onChange={(e) => update({ contactEmail: e.target.value })}
                    placeholder="name@company.co.za"
                  />
                </div>

                <div className="field">
                  <label>Phone (optional)</label>
                  <input
                    value={form.contactPhone}
                    onChange={(e) => update({ contactPhone: e.target.value })}
                    placeholder="+27 82 123 4567"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="form-section">
              <h3 className="section-title">Business address</h3>
              <p className="muted section-sub">
                Used for compliance and document records.
              </p>

              <div className="form-grid">
                <div className="field">
                  <label>Address line 1</label>
                  <input
                    value={form.addressLine1}
                    onChange={(e) => update({ addressLine1: e.target.value })}
                    placeholder="Street address"
                  />
                </div>

                <div className="field">
                  <label>Address line 2 (optional)</label>
                  <input
                    value={form.addressLine2}
                    onChange={(e) => update({ addressLine2: e.target.value })}
                    placeholder="Suite / Unit / Building"
                  />
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label>City</label>
                    <input
                      value={form.city}
                      onChange={(e) => update({ city: e.target.value })}
                      placeholder="Cape Town"
                    />
                  </div>

                  <div className="field">
                    <label>Province</label>
                    <input
                      value={form.province}
                      onChange={(e) => update({ province: e.target.value })}
                      placeholder="Western Cape"
                    />
                  </div>

                  <div className="field">
                    <label>Postal code</label>
                    <input
                      value={form.postalCode}
                      onChange={(e) => update({ postalCode: e.target.value })}
                      placeholder="8001"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="form-section">
              <h3 className="section-title">VAT / Registration</h3>
              <p className="muted section-sub">
                Optional, but recommended for invoicing and compliance.
              </p>

              <div className="form-grid">
                <div className="field">
                  <label>VAT number or Company registration</label>
                  <input
                    value={form.vatOrReg}
                    onChange={(e) => update({ vatOrReg: e.target.value })}
                    placeholder="e.g. 4123456789 / 2020/123456/07"
                  />
                </div>

                <div className="info-callout">
                  <strong>Tip:</strong> If you don’t have it now, you can submit
                  and we’ll follow up later.
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer actions */}
        <div className="onboarding-footer">
          <button
            className="btn-action muted"
            type="button"
            onClick={back}
            disabled={step === 0}
          >
            Back
          </button>

          <div className="footer-right">
            {step < STEPS.length - 1 ? (
              <button className="btn-action primary" type="button" onClick={next}>
                Continue
              </button>
            ) : (
              <button
                className="btn-action success"
                type="button"
                onClick={submitFinal}
                disabled={saving}
              >
                Submit onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
