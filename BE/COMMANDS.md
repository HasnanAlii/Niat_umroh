# 🚀 Quick Command Reference

## Database Commands

### Migration Commands
```bash
# Jalankan semua migrasi
php artisan migrate

# Rollback migrasi terakhir
php artisan migrate:rollback

# Rollback semua migrasi
php artisan migrate:reset

# Drop all tables dan jalankan ulang semua migrasi
php artisan migrate:fresh

# Fresh migration dengan seeder
php artisan migrate:fresh --seed

# Cek status migrasi
php artisan migrate:status
```

### Seeder Commands
```bash
# Jalankan semua seeder
php artisan db:seed

# Jalankan seeder tertentu
php artisan db:seed --class=TravelPackageSeeder
php artisan db:seed --class=AccommodationSeeder
```

### Tinker (Database Testing)
```bash
# Masuk ke tinker
php artisan tinker

# Di dalam tinker:
App\Models\TravelPackage::all();
App\Models\Jamaah::with('tabungan')->first();
App\Models\Payment::where('status', 'Pending')->get();
```

## Model Commands

### Create New Model with Migration
```bash
php artisan make:model NamaModel -m

# Options:
# -m = migration
# -c = controller
# -r = resource controller
# -f = factory
# -s = seeder
# -a = all (migration, factory, seeder, controller)
```

## Artisan Commands Useful

### Generate Commands
```bash
# Make controller
php artisan make:controller JamaahController

# Make resource controller
php artisan make:controller JamaahController --resource

# Make API resource controller
php artisan make:controller Api/JamaahController --api

# Make request
php artisan make:request StoreJamaahRequest

# Make resource (API)
php artisan make:resource JamaahResource

# Make seeder
php artisan make:seeder JamaahSeeder

# Make factory
php artisan make:factory JamaahFactory

# Make middleware
php artisan make:middleware CheckRole
```

### Cache Commands
```bash
# Clear all cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Optimize application
php artisan optimize

# Clear optimization
php artisan optimize:clear
```

### Route Commands
```bash
# List all routes
php artisan route:list

# List API routes only
php artisan route:list --path=api

# Cache routes
php artisan route:cache
```

## Database Query Examples (Tinker)

### Travel Packages
```php
// Get all packages
$packages = \App\Models\TravelPackage::all();

// Get active packages
$active = \App\Models\TravelPackage::where('status', 'Aktif')->get();

// Get package with jamaahs
$package = \App\Models\TravelPackage::with('jamaahs')->find(1);

// Create new package
\App\Models\TravelPackage::create([
    'name' => 'Umroh Premium',
    'duration' => '10 Hari',
    'price' => 40000000,
    'quota' => 30,
    'booked' => 0,
    'available' => 30,
    'departure_date' => '2026-06-15',
    'status' => 'Aktif',
    'rating' => 4.5
]);
```

### Jamaahs
```php
// Get all jamaahs
$jamaahs = \App\Models\Jamaah::all();

// Get jamaah with relations
$jamaah = \App\Models\Jamaah::with(['user', 'travelPackage', 'tabungan', 'payments'])->find(1);

// Get active jamaahs
$active = \App\Models\Jamaah::where('status', 'Aktif')->get();

// Count jamaahs by status
$counts = \App\Models\Jamaah::selectRaw('status, count(*) as total')
    ->groupBy('status')
    ->get();
```

### Tabungans
```php
// Get all tabungans
$tabungans = \App\Models\Tabungan::all();

// Get tabungan with progress > 50%
$tabungans = \App\Models\Tabungan::where('progress', '>', 50)->get();

// Get tabungan with relations
$tabungan = \App\Models\Tabungan::with(['jamaah', 'travelPackage', 'payments'])->find(1);

// Calculate total tabungan
$total = \App\Models\Tabungan::sum('current_amount');
```

### Payments
```php
// Get pending payments
$pending = \App\Models\Payment::where('status', 'Pending')->get();

// Get payments for specific jamaah
$payments = \App\Models\Payment::where('jamaah_id', 1)->get();

// Get payments with jamaah and tabungan
$payments = \App\Models\Payment::with(['jamaah', 'tabungan'])->get();

// Total payment amount this month
$total = \App\Models\Payment::whereMonth('payment_date', now()->month)
    ->where('status', 'Approved')
    ->sum('amount');
```

### Documents
```php
// Get incomplete documents
$incomplete = \App\Models\Document::where('status', 'Perlu Upload')->get();

// Get documents for jamaah
$docs = \App\Models\Document::where('jamaah_id', 1)->get();

// Count documents by status
$counts = \App\Models\Document::selectRaw('status, count(*) as total')
    ->groupBy('status')
    ->get();
```

### Consultations
```php
// Get pending consultations
$pending = \App\Models\Consultation::where('status', 'Pending')->get();

// Get consultation with relations
$consultation = \App\Models\Consultation::with(['jamaah', 'travelPackage', 'handler'])->find(1);

// Assign consultation to admin
$consultation = \App\Models\Consultation::find(1);
$consultation->update([
    'handled_by' => 1,
    'status' => 'In Progress'
]);
```

## Testing Scenarios

### Scenario 1: Create Complete Jamaah Flow
```php
// 1. Create user
$user = \App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password')
]);

// 2. Create jamaah
$jamaah = \App\Models\Jamaah::create([
    'user_id' => $user->id,
    'name' => 'Test Jamaah',
    'nik' => '1234567890123456',
    'email' => 'jamaah@example.com',
    'phone' => '081234567890',
    'address' => 'Test Address',
    'registration_date' => now(),
    'travel_package_id' => 1,
    'status' => 'Aktif'
]);

// 3. Create tabungan
$tabungan = \App\Models\Tabungan::create([
    'jamaah_id' => $jamaah->id,
    'travel_package_id' => 1,
    'target_amount' => 35000000,
    'current_amount' => 0,
    'progress' => 0,
    'status' => 'Berjalan',
    'monthly_payment' => 1000000
]);

// 4. Create payment
$payment = \App\Models\Payment::create([
    'tabungan_id' => $tabungan->id,
    'jamaah_id' => $jamaah->id,
    'amount' => 1000000,
    'payment_date' => now(),
    'payment_method' => 'Transfer BCA',
    'status' => 'Pending'
]);
```

### Scenario 2: Verify Payment & Update Tabungan
```php
// 1. Find payment
$payment = \App\Models\Payment::find(1);

// 2. Verify payment
$payment->update([
    'status' => 'Approved',
    'verified_by' => 1,
    'verified_at' => now()
]);

// 3. Update tabungan
$tabungan = $payment->tabungan;
$tabungan->current_amount += $payment->amount;
$tabungan->progress = ($tabungan->current_amount / $tabungan->target_amount) * 100;
$tabungan->last_payment_date = $payment->payment_date;
$tabungan->save();

// 4. Check if lunas
if ($tabungan->progress >= 100) {
    $tabungan->update(['status' => 'Lunas']);
    $tabungan->jamaah->update(['status' => 'Lunas']);
}
```

### Scenario 3: Get Dashboard Stats
```php
// Total jamaah
$totalJamaah = \App\Models\Jamaah::count();

// Total tabungan collected
$totalTabungan = \App\Models\Tabungan::sum('current_amount');

// Active packages
$activePackages = \App\Models\TravelPackage::where('status', 'Aktif')->count();

// Pending payments
$pendingPayments = \App\Models\Payment::where('status', 'Pending')->count();

// Incomplete documents
$incompleteDocuments = \App\Models\Document::where('status', 'Perlu Upload')->count();

// Recent activities
$recentPayments = \App\Models\Payment::with('jamaah')
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();
```

## Git Commands (Optional)

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: implement database structure with 7 tables and models"

# View status
git status

# View log
git log --oneline
```

## Server Commands

```bash
# Start development server
php artisan serve

# Start on specific port
php artisan serve --port=8080

# Start on specific host
php artisan serve --host=0.0.0.0 --port=8080
```

## Maintenance Commands

```bash
# Put application in maintenance mode
php artisan down

# Bring application back up
php artisan up

# Generate application key
php artisan key:generate

# Create symbolic link for storage
php artisan storage:link
```

## Useful Queries

### Get Statistics
```php
// Jamaah statistics
[
    'total' => \App\Models\Jamaah::count(),
    'aktif' => \App\Models\Jamaah::where('status', 'Aktif')->count(),
    'lunas' => \App\Models\Jamaah::where('status', 'Lunas')->count(),
    'tertunggak' => \App\Models\Jamaah::where('status', 'Tertunggak')->count(),
]

// Revenue statistics
[
    'total_target' => \App\Models\Tabungan::sum('target_amount'),
    'total_collected' => \App\Models\Tabungan::sum('current_amount'),
    'pending_payments' => \App\Models\Payment::where('status', 'Pending')->sum('amount'),
    'approved_today' => \App\Models\Payment::where('status', 'Approved')
        ->whereDate('verified_at', today())
        ->sum('amount'),
]

// Package statistics
\App\Models\TravelPackage::select('name', 'quota', 'booked', 'available')
    ->where('status', 'Aktif')
    ->get()
```

## Remember!

- Always backup database before running `migrate:fresh`
- Use transactions for complex operations
- Test queries in tinker before implementing
- Keep documentation updated
- Follow Laravel naming conventions
