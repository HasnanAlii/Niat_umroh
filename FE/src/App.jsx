import { BrowserRouter, Route, Routes } from "react-router"
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
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<DashboardJamaah />} />
            <Route path="/konsultasi" element={<Konsultasi />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<AdminLayout />}>
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
