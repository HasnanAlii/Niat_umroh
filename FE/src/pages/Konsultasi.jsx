import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageCircle,
  Phone,
  Clock,
  Users,
  CheckCircle,
  Star,
  Shield,
  Calendar,
  FileText,
  ChevronRight,
  Send,
  HelpCircle,
  Globe,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
  Loader2
} from "lucide-react"
import { useState } from "react"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"

export const Konsultasi = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    travelPackage: "", // Changed from 'package' to 'travelPackage'
    date: ""
  })

  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Data konsultan/tim
  const konsultanTim = [
    {
      id: 1,
      name: "Ustadz Ahmad",
      role: "Pembimbing Ibadah",
      phone: "081234567891",
      specialty: "Manasik & Spiritual",
      experience: "15 Tahun",
      rating: 4.9,
      availability: "Senin - Jumat, 08:00 - 16:00"
    },
    {
      id: 2,
      name: "Bu Siti",
      role: "Customer Service",
      phone: "081234567892",
      specialty: "Administrasi & Dokumen",
      experience: "8 Tahun",
      rating: 4.8,
      availability: "Setiap Hari, 09:00 - 17:00"
    },
    {
      id: 3,
      name: "Pak Budi",
      role: "Keuangan",
      phone: "081234567893",
      specialty: "Pembayaran & Tabungan",
      experience: "10 Tahun",
      rating: 4.7,
      availability: "Senin - Sabtu, 08:00 - 15:00"
    },
    {
      id: 4,
      name: "Mba Rina",
      role: "Travel Consultant",
      phone: "081234567894",
      specialty: "Paket & Jadwal",
      experience: "6 Tahun",
      rating: 4.8,
      availability: "Setiap Hari, 10:00 - 18:00"
    },
  ]

  // Kategori konsultasi
  const categories = [
    {
      id: "tabungan",
      title: "Tabungan Umroh",
      description: "Tanya seputar program Taburoh, cicilan, dan pembayaran",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-green-100 text-green-700"
    },
    {
      id: "dokumen",
      title: "Dokumen & Visa",
      description: "Kelengkapan dokumen, paspor, visa, dan persyaratan",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "paket",
      title: "Paket Travel",
      description: "Pemilihan paket, fasilitas, dan jadwal keberangkatan",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "manasik",
      title: "Manasik & Spiritual",
      description: "Bimbingan ibadah, persiapan spiritual, dan tata cara",
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-700"
    },
    {
      id: "kesehatan",
      title: "Kesehatan & Tips",
      description: "Kesehatan selama perjalanan dan tips perjalanan",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-red-100 text-red-700"
    },
    {
      id: "lainnya",
      title: "Lainnya",
      description: "Pertanyaan lain seputar umroh",
      icon: <HelpCircle className="h-6 w-6" />,
      color: "bg-gray-100 text-gray-700"
    },
  ]

  // FAQ
  const faqItems = [
    {
      q: "Berapa minimal DP untuk mendaftar umroh?",
      a: "Minimal DP adalah 30% dari total harga paket. Bisa dicicil hingga 24 bulan.",
      category: "tabungan"
    },
    {
      q: "Dokumen apa saja yang diperlukan?",
      a: "Paspor min. berlaku 6 bulan, KTP, KK, foto 4x6, dan sertifikat vaksin.",
      category: "dokumen"
    },
    {
      q: "Kapan waktu terbaik untuk umroh?",
      a: "Bulan Ramadhan khusus, atau bulan-bulan biasa untuk yang lebih tenang.",
      category: "paket"
    },
    {
      q: "Apakah ada bimbingan manasik?",
      a: "Ya, kami menyediakan bimbingan manasik lengkap sebelum keberangkatan.",
      category: "manasik"
    },
    {
      q: "Bagaimana jika sakit selama perjalanan?",
      a: "Setiap paket dilengkapi dokter pendamping dan asuransi kesehatan.",
      category: "kesehatan"
    },
  ]

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const { name, phone, email, subject, message, travelPackage, date } = formData
    
    const baseMessage = `Halo Niat Umroh, saya ${name} ingin berkonsultasi:\n\n`
    
    let details = ""
    if (subject) details += `Subjek: ${subject}\n`
    if (travelPackage) details += `Paket yang diminati: ${travelPackage}\n`
    if (date) details += `Tanggal rencana: ${date}\n`
    if (email) details += `Email: ${email}\n`
    if (message) details += `Pertanyaan: ${message}\n\n`
    
    const contactInfo = `Kontak saya:\n📱 ${phone}\n\nSaya menghubungi dari website Niat Umroh.`
    
    return encodeURIComponent(baseMessage + details + contactInfo)
  }

  // Open WhatsApp
  const openWhatsApp = (phoneNumber = null, message = null) => {
    const phone = phoneNumber || "6287874790441" // Nomor default Niat Umroh
    const msg = message || generateWhatsAppMessage()
    
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
    
    // Reset form dan lanjut ke step 3 (success)
    setStep(3)
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to backend API
      await apiClient.submitConsultation({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })

      toast({
        title: "Konsultasi Terkirim!",
        description: "Tim kami akan segera menghubungi Anda via WhatsApp.",
        variant: "success"
      })

      // Open WhatsApp
      openWhatsApp()
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        travelPackage: "",
        date: ""
      })
      
      setStep(3)
    } catch (error) {
      console.error("Error submitting consultation:", error)
      toast({
        title: "Gagal Mengirim",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white mt-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Konsultasi Umroh via WhatsApp
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hubungi kami kapan saja untuk konsultasi seputar umroh. 
            Tim kami siap membantu Anda mewujudkan impian ke Tanah Suci.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge className="bg-green-100 text-green-800">
              <MessageCircle className="h-4 w-4 mr-2" />
              Responsif 24/7
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              Gratis Konsultasi
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Users className="h-4 w-4 mr-2" />
              Tim Berpengalaman
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Categories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step Indicator */}
            {step > 1 && (
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    1
                  </div>
                  <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                  <div className={`h-1 w-16 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    3
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Select Category */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pilih Topik Konsultasi</CardTitle>
                  <CardDescription>
                    Pilih kategori yang sesuai dengan pertanyaan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setStep(2)
                          setFormData(prev => ({ ...prev, subject: category.title }))
                        }}
                        className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-lg ${category.color}`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{category.title}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Form Input */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Isi Data Diri</CardTitle>
                      <CardDescription>
                        Lengkapi data untuk konsultasi yang lebih efektif
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                    >
                      Kembali
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nomor WhatsApp *
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0812-3456-7890"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Paket yang Diminati
                        </label>
                        <Input
                          name="travelPackage" // Changed from 'package'
                          value={formData.travelPackage}
                          onChange={handleChange}
                          placeholder="Contoh: Umroh Plus Turki"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Rencana Keberangkatan
                        </label>
                        <Input
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pertanyaan / Pesan *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tulis pertanyaan atau pesan Anda di sini..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        disabled={isSubmitting}
                      >
                        Kembali
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Kirim via WhatsApp
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Success Message */}
            {step === 3 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Konsultasi Berhasil Dikirim!</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Tim kami akan segera menghubungi Anda via WhatsApp. 
                      Biasanya respons dalam 5-15 menit.
                    </p>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => {
                          // Open WhatsApp dengan pesan yang sama
                          openWhatsApp()
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Buka WhatsApp Sekarang
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setStep(1)
                          setSelectedCategory("")
                          setFormData({
                            name: "",
                            phone: "",
                            email: "",
                            subject: "",
                            message: "",
                            travelPackage: "", // Changed from 'package'
                            date: ""
                          })
                        }}
                      >
                        Ajukan Pertanyaan Lain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Pertanyaan yang Sering Diajukan</CardTitle>
                <CardDescription>
                  Temukan jawaban cepat untuk pertanyaan umum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(item.category)
                        setStep(2)
                        setFormData(prev => ({ 
                          ...prev, 
                          subject: item.q,
                          message: item.q + "\n\n" + item.a
                        }))
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">Q: {item.q}</h4>
                          <p className="text-sm text-gray-600">A: {item.a}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info & Team */}
          <div className="space-y-8">
            {/* Quick Contact Card */}
            <Card className="bg-linear-to-br from-blue-600 to-blue-800 text-white">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Hubungi Langsung</h3>
                  <p className="text-blue-100 mb-4">
                    Klik tombol di bawah untuk chat langsung via WhatsApp
                  </p>
                  <Button 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 w-full"
                    onClick={() => {
                      // Open WhatsApp dengan pesan default
                      const defaultMsg = "Halo Niat Umroh, saya ingin berkonsultasi seputar umroh."
                      const url = `https://wa.me/6287874790441?text=${encodeURIComponent(defaultMsg)}`
                      window.open(url, '_blank')
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat via WhatsApp
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <Phone className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Telepon</p>
                      <p className="text-lg font-bold">0878-7479-0441</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <Clock className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Jam Operasional</p>
                      <p className="font-medium">08:00 - 20:00 WIB</p>
                      <p className="text-sm text-blue-200">Setiap Hari</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Lokasi</p>
                      <p className="font-medium">Jl. Pangkalan Raya, Bogor</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Konsultan Team */}
            <Card>
              <CardHeader>
                <CardTitle>Tim Konsultan Kami</CardTitle>
                <CardDescription>
                  Pilih konsultan sesuai kebutuhan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {konsultanTim.map((konsultan) => (
                    <div key={konsultan.id} className="p-3 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{konsultan.name}</h4>
                              <p className="text-sm text-gray-600">{konsultan.role}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{konsultan.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">Spesialis: {konsultan.specialty}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {konsultan.availability}
                          </p>
                          <Button 
                            size="sm" 
                            className="mt-3 w-full"
                            onClick={() => {
                              const message = `Halo ${konsultan.name}, saya ingin berkonsultasi seputar ${konsultan.specialty}.`
                              const url = `https://wa.me/${konsultan.phone}?text=${encodeURIComponent(message)}`
                              window.open(url, '_blank')
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat {konsultan.name}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Ikuti Kami</CardTitle>
                <CardDescription>
                  Update informasi terbaru di media sosial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-col h-auto py-4"
                    asChild
                  >
                    <a 
                      href="https://facebook.com/niatumroh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-6 w-6 mb-2 text-blue-600" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-col h-auto py-4"
                    asChild
                  >
                    <a 
                      href="https://instagram.com/niatumroh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-6 w-6 mb-2 text-pink-600" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-col h-auto py-4"
                    asChild
                  >
                    <a 
                      href="https://youtube.com/niatumroh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Youtube className="h-6 w-6 mb-2 text-red-600" />
                      <span className="text-sm">YouTube</span>
                    </a>
                  </Button>
                </div>
                
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">Butuh bantuan cepat?</p>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-sm"
                        onClick={() => {
                          const defaultMsg = "Halo Niat Umroh, saya butuh bantuan cepat."
                          const url = `https://wa.me/6287874790441?text=${encodeURIComponent(defaultMsg)}`
                          window.open(url, '_blank')
                        }}
                      >
                        Chat WhatsApp Sekarang →
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-8 bg-linear-to-r from-primary to-primary/90 text-white rounded-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-3">Siap Berangkat Umroh?</h3>
              <p className="text-white/90">
                Konsultasi gratis dengan tim ahli kami. Dapatkan panduan lengkap dari persiapan hingga keberangkatan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => {
                  const defaultMsg = "Halo Niat Umroh, saya siap berangkat umroh dan ingin konsultasi."
                  const url = `https://wa.me/6287874790441?text=${encodeURIComponent(defaultMsg)}`
                  window.open(url, '_blank')
                }}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Konsultasi Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white"
              >
                <Phone className="h-5 w-5 mr-2" />
                0878-7479-0441
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
