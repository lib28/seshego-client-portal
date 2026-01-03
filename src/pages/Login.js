// src/pages/Login.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import logo from "../assets/seshego-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const normalizeRole = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const routeByRole = (role) => {
    if (role === "admin") return "/admin";
    if (role === "employee") return "/employee";
    // default
    return "/client";
  };

  const fetchRole = async (firebaseUser) => {
    // 1) Primary: users/{uid}
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return normalizeRole(snap.data().role);
    }

    // 2) Fallback: users where email == current email (handles UID mismatch / recreated user)
    const q = query(
      collection(db, "users"),
      where("email", "==", firebaseUser.email)
    );
    const qs = await getDocs(q);

    if (!qs.empty) {
      const role = normalizeRole(qs.docs[0].data().role);

      // Optional auto-heal: create/overwrite users/{uid} so next login is instant
      // (This does NOT change your app logic; it just fixes missing profile docs.)
      try {
        await setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            email: firebaseUser.email,
            role,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch {
        // ignore if rules block write (you can keep manual creation in console)
      }

      return role;
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Debug help (safe to keep or remove)
      console.log("SIGNED IN EMAIL:", res.user.email);
      console.log("SIGNED IN UID:", res.user.uid);

      const role = await fetchRole(res.user);

      if (!role) {
        setError(
          "User profile not found. Please ask admin to create your profile in Firestore > users (role: admin/client/employee)."
        );
        return;
      }

      navigate(routeByRole(role), { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        className="login-card"
        style={{
          width: "min(420px, 100%)",
          padding: 28,
          borderRadius: 16,
        }}
      >
        <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
          <img
            src={logo}
            alt="Seshego Consulting"
            style={{
              width: 220,
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              marginBottom: 6,
            }}
          />
          <h2 style={{ margin: 0 }}>Sign in</h2>
          <p className="muted" style={{ margin: 0, textAlign: "center" }}>
            Access your portal securely
          </p>
        </div>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.10)",
              color: "#b91c1c",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(15,23,42,0.15)",
              outline: "none",
              marginBottom: 12,
            }}
          />

          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: 10,
              border: "1px solid rgba(15,23,42,0.15)",
              outline: "none",
              marginBottom: 16,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              fontWeight: 700,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 14, textAlign: "center" }}>
          © {new Date().getFullYear()} Seshego Consulting
        </p>
      </div>
    </div>
  );
}
