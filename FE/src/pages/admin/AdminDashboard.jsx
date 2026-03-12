import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Wallet, 
  Plane, 
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  AlertCircle,
  BarChart3,
  Clock,
  Download,
  MoreVertical,
  Loader2,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useState, useEffect } from "react"
import apiClient from "@/api/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export const AdminDashboard = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalJamaah: 0,
    jamaahAktif: 0,
    totalTabungan: 0,
    totalPackages: 0,
  })
  const [revenueData, setRevenueData] = useState([])
  const [packageData, setPackageData] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [pendingDocuments, setPendingDocuments] = useState([])
  const [detailModal, setDetailModal] = useState({
    open: false,
    type: null,
    data: null,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardRes, paymentsRes, documentsRes, revenueRes] = await Promise.all([
        apiClient.getAdminDashboard().catch(() => null),
        apiClient.getPayments({ status: 'Pending' }).catch(() => []),
        apiClient.getDocuments().catch(() => []),
        apiClient.getRevenueStatistics().catch(() => null),
      ])

      const dashboardPayload = dashboardRes?.data || dashboardRes || {}
      const statsPayload = dashboardPayload?.stats || dashboardPayload || {}
      const revenuePayload = revenueRes?.data || revenueRes || {}

      if (dashboardPayload) {
        const d = dashboardPayload
        setDashboardData({
          totalJamaah: Number(statsPayload.total_jamaah || statsPayload.total_jamaahs || 0),
          jamaahAktif: Number(statsPayload.jamaah_aktif || statsPayload.active_jamaah || 0),
          totalTabungan: Number(statsPayload.total_tabungan || statsPayload.total_revenue || 0),
          totalPackages: Number(statsPayload.total_packages || statsPayload.active_packages || 0),
        })

        const packageSource = Array.isArray(d.packages)
          ? d.packages
          : Array.isArray(d.package_stats)
            ? d.package_stats
            : []

        setPackageData(packageSource.map((p) => {
          const rawName = p.name || p.package || '-'
          return {
            name: rawName?.length > 15 ? `${rawName.substring(0, 15)}...` : rawName,
            pendaftar: Number(p.booked || p.total || 0),
            kuota: Number(p.quota || 0),
          }
        }))
      }

      const monthlyRevenue = Array.isArray(revenuePayload?.monthly)
        ? revenuePayload.monthly
        : Array.isArray(revenuePayload?.monthly_revenue)
          ? revenuePayload.monthly_revenue
          : []

      setRevenueData(monthlyRevenue.map((m) => ({
        month: m.month_short || m.month,
        tabungan: Math.round((m.total || m.revenue || 0) / 1000000),
        pembayaran: Math.round((m.payments || m.revenue || 0) / 1000000),
      })))

      const pendingPaymentSource = Array.isArray(paymentsRes)
        ? paymentsRes
        : Array.isArray(dashboardPayload?.pending_payments)
          ? dashboardPayload.pending_payments
          : []
      setPendingPayments(pendingPaymentSource.slice(0, 3))

      const pendingDocs = Array.isArray(documentsRes)
        ? documentsRes.filter((d) => {
            const status = (d.status || "").toLowerCase()
            return ["dalam review", "pending", "menunggu verifikasi"].includes(status)
          }).slice(0, 3)
        : []
      setPendingDocuments(pendingDocs)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) +'M'
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'jt'
    if (amount >= 1000) return (amount / 1000).toFixed(0) + 'rb'
    return String(amount)
  }

  const handleApprovePayment = async (paymentId) => {
    try {
      await apiClient.approvePayment(paymentId)
      toast({ title: "Berhasil!", description: "Pembayaran disetujui", variant: "success" })
      fetchDashboardData()
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleVerifyDocument = async (documentId) => {
    try {
      await apiClient.verifyDocument(documentId)
      toast({ title: "Berhasil!", description: "Dokumen diverifikasi", variant: "success" })
      fetchDashboardData()
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleExportReport = async () => {
    try {
      await apiClient.exportStatistics('jamaah')
      toast({ title: "Berhasil!", description: "Laporan sedang diunduh", variant: "success" })
    } catch (error) {
      toast({ title: "Error", description: "Gagal mengunduh laporan", variant: "destructive" })
    }
  }

  const openPaymentDetail = (payment) => {
    setDetailModal({ open: true, type: "payment", data: payment })
  }

  const openDocumentDetail = (doc) => {
    setDetailModal({ open: true, type: "document", data: doc })
  }

  const closeDetailModal = (open) => {
    if (!open) {
      setDetailModal({ open: false, type: null, data: null })
    }
  }

  const stats = [
    {
      title: "Total Jamaah",
      value: String(dashboardData.totalJamaah),
      icon: Users,
      change: `${dashboardData.jamaahAktif} aktif`,
      color: "bg-blue-500",
    },
    {
      title: "Total Tabungan",
      value: `Rp ${formatCurrency(dashboardData.totalTabungan)}`,
      icon: Wallet,
      change: "",
      color: "bg-green-500",
    },
    {
      title: "Paket Aktif",
      value: String(dashboardData.totalPackages),
      icon: Plane,
      change: "",
      color: "bg-purple-500",
    },
    {
      title: "Pending Pembayaran",
      value: String(pendingPayments.length),
      icon: Calendar,
      change: "Menunggu verifikasi",
      color: "bg-orange-500",
    },
  ]

  return (
    <>
    <div className="min-h-screen bg-gray-50 mt-12 px-4">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Selamat datang kembali.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Memuat data dashboard...</span>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold mt-2">{stat.value}</p>
                          {stat.change && <p className="text-sm text-green-600 mt-1">{stat.change}</p>}
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Pendapatan</CardTitle>
                  <CardDescription>Trend tabungan bulanan (juta Rp)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    {revenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip formatter={(value) => [`Rp ${value} juta`, '']} />
                          <Line type="monotone" dataKey="tabungan" stroke="#3b82f6" strokeWidth={2} name="Tabungan" />
                          <Line type="monotone" dataKey="pembayaran" stroke="#10b981" strokeWidth={2} name="Pembayaran" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">Belum ada data</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pendaftaran per Paket</CardTitle>
                  <CardDescription>Distribusi jamaah berdasarkan paket travel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    {packageData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={packageData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" angle={-20} textAnchor="end" height={50} />
                          <YAxis stroke="#6b7280" />
                          <Tooltip />
                          <Bar dataKey="pendaftar" fill="#3b82f6" name="Pendaftar" />
                          <Bar dataKey="kuota" fill="#d1d5db" name="Kuota" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">Belum ada data</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Pembayaran Pending
                    <Badge className="bg-yellow-100 text-yellow-800 ml-auto">{pendingPayments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingPayments.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Tidak ada pembayaran pending</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                          <div>
                            <p className="font-medium text-sm">{payment.jamaah?.name || payment.title}</p>
                            <p className="text-xs text-gray-600">Rp {Number(payment.amount).toLocaleString('id')}</p>
                            <p className="text-xs text-gray-500">{payment.paymentDate || payment.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprovePayment(payment.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Setuju
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openPaymentDetail(payment)}>
                              <Eye className="h-3 w-3 mr-1" />
                              Lihat
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/admin/tabungan')}>
                        Lihat Semua Pembayaran
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-500" />
                    Dokumen Perlu Verifikasi
                    <Badge className="bg-blue-100 text-blue-800 ml-auto">{pendingDocuments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingDocuments.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Tidak ada dokumen pending</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div>
                            <p className="font-medium text-sm">{doc.jamaah?.name || '-'}</p>
                            <p className="text-xs text-gray-600">{doc.document_type || doc.type}</p>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleVerifyDocument(doc.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verifikasi
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openDocumentDetail(doc)}>
                            <Eye className="h-3 w-3 mr-1" />
                            Lihat
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/admin/jamaah')}>
                        Lihat Semua Jamaah
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>

    <Dialog open={detailModal.open} onOpenChange={closeDetailModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {detailModal.type === "payment" ? "Detail Pembayaran" : "Detail Dokumen"}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap dari item yang dipilih.
          </DialogDescription>
        </DialogHeader>

        {detailModal.type === "payment" && detailModal.data && (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Nama Jamaah:</span> {detailModal.data.jamaah?.name || detailModal.data.title || "-"}</p>
            <p><span className="font-medium">Nominal:</span> Rp {Number(detailModal.data.amount || 0).toLocaleString("id")}</p>
            <p><span className="font-medium">Tanggal:</span> {detailModal.data.paymentDate || detailModal.data.date || "-"}</p>
            <p><span className="font-medium">Status:</span> {detailModal.data.status || "Pending"}</p>
          </div>
        )}

        {detailModal.type === "document" && detailModal.data && (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Nama Jamaah:</span> {detailModal.data.jamaah?.name || "-"}</p>
            <p><span className="font-medium">Jenis Dokumen:</span> {detailModal.data.document_type || detailModal.data.type || "-"}</p>
            <p><span className="font-medium">Status:</span> {detailModal.data.status || "-"}</p>
            <p><span className="font-medium">Tanggal Upload:</span> {detailModal.data.created_at || detailModal.data.date || "-"}</p>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-2">
          {detailModal.type === "payment" && detailModal.data?.id && (
            <Button variant="outline" onClick={() => navigate('/admin/tabungan')}>
              Buka Halaman Pembayaran
            </Button>
          )}
          {detailModal.type === "document" && detailModal.data?.id && (
            <Button variant="outline" onClick={() => navigate('/admin/jamaah')}>
              Buka Halaman Jamaah
            </Button>
          )}
          <Button onClick={() => closeDetailModal(false)}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
