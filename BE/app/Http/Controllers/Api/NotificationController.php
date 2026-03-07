<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Document;
use App\Models\Jamaah;
use App\Models\Payment;
use App\Models\Tabungan;
use App\Models\TravelPackage;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = min(max((int) $request->get('limit', 10), 1), 50);

        $notifications = str($user->role)->lower()->toString() === 'admin'
            ? $this->adminNotifications($limit)
            : $this->jamaahNotifications($user->id, $limit);

        $sorted = $notifications
            ->sortByDesc(function ($item) {
                return $item['created_at'];
            })
            ->take($limit)
            ->values()
            ->map(function ($item) {
                $item['time'] = $item['created_at']->diffForHumans();
                $item['created_at'] = $item['created_at']->toISOString();
                return $item;
            });

        return response()->json([
            'data' => $sorted,
            'total' => $sorted->count(),
            'unread_count' => $sorted->where('unread', true)->count(),
        ]);
    }

    private function adminNotifications(int $limit)
    {
        $items = collect();

        Payment::with('jamaah')
            ->where(function ($q) {
                $q->where('status', 'Pending')->orWhere('status', 'pending');
            })
            ->latest('created_at')
            ->take($limit)
            ->get()
            ->each(function ($payment) use (&$items) {
                $amount = number_format((float) $payment->amount, 0, ',', '.');
                $items->push([
                    'id' => 'payment-' . $payment->id,
                    'type' => 'payment_pending',
                    'title' => 'Pembayaran Baru',
                    'message' => ($payment->jamaah->name ?? 'Jamaah') . " melakukan setoran Rp {$amount}",
                    'unread' => true,
                    'created_at' => $payment->created_at ?? now(),
                    'meta' => [
                        'payment_id' => $payment->id,
                    ],
                ]);
            });

        Document::with('jamaah')
            ->whereIn('status', ['Dalam Review', 'Perlu Upload', 'Pending', 'pending', 'Menunggu Verifikasi'])
            ->latest('updated_at')
            ->take($limit)
            ->get()
            ->each(function ($document) use (&$items) {
                $items->push([
                    'id' => 'document-' . $document->id,
                    'type' => 'document_review',
                    'title' => 'Dokumen Perlu Tindakan',
                    'message' => ($document->jamaah->name ?? 'Jamaah') . ' - ' . ($document->document_type ?? 'Dokumen'),
                    'unread' => true,
                    'created_at' => $document->updated_at ?? $document->created_at ?? now(),
                    'meta' => [
                        'document_id' => $document->id,
                    ],
                ]);
            });

        TravelPackage::query()
            ->where('quota', '>', 0)
            ->whereColumn('booked', '>=', 'quota')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->each(function ($pkg) use (&$items) {
                $items->push([
                    'id' => 'package-full-' . $pkg->id,
                    'type' => 'package_full',
                    'title' => 'Paket Penuh',
                    'message' => ($pkg->name ?? 'Paket') . ' sudah mencapai kuota.',
                    'unread' => true,
                    'created_at' => $pkg->updated_at ?? $pkg->created_at ?? now(),
                    'meta' => [
                        'package_id' => $pkg->id,
                    ],
                ]);
            });

        Consultation::query()
            ->where('status', 'pending')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->each(function ($consultation) use (&$items) {
                $items->push([
                    'id' => 'consultation-' . $consultation->id,
                    'type' => 'consultation_pending',
                    'title' => 'Konsultasi Baru',
                    'message' => 'Ada konsultasi baru yang menunggu respons.',
                    'unread' => false,
                    'created_at' => $consultation->created_at ?? now(),
                    'meta' => [
                        'consultation_id' => $consultation->id,
                    ],
                ]);
            });

        return $items;
    }

    private function jamaahNotifications(int $userId, int $limit)
    {
        $items = collect();

        $jamaah = Jamaah::where('user_id', $userId)->first();
        if (!$jamaah) {
            return $items;
        }

        Payment::query()
            ->where('jamaah_id', $jamaah->id)
            ->whereIn('status', ['Approved', 'Rejected', 'approved', 'rejected'])
            ->latest('updated_at')
            ->take($limit)
            ->get()
            ->each(function ($payment) use (&$items) {
                $isApproved = str($payment->status)->lower()->toString() === 'approved';
                $items->push([
                    'id' => 'jamaah-payment-' . $payment->id,
                    'type' => $isApproved ? 'payment_approved' : 'payment_rejected',
                    'title' => $isApproved ? 'Pembayaran Disetujui' : 'Pembayaran Ditolak',
                    'message' => 'Status pembayaran Anda: ' . ($payment->status ?? '-'),
                    'unread' => false,
                    'created_at' => $payment->updated_at ?? $payment->created_at ?? now(),
                    'meta' => [
                        'payment_id' => $payment->id,
                    ],
                ]);
            });

        Document::query()
            ->where('jamaah_id', $jamaah->id)
            ->whereIn('status', ['Ditolak', 'Perlu Upload', 'Dalam Review', 'Pending', 'pending'])
            ->latest('updated_at')
            ->take($limit)
            ->get()
            ->each(function ($document) use (&$items) {
                $items->push([
                    'id' => 'jamaah-document-' . $document->id,
                    'type' => 'document_status',
                    'title' => 'Update Dokumen',
                    'message' => ($document->document_type ?? 'Dokumen') . ' - ' . ($document->status ?? '-'),
                    'unread' => false,
                    'created_at' => $document->updated_at ?? $document->created_at ?? now(),
                    'meta' => [
                        'document_id' => $document->id,
                    ],
                ]);
            });

        Tabungan::query()
            ->where('jamaah_id', $jamaah->id)
            ->whereNotNull('next_payment_date')
            ->whereDate('next_payment_date', '<=', now()->addDays(7))
            ->latest('next_payment_date')
            ->take(1)
            ->get()
            ->each(function ($tabungan) use (&$items) {
                $items->push([
                    'id' => 'jamaah-tabungan-' . $tabungan->id,
                    'type' => 'payment_reminder',
                    'title' => 'Pengingat Pembayaran',
                    'message' => 'Jadwal pembayaran berikutnya: ' . $tabungan->next_payment_date?->format('d M Y'),
                    'unread' => false,
                    'created_at' => $tabungan->updated_at ?? $tabungan->created_at ?? now(),
                    'meta' => [
                        'tabungan_id' => $tabungan->id,
                    ],
                ]);
            });

        return $items;
    }
}
