import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"

export default function Register() {

  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    nik: "",
    phone: "",
    address: "",
  })

  const handleChange = (e) => {

    const { name, value } = e.target

    if (name === "phone") {
      const onlyNumber = value.replace(/\D/g, "")
      setFormData({ ...formData, [name]: onlyNumber })
      return
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.nik.length !== 16) {
      toast({
        title: "Error",
        description: "NIK harus 16 digit",
        variant: "destructive"
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password minimal 8 karakter",
        variant: "destructive"
      })
      return
    }

    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Error",
        description: "Konfirmasi password tidak cocok",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {

      const response = await register(formData)

      toast({
        title: "Registrasi Berhasil",
        description: "Selamat datang di Niat Umroh!",
        variant: "success"
      })

      if (response?.user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }

    } catch (error) {

      toast({
        title: "Registrasi Gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-6">

          <img
            src="/logo.png"
            alt="Niat Umroh"
            className="h-20 mx-auto mb-4"
          />

          <h2 className="text-3xl font-bold text-gray-900">
            Daftar Akun Baru
          </h2>

          <p className="text-gray-600 mt-2">
            Mulai perjalanan spiritual Anda bersama Niat Umroh
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InputField
              icon={<User />}
              label="Nama Lengkap"
              name="name"
              placeholder="Masukkan nama sesuai KTP"
              value={formData.name}
              onChange={handleChange}
            />

            <InputField
              icon={<CreditCard />}
              label="NIK"
              name="nik"
              maxLength={16}
              placeholder="Masukan NIK"
              value={formData.nik}
              onChange={handleChange}
            />

            <InputField
              icon={<Mail />}
              label="Email"
              name="email"
              type="email"
              placeholder="Masukan email "
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              icon={<Phone />}
              label="Nomor Telepon"
              name="phone"
              placeholder=" Masukan nomor telepon"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* Password */}
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              placeholder="Minimal 8 karakter"
            />

            {/* Confirm Password */}
            <PasswordField
              label="Konfirmasi Password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              showPassword={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              placeholder="Ulangi password"
            />

          </div>

          {/* Address */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Alamat Lengkap
            </label>

            <div className="relative mt-1">

              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>

              <textarea
                name="address"
                rows="3"
                required
                placeholder=" Masukan alamat lengkap"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
              />

            </div>

          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1"/>
            Saya setuju dengan syarat dan ketentuan
          </label>

          {/* Submit */}
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
              "Daftar Sekarang"
            )}

          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Masuk di sini
            </Link>
          </p>

        </form>

      </div>
    </div>
  )
}


/* reusable input */
function InputField({ icon, label, ...props }) {

  return (
    <div>

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-1">

        <div className="absolute left-3 top-3 text-gray-400">
          {icon}
        </div>

        <input
          {...props}
          required
          className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
        />

      </div>

    </div>
  )
}


/* password field */
function PasswordField({
  label,
  showPassword,
  toggle,
  ...props
}) {

  return (
    <div>

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-1">

        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>

        <input
          {...props}
          type={showPassword ? "text" : "password"}
          required
          className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-3 text-gray-400"
        >
          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>

      </div>

    </div>
  )
}