<?php

use App\Http\Controllers\Api\TravelPackageController;
use App\Http\Controllers\Api\AccommodationController;
use App\Http\Controllers\Api\JamaahController;
use App\Http\Controllers\Api\TabunganController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

// Authentication routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard routes
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats']);
    Route::get('/dashboard/jamaah', [DashboardController::class, 'jamaahDashboard']);
    Route::get('/notifications', [NotificationController::class, 'index']);

    // Booking routes
    Route::post('/bookings', [BookingController::class, 'bookPackage']);
    Route::post('/bookings/{jamaahId}/cancel', [BookingController::class, 'cancelBooking']);
    Route::put('/bookings/{jamaahId}/change', [BookingController::class, 'changePackage']);
    
    // Upload routes
    Route::post('/uploads/document', [UploadController::class, 'uploadDocument']);
    Route::post('/uploads/payment', [UploadController::class, 'uploadPaymentProof']);
    Route::post('/payments/{paymentId}/approve', [UploadController::class, 'approvePayment']);
    Route::post('/payments/{paymentId}/reject', [UploadController::class, 'rejectPayment']);
    Route::post('/documents/{documentId}/verify', [UploadController::class, 'verifyDocument']);
    Route::post('/documents/{documentId}/reject', [UploadController::class, 'rejectDocument']);
    Route::get('/documents/{documentId}/download', [UploadController::class, 'downloadDocument']);
    Route::get('/payments/{paymentId}/download', [UploadController::class, 'downloadPaymentProof']);

    // Consultation routes (additional)
    Route::post('/consultations/{consultationId}/respond', [ConsultationController::class, 'respond']);
    Route::post('/consultations/{consultationId}/close', [ConsultationController::class, 'close']);

    // Statistics routes
    Route::get('/statistics/summary', [StatisticsController::class, 'summary']);
    Route::get('/statistics/revenue', [StatisticsController::class, 'revenue']);
    Route::get('/statistics/packages', [StatisticsController::class, 'packages']);
    Route::get('/statistics/tabungan', [StatisticsController::class, 'tabungan']);
    Route::get('/statistics/documents', [StatisticsController::class, 'documents']);
    Route::get('/statistics/export', [StatisticsController::class, 'export']);
});

// Public routes - no authentication required
Route::get('/packages/available', [BookingController::class, 'availablePackages']);
Route::apiResource('packages', TravelPackageController::class);
Route::apiResource('accommodations', AccommodationController::class);
Route::apiResource('jamaahs', JamaahController::class);
Route::apiResource('tabungans', TabunganController::class);
Route::apiResource('documents', DocumentController::class);
Route::apiResource('consultations', ConsultationController::class);
Route::apiResource('payments', PaymentController::class);
