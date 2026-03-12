import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Modal from "@/components/ui/Modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  CreditCard,
  FileCheck
} from "lucide-react"
import { useState, useEffect } from "react"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"

export const AdminJamaah = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("semua")
  const [jamaahData, setJamaahData] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, aktif: 0, menunggu: 0, tertunggak: 0 })
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedJamaah, setSelectedJamaah] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jamaahDocuments, setJamaahDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [documentsList, setDocumentsList] = useState([])
  const [loadingDocumentsList, setLoadingDocumentsList] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    email: "",
    phone: "",
    address: "",
    travel_package_id: "",
    user_id: ""
  })
  
  const [packages, setPackages] = useState([])

  const normalizeStatus = (status) => {
    const s = String(status || "").toLowerCase()
    if (["active", "aktif", "berjalan"].includes(s)) return "aktif"
    if (["waiting", "menunggu", "pending"].includes(s)) return "menunggu"
    if (["completed", "lunas"].includes(s)) return "lunas"
    if (["overdue", "tertunggak"].includes(s)) return "tertunggak"
    return "lainnya"
  }
  
  // Fetch data
  useEffect(() => {
    fetchJamaahs()
    fetchPackages()
    fetchDocumentsList()
  }, [])
  
  const fetchJamaahs = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getJamaahs()
      setJamaahData(data)
      
      // Calculate stats
      const totalJamaah = data.length
      const aktif = data.filter(j => normalizeStatus(j.status) === "aktif").length
      const menunggu = data.filter(j => normalizeStatus(j.status) === "menunggu").length
      const tertunggak = data.filter(j => normalizeStatus(j.status) === "tertunggak").length
      
      setStats({ total: totalJamaah, aktif, menunggu, tertunggak })
    } catch (error) {
      console.error("Error fetching jamaahs:", error)
      toast({
        title: "Gagal Memuat Data",
        description: error.message || "Terjadi kesalahan saat memuat data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const fetchPackages = async () => {
    try {
      const data = await apiClient.getPackages()
      setPackages(data)
    } catch (error) {
      console.error("Error fetching packages:", error)
    }
  }

  const fetchDocumentsList = async () => {
    try {
      setLoadingDocumentsList(true)
      const docs = await apiClient.getDocuments()
      setDocumentsList(Array.isArray(docs) ? docs : [])
    } catch (error) {
      console.error("Error fetching documents list:", error)
      setDocumentsList([])
    } finally {
      setLoadingDocumentsList(false)
    }
  }
  
  // Handle Create
  const handleCreate = async () => {
    if (!formData.name || !formData.nik || !formData.phone) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Nama, NIK, dan telepon wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      await apiClient.createJamaah(formData)
      toast({
        title: "Berhasil!",
        description: "Data jamaah berhasil ditambahkan",
        variant: "success"
      })
      setShowCreateModal(false)
      resetForm()
      fetchJamaahs()
    } catch (error) {
      console.error("Error creating jamaah:", error)
      toast({
        title: "Gagal Menambahkan",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle Update
  const handleUpdate = async () => {
    if (!formData.name || !formData.nik || !formData.phone) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Nama, NIK, dan telepon wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      await apiClient.updateJamaah(selectedJamaah.id, formData)
      toast({
        title: "Berhasil!",
        description: "Data jamaah berhasil diperbarui",
        variant: "success"
      })
      setShowEditModal(false)
      resetForm()
      fetchJamaahs()
    } catch (error) {
      console.error("Error updating jamaah:", error)
      toast({
        title: "Gagal Memperbarui",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle Delete
  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await apiClient.deleteJamaah(selectedJamaah.id)
      toast({
        title: "Berhasil!",
        description: "Data jamaah berhasil dihapus",
        variant: "success"
      })
      setShowDeleteModal(false)
      setSelectedJamaah(null)
      fetchJamaahs()
    } catch (error) {
      console.error("Error deleting jamaah:", error)
      toast({
        title: "Gagal Menghapus",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle Export
  const handleExport = async () => {
    try {
      toast({
        title: "Mengekspor Data",
        description: "Sedang memproses ekspor data..."
      })
      
      await apiClient.exportStatistics("jamaah")
      
      toast({
        title: "Berhasil!",
        description: "Data berhasil diekspor",
        variant: "success"
      })
    } catch (error) {
      console.error("Error exporting:", error)
      toast({
        title: "Gagal Ekspor",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    }
  }
  
  const resetForm = () => {
    setFormData({
      name: "",
      nik: "",
      email: "",
      phone: "",
      address: "",
      travel_package_id: "",
      user_id: ""
    })
    setSelectedJamaah(null)
  }
  
  const openEditModal = (jamaah) => {
    setSelectedJamaah(jamaah)
    setFormData({
      name: jamaah.name || "",
      nik: jamaah.nik || "",
      email: jamaah.email || "",
      phone: jamaah.phone || "",
      address: jamaah.address || "",
      travel_package_id: jamaah.travel_package_id || "",
      user_id: jamaah.user_id || ""
    })
    setShowEditModal(true)
  }
  
  const openDeleteModal = (jamaah) => {
    setSelectedJamaah(jamaah)
    setShowDeleteModal(true)
  }
  
  const openDetailModal = (jamaah) => {
    setSelectedJamaah(jamaah)
    setShowDetailModal(true)
    fetchJamaahDocuments(jamaah.id)
  }

  const fetchJamaahDocuments = async (jamaahId) => {
    try {
      setLoadingDocuments(true)
      const docs = await apiClient.getDocuments(jamaahId)
      setJamaahDocuments(Array.isArray(docs) ? docs : [])
    } catch (error) {
      console.error("Error fetching jamaah documents:", error)
      setJamaahDocuments([])
      toast({
        title: "Gagal Memuat Dokumen",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    } finally {
      setLoadingDocuments(false)
    }
  }

  const handleVerifyDocument = async (documentId) => {
    try {
      await apiClient.verifyDocument(documentId)
      toast({
        title: "Berhasil!",
        description: "Dokumen berhasil diverifikasi",
        variant: "success"
      })

      if (selectedJamaah?.id) {
        await fetchJamaahDocuments(selectedJamaah.id)
      }
      await fetchDocumentsList()
    } catch (error) {
      console.error("Error verifying document:", error)
      toast({
        title: "Gagal Verifikasi",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    }
  }

  const handleDownloadDocument = async (documentId) => {
    try {
      await apiClient.downloadDocument(documentId)
      toast({
        title: "Berhasil!",
        description: "Dokumen sedang diunduh",
        variant: "success"
      })
    } catch (error) {
      console.error("Error downloading document:", error)
      toast({
        title: "Gagal Mengunduh",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      })
    }
  }

  const openDetailFromDocument = (doc) => {
    const jamaahId = doc?.jamaah?.id || doc?.jamaahId
    const matched = jamaahData.find((j) => j.id === jamaahId)

    if (matched) {
      openDetailModal(matched)
      return
    }

    if (doc?.jamaah) {
      openDetailModal(doc.jamaah)
    }
  }
  
  // Filter data
  const filteredJamaah = jamaahData.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nik?.includes(searchTerm) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (statusFilter === "semua") return matchesSearch
    if (statusFilter === "aktif") return matchesSearch && normalizeStatus(item.status) === "aktif"
    if (statusFilter === "menunggu") return matchesSearch && normalizeStatus(item.status) === "menunggu"
    if (statusFilter === "lunas") return matchesSearch && normalizeStatus(item.status) === "lunas"
    if (statusFilter === "tertunggak") return matchesSearch && normalizeStatus(item.status) === "tertunggak"
    
    return matchesSearch
  })

  // Status badge
  const getStatusBadge = (status) => {
    switch(normalizeStatus(status)) {
      case "aktif": return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "menunggu": return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      case "lunas": return <Badge className="bg-blue-100 text-blue-800">Lunas</Badge>
      case "tertunggak": return <Badge className="bg-red-100 text-red-800">Tertunggak</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDocumentStatusBadge = (status) => {
    const s = String(status || "").toLowerCase()
    if (["lengkap", "verified", "disetujui"].includes(s)) {
      return <Badge className="bg-green-100 text-green-800">Lengkap</Badge>
    }
    if (["dalam review", "pending", "menunggu verifikasi"].includes(s)) {
      return <Badge className="bg-yellow-100 text-yellow-800">Dalam Review</Badge>
    }
    if (["ditolak", "rejected"].includes(s)) {
      return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
    }
    return <Badge variant="outline">{status || "-"}</Badge>
  }

  const packageDistribution = (() => {
    const total = jamaahData.length
    const map = new Map()

    jamaahData.forEach((j) => {
      const name = j.travelPackage?.name || j.travel_package?.name || "Tanpa Paket"
      map.set(name, (map.get(name) || 0) + 1)
    })

    return Array.from(map.entries())
      .map(([packageName, count]) => ({
        package: packageName,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })()

  const monthlyRegistrations = (() => {
    const map = new Map()
    const formatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" })

    const parseRegistrationDate = (value) => {
      if (!value) return null

      // ISO format or native date-compatible string
      let parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) return parsed

      // Fallback for "d F Y" format (e.g. "15 January 2025")
      const match = String(value).match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
      if (!match) return null

      const [, day, monthName, year] = match
      parsed = new Date(`${monthName} ${day}, ${year}`)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }

    jamaahData.forEach((j) => {
      const dateValue =
        j.registration_date ||
        j.registrationDate ||
        j.joinDate ||
        j.created_at ||
        j.createdAt

      if (!dateValue) return

      const date = parseRegistrationDate(dateValue)
      if (!date) return

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const existing = map.get(key)
      if (existing) {
        existing.count += 1
      } else {
        map.set(key, {
          key,
          month: formatter.format(date),
          count: 1,
        })
      }
    })

    return Array.from(map.values())
      .sort((a, b) => b.key.localeCompare(a.key))
      .slice(0, 5)
  })()

  return (
    <>
      <div className="min-h-screen bg-gray-50 mt-12 px-4">
        <div className="container mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manajemen Jamaah
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kelola data dan informasi jamaah umroh
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Jamaah
            </Button>
          </div>
          </div>

          {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jamaah</p>
                  <p className="text-2xl font-bold mt-2">{stats.total}</p>
                  <p className="text-sm text-gray-600 mt-1">Terdaftar</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif</p>
                  <p className="text-2xl font-bold mt-2">{stats.aktif}</p>
                  <p className="text-sm text-gray-600 mt-1">{stats.total > 0 ? Math.round((stats.aktif/stats.total)*100) : 0}% dari total</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold mt-2">{stats.menunggu}</p>
                  <p className="text-sm text-yellow-600 mt-1">{stats.menunggu > 0 ? 'Perlu tindakan' : 'Tidak ada'}</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tertunggak</p>
                  <p className="text-2xl font-bold mt-2">{stats.tertunggak}</p>
                  <p className="text-sm text-red-600 mt-1">{stats.tertunggak > 0 ? 'Perlu penagihan' : 'Tidak ada'}</p>
                </div>
                <div className="bg-red-500 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Main Content */}
          <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Data Jamaah</CardTitle>
                <CardDescription>
                  Daftar lengkap jamaah yang terdaftar
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari jamaah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                
              </div>
            </div>

            {/* Status Filter
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              <Button
                variant={statusFilter === "semua" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("semua")}
              >
                Semua
              </Button>
              <Button
                variant={statusFilter === "aktif" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("aktif")}
              >
                Aktif
              </Button>
              <Button
                variant={statusFilter === "menunggu" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("menunggu")}
              >
                Menunggu
              </Button>
              <Button
                variant={statusFilter === "lunas" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("lunas")}
              >
                Lunas
              </Button>
              <Button
                variant={statusFilter === "tertunggak" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("tertunggak")}
              >
                Tertunggak
              </Button>
            </div> */}
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-gray-600">Memuat data...</span>
              </div>
            ) : filteredJamaah.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada data jamaah</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Jamaah</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Paket</TableHead>
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJamaah.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <CreditCard className="h-3 w-3 text-gray-500" />
                              <p className="text-sm text-gray-600">{item.nik}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <p className="text-sm">{item.phone}</p>
                            </div>
                            {item.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <p className="text-sm">{item.email}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{item.travelPackage?.name || item.travel_package?.name || '-'}</p>
                          {item.address && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-500" />
                              <p className="text-sm text-gray-600">{item.address}</p>
                            </div>
                          )}
                        </TableCell>
                        {/* <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell> */}
                        <TableCell>
                          <div className="flex gap-1 text-center justify-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDetailModal(item)}
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditModal(item)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteModal(item)}
                              title="Hapus"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Jamaah per Paket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packageDistribution.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada data paket.</p>
                ) : packageDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.package}</span>
                      <span className="text-sm text-gray-600">{item.count} jamaah</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pendaftaran per Bulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyRegistrations.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada data pendaftaran.</p>
                ) : monthlyRegistrations.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>{item.month}</span>
                    <Badge>{item.count} pendaftar</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                List Dokumen Jamaah
              </CardTitle>
              <CardDescription>
                Dokumen terbaru beserta status verifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDocumentsList ? (
                <div className="flex items-center text-sm text-gray-600 py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Memuat list dokumen...
                </div>
              ) : documentsList.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada dokumen jamaah.</p>
              ) : (
                <div className="space-y-3">
                  {documentsList.slice(0, 6).map((doc) => (
                    <div key={doc.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{doc.name || doc.documentType || "Dokumen"}</p>
                          <p className="text-xs text-gray-600">{doc.jamaah?.name || "Jamaah"}</p>
                          <p className="text-xs text-gray-500 mt-1">{doc.expiry || "-"}</p>
                        </div>
                        {getDocumentStatusBadge(doc.status || doc.rawStatus)}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadDocument(doc.id)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Unduh
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDetailFromDocument(doc)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    
      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Tambah Jamaah Baru"
        size="lg"
      >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
            <Input
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">NIK <span className="text-red-500">*</span></label>
            <Input
              placeholder="Masukkan 16 digit NIK"
              value={formData.nik}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              disabled={isSubmitting}
              maxLength={16}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email <span className="text-red-500">*</span></label>
            <Input
              type="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Password Jamaah default adalah "password"</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telepon <span className="text-red-500">*</span></label>
            <Input
              placeholder="Masukkan nomor telepon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Alamat <span className="text-red-500">*</span></label>
          <Textarea
            placeholder="Masukkan alamat lengkap"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Paket Travel</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.travel_package_id}
            onChange={(e) => setFormData({ ...formData, travel_package_id: e.target.value })}
            disabled={isSubmitting}
          >
            <option value="">Pilih paket (opsional)</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowCreateModal(false)
              resetForm()
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Simpan
              </>
            )}
          </Button>
        </div>
      </div>
      </Modal>
    
      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          resetForm()
        }}
        title="Edit Data Jamaah"
        size="lg"
      >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
            <Input
              placeholder="Masukan nama lengkap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">NIK <span className="text-red-500">*</span></label>
            <Input
              placeholder="Masukan 16 digit NIK"
              value={formData.nik}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              disabled={isSubmitting}
              maxLength={16}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email <span className="text-red-500">*</span></label>
            <Input
              type="email"
              placeholder="Masukan email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telepon <span className="text-red-500">*</span></label>
            <Input
              placeholder="Masukan nomor telepon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Alamat <span className="text-red-500">*</span></label>
          <Textarea
            placeholder="Masukan alamat lengkap"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Paket Travel</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.travel_package_id}
            onChange={(e) => setFormData({ ...formData, travel_package_id: e.target.value })}
            disabled={isSubmitting}
          >
            <option value="">Pilih paket</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowEditModal(false)
              resetForm()
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Update
              </>
            )}
          </Button>
        </div>
      </div>
      </Modal>
    
      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedJamaah(null)
        }}
        title="Konfirmasi Hapus"
        size="sm"
      >
      <div className="space-y-4">
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus data jamaah <strong>{selectedJamaah?.name}</strong>? 
          Tindakan ini tidak dapat dibatalkan.
        </p>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false)
              setSelectedJamaah(null)
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </>
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
          setSelectedJamaah(null)
          setJamaahDocuments([])
        }}
        title="Detail Jamaah"
        size="lg"
      >
      {selectedJamaah && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nama Lengkap</p>
              <p className="font-medium">{selectedJamaah.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NIK</p>
              <p className="font-medium">{selectedJamaah.nik}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{selectedJamaah.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telepon</p>
              <p className="font-medium">{selectedJamaah.phone}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Alamat</p>
            <p className="font-medium">{selectedJamaah.address || '-'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Paket Travel</p>
              <p className="font-medium">{selectedJamaah.travelPackage?.name || selectedJamaah.travel_package?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              {getStatusBadge(selectedJamaah.status)}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Dokumen Jamaah</p>

            {loadingDocuments ? (
              <div className="flex items-center py-3 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Memuat dokumen...
              </div>
            ) : jamaahDocuments.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada dokumen.</p>
            ) : (
              <div className="space-y-2">
                {jamaahDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-medium">{doc.name || doc.documentType || doc.document_type || "Dokumen"}</p>
                        <p className="text-xs text-gray-500">{doc.expiry || "-"}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {getDocumentStatusBadge(doc.status || doc.rawStatus)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadDocument(doc.id)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Unduh
                        </Button>
                        {!['lengkap', 'verified'].includes(String(doc.status || doc.rawStatus || '').toLowerCase()) && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyDocument(doc.id)}
                          >
                            <FileCheck className="h-3 w-3 mr-1" />
                            Verifikasi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDetailModal(false)
                openEditModal(selectedJamaah)
              }}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDetailModal(false)}
              className="flex-1"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
      </Modal>
    </>
  )
}
