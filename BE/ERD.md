# Entity Relationship Diagram (ERD)

## Daftar Tabel Database

| No | Tabel | Deskripsi | Jumlah Field |
|----|-------|-----------|--------------|
| 1 | users | Data pengguna sistem (admin & jamaah) | 10 |
| 2 | jamaahs | Data jamaah/peserta umroh | 12 |
| 3 | travel_packages | Data paket umroh | 18 |
| 4 | tabungans | Data tabungan jamaah | 11 |
| 5 | payments | Transaksi pembayaran | 13 |
| 6 | documents | Dokumen jamaah | 10 |
| 7 | accommodations | Hotel & akomodasi | 12 |
| 8 | consultations | Data konsultasi | 15 |

## Relasi Antar Tabel

### users → jamaahs (One to One)
- **users.id** → **jamaahs.user_id**
- Setiap user hanya memiliki 1 profile jamaah

### users → payments (One to Many - Verifier)
- **users.id** → **payments.verified_by**
- User admin bisa memverifikasi banyak payment

### users → documents (One to Many - Verifier)
- **users.id** → **documents.verified_by**
- User admin bisa memverifikasi banyak dokumen

### users → consultations (One to Many - Handler)
- **users.id** → **consultations.handled_by**
- User admin bisa menangani banyak konsultasi

### travel_packages → jamaahs (One to Many)
- **travel_packages.id** → **jamaahs.travel_package_id**
- Satu paket bisa dipilih banyak jamaah

### travel_packages → tabungans (One to Many)
- **travel_packages.id** → **tabungans.travel_package_id**
- Satu paket bisa memiliki banyak tabungan

### travel_packages → consultations (One to Many)
- **travel_packages.id** → **consultations.travel_package_id**
- Satu paket bisa dikonsultasikan berkali-kali

### jamaahs → tabungan (One to One)
- **jamaahs.id** → **tabungans.jamaah_id**
- Setiap jamaah hanya memiliki 1 tabungan aktif

### jamaahs → payments (One to Many)
- **jamaahs.id** → **payments.jamaah_id**
- Jamaah bisa melakukan banyak pembayaran

### jamaahs → documents (One to Many)
- **jamaahs.id** → **documents.jamaah_id**
- Jamaah memiliki banyak dokumen

### jamaahs → consultations (One to Many)
- **jamaahs.id** → **consultations.jamaah_id**
- Jamaah bisa melakukan banyak konsultasi

### tabungans → payments (One to Many)
- **tabungans.id** → **payments.tabungan_id**
- Satu tabungan memiliki banyak transaksi payment

## Foreign Keys

```sql
-- Tabel: jamaahs
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (travel_package_id) REFERENCES travel_packages(id) ON DELETE SET NULL

-- Tabel: tabungans
FOREIGN KEY (jamaah_id) REFERENCES jamaahs(id) ON DELETE CASCADE
FOREIGN KEY (travel_package_id) REFERENCES travel_packages(id) ON DELETE CASCADE

-- Tabel: payments
FOREIGN KEY (tabungan_id) REFERENCES tabungans(id) ON DELETE CASCADE
FOREIGN KEY (jamaah_id) REFERENCES jamaahs(id) ON DELETE CASCADE
FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL

-- Tabel: documents
FOREIGN KEY (jamaah_id) REFERENCES jamaahs(id) ON DELETE CASCADE
FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL

-- Tabel: consultations
FOREIGN KEY (jamaah_id) REFERENCES jamaahs(id) ON DELETE CASCADE
FOREIGN KEY (travel_package_id) REFERENCES travel_packages(id) ON DELETE SET NULL
FOREIGN KEY (handled_by) REFERENCES users(id) ON DELETE SET NULL
```

## Indexes & Constraints

### Unique Constraints
- `jamaahs.nik` - NIK harus unik
- `jamaahs.email` - Email jamaah harus unik
- `users.email` - Email user harus unik

### Enum Fields

**jamaahs.status:**
- Aktif
- Menunggu
- Lunas
- Tertunggak
- Non-Aktif

**travel_packages.status:**
- Aktif
- Coming Soon
- Hampir Penuh
- Penuh
- Non-Aktif

**tabungans.status:**
- Berjalan
- Lunas
- Tertunggak
- Dibatalkan

**payments.status:**
- Pending
- Approved
- Rejected

**payments.payment_method:**
- Transfer BCA
- Transfer BRI
- Transfer Mandiri
- Transfer BNI
- Cash
- E-Wallet

**documents.status:**
- Lengkap
- Perlu Upload
- Dalam Review
- Ditolak

**accommodations.type:**
- Hotel
- Bandara
- Pemondokan
- Transport

**accommodations.status:**
- Aktif
- Coming Soon
- Non-Aktif

**consultations.status:**
- Pending
- In Progress
- Resolved
- Closed

## JSON Fields

### travel_packages
- **features** - Array fitur paket (Hotel 5*, Manasik, dll)
- **highlights** - Array highlight paket (Plus Turki, Ekonomis, dll)

### accommodations
- **facilities** - Array fasilitas (WiFi, Restoran, dll)

## Cascade Actions

### ON DELETE CASCADE
Ketika parent dihapus, child juga ikut terhapus:
- users → jamaahs
- jamaahs → tabungans
- jamaahs → payments
- jamaahs → documents
- jamaahs → consultations
- travel_packages → tabungans
- tabungans → payments

### ON DELETE SET NULL
Ketika parent dihapus, foreign key di child diset NULL:
- travel_packages → jamaahs
- travel_packages → consultations
- users (verified_by) → payments
- users (verified_by) → documents
- users (handled_by) → consultations

## Visual Representation

```
┌──────────────┐
│    users     │
│─────────────│
│ • id        │
│ • name      │
│ • email     │
│ • password  │
└──────┬───────┘
       │ 1:1
       ├─────────────────────────────────┐
       │                                 │
       │ 1:n (verifier)                  │ 1:n (handler)
       │                                 │
┌──────▼───────┐        ┌──────────────┐ │  ┌────────────────┐
│   jamaahs    │        │   payments   │ │  │ consultations  │
│─────────────│        │──────────────│ │  │────────────────│
│ • id        │        │ • id         │ └──│ • id           │
│ • user_id   │───────▶│ • verified_by│    │ • handled_by   │
│ • name      │   1:n  │ • amount     │    │ • name         │
│ • nik       │        │ • status     │    │ • subject      │
│ • email     │        └──────┬───────┘    │ • status       │
│ • phone     │               │            └────────┬───────┘
└──────┬───────┘               │                    │
       │ 1:1                   │ n:1                │ n:1
       │                       │                    │
┌──────▼───────┐        ┌──────▼───────┐    ┌──────▼─────────┐
│  tabungans   │        │  tabungans   │    │travel_packages │
│─────────────│        │──────────────│    │────────────────│
│ • id        │        │ • id         │    │ • id           │
│ • jamaah_id │        │ • progress   │    │ • name         │
│ • target    │────┬───│ • status     │    │ • duration     │
│ • current   │1:n │   └──────────────┘    │ • price        │
│ • status    │    │                       │ • quota        │
└──────┬───────┘    │   ┌──────────────┐   │ • departure    │
       │            │   │  documents   │   └────────────────┘
       │            └───│──────────────│
       │ n:1            │ • id         │
       │                │ • jamaah_id  │
       │                │ • type       │
       │                │ • status     │
       │                │ • file_path  │
       │                └──────────────┘
       │
┌──────▼─────────┐
│travel_packages │
│────────────────│
│ • id           │
│ • name         │
│ • price        │
│ • features     │◄── JSON array
│ • highlights   │◄── JSON array
└────────────────┘

┌────────────────┐
│accommodations  │  (Standalone table)
│────────────────│
│ • id           │
│ • name         │
│ • type         │
│ • facilities   │◄── JSON array
└────────────────┘
```

## Business Rules

1. **Jamaah Creation**
   - Setiap user yang register akan otomatis dibuatkan profile jamaah
   - NIK dan email harus unique

2. **Tabungan Management**
   - Setiap jamaah hanya boleh punya 1 tabungan aktif
   - Progress dihitung: (current_amount / target_amount) * 100
   - Status berubah otomatis jadi "Lunas" ketika progress = 100%

3. **Payment Verification**
   - Semua payment dimulai dengan status "Pending"
   - Admin harus verify sebelum status berubah jadi "Approved"
   - Ketika payment diapprove, current_amount tabungan bertambah

4. **Document Upload**
   - Jamaah wajib upload 5 dokumen minimum:
     * Paspor
     * KTP
     * KK
     * Foto 4x6
     * Sertifikat Vaksin

5. **Package Booking**
   - Available = Quota - Booked
   - Status "Hampir Penuh" ketika available < 10
   - Status "Penuh" ketika available = 0

6. **Consultation Flow**
   - Status: Pending → In Progress → Resolved → Closed
   - Bisa dibuat tanpa login (jamaah_id nullable)
   - Admin assign consultation ke diri sendiri (handled_by)
