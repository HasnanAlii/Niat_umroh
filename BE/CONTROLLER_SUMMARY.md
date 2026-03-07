# Controller Summary - Niat Umroh Backend

## Daftar Controller yang Telah Dibuat

### 1. AuthController.php ✅
**Path:** `app/Http/Controllers/Api/AuthController.php`

**Fungsi:**
- `register()` - Registrasi user baru + create jamaah profile
- `login()` - Login user
- `logout()` - Logout dan hapus token
- `profile()` - Get profil user yang login
- `updateProfile()` - Update profil user + jamaah

**Digunakan untuk:**
- Form registrasi di FE
- Form login di FE
- Profile page
- Update profile settings

**Routes:**
```php
POST   /api/register
POST   /api/login
POST   /api/logout         (auth required)
GET    /api/profile        (auth required)
PUT    /api/profile        (auth required)
```

---

### 2. DashboardController.php ✅
**Path:** `app/Http/Controllers/Api/DashboardController.php`

**Fungsi:**
- `adminStats()` - Dashboard statistik untuk admin (total jamaah, revenue, chart data, activities)
- `jamaahDashboard()` - Dashboard untuk jamaah (progress, schedule, pending documents, stats)

**Digunakan untuk:**
- AdminDashboard.jsx - Menampilkan stats, chart revenue, package distribution, recent activities
- DashboardJamaah.jsx - Progress tracking, upcoming schedule, alerts

**Routes:**
```php
GET    /api/dashboard/admin    (auth required)
GET    /api/dashboard/jamaah   (auth required)
```

---

### 3. BookingController.php ✅
**Path:** `app/Http/Controllers/Api/BookingController.php`

**Fungsi:**
- `bookPackage()` - Booking paket umroh untuk jamaah, otomatis create tabungan
- `cancelBooking()` - Cancel booking (hanya jika progress < 50%)
- `changePackage()` - Ganti paket umroh
- `availablePackages()` - Get paket yang masih ada kursi tersedia

**Digunakan untuk:**
- DashboardJamaah.jsx - Fitur pilih paket umroh
- AdminJamaah.jsx - Manage booking jamaah
- Home.jsx - Tampilkan paket available untuk booking

**Routes:**
```php
POST   /api/bookings                    (auth required)
POST   /api/bookings/{id}/cancel        (auth required)
PUT    /api/bookings/{id}/change        (auth required)
GET    /api/packages/available          (public)
```

---

### 4. UploadController.php ✅
**Path:** `app/Http/Controllers/Api/UploadController.php`

**Fungsi:**
- `uploadDocument()` - Upload file dokumen (Paspor, KTP, dll)
- `uploadPaymentProof()` - Upload bukti pembayaran, create payment record dengan status Pending
- `approvePayment()` - Approve pembayaran, update tabungan current_amount & progress
- `rejectPayment()` - Reject pembayaran dengan alasan
- `verifyDocument()` - Verify dokumen sebagai lengkap
- `rejectDocument()` - Reject dokumen dengan alasan
- `downloadDocument()` - Download file dokumen
- `downloadPaymentProof()` - Download file bukti bayar

**Digunakan untuk:**
- DashboardJamaah.jsx - Upload dokumen, upload bukti bayar
- AdminTabungan.jsx - Approve/reject pembayaran dari jamaah
- AdminJamaah.jsx - Verify/reject dokumen jamaah

**Routes:**
```php
POST   /api/uploads/document                (auth required)
POST   /api/uploads/payment                 (auth required)
POST   /api/payments/{id}/approve           (auth required)
POST   /api/payments/{id}/reject            (auth required)
POST   /api/documents/{id}/verify           (auth required)
POST   /api/documents/{id}/reject           (auth required)
GET    /api/documents/{id}/download         (auth required)
GET    /api/payments/{id}/download          (auth required)
```

---

### 5. StatisticsController.php ✅
**Path:** `app/Http/Controllers/Api/StatisticsController.php`

**Fungsi:**
- `summary()` - Statistik summary (total jamaah, packages, revenue, documents, consultations)
- `revenue()` - Statistik revenue lengkap dengan monthly chart, by method, top jamaah
- `packages()` - Statistik package booking, utilization, revenue per package
- `tabungan()` - Statistik tabungan (status distribution, avg progress, collection rate)
- `documents()` - Statistik dokumen (completion rate by type, by status)
- `export()` - Export data ke CSV (jamaah atau payments)

**Digunakan untuk:**
- AdminDashboard.jsx - Display chart dan statistik
- Report generation
- Analytics page

**Routes:**
```php
GET    /api/statistics/summary     (auth required)
GET    /api/statistics/revenue     (auth required)
GET    /api/statistics/packages    (auth required)
GET    /api/statistics/tabungan    (auth required)
GET    /api/statistics/documents   (auth required)
GET    /api/statistics/export      (auth required)
```

---

### 6. ConsultationController.php ✅ (Updated)
**Path:** `app/Http/Controllers/Api/ConsultationController.php`

**Fungsi:**
- `index()` - List consultations dengan filter (jamaah_id, status)
- `show()` - Detail consultation
- `store()` - Submit consultation form (support form tanpa login dengan name, phone, email)
- `update()` - Update consultation
- `respond()` - Admin respond ke consultation
- `close()` - Close consultation
- `destroy()` - Delete consultation

**Digunakan untuk:**
- Konsultasi.jsx - Form submission konsultasi
- AdminDashboard.jsx - List pending consultations untuk admin

**Routes:**
```php
GET    /api/consultations                         (public)
POST   /api/consultations                         (public)
GET    /api/consultations/{id}                    (public)
PUT    /api/consultations/{id}                    (auth required)
DELETE /api/consultations/{id}                    (auth required)
POST   /api/consultations/{id}/respond            (auth required)
POST   /api/consultations/{id}/close              (auth required)
```

---

### 7. TravelPackageController.php ✅
**Path:** `app/Http/Controllers/Api/TravelPackageController.php`

**Fungsi:** Full CRUD untuk travel packages

**Digunakan untuk:**
- AdminTravel.jsx - Manage paket umroh
- Home.jsx - Display paket
- DashboardJamaah.jsx - Pilih paket

**Routes:**
```php
GET    /api/packages          (public)
POST   /api/packages          (auth required)
GET    /api/packages/{id}     (public)
PUT    /api/packages/{id}     (auth required)
DELETE /api/packages/{id}     (auth required)
```

---

### 8. AccommodationController.php ✅
**Path:** `app/Http/Controllers/Api/AccommodationController.php`

**Fungsi:** Full CRUD untuk accommodations (hotel, penginapan)

**Digunakan untuk:**
- AdminTempat.jsx - Manage hotel/penginapan

**Routes:**
```php
GET    /api/accommodations          (public)
POST   /api/accommodations          (auth required)
GET    /api/accommodations/{id}     (public)
PUT    /api/accommodations/{id}     (auth required)
DELETE /api/accommodations/{id}     (auth required)
```

---

### 9. JamaahController.php ✅
**Path:** `app/Http/Controllers/Api/JamaahController.php`

**Fungsi:** Full CRUD untuk jamaah dengan relationships

**Digunakan untuk:**
- AdminJamaah.jsx - Manage jamaah (list, create, edit, delete)
- DashboardJamaah.jsx - Display jamaah data

**Routes:**
```php
GET    /api/jamaahs          (public)
POST   /api/jamaahs          (auth required)
GET    /api/jamaahs/{id}     (public)
PUT    /api/jamaahs/{id}     (auth required)
DELETE /api/jamaahs/{id}     (auth required)
```

---

### 10. TabunganController.php ✅
**Path:** `app/Http/Controllers/Api/TabunganController.php`

**Fungsi:** Full CRUD untuk tabungan dengan filter by jamaah_id

**Digunakan untuk:**
- AdminTabungan.jsx - Manage tabungan
- DashboardJamaah.jsx - Display progress tabungan

**Routes:**
```php
GET    /api/tabungans?jamaah_id=1   (public)
POST   /api/tabungans               (auth required)
GET    /api/tabungans/{id}          (public)
PUT    /api/tabungans/{id}          (auth required)
DELETE /api/tabungans/{id}          (auth required)
```

---

### 11. DocumentController.php ✅
**Path:** `app/Http/Controllers/Api/DocumentController.php`

**Fungsi:** Full CRUD untuk documents

**Digunakan untuk:**
- DashboardJamaah.jsx - Display status dokumen
- AdminJamaah.jsx - Manage dokumen jamaah

**Routes:**
```php
GET    /api/documents?jamaah_id=1   (public)
POST   /api/documents               (auth required)
GET    /api/documents/{id}          (public)
PUT    /api/documents/{id}          (auth required)
DELETE /api/documents/{id}          (auth required)
```

---

### 12. PaymentController.php ✅
**Path:** `app/Http/Controllers/Api/PaymentController.php`

**Fungsi:** Full CRUD untuk payments dengan filter

**Digunakan untuk:**
- DashboardJamaah.jsx - Display payment history
- AdminTabungan.jsx - List pending payments

**Routes:**
```php
GET    /api/payments?jamaah_id=1&status=Pending   (public)
POST   /api/payments                               (auth required)
GET    /api/payments/{id}                          (public)
PUT    /api/payments/{id}                          (auth required)
DELETE /api/payments/{id}                          (auth required)
```

---

## Workflow Utama

### 1. Registration & Login Flow
```
User Register (AuthController::register)
→ Create User + Jamaah
→ Return token
→ Store token di FE
→ Use token untuk authenticated requests
```

### 2. Booking Flow
```
Jamaah pilih paket (BookingController::bookPackage)
→ Update jamaah.travel_package_id
→ Create/Update tabungan
→ Increment package.booked
→ Jamaah status = "Aktif"
```

### 3. Payment Flow
```
Jamaah upload bukti bayar (UploadController::uploadPaymentProof)
→ Create Payment record (status: Pending)
→ Admin review di AdminTabungan.jsx
→ Admin approve (UploadController::approvePayment)
→ Update tabungan.current_amount
→ Calculate progress
→ If progress >= 100%: status = "Lunas"
```

### 4. Document Flow
```
Jamaah upload dokumen (UploadController::uploadDocument)
→ Document status = "Dalam Review"
→ Admin review
→ Admin verify/reject (UploadController::verifyDocument/rejectDocument)
→ Document status = "Lengkap" atau "Ditolak"
```

### 5. Consultation Flow
```
User submit form (ConsultationController::store)
→ Consultation status = "pending"
→ Admin view pending consultations
→ Admin respond (ConsultationController::respond)
→ Status = "answered"
→ Admin/User close (ConsultationController::close)
→ Status = "closed"
```

---

## File Uploads

**Storage Configuration:**
- Dokumen: `storage/app/public/documents/`
- Bukti Bayar: `storage/app/public/payment-proofs/`

**Supported Formats:**
- PDF, JPG, JPEG, PNG
- Max size: 5MB

**Access:**
- Public access via: `/storage/documents/filename.pdf`
- Download via: `/api/documents/{id}/download`

---

## Frontend Integration

### AdminJamaah.jsx
```javascript
// Fetch data
apiClient.getJamaahs()

// Create jamaah
apiClient.createJamaah(data)

// Update jamaah
apiClient.updateJamaah(id, data)

// Delete jamaah
apiClient.deleteJamaah(id)

// Export
fetch('/api/statistics/export?type=jamaah')
```

### AdminTabungan.jsx
```javascript
// Fetch tabungan
apiClient.getTabungans()

// Fetch pending payments
apiClient.getPayments({ status: 'Pending' })

// Approve payment
fetch('/api/payments/' + id + '/approve', { method: 'POST' })

// Reject payment
fetch('/api/payments/' + id + '/reject', {
  method: 'POST',
  body: { reason: 'Alasan reject' }
})
```

### Konsultasi.jsx
```javascript
// Submit consultation
fetch('/api/consultations', {
  method: 'POST',
  body: JSON.stringify({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
    travel_package_id: formData.travelPackage,
    preferred_date: formData.date
  })
})
```

### DashboardJamaah.jsx
```javascript
// Fetch dashboard data
fetch('/api/dashboard/jamaah', {
  headers: { Authorization: 'Bearer ' + token }
})

// Book package
fetch('/api/bookings', {
  method: 'POST',
  body: { jamaah_id: 1, travel_package_id: 2, monthly_payment: 2000000 }
})

// Upload payment proof
const formData = new FormData()
formData.append('jamaah_id', jamaahId)
formData.append('tabungan_id', tabunganId)
formData.append('amount', amount)
formData.append('payment_date', date)
formData.append('payment_method', method)
formData.append('file', file)

fetch('/api/uploads/payment', {
  method: 'POST',
  body: formData
})
```

---

## Testing

**Test Basic Endpoints:**
```bash
# Test consultation submission
curl -X POST http://localhost:8000/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "081234567890",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message",
    "travel_package_id": 1,
    "preferred_date": "2024-03-10"
  }'

# Test get packages
curl http://localhost:8000/api/packages

# Test get jamaah with relationships
curl http://localhost:8000/api/jamaahs/1

# Test dashboard stats (need token)
curl http://localhost:8000/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Next Steps untuk Frontend

1. **Update apiClient.js** - Tambahkan semua method baru:
   - Auth methods (register, login, logout, profile)
   - Upload methods (uploadDocument, uploadPayment)
   - Booking methods (bookPackage, cancelBooking, changePackage)
   - Approval methods (approvePayment, rejectPayment, verifyDocument)
   - Statistics methods

2. **Update Admin Pages:**
   - AdminJamaah.jsx: Integrate CRUD operations
   - AdminTabungan.jsx: Integrate payment approval workflow
   - AdminTravel.jsx: Add create/edit/delete package forms
   - AdminTempat.jsx: Add create/edit/delete accommodation forms
   - AdminDashboard.jsx: Integrate statistics API

3. **Update Jamaah Pages:**
   - DashboardJamaah.jsx: Add booking form, upload document/payment features
   - Konsultasi.jsx: Integrate consultation submission API

4. **Add Authentication:**
   - Implement login/register forms
   - Store token in localStorage
   - Add token to all authenticated requests
   - Implement protected routes

5. **Add File Upload:**
   - Create file upload components
   - Handle multipart/form-data requests
   - Display file previews
   - Show upload progress

---

## Database Changes

**New Migration:**
- `2026_03_07_072926_update_consultations_status_enum.php` ✅
  - Changed consultation status enum from `['Pending', 'In Progress', 'Resolved', 'Closed']` to `['pending', 'answered', 'closed']`

**All columns in consultations table already exist:**
- `name`, `phone`, `email` (for form without login)
- `travel_package_id` (link to package)
- `preferred_date` (preferred consultation date)

---

## Summary

✅ **12 Controllers** telah dibuat dan siap digunakan  
✅ **50+ API Endpoints** untuk semua proses FE  
✅ **Complete CRUD** untuk semua entities  
✅ **File Upload** untuk dokumen dan bukti bayar  
✅ **Payment Approval** workflow lengkap  
✅ **Statistics & Analytics** untuk admin dashboard  
✅ **Authentication** dengan Sanctum  
✅ **Booking System** dengan tabungan otomatis  
✅ **Consultation System** untuk form kontak  

Backend sudah 100% siap, tinggal integrate di frontend! 🚀
