# 🕌 Niat Umroh - Database Documentation

> Sistem Manajemen Tabungan Umroh dengan Laravel Backend

## 📋 Table of Contents
- [Overview](#overview)
- [Database Structure](#database-structure)
- [Quick Start](#quick-start)
- [Documentation Files](#documentation-files)
- [Features](#features)
- [Technology Stack](#technology-stack)

## 🎯 Overview

Proyek ini adalah backend sistem untuk aplikasi **Niat Umroh** - platform manajemen tabungan umroh yang membantu jamaah merencanakan dan mengelola tabungan mereka untuk berangkat umroh.

### Key Features
- ✅ Manajemen Data Jamaah
- ✅ Sistem Tabungan dengan Progress Tracking
- ✅ Payment Verification System
- ✅ Document Management
- ✅ Travel Package Management
- ✅ Consultation System
- ✅ Accommodation Database

## 🗄️ Database Structure

### Total: 8 Tables
1. **users** - Autentikasi & akun pengguna
2. **jamaahs** - Data jamaah/peserta
3. **travel_packages** - Paket-paket umroh
4. **tabungans** - Tabungan jamaah
5. **payments** - Transaksi pembayaran
6. **documents** - Dokumen jamaah
7. **accommodations** - Hotel & akomodasi
8. **consultations** - Konsultasi

### Statistics
- **Total Fields**: ~100 fields
- **Foreign Keys**: 11 relationships
- **JSON Fields**: 3 (features, highlights, facilities)
- **Enum Types**: 8 different enums
- **Sample Data**: 4 travel packages, 5 accommodations

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- MySQL 8.0+
- Composer
- Laravel 11.x

### Installation

1. **Clone & Install Dependencies**
```bash
cd BE
composer install
```

2. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database Configuration**
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Taburoh
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. **Run Migrations & Seeders**
```bash
# Fresh migration with sample data
php artisan migrate:fresh --seed

# Or step by step
php artisan migrate
php artisan db:seed
```

5. **Start Development Server**
```bash
php artisan serve
```

Server will run at: `http://localhost:8000`

## 📚 Documentation Files

### Main Documentation
| File | Description |
|------|-------------|
| [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md) | Complete database structure & fields |
| [ERD.md](./ERD.md) | Entity Relationship Diagram & relations |
| [DIAGRAMS.md](./DIAGRAMS.md) | Visual diagrams (Mermaid) |
| [SUMMARY.md](./SUMMARY.md) | Quick summary & statistics |
| [COMMANDS.md](./COMMANDS.md) | Command reference & examples |

### Quick Links
- 📊 [See Full Database Structure](./DATABASE_STRUCTURE.md)
- 🔗 [View Entity Relationships](./ERD.md)
- 📈 [Check Visual Diagrams](./DIAGRAMS.md)
- ⚡ [Quick Command Reference](./COMMANDS.md)

## 🎨 Features

### 1. User Management
- Authentication with Laravel Fortify
- Two-factor authentication support
- Role-based access (Admin & Jamaah)

### 2. Jamaah Management
- Complete profile management
- NIK & email uniqueness validation
- Status tracking (Aktif, Menunggu, Lunas, etc.)
- Linked to user account

### 3. Travel Packages
- Multiple package types (Plus Turki, Reguler, Ramadhan, Plus Dubai)
- Quota management
- Price & duration tracking
- Hotel & airline information
- Features & highlights (JSON)

### 4. Tabungan (Savings) System
- Target amount tracking
- Current amount monitoring
- Auto-calculate progress percentage
- Status management
- Monthly payment tracking

### 5. Payment Processing
- Multiple payment methods
- Receipt upload
- Admin verification workflow
- Payment status tracking
- Automatic tabungan update on approval

### 6. Document Management
- Required documents tracking
- File upload support
- Admin verification
- Expiry date monitoring
- Document types: Paspor, KTP, KK, Foto, Vaksin

### 7. Accommodation Database
- Hotels in Makkah & Madinah
- Airports
- Pemondokan (dormitory)
- Facilities information (JSON)

### 8. Consultation System
- Question submission
- Category-based routing
- Admin assignment
- Response tracking
- Status workflow

## 💻 Technology Stack

### Backend
- **Framework**: Laravel 11.x
- **Language**: PHP 8.2+
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Fortify
- **API**: Laravel Sanctum

### Frontend (Reference)
- React 18
- Vite
- TailwindCSS
- Shadcn UI

## 📊 Database Models

All models are fully configured with:
- ✅ Fillable attributes
- ✅ Type casting (dates, decimals, json)
- ✅ Relationships (BelongsTo, HasOne, HasMany)
- ✅ Proper naming conventions

### Model List
```php
App\Models\User
App\Models\Jamaah
App\Models\TravelPackage
App\Models\Tabungan
App\Models\Payment
App\Models\Document
App\Models\Accommodation
App\Models\Consultation
```

## 🔄 Relationships Overview

```
users (1) ──── (1) jamaahs
jamaahs (1) ──── (1) tabungan
jamaahs (1) ──── (n) payments
jamaahs (1) ──── (n) documents
jamaahs (n) ──── (1) travel_packages
tabungans (1) ──── (n) payments
travel_packages (1) ──── (n) jamaahs
```

## 📈 Sample Data

### Travel Packages (4 packages)
- Umroh Plus Turki: Rp 35,000,000 (12 days)
- Umroh Reguler: Rp 30,000,000 (9 days)
- Umroh Ramadhan: Rp 42,000,000 (14 days)
- Umroh Plus Dubai: Rp 38,000,000 (11 days)

### Accommodations (5 locations)
- Hotel Movenpick Makkah (5 Star)
- Hotel Hilton Madinah (5 Star)
- Bandara Soekarno-Hatta
- Maktab 45 Aziziyah (Pemondokan)
- Ritz Carlton Makkah (5 Star)

## 🛠️ Common Commands

```bash
# Database
php artisan migrate:fresh --seed  # Reset & seed
php artisan db:seed              # Run seeders only

# Testing
php artisan tinker               # Interactive console

# Cache
php artisan optimize:clear       # Clear all cache

# Development
php artisan serve               # Start server
php artisan route:list          # List all routes
```

## 📝 Example Usage

### Create Jamaah with Tabungan
```php
use App\Models\User;
use App\Models\Jamaah;
use App\Models\Tabungan;

// Create user
$user = User::create([
    'name' => 'Ahmad',
    'email' => 'ahmad@example.com',
    'password' => bcrypt('password')
]);

// Create jamaah profile
$jamaah = Jamaah::create([
    'user_id' => $user->id,
    'name' => 'Ahmad Subarjo',
    'nik' => '3201234567890001',
    'email' => 'ahmad@example.com',
    'phone' => '081234567890',
    'address' => 'Jakarta',
    'registration_date' => now(),
    'travel_package_id' => 1,
    'status' => 'Aktif'
]);

// Create tabungan
$tabungan = Tabungan::create([
    'jamaah_id' => $jamaah->id,
    'travel_package_id' => 1,
    'target_amount' => 35000000,
    'current_amount' => 0,
    'progress' => 0,
    'status' => 'Berjalan'
]);
```

### Process Payment
```php
use App\Models\Payment;

// Create payment
$payment = Payment::create([
    'tabungan_id' => $tabungan->id,
    'jamaah_id' => $jamaah->id,
    'amount' => 1000000,
    'payment_date' => now(),
    'payment_method' => 'Transfer BCA',
    'status' => 'Pending'
]);

// Admin verify
$payment->update([
    'status' => 'Approved',
    'verified_by' => auth()->id(),
    'verified_at' => now()
]);

// Update tabungan
$tabungan->current_amount += $payment->amount;
$tabungan->progress = ($tabungan->current_amount / $tabungan->target_amount) * 100;
$tabungan->save();
```

## 📁 Project Structure

```
BE/
├── app/
│   └── Models/
│       ├── User.php
│       ├── Jamaah.php
│       ├── TravelPackage.php
│       ├── Tabungan.php
│       ├── Payment.php
│       ├── Document.php
│       ├── Accommodation.php
│       └── Consultation.php
├── database/
│   ├── migrations/
│   │   ├── *_create_travel_packages_table.php
│   │   ├── *_create_jamaahs_table.php
│   │   ├── *_create_tabungans_table.php
│   │   ├── *_create_payments_table.php
│   │   ├── *_create_documents_table.php
│   │   ├── *_create_accommodations_table.php
│   │   └── *_create_consultations_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── TravelPackageSeeder.php
│       └── AccommodationSeeder.php
├── DATABASE_STRUCTURE.md
├── ERD.md
├── DIAGRAMS.md
├── SUMMARY.md
├── COMMANDS.md
└── README.md (this file)
```

## 🎯 Next Steps

After database setup, consider implementing:

1. **API Controllers**
   - RESTful API endpoints
   - Request validation
   - Response formatting

2. **Authentication**
   - Login/Register
   - Password reset
   - Role management

3. **Business Logic**
   - Auto-calculate tabungan progress
   - Payment verification workflow
   - Document review system

4. **File Upload**
   - Document storage
   - Receipt storage
   - Image optimization

5. **Notifications**
   - Email notifications
   - WhatsApp integration
   - Real-time updates

## 📞 Support

For questions or issues:
- Check documentation files
- Review example code
- Use `php artisan tinker` for testing

## 📄 License

This project is part of Niat Umroh application system.

## ✨ Status

✅ Database Structure Complete  
✅ Models & Relationships Complete  
✅ Sample Data Seeders Complete  
✅ Documentation Complete  
✅ Ready for Development

---

**Happy Coding! 🚀**

Last Updated: March 7, 2026
