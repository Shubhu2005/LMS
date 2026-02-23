import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage    from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import BooksPage    from "../pages/admin/BooksPage";
import MainLayout   from "../components/layout/MainLayout";

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return children;

  if (user?.role === "Admin" || user?.role === "Manager") return <Navigate to="/admin/books" replace />;
  if (user?.role === "Student") return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        <Route path="/admin/books" element={
          <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <MainLayout><BooksPage /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <div style={{ padding: 40, fontSize: 24 }}>
              📚 Student Dashboard (coming soon)
            </div>
          </ProtectedRoute>
        } />

        <Route path="/"      element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/books" replace />} />

        <Route path="/unauthorized" element={
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>🚫 Access Denied</h2>
            <p>You don't have permission to view this page.</p>
          </div>
        } />

       
      </Routes>
    </BrowserRouter>
  );
}