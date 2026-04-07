import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Modal from "@/components/ui/Modal"
import { formatShortCurrency } from "@/utils/formatCurrency"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Plane,
  Users,
  DollarSign,
  Star,
  Calendar,
  Hotel,
  ChevronDown,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"

export const AdminTravel = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("semua")
  const [travelData, setTravelData] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    departure_date: "",
    quota: "",
    description: "",
    accommodation_id: "",
    hotel_makkah: "",
    hotel_madinah: "",
    airline: ""
  })

  // Accommodations state
  const [accommodations, setAccommodations] = useState([])

  // Fetch accommodations
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const data = await apiClient.getAccommodations()
        setAccommodations(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error loading accommodations:", error)
      }
    }
    fetchAccommodations()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getPackages()
      setTravelData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading packages:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data paket travel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch travel packages from API
  useEffect(() => {
    fetchPackages()
  }, [])
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration: "",
      departure_date: "",
      quota: "",
      description: ""
    })
  }
  
  // Handle create
  const handleCreate = async () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.departure_date || !formData.quota) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    setSubmitting(true)
    try {
      await apiClient.createPackage(formData)
      
      toast({
        title: "Berhasil!",
        description: "Paket travel berhasil ditambahkan",
        variant: "success"
      })
      
      setShowCreateModal(false)
      resetForm()
      
      // Refresh data
      await fetchPackages()
    } catch (error) {
      console.error('Error creating package:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan paket",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle edit
  const handleEdit = (pkg) => {
    setSelectedPackage(pkg)
    setFormData({
      name: pkg.name || "",
      price: pkg.price || "",
      duration: pkg.duration || "",
      departure_date: pkg.departure_date || "",
      quota: pkg.quota || "",
      description: pkg.description || ""
    })
    setShowEditModal(true)
  }
  
  // Handle update
  const handleUpdate = async () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.departure_date || !formData.quota) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    setSubmitting(true)
    try {
      await apiClient.updatePackage(selectedPackage.id, formData)
      
      toast({
        title: "Berhasil!",
        description: "Paket travel berhasil diupdate",
        variant: "success"
      })
      
      setShowEditModal(false)
      setSelectedPackage(null)
      resetForm()
      
      // Refresh data
      await fetchPackages()
    } catch (error) {
      console.error('Error updating package:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate paket",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle delete
  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await apiClient.deletePackage(selectedPackage.id)
      
      toast({
        title: "Berhasil!",
        description: "Paket travel berhasil dihapus",
        variant: "success"
      })
      
      setShowDeleteModal(false)
      setSelectedPackage(null)
      
      // Refresh data
      await fetchPackages()
    } catch (error) {
      console.error('Error deleting package:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus paket",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle export
  const handleExport = async () => {
    try {
      await apiClient.exportStatistics('packages')
      toast({
        title: "Berhasil!",
        description: "Data sedang diunduh",
        variant: "success"
      })
    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Gagal mengunduh data",
        variant: "destructive"
      })
    }
  }

  const deriveStatus = (pkg) => {
    if (pkg?.status) return pkg.status
    const quota = Number(pkg?.quota || 0)
    const booked = Number(pkg?.booked || 0)
    if (!quota) return "Coming Soon"
    const percentage = (booked / quota) * 100
    if (percentage >= 80) return "Hampir Penuh"
    return "Aktif"
  }

  const openDetailModal = (pkg) => {
    setSelectedPackage(pkg)
    setShowDetailModal(true)
  }

  // Filter data
  const filteredTravel = travelData.filter(item => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = (item.name || "").toLowerCase().includes(q) ||
                         (item.hotel || "").toLowerCase().includes(q)
    const currentStatus = deriveStatus(item)
    
    if (statusFilter === "semua") return matchesSearch
    if (statusFilter === "aktif") return matchesSearch && currentStatus === "Aktif"
    if (statusFilter === "hampir penuh") return matchesSearch && currentStatus === "Hampir Penuh"
    if (statusFilter === "coming soon") return matchesSearch && currentStatus === "Coming Soon"
    
    return matchesSearch
  })

  // Status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "Aktif": return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "Hampir Penuh": return <Badge className="bg-yellow-100 text-yellow-800">Hampir Penuh</Badge>
      case "Coming Soon": return <Badge className="bg-blue-100 text-blue-800">Coming Soon</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  // Progress bar component
  const QuotaBar = ({ booked, quota }) => {
    const safeQuota = Number(quota || 0)
    const safeBooked = Number(booked || 0)
    const percentage = safeQuota > 0 ? (safeBooked / safeQuota) * 100 : 0
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Tersedia: {Math.max(safeQuota - safeBooked, 0)}</span>
          <span>{Math.round(percentage)}% terisi</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              percentage < 50 ? 'bg-green-500' :
              percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    )
  }

  const dashboardStats = (() => {
    const totalPackages = travelData.length
    const activePackages = travelData.filter((p) => deriveStatus(p) === "Aktif").length
    const totalBooked = travelData.reduce((sum, p) => sum + Number(p.booked || 0), 0)
    const totalQuota = travelData.reduce((sum, p) => sum + Number(p.quota || 0), 0)
    const avgPrice =
      totalPackages > 0
        ? Math.round(travelData.reduce((sum, p) => sum + Number(p.price || 0), 0) / totalPackages)
        : 0

    const ratings = travelData
      .map((p) => Number(p.rating))
      .filter((v) => !Number.isNaN(v) && v > 0)
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "-"

    const potentialRevenue = travelData.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.quota || 0),
      0
    )
    const confirmedRevenue = travelData.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.booked || 0),
      0
    )
    const filledPercent = totalQuota > 0 ? Math.round((totalBooked / totalQuota) * 100) : 0

    return {
      totalPackages,
      activePackages,
      totalBooked,
      totalQuota,
      avgPrice,
      avgRating,
      potentialRevenue,
      confirmedRevenue,
      filledPercent,
      availableQuota: Math.max(totalQuota - totalBooked, 0),
    }
  })()

  const formatCompactRupiah = (value) => {
    const num = Number(value || 0)
    if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)}Jt`
    return `Rp ${num.toLocaleString("id-ID")}`
  }

  return (
    <div className="mt-12 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manajemen Travel
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Kelola paket travel umroh
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => {
            resetForm()
            setShowCreateModal(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Paket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paket Aktif</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.activePackages}</p>
                <p className="text-sm text-green-600 mt-1">dari {dashboardStats.totalPackages} paket</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jamaah Terdaftar</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.totalBooked}</p>
                <p className="text-sm text-gray-600 mt-1">Dari semua paket</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Harga</p>
                <p className="text-2xl font-bold mt-2">{formatCompactRupiah(dashboardStats.avgPrice)}</p>
                <p className="text-sm text-gray-600 mt-1">Per paket</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Rata-rata</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.avgRating}</p>
                <p className="text-sm text-gray-600 mt-1">Dari data paket</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel Packages Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Paket Travel</CardTitle>
              <CardDescription>
                Daftar paket umroh yang tersedia
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari paket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("semua")}>Semua</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("aktif")}>Aktif</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("hampir penuh")}>Hampir Penuh</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("coming soon")}>Coming Soon</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status Filter */}
          {/* <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
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
              variant={statusFilter === "hampir penuh" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("hampir penuh")}
            >
              Hampir Penuh
            </Button>
            <Button
              variant={statusFilter === "coming soon" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("coming soon")}
            >
              Coming Soon
            </Button>
          </div> */}
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          ) : filteredTravel.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Tidak ada paket travel</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Kuota</TableHead>
                  <TableHead>Keberangkatan</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTravel.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <p className="text-sm text-gray-600">{item.duration}</p>
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <p className="text-sm text-gray-600">{item.rating || '5.0'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                     <p className="text-xl font-bold text-primary mt-2">{formatShortCurrency(item.price || 0)}</p>

                    </TableCell>
                    <TableCell>
                      <QuotaBar booked={item.booked || 0} quota={item.quota || 0} />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.departure_date || item.date}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Hotel className="h-3 w-3 text-gray-500" />
                        <p className="text-sm text-gray-600">{item.hotel || 'Hotel Bintang 5'}</p>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      {getStatusBadge(deriveStatus(item))}
                    </TableCell> */}
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Lihat Detail"
                          onClick={() => openDetailModal(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Hapus"
                          onClick={() => {
                            setSelectedPackage(item)
                            setShowDeleteModal(true)
                          }}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Statistik Paket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Kuota Terpakai</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Terisi</span>
                    <span className="text-sm font-medium">{dashboardStats.totalBooked} jamaah</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dashboardStats.filledPercent}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Tersedia</span>
                    <span className="text-sm font-medium">{dashboardStats.availableQuota} jamaah</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.max(100 - dashboardStats.filledPercent, 0)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Pendapatan Potensial</p>
                  <p className="text-sm text-gray-600">Dari semua paket</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{formatCompactRupiah(dashboardStats.potentialRevenue)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Pendapatan Bulan Ini</p>
                    <p className="text-sm text-gray-600">Sudah terkonfirmasi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{formatCompactRupiah(dashboardStats.confirmedRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Tambah Paket Travel Baru"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Masukan nama paket"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Masukan harga paket"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Durasi <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Masukan durasi perjalanan"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal Keberangkatan   <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Kuota Jamaah <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Masukan jumlah kuota maksimal"
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hotel Mekah</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.hotel_makkah}
                onChange={e => setFormData({ ...formData, hotel_makkah: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih Hotel Mekah</option>
                {accommodations.filter(a => a.type === 'hotel Mekah').map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hotel Madinah</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.hotel_madinah}
                onChange={e => setFormData({ ...formData, hotel_madinah: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih Hotel Madinah</option>
                {accommodations.filter(a => a.type === 'hotel Madinah').map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Penerbangan</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.airline}
                onChange={e => setFormData({ ...formData, airline: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih Maskapai</option>
                {accommodations.filter(a => a.type === 'Maskapai').map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
            {/* Foto Paket Travel - styled upload zone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Foto Paket Travel</label>
              <label
                className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-all ${
                  submitting
                    ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                    : 'border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary'
                }`}
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16.5 8.5L12 4m0 0L7.5 8.5M12 4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {formData.photo instanceof File ? formData.photo.name : 'Klik untuk pilih gambar'}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP — maks. 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setFormData({ ...formData, photo: e.target.files[0] })}
                  disabled={submitting}
                />
              </label>
              {formData.photo instanceof File && (
                <div className="mt-2 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-green-700 font-medium truncate max-w-xs">{formData.photo.name}</span>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:text-red-700 ml-2"
                    onClick={() => setFormData({ ...formData, photo: null })}
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi
            </label>
            <Textarea
              placeholder="Masukan detail paket umroh (opsional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                resetForm()
              }}
              disabled={submitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Paket
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
          setSelectedPackage(null)
          resetForm()
        }}
        title="Edit Paket Travel"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Masukan nama paket"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Masukan harga paket"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Durasi <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Masukan durasi perjalanan"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal Keberangkatan <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Kuota Jamaah <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Masukan jumlah kuota maksimal"
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hotel Mekah</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.hotel_makkah}
                onChange={e => setFormData({ ...formData, hotel_makkah: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih Hotel Mekah</option>
                {accommodations.filter(a => a.type === 'hotel Mekah').map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hotel Madinah</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.hotel_madinah}
                onChange={e => setFormData({ ...formData, hotel_madinah: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih Hotel Madinah</option>
                {accommodations.filter(a => a.type === 'hotel Madinah').map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Penerbangan</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.airline}
                onChange={e => setFormData({ ...formData, airline: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih Maskapai</option>
                {accommodations.filter(a => a.type === 'Bandara').map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
            {/* Foto Paket Travel - styled upload zone with existing preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Foto Paket Travel</label>
              {formData.photo && typeof formData.photo === 'string' && (
                <div className="mb-3 rounded-xl overflow-hidden border-2 border-blue-100 shadow-sm relative group">
                  <img
                    src={formData.photo}
                    alt="Foto saat ini"
                    className="w-full h-44 object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-3 py-2">
                    <p className="text-xs text-white font-medium">📷 Foto saat ini — upload baru untuk mengganti</p>
                  </div>
                </div>
              )}
              <label
                className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-all ${
                  submitting
                    ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                    : 'border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary'
                }`}
              >
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16.5 8.5L12 4m0 0L7.5 8.5M12 4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {formData.photo instanceof File ? formData.photo.name : (formData.photo ? 'Ganti dengan gambar baru' : 'Klik untuk pilih gambar')}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP — maks. 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setFormData({ ...formData, photo: e.target.files[0] })}
                  disabled={submitting}
                />
              </label>
              {formData.photo instanceof File && (
                <div className="mt-2 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-green-700 font-medium truncate max-w-xs">{formData.photo.name}</span>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:text-red-700 ml-2"
                    onClick={() => setFormData({ ...formData, photo: null })}
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi
            </label>
            <Textarea
              placeholder="Masukan detail paket"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setSelectedPackage(null)
                resetForm()
              }}
              disabled={submitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Paket
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
          setSelectedPackage(null)
        }}
        title="Konfirmasi Hapus"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Apakah Anda yakin ingin menghapus paket travel ini?
          </p>
          
          {selectedPackage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-red-800">{selectedPackage.name}</p>
              <p className="text-sm text-red-600 mt-1">
                Harga: Rp{(selectedPackage.price || 0).toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-red-600">
                Kuota: {selectedPackage.quota || 0} jamaah
              </p>
            </div>
          )}
          
          <p className="text-sm text-red-600">
            <strong>Peringatan:</strong> Data yang sudah dihapus tidak dapat dikembalikan.
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedPackage(null)
              }}
              disabled={submitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Paket
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
          setSelectedPackage(null)
        }}
        title="Detail Paket Travel"
        size="lg"
      >
        {selectedPackage && (
          <div className="space-y-5">

            {/* Photo */}
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative">
              <img
                src={selectedPackage.photo}
                alt={selectedPackage.name}
                className="w-full h-150 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='208' viewBox='0 0 400 208'%3E%3Crect width='400' height='208' fill='%23f0f4ff'/%3E%3Ccircle cx='200' cy='85' r='35' fill='%23c7d7ff'/%3E%3Ccircle cx='200' cy='73' r='22' fill='%23a5b8ff'/%3E%3Crect x='125' y='122' width='150' height='12' rx='6' fill='%23a5b8ff'/%3E%3Crect x='145' y='142' width='110' height='9' rx='4' fill='%23c7d7ff'/%3E%3Ctext x='200' y='178' font-family='sans-serif' font-size='13' fill='%236b7fc4' text-anchor='middle'%3EPaket Umroh%3C/text%3E%3C/svg%3E"
                }}
              />
              {/* Status badge overlay */}
              <div className="absolute top-3 right-3">
                {getStatusBadge(deriveStatus(selectedPackage))}
              </div>
            </div>

            {/* Header info */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedPackage.name || "-"}</h3>
                <p className="text-2xl font-bold text-primary mt-1">
                  Rp{Number(selectedPackage.price || 0).toLocaleString("id-ID")}
                  <span className="text-sm font-normal text-gray-500 ml-1">/ orang</span>
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Durasi</p>
                <p className="font-semibold text-sm">{selectedPackage.duration || "-"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Keberangkatan</p>
                <p className="font-semibold text-sm">{selectedPackage.departure_date || selectedPackage.date || "-"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Hotel Mekah</p>
                <p className="font-semibold text-sm">{selectedPackage.hotelMakkah || selectedPackage.hotel || "-"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Hotel Madinah</p>
                <p className="font-semibold text-sm">{selectedPackage.hotelMadinah || "-"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Maskapai</p>
                <p className="font-semibold text-sm">{selectedPackage.airline || "-"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Kuota</p>
                <p className="font-semibold text-sm">{selectedPackage.booked || 0} / {selectedPackage.quota || 0} jamaah</p>
              </div>
            </div>

            {/* Quota Bar */}
            <div>
              <QuotaBar booked={selectedPackage.booked || 0} quota={selectedPackage.quota || 0} />
            </div>

            {/* Description */}
            {selectedPackage.description && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">Deskripsi</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPackage.description}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false)
                  handleEdit(selectedPackage)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Paket
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedPackage(null)
                }}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
