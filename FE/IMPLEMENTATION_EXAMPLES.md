# Frontend Implementation Examples

Contoh implementasi untuk mengintegrasikan API ke halaman-halaman frontend.

## 1. Konsultasi.jsx - Form Submission

```jsx
import { useState } from 'react';
import apiClient from '../api/apiClient';

function Konsultasi() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    travelPackage: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.submitConsultation({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        travel_package_id: formData.travelPackage || null,
        preferred_date: formData.date || null
      });
      
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        travelPackage: '',
        date: ''
      });
      
      // Show success message
      alert('Konsultasi berhasil dikirim! Kami akan menghubungi Anda segera.');
    } catch (err) {
      setError(err.message || 'Gagal mengirim konsultasi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Konsultasi berhasil dikirim!</div>}
      
      <input
        type="text"
        name="name"
        placeholder="Nama Lengkap"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <input
        type="tel"
        name="phone"
        placeholder="Nomor Telepon"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <select
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
      >
        <option value="">Pilih Topik</option>
        <option value="Informasi Paket">Informasi Paket</option>
        <option value="Pembayaran">Pembayaran</option>
        <option value="Dokumen">Dokumen</option>
        <option value="Lainnya">Lainnya</option>
      </select>
      
      <textarea
        name="message"
        placeholder="Pesan Anda"
        value={formData.message}
        onChange={handleChange}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim Konsultasi'}
      </button>
    </form>
  );
}

export default Konsultasi;
```

---

## 2. AdminJamaah.jsx - CRUD Operations

```jsx
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

function AdminJamaah() {
  const [jamaahs, setJamaahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJamaah, setEditingJamaah] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    email: '',
    phone: '',
    address: '',
    travel_package_id: '',
    status: 'Menunggu'
  });

  // Fetch all jamaahs
  useEffect(() => {
    fetchJamaahs();
  }, []);

  const fetchJamaahs = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getJamaahs();
      setJamaahs(data);
    } catch (error) {
      console.error('Failed to fetch jamaahs:', error);
      alert('Gagal memuat data jamaah');
    } finally {
      setLoading(false);
    }
  };

  // Create new jamaah
  const handleCreate = async () => {
    try {
      await apiClient.createJamaah(formData);
      alert('Jamaah berhasil ditambahkan');
      setShowModal(false);
      resetForm();
      fetchJamaahs(); // Refresh list
    } catch (error) {
      alert('Gagal menambahkan jamaah: ' + error.message);
    }
  };

  // Update jamaah
  const handleUpdate = async () => {
    try {
      await apiClient.updateJamaah(editingJamaah.id, formData);
      alert('Jamaah berhasil diupdate');
      setShowModal(false);
      setEditingJamaah(null);
      resetForm();
      fetchJamaahs(); // Refresh list
    } catch (error) {
      alert('Gagal mengupdate jamaah: ' + error.message);
    }
  };

  // Delete jamaah
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus jamaah ini?')) return;
    
    try {
      await apiClient.deleteJamaah(id);
      alert('Jamaah berhasil dihapus');
      fetchJamaahs(); // Refresh list
    } catch (error) {
      alert('Gagal menghapus jamaah: ' + error.message);
    }
  };

  // Open edit modal
  const handleEdit = (jamaah) => {
    setEditingJamaah(jamaah);
    setFormData({
      name: jamaah.name,
      nik: jamaah.nik,
      email: jamaah.email,
      phone: jamaah.phone,
      address: jamaah.address,
      travel_package_id: jamaah.travelPackage?.id || '',
      status: jamaah.status
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      nik: '',
      email: '',
      phone: '',
      address: '',
      travel_package_id: '',
      status: 'Menunggu'
    });
  };

  // Export data
  const handleExport = async () => {
    try {
      const blob = await apiClient.exportStatistics('jamaah');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jamaah_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Gagal export data: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
        <h1>Manajemen Jamaah</h1>
        <div>
          <button onClick={() => setShowModal(true)}>+ Tambah Jamaah</button>
          <button onClick={handleExport}>Export Excel</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIK</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Paket</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jamaahs.map(jamaah => (
            <tr key={jamaah.id}>
              <td>{jamaah.name}</td>
              <td>{jamaah.nik}</td>
              <td>{jamaah.email}</td>
              <td>{jamaah.phone}</td>
              <td>{jamaah.travelPackage?.name || '-'}</td>
              <td><span className={`badge ${jamaah.status}`}>{jamaah.status}</span></td>
              <td>
                <button onClick={() => handleEdit(jamaah)}>Edit</button>
                <button onClick={() => handleDelete(jamaah.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingJamaah ? 'Edit Jamaah' : 'Tambah Jamaah'}</h2>
            
            <input
              type="text"
              placeholder="Nama"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <input
              type="text"
              placeholder="NIK"
              value={formData.nik}
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
            />
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <input
              type="tel"
              placeholder="Telepon"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            
            <textarea
              placeholder="Alamat"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Aktif">Aktif</option>
              <option value="Lunas">Lunas</option>
              <option value="Tertunggak">Tertunggak</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
            
            <div className="modal-actions">
              <button onClick={editingJamaah ? handleUpdate : handleCreate}>
                {editingJamaah ? 'Update' : 'Simpan'}
              </button>
              <button onClick={() => {
                setShowModal(false);
                setEditingJamaah(null);
                resetForm();
              }}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminJamaah;
```

---

## 3. AdminTabungan.jsx - Payment Approval

```jsx
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

function AdminTabungan() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPayments({ status: 'Pending' });
      setPendingPayments(data);
    } catch (error) {
      console.error('Failed to fetch pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    if (!confirm('Yakin ingin menyetujui pembayaran ini?')) return;
    
    try {
      await apiClient.approvePayment(paymentId);
      alert('Pembayaran berhasil disetujui!');
      fetchPendingPayments(); // Refresh list
    } catch (error) {
      alert('Gagal menyetujui pembayaran: ' + error.message);
    }
  };

  const handleReject = async (paymentId) => {
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;
    
    try {
      await apiClient.rejectPayment(paymentId, reason);
      alert('Pembayaran berhasil ditolak');
      fetchPendingPayments(); // Refresh list
    } catch (error) {
      alert('Gagal menolak pembayaran: ' + error.message);
    }
  };

  const handleDownloadProof = async (paymentId) => {
    try {
      const blob = await apiClient.downloadPaymentProof(paymentId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      alert('Gagal download bukti pembayaran: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Pembayaran Menunggu Persetujuan</h1>
      
      {pendingPayments.length === 0 ? (
        <p>Tidak ada pembayaran yang menunggu persetujuan</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama Jamaah</th>
              <th>Jumlah</th>
              <th>Tanggal</th>
              <th>Metode</th>
              <th>Bukti</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.jamaah?.name}</td>
                <td>Rp {payment.amount.toLocaleString('id-ID')}</td>
                <td>{new Date(payment.payment_date).toLocaleDateString('id-ID')}</td>
                <td>{payment.payment_method}</td>
                <td>
                  {payment.proof_file && (
                    <button onClick={() => handleDownloadProof(payment.id)}>
                      Lihat Bukti
                    </button>
                  )}
                </td>
                <td>
                  <button 
                    className="btn-approve"
                    onClick={() => handleApprove(payment.id)}
                  >
                    Setujui
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(payment.id)}
                  >
                    Tolak
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminTabungan;
```

---

## 4. DashboardJamaah.jsx - Upload Payment

```jsx
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

function DashboardJamaah() {
  const [jamaahData, setJamaahData] = useState(null);
  const [tabungan, setTabungan] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    amount: '',
    payment_date: '',
    payment_method: 'Transfer BCA',
    file: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apiClient.getJamaahDashboard();
      setJamaahData(data.jamaah);
      setTabungan(data.jamaah?.tabungan);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    }
  };

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      alert('Mohon pilih file bukti pembayaran');
      return;
    }

    const formData = new FormData();
    formData.append('jamaah_id', jamaahData.id);
    formData.append('tabungan_id', tabungan.id);
    formData.append('amount', uploadData.amount);
    formData.append('payment_date', uploadData.payment_date);
    formData.append('payment_method', uploadData.payment_method);
    formData.append('file', uploadData.file);

    try {
      await apiClient.uploadPaymentProof(formData);
      alert('Bukti pembayaran berhasil diupload! Menunggu persetujuan admin.');
      setShowUploadModal(false);
      setUploadData({
        amount: '',
        payment_date: '',
        payment_method: 'Transfer BCA',
        file: null
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      alert('Gagal upload bukti pembayaran: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file harus JPG, PNG, atau PDF');
        e.target.value = '';
        return;
      }
      
      setUploadData({...uploadData, file});
    }
  };

  if (!jamaahData) return <div>Loading...</div>;

  return (
    <div>
      {/* Tabungan Section */}
      <div className="card">
        <h2>Tabungan Umroh</h2>
        {tabungan ? (
          <>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${tabungan.progress}%`}}
              />
            </div>
            <p>Terkumpul: Rp {tabungan.current_amount.toLocaleString('id-ID')}</p>
            <p>Target: Rp {tabungan.target_amount.toLocaleString('id-ID')}</p>
            <p>Progress: {tabungan.progress}%</p>
            
            <button onClick={() => setShowUploadModal(true)}>
              Upload Bukti Pembayaran
            </button>
          </>
        ) : (
          <p>Belum ada tabungan aktif</p>
        )}
      </div>

      {/* Upload Payment Modal */}
      {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Upload Bukti Pembayaran</h2>
            <form onSubmit={handleUploadPayment}>
              <input
                type="number"
                placeholder="Jumlah Pembayaran"
                value={uploadData.amount}
                onChange={(e) => setUploadData({...uploadData, amount: e.target.value})}
                required
              />
              
              <input
                type="date"
                value={uploadData.payment_date}
                onChange={(e) => setUploadData({...uploadData, payment_date: e.target.value})}
                required
              />
              
              <select
                value={uploadData.payment_method}
                onChange={(e) => setUploadData({...uploadData, payment_method: e.target.value})}
                required
              >
                <option value="Transfer BCA">Transfer BCA</option>
                <option value="Transfer BRI">Transfer BRI</option>
                <option value="Transfer Mandiri">Transfer Mandiri</option>
                <option value="Transfer BNI">Transfer BNI</option>
                <option value="Cash">Cash</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
              
              <div className="file-input">
                <label>Upload Bukti Transfer (Max 5MB)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  required
                />
                {uploadData.file && (
                  <p>File: {uploadData.file.name}</p>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="submit">Upload</button>
                <button type="button" onClick={() => setShowUploadModal(false)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardJamaah;
```

---

## 5. AdminDashboard.jsx - Statistics

```jsx
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { Line, Doughnut } from 'react-chartjs-2';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [dashData, revenue] = await Promise.all([
        apiClient.getAdminDashboard(),
        apiClient.getRevenueStatistics()
      ]);
      
      setStats(dashData.stats);
      setRevenueData(revenue);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Prepare chart data
  const lineChartData = {
    labels: revenueData?.monthly_revenue.map(item => item.month_short) || [],
    datasets: [{
      label: 'Revenue',
      data: revenueData?.monthly_revenue.map(item => item.revenue) || [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const doughnutData = {
    labels: stats ? ['Aktif', 'Menunggu', 'Lunas', 'Non-Aktif'] : [],
    datasets: [{
      data: stats ? [
        stats.total_jamaah - stats.active_jamaah,
        stats.active_jamaah,
        0, // You might want to fetch this
        0  // You might want to fetch this
      ] : [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ]
    }]
  };

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jamaah</h3>
          <p className="stat-number">{stats?.total_jamaah}</p>
        </div>
        <div className="stat-card">
          <h3>Jamaah Aktif</h3>
          <p className="stat-number">{stats?.active_jamaah}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">
            Rp {(stats?.total_revenue || 0).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="stat-card">
          <h3>Pembayaran Pending</h3>
          <p className="stat-number">{stats?.pending_payments}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenue per Bulan</h3>
          <Line data={lineChartData} />
        </div>
        
        <div className="chart-card">
          <h3>Distribusi Jamaah</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
```

---

## 6. Authentication - Login & Register

```jsx
// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await apiClient.login(email, password);
      
      // Store token
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('jamaah', JSON.stringify(response.jamaah));
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <div className="alert error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Login</button>
        
        <p>Belum punya akun? <a href="/register">Daftar</a></p>
      </form>
    </div>
  );
}

export default Login;
```

---

## Important Notes

1. **Error Handling**: Semua contoh di atas sudah include error handling. Pastikan untuk menampilkan error message yang user-friendly.

2. **Loading States**: Gunakan loading state untuk memberikan feedback ke user saat proses API call.

3. **File Upload Validation**: Validasi ukuran file (max 5MB) dan tipe file (jpg, png, pdf) sebelum upload.

4. **Token Management**: Store auth token di localStorage dan include di setiap authenticated request.

5. **Refresh Data**: Setelah CRUD operation (create, update, delete), refresh list data untuk menampilkan perubahan terbaru.

6. **Confirmation**: Gunakan confirm dialog untuk aksi yang destructive (delete, reject, dll).

7. **Success Feedback**: Berikan feedback ke user setelah operasi berhasil (alert, toast, atau notification).

8. **Form Reset**: Reset form setelah berhasil submit.

9. **Responsive**: Pastikan UI responsive untuk mobile dan desktop.

10. **Security**: Jangan expose sensitive data di client side. Validasi juga dilakukan di backend.
