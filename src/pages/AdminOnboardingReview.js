// src/pages/AdminOnboardingReview.js
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

export default function AdminOnboardingReview() {
  const [loading, setLoading] = useState(true);

  // all submissions from Firestore
  const [items, setItems] = useState([]);

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | submitted | approved | rejected

  // ---------------------------
  // Helpers
  // ---------------------------
  const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

  const canAccess = async (firebaseUser) => {
    if (!firebaseUser) return false;
    const snap = await getDoc(doc(db, "users", firebaseUser.uid));
    return snap.exists() && snap.data()?.role === "admin";
  };

  const fetchSubmissions = async () => {
    // newest first (if createdAt exists)
    const q = query(
      collection(db, "onboardingSubmissions"),
      orderBy("createdAt", "desc"),
      limit(200)
    );

    const snap = await getDocs(q);
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setItems(rows);
  };

  // ---------------------------
  // Load
  // ---------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const ok = await canAccess(u);
        if (!ok) {
          setItems([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        await fetchSubmissions();
      } catch (e) {
        console.error("AdminOnboardingReview load error:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // ---------------------------
  // Derived
  // ---------------------------
  const counts = useMemo(() => {
    const c = {
      total: items.length,
      pending: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
    };

    for (const x of items) {
      const s = normalize(x.status) || "pending";
      if (s === "pending") c.pending += 1;
      else if (s === "submitted") c.submitted += 1;
      else if (s === "approved") c.approved += 1;
      else if (s === "rejected") c.rejected += 1;
    }
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const s = normalize(search);
    const status = normalize(statusFilter);

    return items.filter((x) => {
      const xStatus = normalize(x.status) || "pending";

      // status filter
      if (status !== "all" && xStatus !== status) return false;

      // text search across likely fields
      if (!s) return true;

      const hay = [
        x.companyName,
        x.contactPerson,
        x.address,
        x.vatOrReg,
        x.email,
        x.userEmail,
        x.contactEmail,
        x.phone,
      ]
        .map(normalize)
        .join(" | ");

      return hay.includes(s);
    });
  }, [items, search, statusFilter]);

  // ---------------------------
  // Actions
  // ---------------------------
  const setStatus = async (row, nextStatus) => {
    try {
      // Optimistic UI
      setItems((prev) =>
        prev.map((x) => (x.id === row.id ? { ...x, status: nextStatus } : x))
      );

      await updateDoc(doc(db, "onboardingSubmissions", row.id), {
        status: nextStatus,
        reviewedAt: new Date(),
      });
    } catch (e) {
      console.error("Update status error:", e);
      // revert by reloading
      try {
        await fetchSubmissions();
      } catch (e2) {
        console.error("Reload after error failed:", e2);
      }
    }
  };

  const handleApprove = (row) => setStatus(row, "approved");
  const handleReject = (row) => setStatus(row, "rejected");

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="page portal-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Onboarding Review</h1>
          <p className="muted">
            Review submissions and approve/reject onboarding.
          </p>
        </div>

        {/* counts aligned like other pages */}
        <div className="header-actions column">
          <div className="stat-mini">Total: {counts.total}</div>
          <div className="stat-mini">Pending: {counts.pending}</div>
          <div className="stat-mini">Submitted: {counts.submitted}</div>
          <div className="stat-mini">Approved: {counts.approved}</div>
          <div className="stat-mini">Rejected: {counts.rejected}</div>
        </div>
      </div>

      {/* ✅ content wrap to align with dashboard */}
      <div className="content-wrap">
        <div className="card glass table-card">
          <div className="toolbar">
            <input
              className="input search"
              placeholder="Search company / contact / email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filter-row">
              {["all", "pending", "submitted", "approved", "rejected"].map(
                (s) => (
                  <button
                    key={s}
                    className={`filter-pill ${
                      statusFilter === s ? "active" : ""
                    }`}
                    onClick={() => setStatusFilter(s)}
                    type="button"
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {loading ? (
            <div className="table-empty">Loading submissions…</div>
          ) : filtered.length === 0 ? (
            <div className="table-empty">No submissions found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => {
                  const status = normalize(x.status) || "pending";

                  return (
                    <tr key={x.id}>
                      <td>
                        <div className="doc-title">
                          {x.companyName || "—"}
                        </div>
                        <div className="doc-sub muted">
                          {x.userEmail || x.email || "—"}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700 }}>
                          {x.contactPerson || "—"}
                        </div>
                        <div className="muted">{x.phone || ""}</div>
                      </td>

                      <td>
                        <span className={`status-pill ${status}`}>
                          {status.toUpperCase()}
                        </span>
                      </td>

                      <td className="right">
                        <div className="table-actions">
                          <button
                            className="btn-action success"
                            onClick={() => handleApprove(x)}
                            type="button"
                            disabled={status === "approved"}
                            title={
                              status === "approved"
                                ? "Already approved"
                                : "Approve submission"
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn-action muted"
                            onClick={() => handleReject(x)}
                            type="button"
                            disabled={status === "rejected"}
                            title={
                              status === "rejected"
                                ? "Already rejected"
                                : "Reject submission"
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
