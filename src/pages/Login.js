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
import { useNavigate, Link } from "react-router-dom";

import { auth, db } from "../firebase";
import logo from "../assets/seshego-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const normalizeRole = (value) =>
    String(value || "").trim().toLowerCase();

  const routeByRole = (role) => {
    if (role === "admin") return "/admin";
    if (role === "employee") return "/employee";
    return "/client";
  };

  const fetchRole = async (firebaseUser) => {
    // 1) Primary: users/{uid}
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return normalizeRole(snap.data().role);

    // 2) Fallback: users where email == current email
    const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
    const qs = await getDocs(q);

    if (!qs.empty) {
      const role = normalizeRole(qs.docs[0].data().role);

      // Optional auto-heal
      try {
        await setDoc(
          doc(db, "users", firebaseUser.uid),
          { email: firebaseUser.email, role, createdAt: serverTimestamp() },
          { merge: true }
        );
      } catch {}

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
    <div style={{ minHeight: "100vh", background: "#0d3b3b" }}>
      <TopBar />

      <div
        style={{
          position: "relative",
          minHeight: "calc(100vh - 72px)",
          display: "grid",
          placeItems: "center",
          padding: "26px 18px 46px",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.85,
          }}
        />

        <div
          style={{
            position: "relative",
            width: "min(520px, 100%)",
            borderRadius: 18,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 24px 70px rgba(2,6,23,0.35)",
            backdropFilter: "blur(12px)",
            padding: 22,
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
                background: "rgba(255,255,255,0.08)",
                padding: 10,
                borderRadius: 14,
              }}
            />
            <h2 style={{ margin: 0, color: "#fff", fontWeight: 900 }}>
              Portal Login
            </h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", textAlign: "center" }}>
              One website. Role-based access for Admin / Client / Employee.
            </p>
          </div>

          {error && (
            <div
              style={{
                marginTop: 16,
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(239, 68, 68, 0.16)",
                border: "1px solid rgba(239, 68, 68, 0.30)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ marginTop: 18 }}>
            <label style={labelStyle()}>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle()}
            />

            <label style={labelStyle()}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle({ marginBottom: 14 })}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.20)",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.85 : 1,
              }}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <div style={{ marginTop: 14, textAlign: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Need access? </span>
            <Link to="/register" style={{ color: "#fff", fontWeight: 900, textDecoration: "underline" }}>
              Register
            </Link>
          </div>

          <div style={{ marginTop: 18, textAlign: "center", color: "rgba(255,255,255,0.75)" }}>
            © {new Date().getFullYear()} Seshego Consulting
          </div>
        </div>
      </div>
    </div>
  );

  function TopBar() {
    return (
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0d3b3b",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img
              src={logo}
              alt="Seshego Consulting"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                objectFit: "contain",
                background: "rgba(255,255,255,0.08)",
                padding: 6,
              }}
            />
            <div style={{ lineHeight: 1.1, color: "#fff" }}>
              <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Seshego Consulting</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Secure Client Portal</div>
            </div>
          </Link>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/login" style={pill(false)}>Login</Link>
            <Link to="/register" style={pill(true)}>Register</Link>
          </div>
        </div>
      </header>
    );
  }

  function pill(primary) {
    return {
      textDecoration: "none",
      fontWeight: 900,
      padding: "10px 14px",
      borderRadius: 999,
      border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.26)",
      background: primary ? "#2563eb" : "transparent",
      color: "#fff",
    };
  }

  function labelStyle() {
    return {
      display: "block",
      fontWeight: 900,
      marginBottom: 6,
      color: "rgba(255,255,255,0.92)",
      letterSpacing: 0.2,
    };
  }

  function inputStyle(extra = {}) {
    return {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      outline: "none",
      marginBottom: 12,
      background: "rgba(255,255,255,0.10)",
      color: "#fff",
      ...extra,
    };
  }
}
