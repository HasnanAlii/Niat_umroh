import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Modal from "@/components/ui/Modal"
import { FileUpload } from "@/components/ui/FileUpload"
import { formatShortCurrency } from "@/utils/formatCurrency"
import { 
  User, 
  Wallet, 
  Calendar, 
  Plane, 
  MapPin, 
  FileText, 
  MessageCircle,
  Bell,
  Settings,
  ChevronRight,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Shield,
  Star,
  Hotel as HotelIcon,
  Users as UsersIcon,
  Gift,
  Clock3,
  Search,
  Upload,
  CreditCard,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export const DashboardJamaah = () => {
  const { toast } = useToast()
  const { jamaah: authJamaah, user, updateUser, updateJamaah } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [travelPackages, setTravelPackages] = useState([])
  const [jamaahData, setJamaahData] = useState(null)
  const [tabunganData, setTabunganData] = useState(null)
  const [travelData, setTravelData] = useState(null)
  const [documents, setDocuments] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Upload modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailModalType, setDetailModalType] = useState("")
  const [detailData, setDetailData] = useState(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "",
    description: ""
  })
  const [paymentFile, setPaymentFile] = useState(null)
  
  // Document form state  
  const [documentData, setDocumentData] = useState({
    documentType: "",
    description: "",
    expiryDate: ""
  })
  const [documentFile, setDocumentFile] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    password_confirmation: "",
  })
  
  // Jamaah ID from auth context
  const currentJamaahId = authJamaah?.id || null
  
  // Handler functions
  const handleEditProfile = () => {
    setProfileData({
      name: jamaahData?.name || user?.name || "",
      email: jamaahData?.email || user?.email || "",
      phone: jamaahData?.phone || "",
      address: jamaahData?.address || "",
      password: "",
      password_confirmation: "",
    })
    setShowProfileModal(true)
  }

  const handlePayNow = () => {
    if (!tabunganData?.id) {
      toast({
        title: "Tabungan belum tersedia",
        description: "Silakan pilih paket atau hubungi admin untuk membuat tabungan.",
        variant: "destructive"
      })
      return
    }

    setShowPaymentModal(true)
  }

  const handleUploadDocumentDirect = (docType) => {
    setSelectedDocumentType(docType)
    setDocumentData((prev) => ({ ...prev, documentType: docType, expiryDate: "" }))
    setShowDocumentModal(true)
  }

  const handleViewScheduleDetail = () => {
    setDetailModalType("schedule")
    setDetailData({
      nextPayment: tabunganData?.nextPayment || "Belum ada jadwal",
      paymentAmount: tabunganData?.paymentAmount || 0,
      manasikDate: "20 Maret 2025",
      departureDate: travelData?.departureDate || "Menunggu penjadwalan",
    })
    setShowDetailModal(true)
  }

  const handleRegisterPackage = async () => {
    if (!selectedPackage) return
    
    try {
      const selectedPkg = travelPackages.find(p => p.id === selectedPackage)

      await apiClient.bookPackage(
        currentJamaahId,
        selectedPackage,
        tabunganData?.paymentAmount || 500000
      )

      const updatedJamaah = await apiClient.getJamaah(currentJamaahId)
      setJamaahData(updatedJamaah)

      toast({
        title: "Pendaftaran Berhasil",
        description: `Paket ${selectedPkg?.name} berhasil dipilih.`,
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    }
  }

  const handleViewPackageDetail = (packageId) => {
    const pkg = travelPackages.find(p => p.id === packageId)
    if (pkg) {
      setDetailModalType("package")
      setDetailData(pkg)
      setShowDetailModal(true)
    }
  }

  const handleStartChat = () => {
    const whatsappNumber = "6287874790441"
    const message = "Halo Niat Umroh, saya ingin berkonsultasi seputar umroh."
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleCallPhone = () => {
    window.location.href = 'tel:+6287874790441'
  }

  const handleConsultation = () => {
    handleStartChat()
  }

  const handleNeedHelp = () => {
    handleStartChat()
  }

  const handleViewMapJourney = () => {
    setDetailModalType("map")
    setDetailData({
      makkah: travelData?.hotelMakkah || "Belum ditentukan",
      madinah: travelData?.hotelMadinah || "Belum ditentukan",
      packageName: travelData?.package || "Paket Umroh",
    })
    setShowDetailModal(true)
  }

  const handleNotification = async () => {
    try {
      const res = await apiClient.getNotifications(5)
      const list = Array.isArray(res?.data) ? res.data : []

      if (list.length === 0) {
        toast({
          title: "Notifikasi",
          description: "Belum ada notifikasi baru",
        })
        return
      }

      const latest = list[0]
      toast({
        title: latest?.title || "Notifikasi",
        description: latest?.message || `Ada ${list.length} notifikasi baru`,
      })
    } catch (error) {
      toast({
        title: "Notifikasi",
        description: "Gagal memuat notifikasi",
        variant: "destructive",
      })
    }
  }

  const handleFaqQuestion = (question) => {
    const whatsappNumber = "6287874790441"
    const message = `Halo Niat Umroh, saya ingin bertanya: ${question}`
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleDocumentAction = async (doc) => {
    if (doc.status === "Lengkap") {
      try {
        await apiClient.downloadDocument(doc.id)
      } catch (error) {
        toast({
          title: "Gagal download dokumen",
          description: error.message || "Terjadi kesalahan saat download",
          variant: "destructive"
        })
      }
      return
    }

    handleUploadDocumentDirect(doc.name)
  }

  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.email) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama dan email wajib diisi.",
        variant: "destructive"
      })
      return
    }

    if (profileData.password && profileData.password !== profileData.password_confirmation) {
      toast({
        title: "Konfirmasi password tidak cocok",
        description: "Silakan cek kembali password baru Anda.",
        variant: "destructive"
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

      if (res?.user) {
        updateUser(res.user)
      }
      if (res?.jamaah) {
        updateJamaah(res.jamaah)
        setJamaahData((prev) => ({ ...(prev || {}), ...res.jamaah }))
      }

      toast({
        title: "Profil diperbarui",
        description: "Data profil berhasil disimpan.",
        variant: "success"
      })
      setShowProfileModal(false)
    } catch (error) {
      toast({
        title: "Gagal menyimpan profil",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const calculateReturnDate = (departureDate, durationText) => {
    if (!departureDate) return null

    const departure = new Date(departureDate)
    if (Number.isNaN(departure.getTime())) return null

    const durationDays = Number(String(durationText || "").match(/\d+/)?.[0] || 0)
    if (!durationDays) return null

    const returnDate = new Date(departure)
    returnDate.setDate(returnDate.getDate() + Math.max(durationDays - 1, 0))

    return returnDate.toISOString().split("T")[0]
  }
  
  // Fetch all data from API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [packagesData, jamaahRes, tabunganRes, documentsRes, paymentsRes] = await Promise.all([
          apiClient.getPackages(),
          currentJamaahId ? apiClient.getJamaah(currentJamaahId).catch(() => null) : Promise.resolve(null),
          currentJamaahId ? apiClient.getTabungans(currentJamaahId).catch(() => null) : Promise.resolve(null),
          currentJamaahId ? apiClient.getDocuments(currentJamaahId).catch(() => []) : Promise.resolve([]),
          currentJamaahId ? apiClient.getPayments({ jamaah_id: currentJamaahId }).catch(() => []) : Promise.resolve([]),
        ])
        
        setTravelPackages(packagesData)
        setJamaahData(jamaahRes)
        
        // Set tabungan data from jamaah's tabungan
        if (jamaahRes && jamaahRes.tabungan) {
          setTabunganData(jamaahRes.tabungan)
        } else if (tabunganRes && tabunganRes.length > 0) {
          setTabunganData(tabunganRes[0])
        }
        
        // Set documents
        setDocuments(documentsRes)
        
        // Set activities from payments
        setActivities(paymentsRes)
        
        // Set travel data from jamaah's package (database)
        const selectedPackageId = jamaahRes?.travelPackage?.id || jamaahRes?.travel_package_id || jamaahRes?.travelPackageId
        const packageFromList = Array.isArray(packagesData)
          ? packagesData.find((p) => String(p.id) === String(selectedPackageId || ""))
          : null
        const pkg = jamaahRes?.travelPackage || packageFromList

        if (pkg) {
          const departureDate = pkg.departureDate || pkg.departure_date || pkg.date || null
          const returnDate = pkg.returnDate || pkg.return_date || calculateReturnDate(departureDate, pkg.duration)

          setTravelData({
            package: pkg.name || "Paket Umroh",
            packageType: pkg.bestFor || pkg.best_for || "Paket Umroh",
            departureDate: departureDate || "Menunggu penjadwalan",
            returnDate: returnDate || "Menunggu penjadwalan",
            duration: pkg.duration || "Belum ditentukan",
            status: jamaahRes?.status || pkg.status || "Menunggu konfirmasi",
            flight: pkg.airline || pkg.flight || "Menunggu info maskapai",
            hotelMakkah: pkg.hotelMakkah || pkg.hotel_makkah || pkg.hotel || "Belum ditentukan",
            hotelMadinah: pkg.hotelMadinah || pkg.hotel_madinah || "Belum ditentukan",
          })
        } else {
          setTravelData(null)
        }
        
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [currentJamaahId])

  // Navigation Tabs
  const navigationTabs = [
    { id: "overview", label: "Overview", icon: <User className="h-4 w-4 mr-2" /> },
    { id: "paket", label: "Pilih Paket", icon: <Plane className="h-4 w-4 mr-2" /> },
    { id: "tabungan", label: "Tabungan", icon: <Wallet className="h-4 w-4 mr-2" /> },
    { id: "perjalanan", label: "Perjalanan", icon: <MapPin className="h-4 w-4 mr-2" /> },
    { id: "dokumen", label: "Dokumen", icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: "konsultasi", label: "Konsultasi", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
  ]

  // Fungsi untuk mendapatkan badge berdasarkan status
  const getStatusBadge = (status) => {
    switch(status) {
      case "Lengkap": return <Badge className="bg-green-100 text-green-800">Lengkap</Badge>
      case "Perlu Upload": return <Badge className="bg-red-100 text-red-800">Perlu Upload</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase()

    if (["approved", "success", "berhasil", "lunas"].includes(normalized)) {
      return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
    }

    if (["pending", "menunggu", "dalam review"].includes(normalized)) {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }

    if (["rejected", "failed", "ditolak", "gagal"].includes(normalized)) {
      return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
    }

    return <Badge variant="outline">{status || "-"}</Badge>
  }

  // Handle Upload Payment Proof
  const handleUploadPayment = async () => {
    if (!paymentFile || !paymentData.amount || !paymentData.paymentMethod) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', paymentFile)
      formData.append('amount', paymentData.amount)
      formData.append('payment_method', paymentData.paymentMethod)
      if (paymentData.description) {
        formData.append('description', paymentData.description)
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      if (!currentJamaahId || !tabunganData?.id) {
        throw new Error('Data jamaah/tabungan belum tersedia')
      }

      formData.append('jamaah_id', currentJamaahId)
      formData.append('tabungan_id', tabunganData.id)
      formData.append('payment_date', new Date().toISOString().split('T')[0])

      await apiClient.uploadPaymentProof(formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Upload Berhasil!",
        description: "Bukti pembayaran Anda sedang diverifikasi",
        variant: "success"
      })

      // Reset form
      setPaymentData({ amount: "", paymentMethod: "", description: "" })
      setPaymentFile(null)
      setShowPaymentModal(false)
      setUploadProgress(0)

      // Refresh activities
      const updatedPayments = await apiClient.getPayments({ jamaah_id: currentJamaahId })
      setActivities(updatedPayments)
    } catch (error) {
      console.error("Error uploading payment:", error)
      toast({
        title: "Upload Gagal",
        description: error.message || "Terjadi kesalahan saat upload",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle Upload Document
  const handleUploadDocument = async () => {
    if (!documentFile || !documentData.documentType) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }

    const requiresExpiryDate = ["Paspor", "Sertifikat Vaksin"].includes(documentData.documentType)
    if (requiresExpiryDate && !documentData.expiryDate) {
      toast({
        title: "Tanggal kedaluwarsa wajib diisi",
        description: "Isi tanggal kedaluwarsa untuk Paspor atau Sertifikat Vaksin.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      if (!currentJamaahId) {
        throw new Error('Data jamaah belum tersedia')
      }

      const createdDocRes = await apiClient.createDocument({
        jamaah_id: currentJamaahId,
        document_type: documentData.documentType,
        status: 'pending',
        expiry_date: requiresExpiryDate ? documentData.expiryDate : null,
      })

      const createdDoc = createdDocRes?.data || createdDocRes?.document || createdDocRes
      const documentId = createdDoc?.id

      if (!documentId) {
        throw new Error('Gagal membuat data dokumen sebelum upload file')
      }

      await apiClient.uploadDocument(documentId, documentFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Upload Berhasil!",
        description: "Dokumen Anda sedang diverifikasi",
        variant: "success"
      })

      // Reset form
      setDocumentData({ documentType: "", description: "", expiryDate: "" })
      setDocumentFile(null)
      setShowDocumentModal(false)
      setUploadProgress(0)

      // Refresh documents
      const updatedDocuments = await apiClient.getDocuments(currentJamaahId)
      setDocuments(updatedDocuments)
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload Gagal",
        description: error.message || "Terjadi kesalahan saat upload",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const paymentDestinationMap = {
    "Transfer BCA": {
      methodLabel: "Transfer BCA",
      accountNumber: "1234567890",
      accountName: "PT Niat Umroh Indonesia",
    },
    "Transfer BRI": {
      methodLabel: "Transfer BRI",
      accountNumber: "9876543210",
      accountName: "PT Niat Umroh Indonesia",
    },
    "Transfer Mandiri": {
      methodLabel: "Transfer Mandiri",
      accountNumber: "1122334455",
      accountName: "PT Niat Umroh Indonesia",
    },
    "Transfer BNI": {
      methodLabel: "Transfer BNI",
      accountNumber: "5566778899",
      accountName: "PT Niat Umroh Indonesia",
    },
    "E-Wallet": {
      methodLabel: "E-Wallet",
      accountNumber: "087874790441",
      accountName: "Niat Umroh",
    },
  }

  const normalizedPaymentMethod = String(paymentData.paymentMethod || "").trim().toLowerCase()
  const showPaymentDestination = Boolean(normalizedPaymentMethod) && normalizedPaymentMethod !== "cash"
  const selectedPaymentDestination = paymentDestinationMap[paymentData.paymentMethod] || {
    methodLabel: paymentData.paymentMethod || "Metode Pembayaran",
    accountNumber: "-",
    accountName: "Niat Umroh",
  }

  // Komponen untuk section pilih paket
  const PackageSelectionSection = () => {
    // Filter paket berdasarkan pencarian
    const filteredPackages = travelPackages.filter(pkg => 
      pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.bestFor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.some(h => h?.toLowerCase().includes(searchTerm.toLowerCase())))
    )

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Pilih Paket Umroh Anda</h2>
          <p className="text-gray-600 mt-2">
            Temukan paket yang sesuai dengan kebutuhan dan budget Anda
          </p>
        </div>



        {/* Package Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Badge className="cursor-pointer hover:bg-primary hover:text-white" onClick={() => setSearchTerm("")}>
            Semua Paket
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white" onClick={() => setSearchTerm("Turki")}>
            Plus Turki
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white" onClick={() => setSearchTerm("Reguler")}>
            Reguler
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white" onClick={() => setSearchTerm("Ramadhan")}>
            Ramadhan
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white" onClick={() => setSearchTerm("Dubai")}>
            Plus Dubai
          </Badge>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Memuat paket umroh...</p>
          </div>
        )}

        {/* Package Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`hover:shadow-xl transition-all duration-300 ${
                  selectedPackage === pkg.id ? 'ring-2 ring-primary border-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{pkg.name || 'Paket Umroh'}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock3 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{pkg.duration || '-'}</span>
                        <Star className="h-4 w-4 text-yellow-500 fill-current ml-2" />
                        <span className="text-sm text-gray-600">{pkg.rating || '5.0'}</span>
                      </div>
                    </div>
                    {pkg.available != null && pkg.available < 10 && (
                      <Badge className="bg-red-100 text-red-800">
                        Hampir Habis!
                      </Badge>
                  )}
                </div>
                
                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
               {/* Package Photo */}
                <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                  <img
                    src={
                      pkg.photo && typeof pkg.photo === 'string' && pkg.photo.trim() !== ''
                        ? pkg.photo
                        : (pkg.image && typeof pkg.image === 'string' && pkg.image.trim() !== ''
                          ? pkg.image
                          : (pkg.thumbnail && typeof pkg.thumbnail === 'string' && pkg.thumbnail.trim() !== ''
                            ? pkg.thumbnail
                            : "/images/default-umroh.jpg"))
                    }
                    alt={pkg.name || "Foto Paket"}
                    className="w-full h-150 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='176' viewBox='0 0 400 176'%3E%3Crect width='400' height='176' fill='%23f0f4ff'/%3E%3Ccircle cx='200' cy='70' r='30' fill='%23c7d7ff'/%3E%3Cellipse cx='200' cy='176' rx='80' ry='50' fill='%23c7d7ff'/%3E%3Ccircle cx='200' cy='60' r='18' fill='%23a5b8ff'/%3E%3Crect x='135' y='100' width='130' height='10' rx='5' fill='%23a5b8ff'/%3E%3Crect x='155' y='118' width='90' height='8' rx='4' fill='%23c7d7ff'/%3E%3Ctext x='200' y='155' font-family='sans-serif' font-size='12' fill='%236b7fc4' text-anchor='middle'%3EPaket Umroh%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>

                {/* Price */}
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {formatShortCurrency(pkg.price)}
     
                  </p>
                  </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fasilitas Utama:</p>
                  <ul className="space-y-1 text-sm">
                    {pkg.features && Array.isArray(pkg.features) && pkg.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {pkg.features && pkg.features.length > 6 && (
                      <li className="text-primary text-sm font-medium cursor-pointer hover:underline">
                        +{pkg.features.length - 6} fasilitas lainnya
                      </li>
                    )}
                  </ul>
                </div>
                
      

                {/* Package Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Keberangkatan</p>
                      <p className="text-gray-600">{pkg.date || pkg.departure_date || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Kuota Tersedia</p>
                      <p className="text-gray-600">{pkg.available || 0}/{pkg.seats || pkg.quota || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HotelIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Hotel</p>
                      <p className="text-gray-600">{pkg.hotel || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Maskapai</p>
                      <p className="text-gray-600">{pkg.airline || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Best For */}
                {pkg.bestFor && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">Cocok untuk:</p>
                    <p className="text-sm text-gray-700">{pkg.bestFor}</p>
                  </div>
                )}
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kuota Terisi</span>
                    <span>{pkg.seats && pkg.seats > 0 ? Math.round(((pkg.seats - (pkg.available || 0)) / pkg.seats) * 100) : 0}%</span>
                  </div>
                  <Progress value={pkg.seats && pkg.seats > 0 ? ((pkg.seats - (pkg.available || 0)) / pkg.seats) * 100 : 0} />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant={selectedPackage === pkg.id ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Terpilih
                      </>
                    ) : (
                      "Pilih Paket"
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleViewPackageDetail(pkg.id)}>
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPackages.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Paket tidak ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba kata kunci pencarian yang berbeda</p>
              <Button onClick={() => setSearchTerm("")}>
                Lihat Semua Paket
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comparison & CTA */}
        {selectedPackage && (
          <div className="mt-8 p-6 bg-linear-to-r from-primary to-primary/90 text-white rounded-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Paket Terpilih</h3>
                <p className="text-white/90 mt-2">
                  Anda memilih: <span className="font-semibold">
                    {travelPackages.find(p => p.id === selectedPackage)?.name}
                  </span>
                </p>
                <p className="text-sm mt-2">
                  Lanjutkan proses pendaftaran untuk mengamankan tempat Anda
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setSelectedPackage(null)}>
                  Batalkan Pilihan
                </Button>
                <Button variant="default" size="lg" className="bg-white text-primary hover:bg-white/90" onClick={handleRegisterPackage}>
                  Daftar Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pertanyaan Umum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  q: "Bagaimana cara memilih paket yang tepat?",
                  a: "Pertimbangkan budget, durasi perjalanan, dan fasilitas yang diinginkan. Paket Reguler cocok untuk pertama kali, sedangkan paket Plus cocok untuk yang ingin menggabungkan ibadah dan wisata."
                },
                {
                  q: "Apakah bisa dicicil?",
                  a: "Ya, semua paket bisa dicicil dengan program Taburoh. DP minimal 30% dan cicilan fleksibel hingga 24 bulan."
                },
                {
                  q: "Kapan harus mendaftar?",
                  a: "Disarankan mendaftar minimal 6 bulan sebelum keberangkatan untuk persiapan dokumen dan visa."
                },
                {
                  q: "Apa saja yang termasuk dalam paket?",
                  a: "Semua paket termasuk tiket pesawat, hotel, transportasi, visa, makan, bimbingan manasik, dan asuransi."
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-semibold mb-2">Q: {faq.q}</h4>
                  <p className="text-gray-600 text-sm">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Komponen untuk section konsultasi
  const ConsultationSection = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Konsultasi & Bantuan</CardTitle>
          <CardDescription>
            Hubungi kami untuk pertanyaan seputar perjalanan umroh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-lg inline-block">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                    <h4 className="font-semibold">Chat Langsung</h4>
                    <p className="text-sm text-gray-600">Customer Service 24/7</p>
                    <Button size="sm" className="w-full" onClick={handleStartChat}>
                      Mulai Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-green-100 text-green-700 rounded-lg inline-block">
                      <Phone className="h-8 w-8" />
                    </div>
                    <h4 className="font-semibold">Telepon</h4>
                    <p className="text-sm text-gray-600">0878-7479-0441</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={handleCallPhone}>
                      Hubungi
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-lg inline-block">
                      <User className="h-8 w-8" />
                    </div>
                    <h4 className="font-semibold">Pembimbing</h4>
                    <p className="text-sm text-gray-600">Ustadz Ahmad</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={handleConsultation}>
                      Konsultasi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Pertanyaan Umum</h4>
              <div className="space-y-3">
                {[
                  "Bagaimana cara menambah setoran tabungan?",
                  "Apa saja dokumen yang diperlukan?",
                  "Kapan jadwal manasik?",
                  "Bagaimana prosedur pembatalan?",
                  "Apa saja yang harus dipersiapkan sebelum keberangkatan?"
                ].map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                    <span className="text-sm">{question}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleFaqQuestion(question)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  // Komponen Phone untuk konsultasi
  const Phone = (props) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="h-8 w-8"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )

  return (
    <>
    <div className="min-h-screen bg-gray-50 mt-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Jamaah
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Selamat datang, {jamaahData?.name || 'Jamaah'}!
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleNotification}>
              <Bell className="h-4 w-4 mr-2" />
              Notifikasi
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-b mb-8 overflow-x-auto">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-none border-b-2 transition-colors ${
                activeSection === tab.id 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className={`grid gap-8 ${activeSection === "paket" ? "" : "lg:grid-cols-3"}`}>
          
          {/* Left Column - Profile & Quick Actions (hidden saat di section paket) */}
          {activeSection !== "paket" && jamaahData && (
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={jamaahData?.profileImage} alt={jamaahData?.name} />
                      <AvatarFallback className="text-2xl">
                        {jamaahData?.name?.split(' ').map(n => n[0]).join('') || 'JM'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="text-xl font-semibold">{jamaahData?.name || 'Nama Jamaah'}</h3>
                      <p className="text-sm text-gray-600">Jamaah Umroh</p>
                    </div>
                    
                    <div className="w-full space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">NIK</span>
                        <span className="text-sm font-medium">{jamaahData?.nik || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-medium">{jamaahData?.email || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Telepon</span>
                        <span className="text-sm font-medium">{jamaahData?.phone || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bergabung</span>
                        <span className="text-sm font-medium">{jamaahData?.joinDate || '-'}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={handleEditProfile}>
                      <User className="h-4 w-4 mr-2" />
                      Edit Profil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Important Info */}
              <Card className="bg-linear-to-r from-primary to-primary/80 text-white">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6" />
                      <div>
                        <h4 className="font-semibold">Informasi Penting</h4>
                        <p className="text-sm opacity-90">Pastikan semua dokumen lengkap</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Heart className="h-6 w-6" />
                      <div>
                        <h4 className="font-semibold">Support 24/7</h4>
                        <p className="text-sm opacity-90">Kami siap membantu Anda</p>
                      </div>
                    </div>
                    
                    <Button variant="secondary" className="w-full" onClick={handleNeedHelp}>
                      Butuh Bantuan?
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Right Column - Main Dashboard */}
          <div className={activeSection === "paket" ? "col-span-full" : "lg:col-span-2 space-y-6"}>
            
            {/* Pilih Paket Section */}
            {activeSection === "paket" && <PackageSelectionSection />}

            {/* Overview Section */}
            {activeSection === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tabunganData && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Status Tabungan</CardTitle>
                      <Wallet className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">
                        Rp{(tabunganData.saldo || 0).toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">Progress: {tabunganData.progress || 0}%</p>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {tabunganData.status}
                        </Badge>
                      </div>
                      <Progress value={tabunganData.progress} className="mt-3" />
                    </CardContent>
                  </Card>
                  )}

                  {travelData && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Perjalanan</CardTitle>
                      <Plane className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold">{travelData.package}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{travelData.departureDate}</p>
                      </div>
                      <Badge className="mt-3 bg-green-100 text-green-800">
                        {travelData.status}
                      </Badge>
                    </CardContent>
                  </Card>
                  )}
                </div>

                {/* Upcoming Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Jadwal Mendatang
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tabunganData && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Jadwal Nabung Berikutnya</h4>
                            <p className="text-sm text-gray-600">Tanggal : {tabunganData.nextPayment}</p>
                          </div>
                        </div>
                        <Button size="sm" onClick={handlePayNow}>
                          Nabung Sekarang
                        </Button>
                      </div>
                      )}
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Upload Dokumen</h4>
                            <p className="text-sm text-gray-600">Sertifikat vaksin belum diupload</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleUploadDocumentDirect("Sertifikat Vaksin")}>
                          Upload
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <MessageCircle className="h-5 w-5 text-purple-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Sesi Manasik</h4>
                            <p className="text-sm text-gray-600">Gelombang 1: 20 Maret 2025</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleViewScheduleDetail}>
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Aktivitas Terkini</CardTitle>
                    <CardDescription>
                      Riwayat aktivitas Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities && activities.length > 0 ? activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-gray-600">
                                {activity.date} • {activity.time}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Selesai
                          </Badge>
                        </div>
                      )) : (
                        <div className="text-center py-6 text-gray-500">
                          <p>Belum ada aktivitas</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Tabungan Section - Empty State */}
            {activeSection === "tabungan" && !tabunganData && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Data tabungan tidak tersedia</p>
                </CardContent>
              </Card>
            )}

            {/* Tabungan Section */}
            {activeSection === "tabungan" && tabunganData && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Tabungan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold text-primary">
                            Rp{tabunganData.saldo.toLocaleString("id-ID")}
                          </p>
                          <p className="text-sm text-gray-600">Saldo Saat Ini</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold">
                            Rp{tabunganData.target.toLocaleString("id-ID")}
                          </p>
                          <p className="text-sm text-gray-600">Target Tabungan</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-2xl font-bold">{tabunganData.progress}%</p>
                          <p className="text-sm text-gray-600">Progress</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Progress Tabungan</span>
                            <span className="text-sm text-gray-600">{tabunganData.progress}%</span>
                          </div>
                          <Progress value={tabunganData.progress} />
                        </div>
                        
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-yellow-800">Pembayaran Selanjutnya</h4>
                              <p className="text-sm text-yellow-700">
                                 pada {tabunganData.nextPayment}
                              </p>
                            </div>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => setShowPaymentModal(true)}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Bukti
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Pembayaran Tabungan</CardTitle>
                    <CardDescription>
                      Daftar pembayaran beserta status verifikasi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activities && activities.length > 0 ? (
                      <div className="space-y-3">
                        {activities.map((payment) => (
                          <div key={payment.id} className="flex items-start sm:items-center justify-between gap-3 p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">
                                Rp{Number(payment.amount || 0).toLocaleString("id-ID")}
                              </p>
                              <p className="text-sm text-gray-600">
                                {payment.paymentMethod || payment.payment_method || "-"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {payment.paymentDate || payment.date || "-"}
                              </p>
                            </div>

                            <div className="shrink-0">
                              {getPaymentStatusBadge(payment.status || payment.rawStatus)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Belum ada riwayat pembayaran</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Perjalanan Section */}
            {activeSection === "perjalanan" && !travelData && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Data perjalanan tidak tersedia</p>
                  <p className="text-sm text-gray-500 mt-2">Pilih paket umroh terlebih dahulu</p>
                </CardContent>
              </Card>
            )}
            
            {/* Perjalanan Section */}
            {activeSection === "perjalanan" && travelData && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Perjalanan</CardTitle>
                    <CardDescription>
                      Informasi lengkap paket umroh Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{travelData.package}</h3>
                            <p className="text-sm text-gray-600">{travelData.packageType || "Paket Umroh"}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {travelData.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Jadwal Perjalanan
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Keberangkatan:</span>
                                <span className="font-medium">{travelData?.departureDate || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Kepulangan:</span>
                                <span className="font-medium">{travelData?.returnDate || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Durasi:</span>
                                <span className="font-medium">{travelData?.duration || '-'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Plane className="h-4 w-4" />
                              Penerbangan
                            </h4>
                            <p className="text-gray-700">{travelData?.flight || '-'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <HotelIcon className="h-4 w-4" />
                              Akomodasi
                            </h4>
                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium">Makkah</p>
                                <p className="text-sm text-gray-600">{travelData?.hotelMakkah || '-'}</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium">Madinah</p>
                                <p className="text-sm text-gray-600">{travelData?.hotelMadinah || '-'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Lokasi Penting
                            </h4>
                            <Button variant="outline" size="sm" onClick={handleViewMapJourney}>
                              Lihat Peta Perjalanan
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Dokumen Section */}
            {activeSection === "dokumen" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Kelola Dokumen</CardTitle>
                    <CardDescription>
                      Pastikan semua dokumen Anda lengkap dan valid
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documents && documents.length > 0 ? documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <FileText className="h-5 w-5 text-gray-700" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{doc.name}</h4>
                              <p className="text-sm text-gray-600">
                                Berlaku hingga: {doc.expiry}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {getStatusBadge(doc.status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDocumentAction(doc)}
                            >
                              {doc.status === "Lengkap" ? "Lihat" : "Upload"}
                            </Button>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-6 text-gray-500">
                          <p>Belum ada dokumen</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5" />

                        <div>
                          <h4 className="font-semibold text-blue-800">
                            Dokumen yang Harus Dilengkapi
                          </h4>

                          <ul className="text-sm text-blue-700 space-y-1 mt-2">
                            <li>• Paspor (masa berlaku minimal 6 bulan)</li>
                            <li>• KTP</li>
                            <li>• Kartu Keluarga (KK)</li>
                            <li>• Foto 4x6 background putih</li>
                            <li>• Sertifikat Vaksin</li>
                          </ul>

                          <h4 className="font-semibold text-blue-800 mt-4">
                            Tips Upload Dokumen
                          </h4>

                          <ul className="text-sm text-blue-700 space-y-1 mt-2">
                            <li>• Pastikan foto dokumen jelas dan terbaca</li>
                            <li>• Format file: JPG / PNG / PDF (max 2MB)</li>
                            <li>• Upload minimal 3 bulan sebelum keberangkatan</li>
                            <li>• Periksa masa berlaku paspor minimal 6 bulan</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={() => setShowDocumentModal(true)}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Dokumen Baru
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Konsultasi Section */}
            {activeSection === "konsultasi" && <ConsultationSection />}
          </div>
        </div>
      </div>
    </div>
    

    {/* Profile Modal */}
    <Modal
      isOpen={showProfileModal}
      onClose={() => setShowProfileModal(false)}
      title="Edit Profil Jamaah"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama</label>
            <Input
              placeholder="Masukkan nama"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={isSavingProfile}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              placeholder="Masukkan email"
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
            placeholder="Masukkan nomor telepon"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            disabled={isSavingProfile}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alamat</label>
          <Textarea
            placeholder="Masukkan alamat lengkap" 
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
      </div>
    </Modal>

    {/* Detail Modal */}
    <Modal
      isOpen={showDetailModal}
      onClose={() => {
        setShowDetailModal(false)
        setDetailModalType("")
        setDetailData(null)
      }}
      title={
        detailModalType === "package"
          ? "Detail Paket Umroh"
          : detailModalType === "schedule"
            ? "Detail Jadwal"
            : "Peta Perjalanan"
      }
      size="lg"
    >
      {detailModalType === "package" && detailData && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <h3 className="text-lg font-semibold">{detailData.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{detailData.duration || "-"}</p>
            <p className="text-2xl font-bold text-primary mt-2">{formatShortCurrency(detailData.price || 0)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 border rounded-lg">
              <p className="text-gray-500">Keberangkatan</p>
              <p className="font-semibold">{detailData.date || detailData.departure_date || "-"}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-gray-500">Kuota Tersedia</p>
              <p className="font-semibold">{detailData.available || 0}/{detailData.seats || detailData.quota || 0}</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Fasilitas:</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {(detailData.features || []).slice(0, 8).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {detailModalType === "schedule" && detailData && (
        <div className="space-y-3">
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm text-gray-600">Pembayaran Berikutnya</p>
            <p className="font-semibold mt-1">{detailData.nextPayment}</p>
            <p className="text-sm mt-1">Jumlah: {formatShortCurrency(detailData.paymentAmount)}</p>
          </div>

          <div className="p-4 border rounded-lg bg-purple-50">
            <p className="text-sm text-gray-600">Jadwal Manasik</p>
            <p className="font-semibold mt-1">{detailData.manasikDate}</p>
          </div>

          <div className="p-4 border rounded-lg bg-green-50">
            <p className="text-sm text-gray-600">Estimasi Keberangkatan</p>
            <p className="font-semibold mt-1">{detailData.departureDate}</p>
          </div>
        </div>
      )}

      {detailModalType === "map" && detailData && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Paket</p>
            <p className="font-semibold">{detailData.packageName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Hotel Makkah</p>
              <p className="font-semibold mt-1">{detailData.makkah}</p>
              <Button
                className="w-full mt-3"
                variant="outline"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailData.makkah)}`, '_blank')}
              >
                Buka Peta Makkah
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Hotel Madinah</p>
              <p className="font-semibold mt-1">{detailData.madinah}</p>
              <Button
                className="w-full mt-3"
                variant="outline"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailData.madinah)}`, '_blank')}
              >
                Buka Peta Madinah
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>

    {/* Payment Upload Modal */}
    <Modal
      isOpen={showPaymentModal}
      onClose={() => {
        setShowPaymentModal(false)
        setPaymentData({ amount: "", paymentMethod: "", description: "" })
        setPaymentFile(null)
        setUploadProgress(0)
      }}
      title="Upload Bukti Pembayaran"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Jumlah Bayar *
            </label>
            <Input
              type="number"
              placeholder="Masukkan jumlah"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Metode Pembayaran *
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
              disabled={isUploading}
            >
              <option value="">Pilih metode</option>
              <option value="Transfer BCA">Transfer BCA</option>
              <option value="Transfer BRI">Transfer BRI</option>
              <option value="Transfer Mandiri">Transfer Mandiri</option>
              <option value="Transfer BNI">Transfer BNI</option>
              <option value="Cash">Cash</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>
        </div>

        {showPaymentDestination && (
          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
            <p className="text-sm font-medium text-blue-800">No Rek Tujuan</p>
            <p className="text-lg font-bold text-blue-900 mt-1">{selectedPaymentDestination.accountNumber}</p>
            <p className="text-sm text-blue-700 mt-1">
              {selectedPaymentDestination.methodLabel} a.n {selectedPaymentDestination.accountName}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Keterangan
          </label>
          <Textarea
            placeholder="Catatan tambahan (opsional)"
            value={paymentData.description}
            onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
            rows={3}
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Bukti Pembayaran *
          </label>
          <FileUpload
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5 * 1024 * 1024}
            onFileSelect={(file) => setPaymentFile(file)}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowPaymentModal(false)
              setPaymentData({ amount: "", paymentMethod: "", description: "" })
              setPaymentFile(null)
            }}
            disabled={isUploading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleUploadPayment}
            disabled={isUploading || !paymentFile}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>

    {/* Document Upload Modal */}
    <Modal
      isOpen={showDocumentModal}
      onClose={() => {
        setShowDocumentModal(false)
        setSelectedDocumentType("")
        setDocumentData({ documentType: "", description: "", expiryDate: "" })
        setDocumentFile(null)
        setUploadProgress(0)
      }}
      title={selectedDocumentType ? `Upload Dokumen: ${selectedDocumentType}` : "Upload Dokumen"}
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Jenis Dokumen *
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={documentData.documentType}
            onChange={(e) => setDocumentData({ ...documentData, documentType: e.target.value })}
            disabled={isUploading}
          >
            <option value="">Pilih jenis dokumen</option>
            <option value="Paspor">Paspor</option>
            <option value="KTP">KTP</option>
            <option value="KK">Kartu Keluarga</option>
            <option value="Foto">Foto 4x6</option>
            <option value="Sertifikat Vaksin">Sertifikat Vaksin</option>
            <option value="Buku Nikah">Buku Nikah</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {["Paspor", "Sertifikat Vaksin"].includes(documentData.documentType) && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Tanggal Kedaluwarsa *
            </label>
            <Input
              type="date"
              value={documentData.expiryDate}
              onChange={(e) => setDocumentData({ ...documentData, expiryDate: e.target.value })}
              disabled={isUploading}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Keterangan
          </label>
          <Textarea
            placeholder="Catatan tambahan (opsional)"
            value={documentData.description}
            onChange={(e) => setDocumentData({ ...documentData, description: e.target.value })}
            rows={3}
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload File Dokumen *
          </label>
          <FileUpload
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5 * 1024 * 1024}
            onFileSelect={(file) => setDocumentFile(file)}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowDocumentModal(false)
              setSelectedDocumentType("")
              setDocumentData({ documentType: "", description: "", expiryDate: "" })
              setDocumentFile(null)
            }}
            disabled={isUploading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleUploadDocument}
            disabled={isUploading || !documentFile}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
    </>
  )
}
