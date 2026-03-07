<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jamaah;
use App\Models\TravelPackage;
use App\Models\Payment;
use App\Models\Tabungan;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for admin
     */
    public function adminStats()
    {
        $stats = [
            'total_jamaah' => Jamaah::count(),
            'active_jamaah' => Jamaah::where('status', 'Aktif')->count(),
            'total_packages' => TravelPackage::count(),
            'active_packages' => TravelPackage::where('status', 'Aktif')->count(),
            'total_revenue' => Payment::where('status', 'Approved')->sum('amount'),
            'pending_payments' => Payment::where('status', 'Pending')->count(),
            'pending_documents' => Document::where('status', 'Perlu Upload')->count(),
            'completed_documents' => Document::where('status', 'Lengkap')->count(),
        ];

        // Monthly revenue chart data
        $monthlyRevenue = Payment::where('status', 'Approved')
            ->selectRaw('MONTH(payment_date) as month, SUM(amount) as total')
            ->whereYear('payment_date', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'revenue' => (float) $item->total,
                ];
            });

        // Package distribution
        $packageStats = Jamaah::select('travel_package_id', DB::raw('count(*) as total'))
            ->with('travelPackage:id,name')
            ->groupBy('travel_package_id')
            ->get()
            ->map(function ($item) {
                return [
                    'package' => $item->travelPackage ? $item->travelPackage->name : 'Belum Pilih',
                    'total' => $item->total,
                ];
            });

        // Recent activities
        $recentActivities = Payment::with('jamaah:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'type' => 'payment',
                    'title' => 'Pembayaran dari ' . $payment->jamaah->name,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'date' => $payment->payment_date->format('d M Y'),
                    'time' => $payment->payment_date->format('H:i'),
                ];
            });

        // Pending payment approvals
        $pendingPayments = Payment::with('jamaah:id,name')
            ->where('status', 'Pending')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'jamaah_name' => $payment->jamaah->name,
                    'amount' => $payment->amount,
                    'method' => $payment->payment_method,
                    'date' => $payment->payment_date->format('d M Y'),
                    'proof_file' => $payment->proof_file,
                ];
            });

        return response()->json([
            'stats' => $stats,
            'monthly_revenue' => $monthlyRevenue,
            'package_stats' => $packageStats,
            'recent_activities' => $recentActivities,
            'pending_payments' => $pendingPayments,
        ]);
    }

    /**
     * Get dashboard data for jamaah
     */
    public function jamaahDashboard(Request $request)
    {
        $user = $request->user();
        $jamaah = Jamaah::where('user_id', $user->id)
            ->with(['travelPackage', 'tabungan', 'documents', 'payments', 'consultations'])
            ->first();

        if (!$jamaah) {
            return response()->json([
                'message' => 'Jamaah profile not found',
            ], 404);
        }

        // Calculate progress
        $tabungan = $jamaah->tabungan;
        $progress = [
            'registration' => 'completed',
            'package_selection' => $jamaah->travel_package_id ? 'completed' : 'pending',
            'documents' => $jamaah->documents->where('status', 'Lengkap')->count() >= 5 ? 'completed' : 'in_progress',
            'payment' => $tabungan && $tabungan->progress >= 100 ? 'completed' : 'in_progress',
            'departure' => $jamaah->status === 'Lunas' ? 'ready' : 'waiting',
        ];

        // Recent activities from payments
        $recentActivities = $jamaah->payments()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'title' => $payment->title,
                    'date' => $payment->date,
                    'time' => $payment->time,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                ];
            });

        // Upcoming schedule
        $upcomingSchedule = [];
        if ($tabungan && $tabungan->nextPaymentDate) {
            $upcomingSchedule[] = [
                'type' => 'payment',
                'title' => 'Pembayaran Cicilan',
                'date' => $tabungan->nextPaymentDate,
                'amount' => $tabungan->paymentAmount,
            ];
        }

        // Document alerts
        $pendingDocuments = $jamaah->documents()
            ->where('status', 'Perlu Upload')
            ->get()
            ->map(function ($doc) {
                return [
                    'name' => $doc->name,
                    'status' => $doc->status,
                ];
            });

        return response()->json([
            'jamaah' => $jamaah,
            'progress' => $progress,
            'recent_activities' => $recentActivities,
            'upcoming_schedule' => $upcomingSchedule,
            'pending_documents' => $pendingDocuments,
            'stats' => [
                'tabungan_progress' => $tabungan ? $tabungan->progress : 0,
                'documents_completed' => $jamaah->documents->where('status', 'Lengkap')->count(),
                'total_payments' => $jamaah->payments->count(),
                'days_until_departure' => $jamaah->travelPackage ? now()->diffInDays($jamaah->travelPackage->departure_date) : null,
            ],
        ]);
    }
}
