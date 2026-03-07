# 🚀 Setup & Integration Guide

## Perubahan yang Telah Dibuat

### Backend (BE)
1. ✅ **API Controllers**
   - `TravelPackageController` - CRUD untuk paket umroh
   - `AccommodationController` - CRUD untuk akomodasi

2. ✅ **API Resources**
   - `TravelPackageResource` - Format response packages
   - `AccommodationResource` - Format response accommodations

3. ✅ **API Routes**
   - `GET /api/packages` - List semua paket
   - `GET /api/packages/{id}` - Detail paket
   - `GET /api/accommodations` - List semua akomodasi
   - `GET /api/accommodations/{id}` - Detail akomodasi
   - Plus POST, PUT, DELETE untuk masing-masing

### Frontend (FE)
1. ✅ **API Client** (`src/api/apiClient.js`)
   - Fungsi untuk fetch packages
   - Fungsi untuk fetch accommodations
   - Error handling

2. ✅ **Configuration** (`src/config/api.js`)
   - API base URL configuration
   - Endpoints constants

3. ✅ **Updated Components**
   - `DashboardJamaah.jsx` - Fetch packages from API
   - `AdminTravel.jsx` - Fetch packages from API
   - `AdminTempat.jsx` - Fetch accommodations from API

4. ✅ **Environment Files**
   - `.env` - Development configuration
   - `.env.example` - Example configuration

5. ✅ **Removed**
   - ❌ Hardcoded travel packages data
   - ❌ Hardcoded accommodations data

## 📋 Setup Instructions

### 1. Backend Setup

```bash
# Masuk ke folder BE
cd BE

# Pastikan migrations sudah dijalankan
php artisan migrate

# Jalankan seeders untuk data contoh
php artisan db:seed

# Start Laravel server
php artisan serve
# Server akan berjalan di http://localhost:8000
```

### 2. Frontend Setup

```bash
# Masuk ke folder FE
cd FE

# Install dependencies (jika belum)
npm install

# Copy environment file
cp .env.example .env

# Edit .env jika perlu (default sudah benar)
# VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev
# Server akan berjalan di http://localhost:5173
```

## 🧪 Testing API

### Test dengan cURL

```bash
# Test GET packages
curl http://localhost:8000/api/packages

# Test GET single package
curl http://localhost:8000/api/packages/1

# Test GET accommodations
curl http://localhost:8000/api/accommodations

# Test GET single accommodation
curl http://localhost:8000/api/accommodations/1
```

### Expected Response (Packages)

```json
{
  "data": [
    {
      "id": 1,
      "name": "Umroh Plus Turki",
      "duration": "12 Hari",
      "price": 35000000,
      "quota": 45,
      "booked": 12,
      "available": 33,
      "date": "15 Mar 2026",
      "departure_date": "2026-03-15",
      "status": "Aktif",
      "rating": 4.8,
      "features": [...],
      "highlights": [...]
    }
  ]
}
```

## 🔍 Verifikasi Integration

### 1. Check Backend

```bash
# Cek routes
cd BE
php artisan route:list --path=api

# Expected output:
# GET|HEAD  api/packages
# GET|HEAD  api/packages/{package}
# GET|HEAD  api/accommodations
# GET|HEAD  api/accommodations/{accommodation}
```

### 2. Check Frontend Console

Buka browser dan buka Console (F12), seharusnya tidak ada error dan akan melihat:
- Network requests ke `http://localhost:8000/api/packages`
- Data packages ditampilkan di halaman
- Loading state saat fetch data

### 3. Visual Check

1. **Dashboard Jamaah - Tab Pilih Paket**
   - Seharusnya menampilkan loading spinner
   - Kemudian menampilkan 4 paket dari database
   - Data sesuai dengan seeder

2. **Admin Travel**
   - Tabel menampilkan packages dari API
   - Filter dan search masih berfungsi

3. **Admin Tempat**
   - Tabel menampilkan accommodations dari API
   - Filter by type berfungsi

## 🐛 Troubleshooting

### CORS Error
Jika ada error CORS di console:

**Laravel (BE) - config/cors.php:**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

### Connection Refused
Pastikan Laravel server running:
```bash
cd BE
php artisan serve
```

### 404 Not Found
Pastikan routes sudah terdaftar:
```bash
php artisan route:list --path=api
```

### Empty Data
Pastikan seeders sudah dijalankan:
```bash
php artisan db:seed
```

### Frontend Not Updating
Clear cache dan restart:
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

## 📝 Next Steps

### 1. Add CORS Configuration
Edit `BE/config/cors.php`:
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 2. Add Loading States
Components sudah ada loading state, tapi bisa diperbaiki:
- Add skeleton loaders
- Better error messages
- Retry functionality

### 3. Add Error Handling
Create error boundary atau notification system untuk menampilkan error ke user.

### 4. Add More Endpoints
Buat endpoints untuk:
- Jamaahs CRUD
- Tabungans management
- Payments processing
- Documents upload
- Consultations

### 5. Add Authentication
Implement Laravel Sanctum untuk protected routes.

## ✅ Checklist

- [x] Backend API Controllers created
- [x] Backend API Resources created
- [x] Backend API Routes registered
- [x] Frontend API client created
- [x] Frontend components updated
- [x] Dummy data removed
- [x] Loading states added
- [x] Configuration files created
- [ ] CORS configured (perlu manual)
- [ ] Authentication added
- [ ] Error handling improved

## 🎉 Status: Integration Complete!

Frontend sekarang menggunakan data dari database melalui API Laravel, bukan lagi data dummy yang hardcoded!

### Cara Test:
1. Start Backend: `cd BE && php artisan serve`
2. Start Frontend: `cd FE && npm run dev`
3. Buka browser: `http://localhost:5173`
4. Navigate ke Dashboard Jamaah > Tab "Pilih Paket"
5. Data paket akan di-fetch dari API

---

Last Updated: March 7, 2026
