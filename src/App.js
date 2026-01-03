import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

/* ========= ADMIN ========= */
import AdminDashboard from "./pages/AdminDashboard";
import AdminDocuments from "./pages/AdminDocuments";
import AdminAddDocument from "./pages/AdminAddDocument";
import AdminOnboardingReview from "./pages/AdminOnboardingReview";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";

/* ========= CLIENT ========= */
import ClientDashboard from "./pages/ClientDashboard";
import ClientDocuments from "./pages/ClientDocuments";
import ClientOnboarding from "./pages/ClientOnboarding";
import ClientLayout from "./components/ClientLayout";
import ProtectedRoute from "./components/ProtectedRoute";

/* ========= EMPLOYEE ========= */
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeLayout from "./components/EmployeeLayout";
import EmployeeRoute from "./components/EmployeeRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* CLIENT */}
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

        {/* ADMIN */}
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
          path="/admin/documents"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDocuments />
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

        {/* EMPLOYEE */}
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

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
