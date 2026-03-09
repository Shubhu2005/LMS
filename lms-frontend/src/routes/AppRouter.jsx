import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage    from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import BooksPage    from "../pages/admin/BooksPage";
import BorrowManagement from "../pages/admin/BorrowManagement";
import StudentDashboard from "../pages/student/StudentDashboard";
import AdminDashboard   from "../pages/admin/AdminDashboard";
import MainLayout   from "../components/layout/MainLayout";

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return children;

  if (user?.role === "Admin" || user?.role === "Manager") return <Navigate to="/admin/dashboard" replace />;
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

        <Route path="/books" element={
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Student"]}>
            <MainLayout><BooksPage /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/borrows" element={
          <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <MainLayout><BorrowManagement /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <MainLayout><StudentDashboard /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
           <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <MainLayout><AdminDashboard /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/"      element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />        

        <Route path="/unauthorized" element={
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>?? Access Denied</h2>
            <p>You dont have permission to view this page.</p>
          </div>
        } />


      </Routes>
    </BrowserRouter>
  );
}
