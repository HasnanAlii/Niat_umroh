import { useEffect, useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router"
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Plane, 
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Home,
  FileText,
  Calendar,
  BarChart3,
  Shield,
  HelpCircle,
  MapPin,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Modal from "@/components/ui/Modal"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const AdminLayout = () => {
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState({
    name: "Admin",
    email: "",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin-niat",
    phone: "",
    address: "",
  })
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    password_confirmation: "",
  })
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true)
        const res = await apiClient.getProfile()
        const userPayload = res?.user || res || {}

        const mappedUser = {
          name: userPayload.name || "Admin",
          email: userPayload.email || "",
          role: userPayload.role || "Admin",
          avatar: userPayload.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin-niat",
          phone: userPayload.phone || userPayload.jamaah?.phone || "",
          address: userPayload.address || userPayload.jamaah?.address || "",
        }

        setUser(mappedUser)
        setProfileData({
          name: mappedUser.name,
          email: mappedUser.email,
          phone: mappedUser.phone,
          address: mappedUser.address,
          password: "",
          password_confirmation: "",
        })
      } catch (error) {
        console.error("Error fetching admin profile:", error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    let mounted = true

    const fetchNotifications = async () => {
      try {
        if (mounted) setNotificationsLoading(true)
        const res = await apiClient.getNotifications(12)
        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : []

        if (mounted) {
          setNotifications(data)
          setUnreadCount(Number(res?.unread_count || data.filter((n) => n?.unread).length || 0))
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
        if (mounted) {
          setNotifications([])
          setUnreadCount(0)
        }
      } finally {
        if (mounted) setNotificationsLoading(false)
      }
    }

    fetchNotifications()
    const timer = setInterval(fetchNotifications, 60000)

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const openProfileModal = () => {
    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      password: "",
      password_confirmation: "",
    })
    setShowProfileModal(true)
  }

  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.email) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama dan email wajib diisi.",
        variant: "destructive",
      })
      return
    }

    if (profileData.password && profileData.password !== profileData.password_confirmation) {
      toast({
        title: "Konfirmasi password tidak cocok",
        description: "Silakan cek kembali password baru Anda.",
        variant: "destructive",
      })
      return
    }

    setIsSavingProfile(true)
    try {
      const payload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
      }

      if (profileData.password) {
        payload.password = profileData.password
        payload.password_confirmation = profileData.password_confirmation
      }

      const res = await apiClient.updateProfile(payload)

      const userPayload = res?.user || { ...user, ...profileData }
      setUser((prev) => ({
        ...prev,
        name: userPayload.name || profileData.name,
        email: userPayload.email || profileData.email,
        phone: userPayload.phone || profileData.phone,
        address: userPayload.address || profileData.address,
      }))

      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui.",
        variant: "success",
      })
      setShowProfileModal(false)
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menyimpan profil.",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      badge: null
    },
    {
      title: "Tabungan",
      icon: Wallet,
      path: "/admin/tabungan",
      // badge: "3"
    },
    {
      title: "Jamaah",
      icon: Users,
      path: "/admin/jamaah",
      badge: null
    },
    {
      title: "Travel",
      icon: Plane,
      path: "/admin/travel",
      badge: null
    },
    {
      title: "Tempat",
      icon: MapPin,
      path: "/admin/tempat",
      badge: null
    },
  ]

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-26 px-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="p-2 rounded-lg">
              <img src="/logo.png" alt="Logo" className="h-16 w-16" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Niat Umroh</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable sidebar content */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          {/* Main Navigation */}
          <nav className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Menu Utama
            </p>
            
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                
                return (
                  <li key={item.title}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${active 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge className={`
                          ${active 
                            ? 'bg-white text-primary' 
                            : 'bg-primary text-white'
                          }
                        `}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Support Section */}
            <div className="mt-8 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Butuh Bantuan?</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Hubungi tim IT untuk masalah teknis
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="h-auto p-0 text-xs mt-1"
                    asChild
                  >
                    <a
                      href="https://wa.me/6287874790441"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buka Tiket Support
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area dengan margin left untuk sidebar */}
      <div className="lg:ml-64">
        {/* Top Navigation - STICKY */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left: Hamburger & Search */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="flex items-center justify-center py-6 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Memuat notifikasi...
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="text-sm text-gray-500 p-4 text-center">Belum ada notifikasi.</p>
                    ) : notifications.map((notif) => (
                      <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <p className="font-medium">{notif.title}</p>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                          </div>
                          {notif.unread && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notif.time || "Baru saja"}</p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary">
                    {notifications.length > 0 ? `Total ${notifications.length} notifikasi` : "Lihat Semua Notifikasi"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Back to Home */}
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Homepage</span>
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="#"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        openProfileModal()
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content - Ini yang bisa discroll */}
        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Niat Umroh. Hak cipta dilindungi.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Admin Panel v1.0.0 • Terakhir diperbarui: 15 Jan 2026
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="link" size="sm" asChild>
                  <Link to="/admin/privacy">Kebijakan Privasi</Link>
                </Button>
                <Button variant="link" size="sm" asChild>
                  <Link to="/admin/terms">Syarat & Ketentuan</Link>
                </Button>
                <Button variant="link" size="sm" asChild>
                  <Link to="/admin/support">Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Edit Profil Admin"
        size="lg"
      >
        <div className="space-y-4">
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Memuat profil...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama</label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={isSavingProfile}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nomor Telepon</label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={isSavingProfile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alamat</label>
                <Textarea
                  rows={3}
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={isSavingProfile}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Password Baru (opsional)</label>
                  <Input
                    type="password"
                    value={profileData.password}
                    onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                    placeholder="Kosongkan jika tidak diubah"
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
                  <Input
                    type="password"
                    value={profileData.password_confirmation}
                    onChange={(e) => setProfileData({ ...profileData, password_confirmation: e.target.value })}
                    placeholder="Ulangi password baru"
                    disabled={isSavingProfile}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowProfileModal(false)}
                  disabled={isSavingProfile}
                >
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleSaveProfile} disabled={isSavingProfile}>
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
