import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Modal from "@/components/ui/Modal"
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
  Edit, 
  Trash2,
  Plus,
  MapPin,
  Hotel,
  Star,
  Building,
  Home,
  Plane,
  ChevronDown,
  Loader2,
  Eye
} from "lucide-react"
import { useState, useEffect } from "react"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"

export const AdminTempat = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("semua")
  const [tempatData, setTempatData] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    address: "",
    rating: "",
    description: ""
  })
  
  const fetchAccommodations = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getAccommodations()
      setTempatData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading accommodations:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data tempat",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch accommodations from API
  useEffect(() => {
    fetchAccommodations()
  }, [])
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      location: "",
      address: "",
      rating: "",
      description: ""
    })
  }
  
  // Handle create
  const handleCreate = async () => {
    if (!formData.name || !formData.type || !formData.location) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    setSubmitting(true)
    try {
      await apiClient.createAccommodation(formData)
      
      toast({
        title: "Berhasil!",
        description: "Tempat berhasil ditambahkan",
        variant: "success"
      })
      
      setShowCreateModal(false)
      resetForm()
      
      // Refresh data
      await fetchAccommodations()
    } catch (error) {
      console.error('Error creating accommodation:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan tempat",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle edit
  const handleEdit = (place) => {
    setSelectedPlace(place)
    setFormData({
      name: place.name || "",
      type: place.type || "",
      location: place.location || "",
      address: place.address || "",
      rating: place.rating || "",
      description: place.description || ""
    })
    setShowEditModal(true)
  }
  
  // Handle update
  const handleUpdate = async () => {
    if (!formData.name || !formData.type || !formData.location) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    setSubmitting(true)
    try {
      await apiClient.updateAccommodation(selectedPlace.id, formData)
      
      toast({
        title: "Berhasil!",
        description: "Tempat berhasil diupdate",
        variant: "success"
      })
      
      setShowEditModal(false)
      setSelectedPlace(null)
      resetForm()
      
      // Refresh data
      await fetchAccommodations()
    } catch (error) {
      console.error('Error updating accommodation:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate tempat",
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
      await apiClient.deleteAccommodation(selectedPlace.id)
      
      toast({
        title: "Berhasil!",
        description: "Tempat berhasil dihapus",
        variant: "success"
      })
      
      setShowDeleteModal(false)
      setSelectedPlace(null)
      
      // Refresh data
      await fetchAccommodations()
    } catch (error) {
      console.error('Error deleting accommodation:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus tempat",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle export
  const handleExport = async () => {
    try {
      await apiClient.exportStatistics('accommodations')
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

  const openCreateWithType = (type) => {
    resetForm()
    setFormData((prev) => ({ ...prev, type }))
    setShowCreateModal(true)
  }

  const openDetailModal = (place) => {
    setSelectedPlace(place)
    setShowDetailModal(true)
  }
  
  // Filter data
  const filteredTempat = tempatData.filter(item => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = (item.name || "").toLowerCase().includes(q) ||
                         (item.location || "").toLowerCase().includes(q)
    
    if (typeFilter === "semua") return matchesSearch
    return matchesSearch && item.type === typeFilter
  })

  // Icon berdasarkan tipe
  const getTypeIcon = (type) => {
    switch(type) {
      case "Hotel": return <Hotel className="h-4 w-4" />
      case "Bandara": return <Plane className="h-4 w-4" />
      case "Pemondokan": return <Home className="h-4 w-4" />
      default: return <Building className="h-4 w-4" />
    }
  }

  // Color badge berdasarkan tipe
  const getTypeBadge = (type) => {
    switch(type) {
      case "Hotel": return <Badge className="bg-blue-100 text-blue-800">{type}</Badge>
      case "Bandara": return <Badge className="bg-purple-100 text-purple-800">{type}</Badge>
      case "Pemondokan": return <Badge className="bg-green-100 text-green-800">{type}</Badge>
      default: return <Badge variant="outline">{type}</Badge>
    }
  }

  const normalizedType = (type) => {
    const t = String(type || "").toLowerCase()
    if (t.includes("hotel")) return "Hotel"
    if (t.includes("bandara")) return "Bandara"
    if (t.includes("pemondokan")) return "Pemondokan"
    return "Lainnya"
  }

  const dashboardStats = (() => {
    const total = tempatData.length
    const hotelCount = tempatData.filter((t) => normalizedType(t.type) === "Hotel").length

    const ratings = tempatData
      .map((t) => Number(t.rating))
      .filter((v) => !Number.isNaN(v) && v > 0)
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "-"

    return {
      total,
      hotelCount,
      avgRating,
    }
  })()

  const locationStats = (() => {
    const map = new Map()
    tempatData.forEach((t) => {
      const key = t.location || "Tidak diketahui"
      map.set(key, (map.get(key) || 0) + 1)
    })

    const total = tempatData.length
    return Array.from(map.entries())
      .map(([location, count]) => ({
        location,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  })()

  const recentActivities = (() => {
    return [...tempatData]
      .sort((a, b) => {
        const da = new Date(a.updated_at || a.created_at || 0).getTime()
        const db = new Date(b.updated_at || b.created_at || 0).getTime()
        return db - da
      })
      .slice(0, 3)
      .map((item) => ({
        title: `${item.name || "Tempat"} diperbarui`,
        time: item.updated_at || item.created_at || "-",
      }))
  })()

  return (
    <div className="mt-12 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manajemen Tempat & Akomodasi
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Kelola hotel, bandara, dan fasilitas jamaah
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
            Tambah Tempat
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tempat</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.total}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hotel</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.hotelCount}</p>
                <p className="text-sm text-gray-600 mt-1">Aktif</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <Hotel className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata Rating</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.avgRating}</p>
                <p className="text-sm text-gray-600 mt-1">Dari semua tempat</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kamar Tersedia</p>
                <p className="text-2xl font-bold mt-2">{dashboardStats.total}</p>
                <p className="text-sm text-gray-600 mt-1">Total lokasi</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daftar Tempat */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Daftar Tempat & Akomodasi</CardTitle>
                  <CardDescription>
                    Hotel, bandara, dan fasilitas pendukung
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari tempat..."
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
                      <DropdownMenuItem onClick={() => setTypeFilter("semua")}>Semua</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter("Hotel")}>Hotel</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter("Bandara")}>Bandara</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter("Pemondokan")}>Pemondokan</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <Button
                  variant={typeFilter === "semua" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("semua")}
                >
                  Semua
                </Button>
                <Button
                  variant={typeFilter === "Hotel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("Hotel")}
                >
                  Hotel
                </Button>
                <Button
                  variant={typeFilter === "Bandara" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("Bandara")}
                >
                  Bandara
                </Button>
                <Button
                  variant={typeFilter === "Pemondokan" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter("Pemondokan")}
                >
                  Pemondokan
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-4 text-gray-600">Memuat data...</p>
                </div>
              ) : filteredTempat.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Tidak ada tempat</p>
                </div>
              ) : (
              <div className="space-y-4">
                {filteredTempat.map((tempat) => (
                  <div key={tempat.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getTypeIcon(tempat.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{tempat.name}</h3>
                            {getTypeBadge(tempat.type)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{tempat.location}</span>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{tempat.rating || '5.0'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Lihat"
                          onClick={() => openDetailModal(tempat)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Edit"
                          onClick={() => handleEdit(tempat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Hapus"
                          onClick={() => {
                            setSelectedPlace(tempat)
                            setShowDeleteModal(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {tempat.address && (
                      <p className="text-sm text-gray-600 mb-3">{tempat.address}</p>
                    )}
                    
                    {tempat.description && (
                      <p className="text-sm text-gray-600 mb-3">{tempat.description}</p>
                    )}
                    
                    {tempat.facilities && Array.isArray(tempat.facilities) && tempat.facilities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Fasilitas:</p>
                        <div className="flex flex-wrap gap-2">
                          {tempat.facilities.map((facility, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Info & Actions */}
        <div className="space-y-6">
          {/* Add New Place */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Tambah Tempat Baru
              </CardTitle>
              <CardDescription>
                Tambah hotel, bandara, atau fasilitas baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline" onClick={() => openCreateWithType("Hotel")}>
                  <Hotel className="h-4 w-4 mr-2" />
                  Tambah Hotel
                </Button>
                
                <Button className="w-full" variant="outline" onClick={() => openCreateWithType("Bandara")}>
                  <Plane className="h-4 w-4 mr-2" />
                  Tambah Bandara
                </Button>
                
                <Button className="w-full" variant="outline" onClick={() => openCreateWithType("Pemondokan")}>
                  <Home className="h-4 w-4 mr-2" />
                  Tambah Pemondokan
                </Button>
                
                <Button className="w-full" variant="outline" onClick={() => openCreateWithType("Lainnya")}>
                  <Building className="h-4 w-4 mr-2" />
                  Tambah Fasilitas Lain
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Distribusi Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationStats.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada data lokasi.</p>
                ) : locationStats.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.location}</span>
                      <span className="text-sm font-medium">{item.count} tempat</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada aktivitas.</p>
                ) : recentActivities.map((activity, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Tambah Tempat Baru"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Tempat *
              </label>
              <Input
                placeholder="Contoh: Hotel Hilton Makkah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipe *
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih tipe</option>
                <option value="Hotel">Hotel</option>
                <option value="Bandara">Bandara</option>
                <option value="Pemondokan">Pemondokan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Lokasi *
              </label>
              <Input
                placeholder="Contoh: Makkah"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="5.0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Alamat Lengkap
            </label>
            <Input
              placeholder="Alamat detail"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi
            </label>
            <Textarea
              placeholder="Detail tempat (opsional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
                  Tambah Tempat
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
          setSelectedPlace(null)
          resetForm()
        }}
        title="Edit Tempat"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Tempat *
              </label>
              <Input
                placeholder="Nama tempat"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipe *
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={submitting}
              >
                <option value="">Pilih tipe</option>
                <option value="Hotel">Hotel</option>
                <option value="Bandara">Bandara</option>
                <option value="Pemondokan">Pemondokan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Lokasi *
              </label>
              <Input
                placeholder="Lokasi"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Alamat Lengkap
            </label>
            <Input
              placeholder="Alamat"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi
            </label>
            <Textarea
              placeholder="Detail tempat"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setSelectedPlace(null)
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
                  Update Tempat
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
          setSelectedPlace(null)
        }}
        title="Konfirmasi Hapus"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Apakah Anda yakin ingin menghapus tempat ini?
          </p>
          
          {selectedPlace && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-red-800">{selectedPlace.name}</p>
              <p className="text-sm text-red-600 mt-1">
                Tipe: {selectedPlace.type}
              </p>
              <p className="text-sm text-red-600">
                Lokasi: {selectedPlace.location}
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
                setSelectedPlace(null)
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
                  Hapus Tempat
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
          setSelectedPlace(null)
        }}
        title="Detail Tempat"
        size="lg"
      >
        {selectedPlace && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">{selectedPlace.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipe</p>
                <div className="mt-1">{getTypeBadge(selectedPlace.type)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lokasi</p>
                <p className="font-medium">{selectedPlace.location || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-medium">{selectedPlace.rating || "-"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Alamat</p>
              <p className="font-medium">{selectedPlace.address || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Deskripsi</p>
              <p className="font-medium">{selectedPlace.description || "-"}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false)
                  handleEdit(selectedPlace)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedPlace(null)
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
