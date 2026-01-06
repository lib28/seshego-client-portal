// src/pages/Register.js
import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

import { auth, db } from "../firebase";
import logo from "../assets/seshego-logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [vatOrReg, setVatOrReg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      // Create auth user (so they can later login once approved)
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create onboarding submission for admin review
      await addDoc(collection(db, "onboardingSubmissions"), {
        companyName,
        contactPerson,
        address,
        vatOrReg,

        email: res.user.email,
        uid: res.user.uid,

        status: "pending", // admin approves/rejects
        createdAt: serverTimestamp(),
      });

      // Optional: sign them out immediately until approved
      await signOut(auth);

      setMsg(
        "Registration submitted. Your account is pending approval. You will be able to login once approved."
      );

      // Clear form
      setCompanyName("");
      setContactPerson("");
      setAddress("");
      setVatOrReg("");
      setEmail("");
      setPassword("");

      // ✅ Option A: use navigate so ESLint is happy + better UX
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);

      if (err?.code === "auth/email-already-in-use") {
        setError("That email is already registered. Please login instead.");
      } else if (err?.code === "auth/weak-password") {
        setError("Password too weak. Use at least 6 characters.");
      } else {
        setError(err?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-bg">
      <div className="portal-frame">
        <div style={{ padding: 26 }}>
          <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
            <img
              src={logo}
              alt="Seshego Consulting"
              style={{ width: 220, maxWidth: "100%" }}
            />
            <h2 style={{ margin: 0 }}>Register</h2>
            <p className="muted" style={{ margin: 0, textAlign: "center" }}>
              Submit details for approval
            </p>
          </div>

          {error && (
            <div
              style={{
                marginTop: 16,
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
                marginTop: 16,
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

          <form onSubmit={handleRegister} style={{ marginTop: 18 }}>
            <div className="card glass" style={{ padding: 16, marginBottom: 14 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Company name</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact person</label>
                  <input
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginTop: 12 }}>
                <label>VAT / Registration</label>
                <input
                  value={vatOrReg}
                  onChange={(e) => setVatOrReg(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="card glass" style={{ padding: 16 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="you@company.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    placeholder="Minimum 6 characters"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: 14,
                  padding: "12px 14px",
                  borderRadius: 14,
                  fontWeight: 900,
                }}
              >
                {loading ? "Submitting…" : "Submit Registration"}
              </button>

              <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                After submission, an admin will approve or reject access.
              </p>
            </div>
          </form>

          <div style={{ marginTop: 14, textAlign: "center" }}>
            <span className="muted">Already registered? </span>
            <Link to="/login" className="link" style={{ fontWeight: 800 }}>
              Login
            </Link>
          </div>

          <p className="muted" style={{ marginTop: 18, textAlign: "center" }}>
            © {new Date().getFullYear()} Seshego Consulting
          </p>
        </div>
      </div>
    </div>
  );
}
