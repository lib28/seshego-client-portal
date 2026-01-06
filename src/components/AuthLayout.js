import logo from "../assets/seshego-logo.png";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, var(--brand-dark), var(--bg-page))",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "min(440px, 100%)",
          background: "var(--bg-glass)",
          backdropFilter: "blur(14px)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-soft)",
          padding: 32,
          color: "var(--text-invert)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={logo}
            alt="Seshego Consulting"
            style={{ width: 200, marginBottom: 10 }}
          />
          <h2 style={{ margin: 0 }}>{title}</h2>
          <p style={{ opacity: 0.85 }}>{subtitle}</p>
        </div>

        {children}

        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          © {new Date().getFullYear()} Seshego Consulting
        </p>
      </div>
    </div>
  );
}
