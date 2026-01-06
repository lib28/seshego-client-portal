// src/pages/AdminOnboardingReview.js
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminOnboardingReview() {
  const [items, setItems] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  // Optional: rejection message per row
  const [rejectReason, setRejectReason] = useState({});

  useEffect(() => {
    setError("");

    const q = query(
      collection(db, "onboardingSubmissions"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(rows);
      },
      (err) => {
        console.error(err);
        setError("Failed to load onboarding submissions.");
      }
    );

    return () => unsub();
  }, []);

  const pending = useMemo(
    () => items.filter((x) => String(x.status || "").toLowerCase() === "pending"),
    [items]
  );
  const approved = useMemo(
    () => items.filter((x) => String(x.status || "").toLowerCase() === "approved"),
    [items]
  );
  const rejected = useMemo(
    () => items.filter((x) => String(x.status || "").toLowerCase() === "rejected"),
    [items]
  );

  // ----------------------------
  // APPROVE (sends email)
  // ----------------------------
  const approve = async (row) => {
    setError("");
    setBusyId(row.id);

    try {
      if (!row?.uid || !row?.email) {
        throw new Error("Submission missing uid/email. Cannot approve.");
      }

      // 1) Mark submission approved
      await updateDoc(doc(db, "onboardingSubmissions", row.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
      });

      // 2) Create/merge user profile for routing
      await setDoc(
        doc(db, "users", row.uid),
        {
          email: row.email,
          role: "client",
          companyName: row.companyName || "",
          contactPerson: row.contactPerson || "",
          address: row.address || "",
          vatOrReg: row.vatOrReg || "",
          createdAt: serverTimestamp(),
          isActive: true,
        },
        { merge: true }
      );

      // 3) Trigger email via Firebase Extension (mail collection)
      await addDoc(collection(db, "mail"), {
        to: row.email,
        message: {
          subject: "Seshego Portal Access Approved",
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.6;">
              <h2 style="margin:0 0 10px;">Your portal access is approved ✅</h2>
              <p style="margin:0 0 12px;">
                Hello ${escapeHtml(row.contactPerson || "there")},
              </p>
              <p style="margin:0 0 12px;">
                Your registration for <b>${escapeHtml(row.companyName || "your company")}</b> has been approved.
              </p>
              <p style="margin:0 0 12px;">
                You may now log in using the email and password you registered with.
              </p>
              <p style="margin:0 0 12px;">
                <b>Login link:</b> ${escapeHtml(window.location.origin)}/login
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;" />
              <p style="margin:0; color:#64748b; font-size:12px;">
                Seshego Consulting — Secure Client Portal
              </p>
            </div>
          `,
        },
      });
    } catch (e) {
      console.error(e);
      setError(e.message || "Approve failed.");
    } finally {
      setBusyId(null);
    }
  };

  // ----------------------------
  // REJECT (optional, but useful)
  // ----------------------------
  const reject = async (row) => {
    setError("");
    setBusyId(row.id);

    try {
      if (!row?.email) throw new Error("Submission missing email. Cannot reject.");

      const reason = (rejectReason[row.id] || "").trim();

      await updateDoc(doc(db, "onboardingSubmissions", row.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        rejectReason: reason || "",
      });

      await addDoc(collection(db, "mail"), {
        to: row.email,
        message: {
          subject: "Seshego Portal Registration Update",
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.6;">
              <h2 style="margin:0 0 10px;">Registration update</h2>
              <p style="margin:0 0 12px;">
                Hello ${escapeHtml(row.contactPerson || "there")},
              </p>
              <p style="margin:0 0 12px;">
                Your registration could not be approved at this time.
              </p>
              ${
                reason
                  ? `<p style="margin:0 0 12px;"><b>Reason:</b> ${escapeHtml(reason)}</p>`
                  : ""
              }
              <p style="margin:0 0 12px;">
                Please contact support if you need assistance.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;" />
              <p style="margin:0; color:#64748b; font-size:12px;">
                Seshego Consulting — Secure Client Portal
              </p>
            </div>
          `,
        },
      });
    } catch (e) {
      console.error(e);
      setError(e.message || "Reject failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: 22 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
          Onboarding Review
        </h1>
        <p style={{ marginTop: 8, marginBottom: 18, color: "#334155" }}>
          Approve pending registrations. Approval creates the client profile and sends an email automatically.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(239, 68, 68, 0.10)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#b91c1c",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <Section title={`Pending (${pending.length})`}>
          {pending.length === 0 ? (
            <Empty />
          ) : (
            pending.map((row) => (
              <Card key={row.id}>
                <RowTop
                  title={row.companyName || "Company"}
                  subtitle={`${row.contactPerson || "Contact"} • ${row.email || ""}`}
                  badge="PENDING"
                />

                <div style={grid()}>
                  <Info label="Address" value={row.address || "—"} />
                  <Info label="VAT/Reg" value={row.vatOrReg || "—"} />
                  <Info label="UID" value={row.uid || "—"} mono />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  <button
                    onClick={() => approve(row)}
                    disabled={busyId === row.id}
                    style={btnPrimary(busyId === row.id)}
                  >
                    {busyId === row.id ? "Approving..." : "Approve + Email"}
                  </button>

                  <div style={{ flex: 1, minWidth: 240 }}>
                    <input
                      value={rejectReason[row.id] || ""}
                      onChange={(e) =>
                        setRejectReason((p) => ({ ...p, [row.id]: e.target.value }))
                      }
                      placeholder="Reject reason (optional)"
                      style={input()}
                    />
                  </div>

                  <button
                    onClick={() => reject(row)}
                    disabled={busyId === row.id}
                    style={btnGhostDanger(busyId === row.id)}
                  >
                    Reject + Email
                  </button>
                </div>
              </Card>
            ))
          )}
        </Section>

        <div style={{ height: 18 }} />

        <Section title={`Approved (${approved.length})`}>
          {approved.length === 0 ? (
            <Empty />
          ) : (
            approved.slice(0, 10).map((row) => (
              <Card key={row.id}>
                <RowTop
                  title={row.companyName || "Company"}
                  subtitle={`${row.contactPerson || "Contact"} • ${row.email || ""}`}
                  badge="APPROVED"
                  badgeColor="#16a34a"
                />
              </Card>
            ))
          )}
        </Section>

        <div style={{ height: 18 }} />

        <Section title={`Rejected (${rejected.length})`}>
          {rejected.length === 0 ? (
            <Empty />
          ) : (
            rejected.slice(0, 10).map((row) => (
              <Card key={row.id}>
                <RowTop
                  title={row.companyName || "Company"}
                  subtitle={`${row.contactPerson || "Contact"} • ${row.email || ""}`}
                  badge="REJECTED"
                  badgeColor="#ef4444"
                />
                {row.rejectReason ? (
                  <div style={{ marginTop: 10, color: "#334155" }}>
                    <b>Reason:</b> {row.rejectReason}
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </Section>
      </div>
    </div>
  );
}

/* -----------------------
   Small UI helpers
----------------------- */

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontWeight: 900, color: "#0f172a", marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(15,23,42,0.10)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 10px 24px rgba(2,6,23,0.06)",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function RowTop({ title, subtitle, badge, badgeColor = "#f97316" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: "#0f172a" }}>{title}</div>
        <div style={{ marginTop: 4, color: "#334155" }}>{subtitle}</div>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 900,
          padding: "6px 10px",
          borderRadius: 999,
          background: "rgba(2,6,23,0.04)",
          border: "1px solid rgba(15,23,42,0.10)",
          color: badgeColor,
          whiteSpace: "nowrap",
        }}
      >
        {badge}
      </span>
    </div>
  );
}

function Info({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 900, color: "#475569" }}>{label}</div>
      <div
        style={{
          marginTop: 6,
          color: "#0f172a",
          fontWeight: 700,
          fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
          fontSize: mono ? 12 : 14,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        border: "1px dashed rgba(15,23,42,0.18)",
        color: "#64748b",
        background: "rgba(2,6,23,0.02)",
      }}
    >
      Nothing here yet.
    </div>
  );
}

function grid() {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 12,
  };
}

function input() {
  return {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.15)",
    outline: "none",
  };
}

function btnPrimary(disabled) {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 14px",
    fontWeight: 900,
    background: "#2563eb",
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.8 : 1,
  };
}

function btnGhostDanger(disabled) {
  return {
    border: "1px solid rgba(239, 68, 68, 0.25)",
    borderRadius: 12,
    padding: "11px 14px",
    fontWeight: 900,
    background: "rgba(239, 68, 68, 0.06)",
    color: "#b91c1c",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.8 : 1,
  };
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
