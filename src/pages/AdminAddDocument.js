// src/pages/AdminAddDocument.js
import { useEffect, useMemo, useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminAddDocument() {
  const [clients, setClients] = useState([]); // clients + employees
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(""); // selected user id
  const [status, setStatus] = useState("pending");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setAuthReady(!!user));
    return unsub;
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setClients(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.role === "client" || u.role === "employee")
      );
    };
    loadUsers();
  }, []);

  const selectedUser = useMemo(
    () => clients.find((c) => c.id === clientId),
    [clients, clientId]
  );

  const canSubmit = authReady && title.trim() && clientId && file && !loading;

  const formatBytes = (bytes = 0) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (!bytes) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authReady || !title || !clientId || !file) {
      alert("Complete all fields");
      return;
    }

    setLoading(true);

    try {
      const selectedUserLocal = clients.find((c) => c.id === clientId);
      if (!selectedUserLocal) {
        alert("Selected user not found");
        setLoading(false);
        return;
      }

      const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

      // Upload to Storage
      const fileRef = ref(storage, `documents/${clientId}/${safeName}`);
      await uploadBytes(fileRef, file, { contentType: "application/pdf" });
      const fileUrl = await getDownloadURL(fileRef);

      // Save document record
      await addDoc(collection(db, "documents"), {
        title: title.trim(),

        // client fields (keep for client portal)
        clientId: selectedUserLocal.role === "client" ? selectedUserLocal.id : null,
        clientEmail:
          selectedUserLocal.role === "client" ? selectedUserLocal.email : null,

        // employee fields (for employee portal)
        employeeId:
          selectedUserLocal.role === "employee" ? selectedUserLocal.id : null,
        employeeEmail:
          selectedUserLocal.role === "employee" ? selectedUserLocal.email : null,

        // helpful generic fields
        assignedRole: selectedUserLocal.role,
        assignedToId: selectedUserLocal.id,
        assignedToEmail: selectedUserLocal.email,

        status,
        fileUrl,
        fileName: file.name,
        createdAt: serverTimestamp(),
        uploadedBy: auth.currentUser?.email || "unknown",
      });

      alert("Document uploaded");
      setTitle("");
      setClientId("");
      setStatus("pending");
      setFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page portal-page">
      {/* HEADER */}
      <div className="page-header" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="page-title">Add Document</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Upload a PDF and assign it to a client or employee.
          </p>

          {selectedUser && (
            <p className="muted" style={{ marginTop: 10 }}>
              Assigning to:{" "}
              <strong style={{ color: "#0f172a" }}>
                {selectedUser.email}
              </strong>{" "}
              <span className="muted">({selectedUser.role})</span>
            </p>
          )}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="card glass" style={{ padding: 22 }}>
        <form onSubmit={handleSubmit}>
          {/* Section: Details */}
          <div style={{ display: "grid", gap: 14 }}>
            <div className="form-group">
              <label style={{ fontWeight: 600 }}>Document title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Employment Contract / Leave Policy"
              />
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Keep it short and clear. This is what users will see in their portal.
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.9fr",
                gap: 14,
              }}
            >
              <div className="form-group">
                <label style={{ fontWeight: 600 }}>Assign to</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">Select user</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.email} ({c.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 600 }}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="signed">Signed</option>
                </select>
              </div>
            </div>

            {/* Section: File */}
            <div className="form-group">
              <label style={{ fontWeight: 600 }}>Upload PDF</label>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 14,
                  borderRadius: 14,
                  border: "1px solid rgba(15, 23, 42, 0.10)",
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {file ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      background: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>
                        {file.name}
                      </div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                        {formatBytes(file.size)} • PDF
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: 12 }}>
                    Only PDF files are supported.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 6,
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setTitle("");
                  setClientId("");
                  setStatus("pending");
                  setFile(null);
                }}
                disabled={loading}
              >
                Clear
              </button>

              <button className="btn-primary" disabled={!canSubmit}>
                {loading ? "Uploading…" : "Upload Document"}
              </button>
            </div>

            {!authReady && (
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Checking admin session…
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
