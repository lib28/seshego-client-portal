import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ClientEmployees from "./pages/ClientEmployees";

/* =========================
   PUBLIC
========================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* =========================
   ROUTE GUARDS
========================= */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import EmployeeRoute from "./components/EmployeeRoute";

/* =========================
   LAYOUTS (OPTION B)
========================= */
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

/* =========================
   ADMIN PAGES
========================= */
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddDocument from "./pages/AdminAddDocument";
import AdminOnboardingReview from "./pages/AdminOnboardingReview";

/* =========================
   CLIENT PAGES
========================= */
import ClientDashboard from "./pages/ClientDashboard";
import ClientDocuments from "./pages/ClientDocuments";
import ClientOnboarding from "./pages/ClientOnboarding";
import ClientQA from "./pages/ClientQA";

/* =========================
   EMPLOYEE PAGES
========================= */
import EmployeeDashboard from "./pages/EmployeeDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================
            PUBLIC
        ===================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =====================
            CLIENT
        ===================== */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <ClientDashboard />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/documents"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <ClientDocuments />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/onboarding"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <ClientOnboarding />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/qa"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <ClientQA />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        {/* =====================
            ADMIN
        ===================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/documents/new"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminAddDocument />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/onboarding"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminOnboardingReview />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* =====================
            EMPLOYEE
        ===================== */}
        <Route
          path="/employee"
          element={
            <EmployeeRoute>
              <EmployeeLayout>
                <EmployeeDashboard />
              </EmployeeLayout>
            </EmployeeRoute>
          }
        />

        {/* =====================
            FALLBACK
        ===================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
<Route
  path="/client/employees"
  element={
    <ProtectedRoute>
      <ClientLayout>
        <ClientEmployees />
      </ClientLayout>
    </ProtectedRoute>
  }
/>
