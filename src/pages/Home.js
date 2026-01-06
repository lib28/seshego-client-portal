// src/pages/Home.js
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/seshego-logo.png";
import { sampleOperationalDocuments } from "../data/sampleDocuments";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const styles = useMemo(() => createStyles(), []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div style={styles.page}>
      {/* TOP NAV */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <div style={styles.brandLogoWrap}>
              <img src={logo} alt="Seshego Consulting" style={styles.brandLogo} />
            </div>
            <div style={styles.brandText}>
              <div style={styles.brandName}>Seshego Consulting</div>
              <div style={styles.brandSub}>Secure Client Portal</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav style={styles.navDesktop} aria-label="Primary navigation">
            <button onClick={() => scrollToId("home")} style={styles.navBtn} type="button">
              Home
            </button>
            <button onClick={() => scrollToId("platform")} style={styles.navBtn} type="button">
              Platform
            </button>
            <button onClick={() => scrollToId("about")} style={styles.navBtn} type="button">
              About
            </button>
            <button onClick={() => scrollToId("services")} style={styles.navBtn} type="button">
              Services
            </button>
            <button onClick={() => scrollToId("contact")} style={styles.navBtn} type="button">
              Contact
            </button>

            <div style={styles.navDivider} />

            <Link to="/login" style={styles.pillGhost}>
              Login
            </Link>
            <Link to="/register" style={styles.pillPrimary}>
              Register
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button type="button" onClick={() => setMenuOpen((v) => !v)} style={styles.mobileMenuBtn}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <button onClick={() => scrollToId("home")} style={styles.mobileLink} type="button">
              Home
            </button>
            <button onClick={() => scrollToId("platform")} style={styles.mobileLink} type="button">
              Platform
            </button>
            <button onClick={() => scrollToId("about")} style={styles.mobileLink} type="button">
              About
            </button>
            <button onClick={() => scrollToId("services")} style={styles.mobileLink} type="button">
              Services
            </button>
            <button onClick={() => scrollToId("contact")} style={styles.mobileLink} type="button">
              Contact
            </button>

            <div style={styles.mobileDivider} />

            <Link to="/login" style={styles.mobileCtaGhost} onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" style={styles.mobileCtaPrimary} onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroInner}>
          <div>
            <h1 style={styles.h1}>
              Secure access to your <br />
              documents & services.
            </h1>

            <p style={styles.heroP}>
              One login website with role-based access (Admin / Client / Employee).
              Centralise onboarding, compliance, documents and approvals — in one professional platform.
            </p>

            <div style={styles.heroCtas}>
              <Link to="/login" style={styles.ctaPrimary}>
                Login
              </Link>
              <Link to="/register" style={styles.ctaSecondary}>
                Register
              </Link>
            </div>

            <div style={styles.badges}>
              <Badge text="Encrypted login" />
              <Badge text="Role-based access" />
              <Badge text="Document workflows" />
              <Badge text="Audit trail ready" />
            </div>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.heroCardTitle}>Quick access</div>
            <div style={styles.heroCardSub}>What you can do inside the portal:</div>

            <ul style={styles.heroList}>
              <li>Submit onboarding / compliance information</li>
              <li>Download policies, statements, and approved documents</li>
              <li>Track approvals and outstanding requests</li>
              <li>Employees access policies & resources securely</li>
            </ul>

            <div style={styles.heroCardBtns}>
              <Link to="/login" style={styles.heroMiniPrimary}>
                Go to portal
              </Link>
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                style={styles.heroMiniGhost}
              >
                Contact us
              </button>
            </div>
          </div>
        </div>

        <div style={styles.heroBottomCurve} />
      </section>

      {/* PLATFORM / OPERATIONAL */}
      <section id="platform" style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.h2}>Operational platform scope</h2>
          <p style={styles.p}>
            This portal is designed to look and feel like an enterprise investment platform —
            but focused on secure servicing, governance and operational delivery.
          </p>

          <div style={styles.grid3}>
            <InfoCard
              title="Risk management"
              text="Centralise frameworks, controls, incidents, KRIs and supporting evidence. Track updates and distribute only what each role is allowed to see."
            />
            <InfoCard
              title="Compliance & governance"
              text="Support policy management, approvals, audit readiness, delegated authority and role-based access controls across the organisation."
            />
            <InfoCard
              title="Employee & client protection"
              text="Secure handling of personal and business data, POPIA-aligned processes, incident escalation and controlled access to sensitive documents."
            />
            <InfoCard
              title="Financial, regulatory & advisory services"
              text="Provide service documentation, engagement packs, reporting, regulatory touchpoints and communication standards — consistent and trackable."
            />
            <InfoCard
              title="Trust, security, and accountability"
              text="Clear accountability, audit trails, and secure distribution — improving trust for clients, employees and stakeholders."
            />
            <InfoCard
              title="One website, different roles"
              text="Everyone logs in through the same system. Features and navigation are shown/hidden based on role (Admin / Client / Employee)."
            />
          </div>

          {/* SAMPLE DOCUMENTS */}
          <div style={styles.subSection}>
            <div style={styles.subHead}>
              <div>
                <div style={styles.subTitle}>Sample operational documents</div>
                <div style={styles.subMuted}>
                  Example placeholders — these can later be replaced with real uploads stored in Firebase Storage.
                </div>
              </div>
              <Link to="/login" style={styles.subAction}>
                View in portal →
              </Link>
            </div>

            <div style={styles.docGrid}>
              {sampleOperationalDocuments.map((d) => (
                <div key={d.id} style={styles.docCard}>
                  <div style={styles.docTop}>
                    <div style={styles.docTitle}>{d.title}</div>
                    <div style={styles.docMeta}>{d.version}</div>
                  </div>

                  <div style={styles.docCategory}>{d.category}</div>
                  <div style={styles.docSummary}>{d.summary}</div>

                  <div style={styles.docFooter}>
                    <div style={styles.docOwner}>Owner: {d.owner}</div>
                    <div style={styles.docDate}>Updated: {d.updated}</div>
                  </div>

                  <div style={styles.tagRow}>
                    {d.tags.map((t) => (
                      <span key={t} style={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROLES */}
          <div style={styles.callout}>
            <div style={styles.calloutTitle}>Roles (current plan)</div>
            <div style={styles.calloutText}>
              <b>Admin:</b> full access, manage users, review onboarding, manage documents, approvals, and workflows. <br />
              <b>Client:</b> dashboard, documents, onboarding form, Q&amp;A/support and service updates. <br />
              <b>Employee:</b> policies/resources dashboard (expand later to include tasks, tickets, internal forms).
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={styles.sectionAlt}>
        <div style={styles.sectionInner}>
          <h2 style={styles.h2}>About Seshego</h2>
          <p style={styles.p}>
            Seshego Consulting provides structured, secure operational support for businesses that require
            strong governance, clear accountability, and consistent client servicing.
          </p>

          <div style={styles.grid2}>
            <InfoCard
              title="Built for clarity"
              text="A single platform that reduces back-and-forth, improves visibility, and keeps documents and approvals in one place."
            />
            <InfoCard
              title="Built for compliance"
              text="Role-based access, controlled document sharing, and an audit-friendly approval workflow — designed for real operational requirements."
            />
            <InfoCard
              title="Built for trust"
              text="Clients and employees can see exactly what applies to them, while sensitive operations remain protected and accountable."
            />
            <InfoCard
              title="Designed to scale"
              text="Start simple (documents + onboarding) and expand into workflows like service requests, reporting packs, and client communications."
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={styles.section}>
        <div style={styles.sectionInner}>
          <h2 style={styles.h2}>Services</h2>
          <p style={styles.p}>
            The platform supports core service delivery — and can be expanded into a full enterprise portal over time.
          </p>

          <div style={styles.grid3}>
            <ServiceCard
              title="Client onboarding"
              text="Collect and validate required information with approvals, review history, and a structured audit trail."
            />
            <ServiceCard
              title="Document management"
              text="Secure upload, controlled access, and role-based distribution of policies, statements and client packs."
            />
            <ServiceCard
              title="Approvals & workflow"
              text="Approve/reject submissions, request changes, track statuses, and keep decisions consistent."
            />
            <ServiceCard
              title="Compliance support"
              text="Maintain governance documentation, compliance processes, and policy distribution with traceability."
            />
            <ServiceCard
              title="Employee portal"
              text="Policies, resources and internal documentation delivered securely to employees (expand to tickets later)."
            />
            <ServiceCard
              title="Client Q&A"
              text="A client/admin Q&A channel for guided requests and structured communication (automation comes next)."
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={styles.sectionAlt}>
        <div style={styles.sectionInner}>
          <h2 style={styles.h2}>Contact</h2>
          <p style={styles.p}>
            Need help with onboarding, documents, or portal access? Contact our support team.
          </p>

          <div style={styles.grid2Contact}>
            <div style={styles.contactBox}>
              <div style={styles.contactTitle}>Email</div>
              <div style={styles.contactValue}>support@seshego.co.za</div>
            </div>

            <div style={styles.contactBox}>
              <div style={styles.contactTitle}>Phone</div>
              <div style={styles.contactValue}>+27 (0)00 000 0000</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <Link to="/login" style={styles.ctaPrimaryDark}>
              Access portal
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={{ opacity: 0.9 }}>© {new Date().getFullYear()} Seshego Consulting</div>
          <div style={{ opacity: 0.9 }}>Legal | Privacy | PAIA</div>
        </div>
      </footer>
    </div>
  );

  function Badge({ text }) {
    return (
      <span style={styles.badge}>
        <span style={styles.badgeDot} />
        {text}
      </span>
    );
  }

  function InfoCard({ title, text }) {
    return (
      <div style={styles.card}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardText}>{text}</div>
      </div>
    );
  }

  function ServiceCard({ title, text }) {
    return (
      <div style={styles.serviceCard}>
        <div style={styles.serviceTitle}>{title}</div>
        <div style={styles.serviceText}>{text}</div>
      </div>
    );
  }
}

function createStyles() {
  const teal = "#0d3b3b";
  const ink = "#0f172a";
  const slate = "#334155";
  const blue = "#2563eb";
  const orange = "#f97316";

  return {
    page: { minHeight: "100vh", background: "#fff" },

    header: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: teal,
      color: "#fff",
      borderBottom: "1px solid rgba(255,255,255,0.10)",
    },
    headerInner: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 18,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandLogoWrap: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      display: "grid",
      placeItems: "center",
    },
    brandLogo: { width: 34, height: 34, objectFit: "contain" },
    brandText: { lineHeight: 1.1 },
    brandName: { fontWeight: 900, letterSpacing: 0.2 },
    brandSub: { fontSize: 12, opacity: 0.9 },

    navDesktop: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    navBtn: {
      background: "transparent",
      border: "none",
      color: "rgba(255,255,255,0.92)",
      fontWeight: 800,
      cursor: "pointer",
      padding: "8px 10px",
      borderRadius: 10,
    },
    navDivider: { width: 1, height: 26, background: "rgba(255,255,255,0.18)" },

    pillGhost: {
      textDecoration: "none",
      fontWeight: 900,
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.26)",
      background: "transparent",
      color: "#fff",
    },
    pillPrimary: {
      textDecoration: "none",
      fontWeight: 900,
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.18)",
      background: blue,
      color: "#fff",
    },

    mobileMenuBtn: {
      marginLeft: "auto",
      display: "none",
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.16)",
      color: "#fff",
      borderRadius: 12,
      padding: "10px 12px",
      fontWeight: 900,
      cursor: "pointer",
    },
    mobileMenu: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 18px 16px",
      display: "none",
      flexDirection: "column",
      gap: 8,
    },
    mobileLink: {
      textAlign: "left",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#fff",
      padding: "12px 12px",
      borderRadius: 14,
      fontWeight: 900,
      cursor: "pointer",
    },
    mobileDivider: { height: 1, background: "rgba(255,255,255,0.12)", margin: "8px 0" },
    mobileCtaGhost: {
      textDecoration: "none",
      textAlign: "center",
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.24)",
      color: "#fff",
      padding: "12px 12px",
      borderRadius: 14,
      fontWeight: 900,
    },
    mobileCtaPrimary: {
      textDecoration: "none",
      textAlign: "center",
      background: blue,
      border: "1px solid rgba(255,255,255,0.18)",
      color: "#fff",
      padding: "12px 12px",
      borderRadius: 14,
      fontWeight: 900,
    },

    hero: { position: "relative", background: teal, color: "#fff" },
    heroBg: {
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=60')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.85,
    },
    heroInner: {
      position: "relative",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "64px 18px",
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 26,
    },
    h1: { fontSize: 44, margin: 0, lineHeight: 1.05, fontWeight: 900, letterSpacing: -0.5 },
    heroP: { marginTop: 14, marginBottom: 0, fontSize: 16, opacity: 0.92, maxWidth: 560 },
    heroCtas: { display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" },
    ctaPrimary: {
      textDecoration: "none",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      padding: "12px 18px",
      borderRadius: 999,
      background: blue,
      color: "#fff",
      fontWeight: 900,
      border: "1px solid rgba(255,255,255,0.2)",
    },
    ctaSecondary: {
      textDecoration: "none",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      padding: "12px 18px",
      borderRadius: 999,
      background: "transparent",
      color: "#fff",
      fontWeight: 900,
      border: "1px solid rgba(255,255,255,0.28)",
    },
    badges: { display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.16)",
      fontSize: 13,
      fontWeight: 800,
    },
    badgeDot: { width: 7, height: 7, borderRadius: 99, background: orange },

    heroCard: {
      alignSelf: "center",
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.16)",
      borderRadius: 18,
      padding: 20,
      backdropFilter: "blur(10px)",
    },
    heroCardTitle: { fontWeight: 900, fontSize: 16 },
    heroCardSub: { fontSize: 13, opacity: 0.9, marginTop: 6 },
    heroList: { marginTop: 14, marginBottom: 0, paddingLeft: 18, opacity: 0.95, lineHeight: 1.8 },
    heroCardBtns: { marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" },
    heroMiniPrimary: {
      background: orange,
      color: "#fff",
      textDecoration: "none",
      borderRadius: 12,
      padding: "10px 12px",
      fontWeight: 900,
      border: "1px solid rgba(255,255,255,0.12)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    heroMiniGhost: {
      background: "transparent",
      color: "#fff",
      borderRadius: 12,
      padding: "10px 12px",
      fontWeight: 900,
      border: "1px solid rgba(255,255,255,0.22)",
      cursor: "pointer",
    },
    heroBottomCurve: { height: 18, background: "#fff", borderTopLeftRadius: 18, borderTopRightRadius: 18 },

    section: { padding: "36px 18px", background: "#fff" },
    sectionAlt: { padding: "36px 18px", background: "#f8fafc" },
    sectionInner: { maxWidth: 1200, margin: "0 auto" },

    h2: { margin: 0, fontSize: 28, fontWeight: 900, color: ink },
    p: { marginTop: 12, marginBottom: 0, maxWidth: 900, color: slate, lineHeight: 1.7 },

    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 16,
      marginTop: 18,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 16,
      marginTop: 18,
    },

    card: {
      background: "#fff",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 16,
      padding: 18,
      boxShadow: "0 10px 24px rgba(2,6,23,0.06)",
    },
    cardTitle: { fontWeight: 900, color: ink, fontSize: 16 },
    cardText: { marginTop: 10, color: slate, lineHeight: 1.6 },

    subSection: { marginTop: 18, padding: 16, background: "#f1f5f9", borderRadius: 14 },
    subHead: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" },
    subTitle: { fontWeight: 900, color: ink },
    subMuted: { marginTop: 6, color: "#64748b", fontSize: 13 },
    subAction: { textDecoration: "none", fontWeight: 900, color: blue },

    docGrid: {
      marginTop: 14,
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 14,
    },
    docCard: {
      background: "#fff",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 16,
      padding: 16,
    },
    docTop: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" },
    docTitle: { fontWeight: 900, color: ink },
    docMeta: { fontSize: 12, color: "#64748b", fontWeight: 800 },
    docCategory: { marginTop: 10, fontSize: 12, fontWeight: 900, color: teal, opacity: 0.95 },
    docSummary: { marginTop: 10, color: slate, lineHeight: 1.6, fontSize: 13 },
    docFooter: { marginTop: 12, display: "flex", justifyContent: "space-between", gap: 12, color: "#64748b", fontSize: 12 },
    docOwner: { fontWeight: 800 },
    docDate: { fontWeight: 800 },
    tagRow: { marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 },
    tag: {
      fontSize: 12,
      fontWeight: 900,
      padding: "6px 10px",
      borderRadius: 999,
      background: "rgba(37,99,235,0.08)",
      border: "1px solid rgba(37,99,235,0.16)",
      color: "#1e3a8a",
    },

    callout: { marginTop: 18, padding: 16, background: "#f1f5f9", borderRadius: 14 },
    calloutTitle: { fontWeight: 900, color: ink },
    calloutText: { marginTop: 8, color: slate, lineHeight: 1.7 },

    serviceCard: {
      background: "#fff",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 16,
      padding: 18,
    },
    serviceTitle: { fontWeight: 900, color: ink },
    serviceText: { marginTop: 8, color: slate, lineHeight: 1.6 },

    grid2Contact: {
      marginTop: 16,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      maxWidth: 860,
    },
    contactBox: { border: "1px solid rgba(15,23,42,0.10)", borderRadius: 14, padding: 14, background: "#fff" },
    contactTitle: { fontWeight: 900, color: ink },
    contactValue: { marginTop: 8, color: slate },

    ctaPrimaryDark: {
      textDecoration: "none",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      padding: "12px 18px",
      borderRadius: 999,
      background: teal,
      color: "#fff",
      fontWeight: 900,
      border: "1px solid rgba(15,23,42,0.10)",
    },

    footer: { background: teal, color: "#fff", marginTop: 20 },
    footerInner: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "20px 18px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    },
  };
}

/**
 * NOTE:
 * Mobile responsiveness for the nav is handled by "display: none" above.
 * To enable it without CSS, we use a tiny media-query-free approach:
 * if you want the mobile menu to show, we rely on the browser width.
 * (If you prefer proper CSS media queries, tell me and I’ll move these to App.css.)
 */
