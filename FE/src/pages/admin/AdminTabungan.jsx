import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Modal from "@/components/ui/Modal"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  User,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Loader2,
  FileText
} from "lucide-react"
import { useState, useEffect } from "react"
import apiClient from "@/api/apiClient"
import API_CONFIG from "@/config/api"
import { useToast } from "@/hooks/use-toast"

export const AdminTabungan = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("semua")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Data state
  const [tabunganData, setTabunganData] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  
  // Modal state
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedTabungan, setSelectedTabungan] = useState(null)
  const [rejectReason, setRejectReason] = useState("")

  
  // Fetch all data
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch tabungan data
      const tabunganRes = await apiClient.getTabungans()
      setTabunganData(tabunganRes)
      
      // Fetch pending payments
      const paymentsRes = await apiClient.getPayments({ status: 'Pending' })
      setPendingPayments(paymentsRes)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data tabungan",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Handle approve payment
  const handleApprovePayment = async () => {
    if (!selectedPayment) return
    
    setSubmitting(true)
    try {
      await apiClient.approvePayment(selectedPayment.id)
      
      toast({
        title: "Berhasil!",
        description: "Pembayaran telah disetujui",
        variant: "success"
      })
      
      setShowApproveModal(false)
      setSelectedPayment(null)
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error approving payment:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyetujui pembayaran",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle reject payment
  const handleRejectPayment = async () => {
    if (!selectedPayment || !rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Mohon isi alasan penolakan",
        variant: "destructive"
      })
      return
    }
    
    setSubmitting(true)
    try {
      await apiClient.rejectPayment(selectedPayment.id, rejectReason)
      
      toast({
        title: "Berhasil!",
        description: "Pembayaran telah ditolak",
        variant: "success"
      })
      
      setShowRejectModal(false)
      setSelectedPayment(null)
      setRejectReason("")
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error rejecting payment:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menolak pembayaran",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  // Handle view receipt
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment)
    setShowReceiptModal(true)
  }
  
  // Handle download receipt
  const handleDownloadReceipt = async (paymentId) => {
    try {
      await apiClient.downloadPaymentProof(paymentId)
      toast({
        title: "Berhasil!",
        description: "Bukti pembayaran sedang diunduh",
        variant: "success"
      })
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast({
        title: "Error",
        description: "Gagal mengunduh bukti pembayaran",
        variant: "destructive"
      })
    }
  }
  
  // Handle export
  const handleExport = async () => {
    try {
      await apiClient.exportStatistics('tabungan')
      toast({
        title: "Berhasil!",
        description: "Laporan sedang diunduh",
        variant: "success"
      })
    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Gagal mengunduh laporan",
        variant: "destructive"
      })
    }
  }
  

  // Filter data
const filteredTabungan = tabunganData.filter((item) => {
  const name = item.jamaah?.name?.toLowerCase() || ""
  const nik = item.jamaah?.nik || ""

  const matchesSearch =
    name.includes(searchTerm.toLowerCase()) ||
    nik.includes(searchTerm)

  if (statusFilter === "semua") return matchesSearch

  const status = item.status?.toLowerCase()

  if (statusFilter === "berjalan") {
    return matchesSearch && (status === "active" || status === "berjalan")
  }

  if (statusFilter === "lunas") {
    return matchesSearch && (status === "completed" || status === "lunas")
  }

  if (statusFilter === "tertunggak") {
    return matchesSearch && (status === "overdue" || status === "tertunggak")
  }

  return matchesSearch
})

  // Status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "Active": 
      case "Berjalan": 
        return <Badge className="bg-blue-100 text-blue-800">Berjalan</Badge>
      case "Completed":
      case "Lunas": 
        return <Badge className="bg-green-100 text-green-800">Lunas</Badge>
      case "Overdue":
      case "Tertunggak": 
        return <Badge className="bg-red-100 text-red-800">Tertunggak</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  // Progress bar component
  const ProgressBar = ({ progress }) => (
    <div className="flex items-center gap-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium whitespace-nowrap">{progress}%</span>
    </div>
  )

  const statusDistribution = (() => {
    const total = tabunganData.length
    const berjalan = tabunganData.filter((t) => ["Active", "Berjalan"].includes(t.status)).length
    const lunas = tabunganData.filter((t) => ["Completed", "Lunas"].includes(t.status)).length
    const tertunggak = tabunganData.filter((t) => ["Overdue", "Tertunggak"].includes(t.status)).length

    const toPercent = (value) => (total > 0 ? Math.round((value / total) * 100) : 0)

    return {
      total,
      berjalan,
      lunas,
      tertunggak,
      berjalanPercent: toPercent(berjalan),
      lunasPercent: toPercent(lunas),
      tertunggakPercent: toPercent(tertunggak),
    }
  })()

  const stats = (() => {
    const totalTabungan = tabunganData.reduce((sum, t) => sum + Number(t.saldo || 0), 0)
    const jamaahBerjalan = tabunganData.filter((t) => ["Active", "Berjalan"].includes(t.status)).length
    const averageProgress = tabunganData.length > 0
      ? Math.round(tabunganData.reduce((sum, t) => sum + Number(t.progress || 0), 0) / tabunganData.length)
      : 0

    return {
      totalTabungan,
      jamaahBerjalan,
      pendingCount: pendingPayments.length,
      averageProgress,
    }
  })()

  const getReceiptPath = (payment) => {
    return payment?.file_path || payment?.filePath || payment?.proofFile || payment?.receiptPath || ""
  }

  const getReceiptPreviewUrl = (payment) => {
    const rawPath = getReceiptPath(payment)
    if (!rawPath) return ""
    if (/^https?:\/\//i.test(rawPath)) return rawPath

    const appBaseUrl = String(API_CONFIG.BASE_URL || "").replace(/\/api\/?$/, "")
    const normalizedPath = String(rawPath).replace(/^\/+/, "")

    if (normalizedPath.startsWith("storage/")) {
      return `${appBaseUrl}/${normalizedPath}`
    }

    return `${appBaseUrl}/storage/${normalizedPath}`
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-12 px-4">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manajemen Tabungan
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kelola tabungan umroh semua jamaah
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tabungan</p>
                  <p className="text-2xl font-bold mt-2">
                    Rp {(stats.totalTabungan / 1000000).toFixed(1)}Jt
                  </p>
                  <p className="text-sm text-green-600 mt-1">Total dari semua jamaah</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jamaah Berjalan</p>
                  <p className="text-2xl font-bold mt-2">{stats.jamaahBerjalan}</p>
                  <p className="text-sm text-gray-600 mt-1">Dari {tabunganData.length} total</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pembayaran Pending</p>
                  <p className="text-2xl font-bold mt-2">{stats.pendingCount}</p>
                  <p className="text-sm text-yellow-600 mt-1">Perlu verifikasi</p>
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
                  <p className="text-sm font-medium text-gray-600">Rata-rata Progress</p>
                  <p className="text-2xl font-bold mt-2">{stats.averageProgress}%</p>
                  <p className="text-sm text-gray-600 mt-1">Dari target</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabungan List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Data Tabungan Jamaah</CardTitle>
                    <CardDescription>
                      Daftar lengkap tabungan umroh
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

                {/* Status Filter */}
             <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <Button
              variant={statusFilter === "semua" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("semua")}
            >
              Semua
            </Button>
            <Button
              variant={statusFilter === "berjalan" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("berjalan")}
            >
              Berjalan
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
          </div>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-gray-600">Memuat data...</p>
                  </div>
                ) : filteredTabungan.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Tidak ada data tabungan</p>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Jamaah</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Saldo</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTabungan.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.jamaah?.name || '-'}</p>
                              <p className="text-sm text-gray-600">{item.jamaah?.nik || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">Rp{(item.target || 0).toLocaleString("id-ID")}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-primary">Rp{(item.saldo || 0).toLocaleString("id-ID")}</p>
                          </TableCell>
                          <TableCell>
                            <ProgressBar progress={item.progress || 0} />
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(item.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Lihat Detail"
                                onClick={() => {
                                  setSelectedTabungan(item)
                                  setShowDetailModal(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
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
          </div>

          {/* Sidebar - Pending Actions */}
          <div className="space-y-6">
            {/* Pending Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Pembayaran Pending
                </CardTitle>
                <CardDescription>
                  Verifikasi pembayaran yang masuk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </div>
                  ) : pendingPayments.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Tidak ada pembayaran pending</p>
                    </div>
                  ) : (
                    pendingPayments.map((payment) => (
                    <div key={payment.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{payment.jamaah?.name || '-'}</p>
                          <p className="text-sm text-gray-600">{payment.payment_method || payment.paymentMethod || '-'}</p>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          Rp{(payment.amount || 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>Tanggal: {payment.payment_date || payment.paymentDate || payment.date || '-'}</span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0"
                          onClick={() => handleViewReceipt(payment)}
                        >
                          Lihat Bukti
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowApproveModal(true)
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Terima
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowRejectModal(true)
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Tabungan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Distribusi Status</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Berjalan</span>
                        <span className="text-sm font-medium">{statusDistribution.berjalan} jamaah</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${statusDistribution.berjalanPercent}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Lunas</span>
                        <span className="text-sm font-medium">{statusDistribution.lunas} jamaah</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${statusDistribution.lunasPercent}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Tertunggak</span>
                        <span className="text-sm font-medium">{statusDistribution.tertunggak} jamaah</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${statusDistribution.tertunggakPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Approve Payment Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false)
          setSelectedPayment(null)
        }}
        title="Konfirmasi Persetujuan"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Apakah Anda yakin ingin menyetujui pembayaran ini?
          </p>
          
          {selectedPayment && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nama:</span>
                <span className="text-sm font-medium">{selectedPayment.jamaah?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jumlah:</span>
                <span className="text-sm font-medium text-primary">
                  Rp{(selectedPayment.amount || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Metode:</span>
                  <span className="text-sm font-medium">{selectedPayment.payment_method || selectedPayment.paymentMethod || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tanggal:</span>
                  <span className="text-sm font-medium">{selectedPayment.payment_date || selectedPayment.paymentDate || selectedPayment.date || '-'}</span>
                </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveModal(false)
                setSelectedPayment(null)
              }}
              disabled={submitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleApprovePayment}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setujui
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Reject Payment Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setSelectedPayment(null)
          setRejectReason("")
        }}
        title="Tolak Pembayaran"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Silakan berikan alasan penolakan pembayaran ini:
          </p>
          
          {selectedPayment && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nama:</span>
                <span className="text-sm font-medium">{selectedPayment.jamaah?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jumlah:</span>
                <span className="text-sm font-medium">
                  Rp{(selectedPayment.amount || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Masukkan alasan penolakan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false)
                setSelectedPayment(null)
                setRejectReason("")
              }}
              disabled={submitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectPayment}
              disabled={submitting || !rejectReason.trim()}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false)
          setSelectedPayment(null)
        }}
        title="Bukti Pembayaran"
        size="lg"
      >
        <div className="space-y-4">
          {selectedPayment && (
            <>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nama Jamaah:</span>
                  <span className="text-sm font-medium">{selectedPayment.jamaah?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jumlah:</span>
                  <span className="text-sm font-medium text-primary">
                    Rp{(selectedPayment.amount || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Metode:</span>
                  <span className="text-sm font-medium">{selectedPayment.payment_method || selectedPayment.paymentMethod || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tanggal:</span>
                  <span className="text-sm font-medium">{selectedPayment.payment_date || selectedPayment.paymentDate || selectedPayment.date || '-'}</span>
                </div>
                {selectedPayment.description && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-600">Keterangan:</span>
                    <p className="text-sm mt-1">{selectedPayment.description}</p>
                  </div>
                )}
              </div>
              
              {(selectedPayment.file_path || selectedPayment.filePath || selectedPayment.proofFile || selectedPayment.receiptPath) ? (
                <div className="border rounded-lg p-4">
                  {(() => {
                    const receiptPath = getReceiptPath(selectedPayment)
                    const receiptUrl = getReceiptPreviewUrl(selectedPayment)
                    const ext = receiptPath.split('.').pop()?.toLowerCase() || ""
                    const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
                    const isPdf = ext === "pdf"

                    if (isImage) {
                      return (
                        <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                          <img
                            src={receiptUrl}
                            alt="Bukti Pembayaran"
                            className="max-h-105 w-auto object-contain rounded"
                          />
                        </div>
                      )
                    }

                    if (isPdf) {
                      return (
                        <div className="bg-gray-100 rounded-lg p-2">
                          <iframe
                            src={receiptUrl}
                            title="Preview Bukti Pembayaran"
                            className="w-full h-105 rounded border bg-white"
                          />
                        </div>
                      )
                    }

                    return (
                      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-3">
                            File: {receiptPath.split('/').pop()}
                          </p>
                          <Button variant="outline" onClick={() => window.open(receiptUrl, '_blank')}>
                            Lihat File
                          </Button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Tidak ada file bukti pembayaran</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReceiptModal(false)
                    setSelectedPayment(null)
                    setShowRejectModal(true)
                  }}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak
                </Button>
                <Button
                  onClick={() => {
                    setShowReceiptModal(false)
                    setShowApproveModal(true)
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setujui
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Detail Tabungan Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedTabungan(null)
        }}
        title="Detail Tabungan Jamaah"
        size="lg"
      >
        {selectedTabungan && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nama Jamaah</p>
                <p className="font-medium">{selectedTabungan.jamaah?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIK</p>
                <p className="font-medium">{selectedTabungan.jamaah?.nik || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Tabungan</p>
                <p className="font-medium">Rp{(selectedTabungan.target || 0).toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Saldo Saat Ini</p>
                <p className="font-medium text-primary">Rp{(selectedTabungan.saldo || 0).toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium">{selectedTabungan.progress || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-1">{getStatusBadge(selectedTabungan.status)}</div>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar progress={selectedTabungan.progress || 0} />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedTabungan(null)
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
