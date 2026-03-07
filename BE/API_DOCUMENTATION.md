# API Documentation - Niat Umroh

Dokumentasi lengkap API untuk sistem manajemen umroh Niat Umroh.

## Base URL
```
http://localhost:8000/api
```

## Authentication

### Register
Mendaftar user baru dan membuat profil jamaah.

**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "name": "Ahmad Subarjo",
  "email": "ahmad@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "nik": "3201234567890123",
  "phone": "081234567890",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "travel_package_id": 1
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful",
  "user": { ... },
  "jamaah": { ... },
  "token": "1|abcd1234..."
}
```

---

### Login
Login user yang sudah terdaftar.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "ahmad@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": { ... },
  "jamaah": { ... },
  "token": "2|efgh5678..."
}
```

---

### Logout
Logout dan hapus token saat ini.

**Endpoint:** `POST /logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Profile
Mendapatkan profil user yang sedang login.

**Endpoint:** `GET /profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "name": "Ahmad Subarjo",
    "email": "ahmad@example.com"
  },
  "jamaah": {
    "id": 1,
    "name": "Ahmad Subarjo",
    "nik": "3201234567890123",
    "phone": "081234567890",
    "address": "...",
    "status": "Aktif",
    "travel_package": { ... },
    "tabungan": { ... },
    "documents": [ ... ],
    "payments": [ ... ]
  }
}
```

---

### Update Profile
Update profil user yang sedang login.

**Endpoint:** `PUT /profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Ahmad Subarjo Updated",
  "email": "ahmad.new@example.com",
  "phone": "081234567899",
  "address": "New Address",
  "current_password": "password123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:** `200 OK`

---

## Dashboard

### Admin Dashboard Stats
Mendapatkan statistik dashboard admin.

**Endpoint:** `GET /dashboard/admin`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "stats": {
    "total_jamaah": 50,
    "active_jamaah": 35,
    "total_packages": 10,
    "active_packages": 5,
    "total_revenue": 500000000,
    "pending_payments": 5,
    "pending_documents": 10,
    "completed_documents": 120
  },
  "monthly_revenue": [
    { "month": "Jan", "revenue": 50000000 },
    { "month": "Feb", "revenue": 75000000 }
  ],
  "package_stats": [
    { "package": "Umroh Plus Turki", "total": 15 },
    { "package": "Umroh Reguler", "total": 10 }
  ],
  "recent_activities": [ ... ],
  "pending_payments": [ ... ]
}
```

---

### Jamaah Dashboard
Mendapatkan dashboard data untuk jamaah yang sedang login.

**Endpoint:** `GET /dashboard/jamaah`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "jamaah": { ... },
  "progress": {
    "registration": "completed",
    "package_selection": "completed",
    "documents": "in_progress",
    "payment": "in_progress",
    "departure": "waiting"
  },
  "recent_activities": [ ... ],
  "upcoming_schedule": [ ... ],
  "pending_documents": [ ... ],
  "stats": {
    "tabungan_progress": 53,
    "documents_completed": 3,
    "total_payments": 5,
    "days_until_departure": 180
  }
}
```

---

## Packages (Travel Packages)

### Get All Packages
**Endpoint:** `GET /packages`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Umroh Plus Turki 15 Hari",
    "duration": "15 hari",
    "price": 35000000,
    "departure_date": "2024-06-15",
    "quota": 40,
    "booked": 25,
    "hotel": "Bintang 5",
    "airline": "Saudi Airlines",
    "features": ["Ziarah", "Tour Turki"],
    "highlights": ["Masjid Nabawi", "Blue Mosque"],
    "rating": 4.8,
    "status": "Aktif"
  }
]
```

---

### Get Package by ID
**Endpoint:** `GET /packages/{id}`

**Response:** `200 OK`

---

### Create Package
**Endpoint:** `POST /packages`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Umroh Premium",
  "duration": "20 hari",
  "price": 45000000,
  "departure_date": "2024-12-01",
  "quota": 30,
  "hotel": "Bintang 5",
  "airline": "Emirates",
  "features": ["Tour", "Ziarah Lengkap"],
  "highlights": ["Masjid Nabawi", "Jabal Rahmah"],
  "description": "Paket umroh premium...",
  "status": "Aktif"
}
```

**Response:** `201 Created`

---

### Update Package
**Endpoint:** `PUT /packages/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:** Same as Create Package

**Response:** `200 OK`

---

### Delete Package
**Endpoint:** `DELETE /packages/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Accommodations

### Get All Accommodations
**Endpoint:** `GET /accommodations`

**Response:** `200 OK`

---

### Create Accommodation
**Endpoint:** `POST /accommodations`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Hotel Makkah Hilton",
  "type": "Hotel",
  "location": "Makkah",
  "address": "Near Masjid Al-Haram",
  "distance": "100 meter dari Masjidil Haram",
  "rating": 5,
  "facilities": ["WiFi", "AC", "Restaurant"],
  "room_type": "Deluxe Room",
  "capacity": 2,
  "price_per_night": 2000000,
  "images": ["url1", "url2"]
}
```

**Response:** `201 Created`

---

### Update/Delete Accommodation
Same pattern as Packages (`PUT /accommodations/{id}`, `DELETE /accommodations/{id}`)

---

## Booking

### Book Package
Booking paket umroh untuk jamaah.

**Endpoint:** `POST /bookings`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "jamaah_id": 1,
  "travel_package_id": 2,
  "monthly_payment": 2000000
}
```

**Response:** `200 OK`
```json
{
  "message": "Package booked successfully",
  "jamaah": { ... },
  "tabungan": {
    "id": 1,
    "target_amount": 35000000,
    "current_amount": 0,
    "monthly_payment": 2000000,
    "status": "Berjalan"
  }
}
```

---

### Cancel Booking
**Endpoint:** `POST /bookings/{jamaahId}/cancel`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Change Package
**Endpoint:** `PUT /bookings/{jamaahId}/change`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "new_package_id": 3
}
```

**Response:** `200 OK`

---

### Get Available Packages
Get paket yang masih memiliki kuota tersedia.

**Endpoint:** `GET /packages/available`

**Response:** `200 OK`

---

## Jamaah

### Get All Jamaah
**Endpoint:** `GET /jamaahs`

**Response:** `200 OK`

---

### Get Jamaah by ID
**Endpoint:** `GET /jamaahs/{id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Ahmad Subarjo",
  "nik": "3201234567890123",
  "email": "ahmad@example.com",
  "phone": "081234567890",
  "address": "...",
  "registration_date": "2024-01-15",
  "status": "Aktif",
  "travel_package": { ... },
  "tabungan": {
    "id": 1,
    "target_amount": 35000000,
    "current_amount": 18500000,
    "progress": 53
  },
  "documents": [
    {
      "id": 1,
      "document_type": "Paspor",
      "status": "Lengkap",
      "file_path": "..."
    }
  ],
  "payments": [ ... ]
}
```

---

### Create Jamaah
**Endpoint:** `POST /jamaahs`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Budi Santoso",
  "nik": "3301234567890123",
  "email": "budi@example.com",
  "phone": "082234567890",
  "address": "Jl. Merdeka No. 45",
  "travel_package_id": 1,
  "status": "Menunggu"
}
```

**Response:** `201 Created`

---

### Update/Delete Jamaah
Standard CRUD endpoints: `PUT /jamaahs/{id}`, `DELETE /jamaahs/{id}`

---

## Tabungan

### Get All Tabungan
**Endpoint:** `GET /tabungans`

**Query Parameters:**
- `jamaah_id` (optional): Filter by jamaah

**Response:** `200 OK`

---

### Create Tabungan
**Endpoint:** `POST /tabungans`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "jamaah_id": 1,
  "travel_package_id": 1,
  "target_amount": 35000000,
  "current_amount": 0,
  "monthly_payment": 2000000,
  "next_payment_date": "2024-02-15",
  "status": "Berjalan"
}
```

**Response:** `201 Created`

---

## Payments

### Get All Payments
**Endpoint:** `GET /payments`

**Query Parameters:**
- `jamaah_id` (optional): Filter by jamaah
- `status` (optional): Filter by status (Pending, Approved, Rejected)

**Response:** `200 OK`

---

### Upload Payment Proof
Upload bukti pembayaran baru.

**Endpoint:** `POST /uploads/payment`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
jamaah_id: 1
tabungan_id: 1
amount: 2000000
payment_date: 2024-03-07
payment_method: Transfer BCA
file: [file upload]
```

**Response:** `201 Created`
```json
{
  "message": "Payment proof uploaded successfully. Waiting for admin approval.",
  "payment": {
    "id": 14,
    "amount": 2000000,
    "payment_method": "Transfer BCA",
    "status": "Pending",
    "proof_file": "payment-proofs/xyz123.jpg"
  },
  "file_url": "/storage/payment-proofs/xyz123.jpg"
}
```

---

### Approve Payment
Admin approve pembayaran.

**Endpoint:** `POST /payments/{paymentId}/approve`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Payment approved successfully",
  "payment": { ... },
  "tabungan": {
    "current_amount": 20500000,
    "progress": 59,
    "status": "Berjalan"
  }
}
```

---

### Reject Payment
Admin reject pembayaran.

**Endpoint:** `POST /payments/{paymentId}/reject`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reason": "Bukti pembayaran tidak jelas, mohon upload ulang"
}
```

**Response:** `200 OK`

---

### Download Payment Proof
**Endpoint:** `GET /payments/{paymentId}/download`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** File download

---

## Documents

### Get All Documents
**Endpoint:** `GET /documents`

**Query Parameters:**
- `jamaah_id` (optional): Filter by jamaah

**Response:** `200 OK`

---

### Upload Document
Upload file dokumen.

**Endpoint:** `POST /uploads/document`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
document_id: 1
file: [file upload]
```

**Response:** `200 OK`
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 1,
    "document_type": "Paspor",
    "status": "Dalam Review",
    "file_path": "documents/abc123.pdf"
  },
  "file_url": "/storage/documents/abc123.pdf"
}
```

---

### Verify Document
Admin verify dokumen sebagai lengkap.

**Endpoint:** `POST /documents/{documentId}/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Reject Document
Admin reject dokumen.

**Endpoint:** `POST /documents/{documentId}/reject`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reason": "Foto paspor tidak jelas, mohon upload ulang"
}
```

**Response:** `200 OK`

---

### Download Document
**Endpoint:** `GET /documents/{documentId}/download`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** File download

---

## Consultations

### Get All Consultations
**Endpoint:** `GET /consultations`

**Query Parameters:**
- `jamaah_id` (optional): Filter by jamaah
- `status` (optional): Filter by status (pending, answered, closed)

**Response:** `200 OK`

---

### Submit Consultation
Submit pertanyaan/konsultasi baru dari form.

**Endpoint:** `POST /consultations`

**Request Body:**
```json
{
  "jamaah_id": 1,
  "name": "Ahmad Subarjo",
  "phone": "081234567890",
  "email": "ahmad@example.com",
  "subject": "Pertanyaan tentang visa",
  "message": "Apakah pengurusan visa sudah termasuk?",
  "travel_package_id": 1,
  "preferred_date": "2024-03-10"
}
```

**Response:** `201 Created`
```json
{
  "message": "Consultation request submitted successfully",
  "consultation": {
    "id": 5,
    "name": "Ahmad Subarjo",
    "subject": "Pertanyaan tentang visa",
    "status": "pending",
    "created_at": "2024-03-07T10:30:00.000000Z"
  }
}
```

---

### Respond to Consultation
Admin memberikan respon ke konsultasi.

**Endpoint:** `POST /consultations/{consultationId}/respond`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "response": "Ya, pengurusan visa sudah termasuk dalam paket. Tim kami akan membantu..."
}
```

**Response:** `200 OK`

---

### Close Consultation
**Endpoint:** `POST /consultations/{consultationId}/close`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Statistics

### Summary Statistics
Statistik ringkasan keseluruhan.

**Endpoint:** `GET /statistics/summary`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "jamaah": {
    "total": 50,
    "aktif": 35,
    "menunggu": 5,
    "lunas": 10,
    "tertunggak": 0,
    "non_aktif": 0
  },
  "packages": {
    "total": 10,
    "aktif": 5,
    "coming_soon": 3,
    "total_seats": 400,
    "booked_seats": 250
  },
  "financial": {
    "total_revenue": 500000000,
    "this_month": 75000000,
    "pending_amount": 25000000,
    "total_target": 1750000000,
    "total_collected": 875000000
  },
  "documents": {
    "total": 250,
    "lengkap": 180,
    "perlu_upload": 40,
    "dalam_review": 20,
    "ditolak": 10
  },
  "consultations": {
    "total": 45,
    "pending": 10,
    "answered": 30,
    "closed": 5
  }
}
```

---

### Revenue Statistics
Statistik pendapatan dengan chart data.

**Endpoint:** `GET /statistics/revenue`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `year` (optional): Filter by year (default: current year)

**Response:** `200 OK`
```json
{
  "monthly_revenue": [
    {
      "month": "January",
      "month_short": "Jan",
      "revenue": 50000000,
      "transactions": 25
    }
  ],
  "revenue_by_method": [
    {
      "method": "Transfer BCA",
      "revenue": 300000000,
      "transactions": 150
    }
  ],
  "top_jamaah": [
    {
      "id": 1,
      "name": "Ahmad Subarjo",
      "total_paid": 35000000
    }
  ],
  "summary": {
    "total_year": 500000000,
    "average_transaction": 2000000,
    "total_transactions": 250
  }
}
```

---

### Package Statistics
**Endpoint:** `GET /statistics/packages`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Tabungan Statistics
**Endpoint:** `GET /statistics/tabungan`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Document Statistics
**Endpoint:** `GET /statistics/documents`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Export Statistics
Export data ke CSV.

**Endpoint:** `GET /statistics/export`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `type`: jamaah | payments

**Response:** CSV file download

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Notes

1. **Authentication**: Sebagian besar endpoint memerlukan authentication token. Dapatkan token dari `/login` atau `/register`, lalu sertakan di header `Authorization: Bearer {token}`.

2. **Pagination**: List endpoints seperti `/jamaahs`, `/payments`, dll mendukung pagination. Gunakan query parameters:
   - `page`: Page number (default: 1)
   - `per_page`: Items per page (default: 15)

3. **File Uploads**: Untuk upload file (dokumen, bukti bayar), gunakan `Content-Type: multipart/form-data`.

4. **Date Format**: Gunakan format `YYYY-MM-DD` untuk tanggal.

5. **Enum Values**:
   - Jamaah Status: `Menunggu`, `Aktif`, `Lunas`, `Tertunggak`, `Non-Aktif`
   - Tabungan Status: `Berjalan`, `Lunas`, `Tertunggak`, `Dibatalkan`
   - Document Status: `Perlu Upload`, `Lengkap`, `Dalam Review`, `Ditolak`
   - Payment Status: `Pending`, `Approved`, `Rejected`
   - Consultation Status: `pending`, `answered`, `closed`
   - Payment Methods: `Transfer BCA`, `Transfer BRI`, `Transfer Mandiri`, `Transfer BNI`, `Cash`, `E-Wallet`
