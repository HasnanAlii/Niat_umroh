# Struktur Database - Niat Umroh

## Analisa Frontend
Berdasarkan analisa pada folder FE, telah diidentifikasi 7 entitas database utama yang digunakan dalam aplikasi.

## Entitas Database

### 1. Users (Sudah Ada)
Tabel untuk autentikasi pengguna sistem (admin dan jamaah)

**Fields:**
- id
- name
- email
- password
- email_verified_at
- two_factor_secret
- two_factor_recovery_codes
- two_factor_confirmed_at
- remember_token
- timestamps

### 2. Jamaahs
Tabel untuk data jamaah/peserta umroh

**Fields:**
- id
- user_id (FK -> users)
- name
- nik (NIK 16 digit, unique)
- email (unique)
- phone (15 digit)
- address (text)
- registration_date
- travel_package_id (FK -> travel_packages, nullable)
- status (enum: Aktif, Menunggu, Lunas, Tertunggak, Non-Aktif)
- profile_image (nullable)
- timestamps

**Relasi:**
- BelongsTo: User, TravelPackage
- HasOne: Tabungan
- HasMany: Payments, Documents, Consultations

### 3. Travel Packages
Tabel untuk paket-paket perjalanan umroh

**Fields:**
- id
- name
- duration
- price (decimal 15,2)
- quota (integer)
- booked (integer, default 0)
- available (integer)
- departure_date
- status (enum: Aktif, Coming Soon, Hampir Penuh, Penuh, Non-Aktif)
- rating (decimal 3,2)
- hotel_makkah (nullable)
- hotel_madinah (nullable)
- airline (nullable)
- features (json, nullable)
- highlights (json, nullable)
- best_for (nullable)
- description (text, nullable)
- timestamps

**Relasi:**
- HasMany: Jamaahs, Tabungans, Consultations

**Data Contoh:**
1. Umroh Plus Turki - Rp 35.000.000 (12 Hari)
2. Umroh Reguler - Rp 30.000.000 (9 Hari)
3. Umroh Ramadhan - Rp 42.000.000 (14 Hari)
4. Umroh Plus Dubai - Rp 38.000.000 (11 Hari)

### 4. Tabungans
Tabel untuk data tabungan umroh jamaah

**Fields:**
- id
- jamaah_id (FK -> jamaahs)
- travel_package_id (FK -> travel_packages)
- target_amount (decimal 15,2)
- current_amount (decimal 15,2, default 0)
- progress (integer, default 0)
- status (enum: Berjalan, Lunas, Tertunggak, Dibatalkan)
- last_payment_date (nullable)
- next_payment_date (nullable)
- monthly_payment (decimal 15,2, nullable)
- timestamps

**Relasi:**
- BelongsTo: Jamaah, TravelPackage
- HasMany: Payments

### 5. Payments
Tabel untuk transaksi pembayaran tabungan

**Fields:**
- id
- tabungan_id (FK -> tabungans)
- jamaah_id (FK -> jamaahs)
- amount (decimal 15,2)
- payment_date
- payment_method (enum: Transfer BCA, Transfer BRI, Transfer Mandiri, Transfer BNI, Cash, E-Wallet)
- status (enum: Pending, Approved, Rejected)
- receipt_path (nullable)
- notes (text, nullable)
- verified_by (FK -> users, nullable)
- verified_at (timestamp, nullable)
- timestamps

**Relasi:**
- BelongsTo: Tabungan, Jamaah, User (verifier)

### 6. Documents
Tabel untuk dokumen-dokumen jamaah

**Fields:**
- id
- jamaah_id (FK -> jamaahs)
- document_type
- status (enum: Lengkap, Perlu Upload, Dalam Review, Ditolak)
- file_path (nullable)
- expiry_date (nullable)
- notes (text, nullable)
- verified_by (FK -> users, nullable)
- verified_at (timestamp, nullable)
- timestamps

**Relasi:**
- BelongsTo: Jamaah, User (verifier)

**Jenis Dokumen:**
- Paspor
- KTP
- KK (Kartu Keluarga)
- Foto 4x6
- Sertifikat Vaksin

### 7. Accommodations
Tabel untuk data hotel dan tempat akomodasi

**Fields:**
- id
- name
- type (enum: Hotel, Bandara, Pemondokan, Transport)
- location
- rating (decimal 3,2)
- capacity (nullable)
- price (nullable)
- status (enum: Aktif, Coming Soon, Non-Aktif)
- facilities (json, nullable)
- description (text, nullable)
- image (nullable)
- timestamps

**Data Contoh:**
1. Hotel Movenpick Makkah (5 Star)
2. Hotel Hilton Madinah (5 Star)
3. Bandara Soekarno-Hatta
4. Maktab 45 Aziziyah (Pemondokan)
5. Ritz Carlton Makkah (5 Star)

### 8. Consultations
Tabel untuk konsultasi jamaah dengan tim

**Fields:**
- id
- jamaah_id (FK -> jamaahs, nullable)
- name
- phone (15 digit)
- email
- subject
- message (text)
- category (nullable)
- travel_package_id (FK -> travel_packages, nullable)
- preferred_date (nullable)
- status (enum: Pending, In Progress, Resolved, Closed)
- handled_by (FK -> users, nullable)
- response (text, nullable)
- responded_at (timestamp, nullable)
- timestamps

**Relasi:**
- BelongsTo: Jamaah, TravelPackage, User (handler)

**Kategori:**
- Tabungan Umroh
- Dokumen & Visa
- Paket Travel
- Manasik & Spiritual

## Diagram Relasi

```
users
├── jamaahs (1:1)
├── verified_payments (1:n)
├── verified_documents (1:n)
└── handled_consultations (1:n)

travel_packages
├── jamaahs (1:n)
├── tabungans (1:n)
└── consultations (1:n)

jamaahs
├── user (n:1)
├── travel_package (n:1)
├── tabungan (1:1)
├── payments (1:n)
├── documents (1:n)
└── consultations (1:n)

tabungans
├── jamaah (n:1)
├── travel_package (n:1)
└── payments (1:n)

payments
├── tabungan (n:1)
├── jamaah (n:1)
└── verifier/user (n:1)

documents
├── jamaah (n:1)
└── verifier/user (n:1)

consultations
├── jamaah (n:1)
├── travel_package (n:1)
└── handler/user (n:1)

accommodations (standalone)
```

## File Migrasi
Semua migrasi telah dibuat dengan urutan yang benar untuk menghindari foreign key constraint errors:

1. `2026_03_07_064945_create_travel_packages_table.php`
2. `2026_03_07_064946_create_jamaahs_table.php`
3. `2026_03_07_064952_create_tabungans_table.php`
4. `2026_03_07_064953_create_accommodations_table.php`
5. `2026_03_07_064953_create_documents_table.php`
6. `2026_03_07_064953_create_payments_table.php`
7. `2026_03_07_064954_create_consultations_table.php`

## Model Laravel
Semua model telah dibuat lengkap dengan:
- Fillable attributes
- Type casting
- Relationships (BelongsTo, HasOne, HasMany)

**File Model:**
- `app/Models/Jamaah.php`
- `app/Models/TravelPackage.php`
- `app/Models/Tabungan.php`
- `app/Models/Payment.php`
- `app/Models/Document.php`
- `app/Models/Accommodation.php`
- `app/Models/Consultation.php`
- `app/Models/User.php` (updated dengan relasi tambahan)

## Seeders
Telah dibuat seeders untuk data contoh:
- `TravelPackageSeeder.php` - 4 paket umroh
- `AccommodationSeeder.php` - 5 akomodasi

## Cara Penggunaan

### Menjalankan Migrasi
```bash
php artisan migrate
```

### Menjalankan Migrasi dari Awal (Fresh)
```bash
php artisan migrate:fresh
```

### Menjalankan Seeder
```bash
php artisan db:seed
```

### Menjalankan Migrasi & Seeder Sekaligus
```bash
php artisan migrate:fresh --seed
```

## Contoh Query

### Mendapatkan Jamaah dengan Tabungan dan Paket
```php
$jamaah = Jamaah::with(['tabungan', 'travelPackage'])->find($id);
```

### Mendapatkan Semua Payment dengan Status Pending
```php
$pendingPayments = Payment::where('status', 'Pending')
    ->with(['jamaah', 'tabungan'])
    ->get();
```

### Mendapatkan Travel Package dengan Jamaah
```php
$package = TravelPackage::with(['jamaahs', 'tabungans'])
    ->where('status', 'Aktif')
    ->get();
```

### Update Progress Tabungan
```php
$tabungan = Tabungan::find($id);
$tabungan->current_amount += $paymentAmount;
$tabungan->progress = ($tabungan->current_amount / $tabungan->target_amount) * 100;
$tabungan->save();
```

## Status Migrasi
✅ Semua migrasi berhasil dijalankan
✅ Semua model telah dibuat
✅ Semua relasi telah dikonfigurasi
✅ Seeders untuk data contoh telah dibuat
✅ Database siap digunakan
