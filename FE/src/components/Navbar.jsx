import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import { 
  Home, 
  MessageCircle, 
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

const navItems = [
  { path: "/", label: "Beranda", icon: <Home className="h-4 w-4" />, end: true },
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, protected: true },
  { path: "/konsultasi", label: "Konsultasi", icon: <MessageCircle className="h-4 w-4" /> },
]

const handleProtectedRoute = (path) => {
  if (!isAuthenticated) {
    navigate("/login")
  } else {
    navigate(path)
  }
}
  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
    navigate("/")
  }

  const handleLogin = () => {
    navigate("/login")
    setIsMenuOpen(false)
  }

  const handleRegister = () => {
    navigate("/register")
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 w-full border-b bg-white z-50">
        <div className="flex px-6 py-4 justify-between items-center">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-16 w-16" />
          </NavLink>

          {/* ===== Desktop Menu ===== */}
          <div className="hidden lg:flex items-center space-x-1 bg-muted/30 rounded-full p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.protected && !isAuthenticated ? "/login" : item.path}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-primary hover:bg-white/50"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* ===== Desktop Auth ===== */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || "User"}
                  </span>
                  {/* <ChevronDown className="h-4 w-4 text-gray-500" /> */}
                </div>

                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </Button>
              </>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleLogin}>Login</Button>
                <Button variant="secondary" onClick={handleRegister}>Register</Button>
              </div>
            )}
          </div>

          {/* ===== Mobile Toggle ===== */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* ===== Mobile Menu ===== */}
      <div className={`lg:hidden fixed inset-0 z-40 ${isMenuOpen ? "block" : "hidden"}`}>
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />

        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg">
          
          {/* Profile */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User />
              </div>
              <div>
                <h3 className="font-semibold">
                  {isAuthenticated ? (user?.name || "User") : "Belum Login"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isAuthenticated ? "Online" : "Silakan login"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.protected && !isAuthenticated ? "/login" : item.path}
                end={item.end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-2 rounded-lg ${isActive ? "bg-primary/20" : "bg-gray-100"}`}>
                      {item.icon}
                    </div>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
            {isAuthenticated ? (
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleRegister}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
