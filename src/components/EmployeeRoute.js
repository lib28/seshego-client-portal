import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EmployeeRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  // IMPORTANT: prevent redirect while role is still null/undefined
  if (!role) return <p style={{ padding: 40 }}>Loading role…</p>;

  if (role !== "employee") {
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/client" replace />;
  }

  return children;
}
