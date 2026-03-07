# 🚀 Recommended API Endpoints

Berikut adalah rekomendasi struktur API endpoints yang bisa dibuat berdasarkan database yang sudah ada.

## 🔐 Authentication Endpoints

### Public Routes
```
POST   /api/register           - Register new user
POST   /api/login              - Login user
POST   /api/forgot-password    - Request password reset
POST   /api/reset-password     - Reset password
```

### Protected Routes (Sanctum)
```
POST   /api/logout             - Logout user
GET    /api/user               - Get authenticated user
PUT    /api/user/profile       - Update user profile
POST   /api/user/two-factor    - Enable 2FA
```

## 👤 Jamaah Endpoints

### Admin Access
```
GET    /api/jamaahs                        - List all jamaahs
POST   /api/jamaahs                        - Create jamaah
GET    /api/jamaahs/{id}                   - Get jamaah detail
PUT    /api/jamaahs/{id}                   - Update jamaah
DELETE /api/jamaahs/{id}                   - Delete jamaah
GET    /api/jamaahs/{id}/tabungan          - Get jamaah tabungan
GET    /api/jamaahs/{id}/payments          - Get jamaah payments
GET    /api/jamaahs/{id}/documents         - Get jamaah documents
GET    /api/jamaahs/{id}/consultations     - Get jamaah consultations
```

### Jamaah Access
```
GET    /api/jamaah/profile                 - Get own profile
PUT    /api/jamaah/profile                 - Update own profile
GET    /api/jamaah/dashboard               - Dashboard data
```

## 🏖️ Travel Package Endpoints

### Public Access
```
GET    /api/packages                       - List all packages
GET    /api/packages/{id}                  - Get package detail
GET    /api/packages/featured              - Get featured packages
GET    /api/packages/search                - Search packages
```

### Admin Access
```
POST   /api/packages                       - Create package
PUT    /api/packages/{id}                  - Update package
DELETE /api/packages/{id}                  - Delete package
GET    /api/packages/{id}/jamaahs          - Get package jamaahs
GET    /api/packages/{id}/stats            - Get package statistics
```

## 💰 Tabungan Endpoints

### Jamaah Access
```
GET    /api/tabungan                       - Get own tabungan
GET    /api/tabungan/progress              - Get progress detail
GET    /api/tabungan/history               - Get payment history
```

### Admin Access
```
GET    /api/tabungans                      - List all tabungans
GET    /api/tabungans/{id}                 - Get tabungan detail
PUT    /api/tabungans/{id}                 - Update tabungan
GET    /api/tabungans/stats                - Get tabungan statistics
GET    /api/tabungans/pending              - Get pending tabungans
```

## 💳 Payment Endpoints

### Jamaah Access
```
POST   /api/payments                       - Create payment
GET    /api/payments                       - Get own payments
GET    /api/payments/{id}                  - Get payment detail
POST   /api/payments/{id}/upload-receipt  - Upload receipt
```

### Admin Access
```
GET    /api/payments/all                   - List all payments
GET    /api/payments/pending               - Get pending payments
PUT    /api/payments/{id}/approve          - Approve payment
PUT    /api/payments/{id}/reject           - Reject payment
GET    /api/payments/stats                 - Payment statistics
GET    /api/payments/export                - Export payments
```

## 📄 Document Endpoints

### Jamaah Access
```
GET    /api/documents                      - Get own documents
POST   /api/documents                      - Upload document
GET    /api/documents/{id}                 - Get document detail
PUT    /api/documents/{id}                 - Update document
DELETE /api/documents/{id}                 - Delete document
```

### Admin Access
```
GET    /api/documents/all                  - List all documents
GET    /api/documents/pending              - Get pending documents
PUT    /api/documents/{id}/verify          - Verify document
PUT    /api/documents/{id}/reject          - Reject document
GET    /api/documents/stats                - Document statistics
```

## 🏨 Accommodation Endpoints

### Public Access
```
GET    /api/accommodations                 - List all accommodations
GET    /api/accommodations/{id}            - Get accommodation detail
GET    /api/accommodations/search          - Search accommodations
GET    /api/accommodations/by-type/{type}  - Get by type
```

### Admin Access
```
POST   /api/accommodations                 - Create accommodation
PUT    /api/accommodations/{id}            - Update accommodation
DELETE /api/accommodations/{id}            - Delete accommodation
```

## 💬 Consultation Endpoints

### Public/Jamaah Access
```
POST   /api/consultations                  - Create consultation
GET    /api/consultations                  - Get own consultations
GET    /api/consultations/{id}             - Get consultation detail
```

### Admin Access
```
GET    /api/consultations/all              - List all consultations
GET    /api/consultations/pending          - Get pending consultations
PUT    /api/consultations/{id}/assign      - Assign to admin
PUT    /api/consultations/{id}/respond     - Respond to consultation
PUT    /api/consultations/{id}/close       - Close consultation
GET    /api/consultations/stats            - Consultation statistics
```

## 📊 Dashboard & Statistics Endpoints

### Jamaah Dashboard
```
GET    /api/dashboard/jamaah               - Jamaah dashboard data
```

**Response Example:**
```json
{
  "profile": {...},
  "tabungan": {...},
  "package": {...},
  "recent_payments": [...],
  "documents_status": {...},
  "next_payment_date": "2026-03-10"
}
```

### Admin Dashboard
```
GET    /api/dashboard/admin                - Admin dashboard data
GET    /api/dashboard/stats                - Overall statistics
GET    /api/dashboard/recent-activities    - Recent activities
GET    /api/dashboard/pending-tasks        - Pending tasks
```

**Response Example:**
```json
{
  "stats": {
    "total_jamaahs": 156,
    "total_tabungan": 4200000000,
    "active_packages": 8,
    "pending_payments": 12
  },
  "recent_activities": [...],
  "pending_tasks": {
    "payments": 12,
    "documents": 8,
    "consultations": 5
  }
}
```

## 📈 Report Endpoints

### Admin Reports
```
GET    /api/reports/revenue                - Revenue report
GET    /api/reports/jamaahs                - Jamaah report
GET    /api/reports/packages               - Package report
GET    /api/reports/export                 - Export all reports
```

## 🔍 Search & Filter Endpoints

### General Search
```
GET    /api/search?q=keyword               - Global search
GET    /api/jamaahs?status=Aktif           - Filter jamaahs
GET    /api/payments?status=Pending        - Filter payments
GET    /api/packages?min_price=30000000    - Filter packages
```

## 📤 File Upload Endpoints

```
POST   /api/upload/receipt                 - Upload payment receipt
POST   /api/upload/document                - Upload document
POST   /api/upload/profile-image           - Upload profile image
```

## 🔔 Notification Endpoints

```
GET    /api/notifications                  - Get notifications
PUT    /api/notifications/{id}/read        - Mark as read
DELETE /api/notifications/{id}             - Delete notification
POST   /api/notifications/read-all         - Mark all as read
```

## 📝 Example Request/Response

### Create Payment (Jamaah)
**Request:**
```http
POST /api/payments
Content-Type: application/json
Authorization: Bearer {token}

{
  "amount": 1000000,
  "payment_date": "2026-03-07",
  "payment_method": "Transfer BCA",
  "receipt": "base64_encoded_image",
  "notes": "Pembayaran bulan Maret"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": 1,
    "amount": 1000000,
    "status": "Pending",
    "payment_date": "2026-03-07",
    "payment_method": "Transfer BCA",
    "receipt_path": "uploads/receipts/123456.jpg",
    "created_at": "2026-03-07T10:30:00Z"
  }
}
```

### Approve Payment (Admin)
**Request:**
```http
PUT /api/payments/1/approve
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "notes": "Pembayaran diverifikasi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment approved successfully",
  "data": {
    "id": 1,
    "status": "Approved",
    "verified_by": 1,
    "verified_at": "2026-03-07T11:00:00Z",
    "tabungan": {
      "current_amount": 1000000,
      "progress": 2.86
    }
  }
}
```

### Get Dashboard (Jamaah)
**Request:**
```http
GET /api/dashboard/jamaah
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "Ahmad Subarjo",
      "nik": "3201234567890001",
      "status": "Aktif"
    },
    "tabungan": {
      "target_amount": 35000000,
      "current_amount": 18500000,
      "progress": 52.86,
      "status": "Berjalan",
      "next_payment_date": "2026-04-10"
    },
    "package": {
      "name": "Umroh Plus Turki",
      "departure_date": "2026-03-15",
      "duration": "12 Hari"
    },
    "recent_payments": [...],
    "documents": {
      "total": 5,
      "complete": 3,
      "pending": 2
    }
  }
}
```

## 🛡️ Middleware Recommendations

### Auth Middleware
```php
Route::middleware('auth:sanctum')->group(function() {
    // Protected routes
});
```

### Role Middleware
```php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function() {
    // Admin only routes
});

Route::middleware(['auth:sanctum', 'role:jamaah'])->group(function() {
    // Jamaah only routes
});
```

### Throttle Middleware
```php
Route::middleware('throttle:60,1')->group(function() {
    // Rate limited routes (60 requests per minute)
});
```

## 📦 Response Format Standard

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

## 🔐 API Security Recommendations

1. **Use Laravel Sanctum for API authentication**
2. **Implement rate limiting**
3. **Validate all inputs**
4. **Use HTTPS in production**
5. **Implement CORS properly**
6. **Log all sensitive operations**
7. **Use API versioning (v1, v2, etc.)**

## 📝 Next Steps

1. Create controllers for each endpoint
2. Implement request validation (Form Requests)
3. Create API resources for response formatting
4. Add middleware for authentication & authorization
5. Write API tests
6. Generate API documentation (Swagger/OpenAPI)

## 🔗 Useful Laravel Commands

```bash
# Create controller
php artisan make:controller Api/JamaahController --api

# Create request validation
php artisan make:request StorePaymentRequest

# Create resource
php artisan make:resource JamaahResource

# List all routes
php artisan route:list --path=api
```

---

This API structure provides a complete RESTful API for the Niat Umroh application based on the existing database structure.
