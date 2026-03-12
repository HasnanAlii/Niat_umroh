import { BrowserRouter, Route, Routes, Navigate } from "react-router"
import { Home } from "@/pages/Home"
import { PublicLayout } from "@/layouts/PublicLayout"
import { AdminDashboard } from "@/pages/admin/AdminDashboard"
import { AdminTabungan } from "@/pages/admin/AdminTabungan"
import { AdminJamaah } from "@/pages/admin/AdminJamaah"
import { AdminLayout } from "@/layouts/AdminLayout"
import { DashboardJamaah } from "@/pages/DashboardJamaah"
import { AdminTempat } from "@/pages/admin/AdminTempat"
import { AdminTravel } from "@/pages/admin/AdminTravel"
import { Konsultasi } from "@/pages/Konsultasi"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
// Route guard for authenticated users
function RequireAuth({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;
  return children;
}
import { Toaster } from "@/components/ui/toaster"

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={
              <RequireAuth role="jamaah">
                <DashboardJamaah />
              </RequireAuth>
            } />
            <Route path="/konsultasi" element={<Konsultasi />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={
            <RequireAuth role="admin">
              <AdminLayout />
            </RequireAuth>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="tabungan" element={<AdminTabungan />} />
            <Route path="jamaah" element={<AdminJamaah />} />
            <Route path="travel" element={<AdminTravel />} />
            <Route path="tempat" element={<AdminTempat />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}
