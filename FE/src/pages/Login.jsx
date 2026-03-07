import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Loader2 } from "lucide-react"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const response = await login(formData.email, formData.password)

    toast({
      title: "Login Berhasil",
      description: "Selamat datang kembali!",
      variant: "success",
    })

    // Redirect berdasarkan role
    if (response.user.role === "admin") {
      navigate("/admin")
    } else {
      navigate("/dashboard")
    }

  } catch (error) {
    toast({
      title: "Login Gagal",
      description: error.message || "Email atau password salah",
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">

      {/* Background sama seperti halaman Home */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Niat Umroh"
            className="h-20 mx-auto mb-4"
          />

          <h2 className="text-3xl font-bold text-gray-900">
            Selamat Datang
          </h2>

          <p className="text-gray-600 mt-2">
            Masuk ke akun Niat Umroh Anda
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-5"
        >

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Masukan Email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded"/>
              Ingat saya
            </label>

            <a className="text-primary hover:underline" href="#">
              Lupa password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 rounded-lg text-white bg-primary hover:opacity-90 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4"/>
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}