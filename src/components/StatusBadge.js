export default function StatusBadge({ status }) {
  const styles = {
    pending: {
      bg: "#fef3c7",
      color: "#92400e",
    },
    approved: {
      bg: "#dcfce7",
      color: "#166534",
    },
    signed: {
      bg: "#dbeafe",
      color: "#1e40af",
    },
    archived: {
      bg: "#e5e7eb",
      color: "#374151",
    },
  };

  const style = styles[status] || styles.archived;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {status || "unknown"}
    </span>
  );
}
