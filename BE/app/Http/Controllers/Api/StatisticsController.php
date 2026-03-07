<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jamaah;
use App\Models\TravelPackage;
use App\Models\Payment;
use App\Models\Tabungan;
use App\Models\Document;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * Get statistics summary
     */
    public function summary()
    {
        return response()->json([
            'jamaah' => [
                'total' => Jamaah::count(),
                'aktif' => Jamaah::where('status', 'Aktif')->count(),
                'menunggu' => Jamaah::where('status', 'Menunggu')->count(),
                'lunas' => Jamaah::where('status', 'Lunas')->count(),
                'tertunggak' => Jamaah::where('status', 'Tertunggak')->count(),
                'non_aktif' => Jamaah::where('status', 'Non-Aktif')->count(),
            ],
            'packages' => [
                'total' => TravelPackage::count(),
                'aktif' => TravelPackage::where('status', 'Aktif')->count(),
                'coming_soon' => TravelPackage::where('status', 'Coming Soon')->count(),
                'total_seats' => TravelPackage::sum('quota'),
                'booked_seats' => TravelPackage::sum('booked'),
                'available_seats' => DB::raw('SUM(quota - booked)'),
            ],
            'financial' => [
                'total_revenue' => Payment::where('status', 'Approved')->sum('amount'),
                'this_month' => Payment::where('status', 'Approved')
                    ->whereMonth('payment_date', now()->month)
                    ->whereYear('payment_date', now()->year)
                    ->sum('amount'),
                'pending_amount' => Payment::where('status', 'Pending')->sum('amount'),
                'total_target' => Tabungan::sum('target_amount'),
                'total_collected' => Tabungan::sum('current_amount'),
            ],
            'documents' => [
                'total' => Document::count(),
                'lengkap' => Document::where('status', 'Lengkap')->count(),
                'perlu_upload' => Document::where('status', 'Perlu Upload')->count(),
                'dalam_review' => Document::where('status', 'Dalam Review')->count(),
                'ditolak' => Document::where('status', 'Ditolak')->count(),
            ],
            'consultations' => [
                'total' => Consultation::count(),
                'pending' => Consultation::where('status', 'pending')->count(),
                'answered' => Consultation::where('status', 'answered')->count(),
                'closed' => Consultation::where('status', 'closed')->count(),
            ],
        ]);
    }

    /**
     * Get revenue statistics with chart data
     */
    public function revenue(Request $request)
    {
        $year = $request->get('year', now()->year);

        // Monthly revenue
        $monthlyRevenue = Payment::where('status', 'Approved')
            ->selectRaw('MONTH(payment_date) as month, SUM(amount) as total, COUNT(*) as count')
            ->whereYear('payment_date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('F', mktime(0, 0, 0, $item->month, 1)),
                    'month_short' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'revenue' => (float) $item->total,
                    'transactions' => $item->count,
                ];
            });

        // Revenue by payment method
        $revenueByMethod = Payment::where('status', 'Approved')
            ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
            ->whereYear('payment_date', $year)
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => $item->payment_method,
                    'revenue' => (float) $item->total,
                    'transactions' => $item->count,
                ];
            });

        // Top paying jamaah
        $topJamaah = Jamaah::select('jamaahs.*')
            ->withCount(['payments as total_paid' => function ($query) {
                $query->select(DB::raw('SUM(amount)'))
                    ->where('status', 'Approved');
            }])
            ->orderByDesc('total_paid')
            ->limit(10)
            ->get()
            ->map(function ($jamaah) {
                return [
                    'id' => $jamaah->id,
                    'name' => $jamaah->name,
                    'total_paid' => $jamaah->total_paid ?? 0,
                ];
            });

        return response()->json([
            'monthly_revenue' => $monthlyRevenue,
            'revenue_by_method' => $revenueByMethod,
            'top_jamaah' => $topJamaah,
            'summary' => [
                'total_year' => Payment::where('status', 'Approved')
                    ->whereYear('payment_date', $year)
                    ->sum('amount'),
                'average_transaction' => Payment::where('status', 'Approved')
                    ->whereYear('payment_date', $year)
                    ->avg('amount'),
                'total_transactions' => Payment::where('status', 'Approved')
                    ->whereYear('payment_date', $year)
                    ->count(),
            ],
        ]);
    }

    /**
     * Get package statistics
     */
    public function packages()
    {
        // Package booking statistics
        $packageStats = TravelPackage::select(
            'travel_packages.*',
            DB::raw('COUNT(jamaahs.id) as jamaah_count'),
            DB::raw('SUM(CASE WHEN jamaahs.status = "Lunas" THEN 1 ELSE 0 END) as lunas_count')
        )
            ->leftJoin('jamaahs', 'travel_packages.id', '=', 'jamaahs.travel_package_id')
            ->groupBy('travel_packages.id')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'quota' => $package->quota,
                    'booked' => $package->booked,
                    'available' => $package->quota - $package->booked,
                    'jamaah_count' => $package->jamaah_count,
                    'lunas_count' => $package->lunas_count,
                    'utilization' => round(($package->booked / $package->quota) * 100, 2),
                    'price' => $package->price,
                    'revenue' => $package->jamaah_count * $package->price,
                ];
            });

        // Most popular packages
        $popularPackages = TravelPackage::withCount('jamaahs')
            ->orderByDesc('jamaahs_count')
            ->limit(5)
            ->get()
            ->map(function ($package) {
                return [
                    'name' => $package->name,
                    'bookings' => $package->jamaahs_count,
                ];
            });

        return response()->json([
            'package_stats' => $packageStats,
            'popular_packages' => $popularPackages,
        ]);
    }

    /**
     * Get tabungan/payment statistics
     */
    public function tabungan()
    {
        // Tabungan status distribution
        $statusDistribution = Tabungan::selectRaw('status, COUNT(*) as count, SUM(current_amount) as total')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                    'total_amount' => (float) $item->total,
                ];
            });

        // Average progress
        $averageProgress = Tabungan::avg('progress');

        // Collection rate (this month vs target)
        $thisMonthCollection = Payment::where('status', 'Approved')
            ->whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year)
            ->sum('amount');

        $targetMonthly = Tabungan::where('status', 'Berjalan')->sum('monthly_payment');

        return response()->json([
            'status_distribution' => $statusDistribution,
            'average_progress' => round($averageProgress, 2),
            'this_month' => [
                'collected' => (float) $thisMonthCollection,
                'target' => (float) $targetMonthly,
                'percentage' => $targetMonthly > 0 ? round(($thisMonthCollection / $targetMonthly) * 100, 2) : 0,
            ],
            'summary' => [
                'total_tabungan' => Tabungan::count(),
                'active' => Tabungan::where('status', 'Berjalan')->count(),
                'completed' => Tabungan::where('status', 'Lunas')->count(),
                'overdue' => Tabungan::where('status', 'Tertunggak')->count(),
            ],
        ]);
    }

    /**
     * Get document completion statistics
     */
    public function documents()
    {
        $stats = [
            'completion_rate' => [
                'total_required' => Jamaah::count() * 5, // Assuming 5 documents per jamaah
                'completed' => Document::where('status', 'Lengkap')->count(),
                'percentage' => round((Document::where('status', 'Lengkap')->count() / (Jamaah::count() * 5)) * 100, 2),
            ],
            'by_type' => Document::selectRaw('document_type, COUNT(*) as total, 
                SUM(CASE WHEN status = "Lengkap" THEN 1 ELSE 0 END) as completed')
                ->groupBy('document_type')
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => $item->document_type,
                        'total' => $item->total,
                        'completed' => $item->completed,
                        'completion_rate' => round(($item->completed / $item->total) * 100, 2),
                    ];
                }),
            'by_status' => Document::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->map(function ($item) {
                    return [
                        'status' => $item->status,
                        'count' => $item->count,
                    ];
                }),
        ];

        return response()->json($stats);
    }

    /**
     * Export statistics to CSV
     */
    public function export(Request $request)
    {
        $type = strtolower((string) $request->get('type', 'jamaah'));

        $supportedTypes = ['jamaah', 'payments', 'tabungan', 'packages', 'accommodations'];
        if (!in_array($type, $supportedTypes, true)) {
            $type = 'jamaah';
        }

        $filename = $type . '_statistics_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($type) {
            $file = fopen('php://output', 'w');

            if ($type === 'jamaah') {
                fputcsv($file, ['ID', 'Name', 'NIK', 'Email', 'Phone', 'Package', 'Status', 'Registration Date']);
                Jamaah::with('travelPackage')->chunk(100, function ($jamaahs) use ($file) {
                    foreach ($jamaahs as $jamaah) {
                        fputcsv($file, [
                            $jamaah->id,
                            $jamaah->name,
                            $jamaah->nik,
                            $jamaah->email,
                            $jamaah->phone,
                            $jamaah->travelPackage?->name ?? '-',
                            $jamaah->status,
                            $jamaah->registration_date?->format('Y-m-d') ?? '-',
                        ]);
                    }
                });
            } elseif ($type === 'payments') {
                fputcsv($file, ['ID', 'Jamaah', 'Amount', 'Method', 'Date', 'Status']);
                Payment::with('jamaah')->chunk(100, function ($payments) use ($file) {
                    foreach ($payments as $payment) {
                        fputcsv($file, [
                            $payment->id,
                            $payment->jamaah?->name ?? '-',
                            $payment->amount,
                            $payment->payment_method,
                            $payment->payment_date?->format('Y-m-d') ?? '-',
                            $payment->status,
                        ]);
                    }
                });
            } elseif ($type === 'tabungan') {
                fputcsv($file, ['ID', 'Jamaah', 'Paket', 'Target', 'Saldo', 'Progress', 'Status', 'Last Payment', 'Next Payment']);
                Tabungan::with(['jamaah', 'travelPackage'])->chunk(100, function ($tabungans) use ($file) {
                    foreach ($tabungans as $tabungan) {
                        fputcsv($file, [
                            $tabungan->id,
                            $tabungan->jamaah?->name ?? '-',
                            $tabungan->travelPackage?->name ?? '-',
                            $tabungan->target_amount,
                            $tabungan->current_amount,
                            $tabungan->progress,
                            $tabungan->status,
                            $tabungan->last_payment_date?->format('Y-m-d') ?? '-',
                            $tabungan->next_payment_date?->format('Y-m-d') ?? '-',
                        ]);
                    }
                });
            } elseif ($type === 'packages') {
                fputcsv($file, ['ID', 'Nama Paket', 'Harga', 'Durasi', 'Tanggal Keberangkatan', 'Kuota', 'Booked', 'Available', 'Status', 'Rating']);
                TravelPackage::chunk(100, function ($packages) use ($file) {
                    foreach ($packages as $package) {
                        fputcsv($file, [
                            $package->id,
                            $package->name,
                            $package->price,
                            $package->duration,
                            $package->departure_date?->format('Y-m-d') ?? '-',
                            $package->quota,
                            $package->booked,
                            $package->available,
                            $package->status,
                            $package->rating,
                        ]);
                    }
                });
            } elseif ($type === 'accommodations') {
                fputcsv($file, ['ID', 'Nama Tempat', 'Tipe', 'Lokasi', 'Rating', 'Kapasitas', 'Harga', 'Status', 'Deskripsi']);
                \App\Models\Accommodation::chunk(100, function ($accommodations) use ($file) {
                    foreach ($accommodations as $accommodation) {
                        fputcsv($file, [
                            $accommodation->id,
                            $accommodation->name,
                            $accommodation->type,
                            $accommodation->location,
                            $accommodation->rating,
                            $accommodation->capacity,
                            $accommodation->price,
                            $accommodation->status,
                            $accommodation->description,
                        ]);
                    }
                });
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
