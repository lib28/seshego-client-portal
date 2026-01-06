import { useEffect, useMemo, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db, functions } from "../firebase";

export default function ClientEmployees() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [employees, setEmployees] = useState([]);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    // Client sees employees they created (demo-friendly)
    const qRef = query(
      collection(db, "employees"),
      where("createdByUid", "==", uid)
    );

    const unsub = onSnapshot(qRef, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
      setEmployees(rows);
    });

    return () => unsub();
  }, [uid]);

  const createEmployeeFn = useMemo(
    () => httpsCallable(functions, "createEmployee"),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      await createEmployeeFn({ fullName, email });

      setMsg(
        "Employee created successfully. An email invite has been queued (check Trigger Email extension logs)."
      );

      setFullName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="muted">
            Create employee access and manage your team.
          </p>
        </div>
      </div>

      <div className="card glass form-card">
        <h3 style={{ marginTop: 0 }}>Add employee</h3>

        {error && (
          <div
            style={{
              marginBottom: 12,
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

        {msg && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(34, 197, 94, 0.10)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              color: "#166534",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} className="form">
          <div className="grid-2">
            <div className="form-group">
              <label>Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                type="email"
                required
              />
            </div>
          </div>

          <button
            className="btn-primary"
            disabled={loading}
            type="submit"
            style={{ width: "100%" }}
          >
            {loading ? "Creating…" : "Create employee access"}
          </button>

          <p className="muted" style={{ margin: 0, fontSize: 12 }}>
            This will create an employee login and send a temporary password.
          </p>
        </form>
      </div>

      <div className="card glass table-card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td className="empty" colSpan={3}>
                    <div className="empty-box">
                      <div className="empty-title">No employees yet</div>
                      <div className="empty-sub">
                        Add your first employee above.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="table-row-hover">
                    <td className="title">{emp.fullName}</td>
                    <td>{emp.email}</td>
                    <td>
                      <span className={"status-pill " + (emp.status || "")}>
                        {emp.status || "active"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
