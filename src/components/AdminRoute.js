import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUserData } from "../services/userService";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const userData = await getCurrentUserData();
      if (userData?.role === "admin") {
        setAllowed(true);
      }
      setLoading(false);
    }
    checkRole();
  }, []);

  if (loading) return null;
  if (!allowed) return <Navigate to="/dashboard" />;

  return children;
}
