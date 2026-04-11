<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Tabungan;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['jamaah']);
        
        if ($request->has('jamaah_id')) {
            $query->where('jamaah_id', $request->jamaah_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $payments = $query->latest()->get();
        return PaymentResource::collection($payments);
    }

    public function show($id)
    {
        $payment = Payment::with(['jamaah'])->findOrFail($id);
        return new PaymentResource($payment);
    }

    public function store(Request $request)
    {
        // Jika admin input manual, FE bisa mengirim type: manual atau payment_method: Cash
        $isManual = $request->input('type') === 'manual' || strtolower($request->input('payment_method')) === 'cash';

        if ($isManual) {
            $validated = $request->validate([
                'jamaah_id' => 'required|exists:jamaahs,id',
                'amount' => 'required|numeric|min:1000',
                'note' => 'nullable|string',
            ]);

            // Cari tabungan aktif (status Berjalan sesuai enum DB)
            $tabungan = Tabungan::where('jamaah_id', $validated['jamaah_id'])
                ->where('status', 'Berjalan')
                ->first();
            if (!$tabungan) {
                return response()->json(['message' => 'Tabungan aktif tidak ditemukan untuk jamaah ini'], 422);
            }

            // Buat record payment
            $paymentData = [
                'tabungan_id' => $tabungan->id,
                'jamaah_id' => $validated['jamaah_id'],
                'amount' => $validated['amount'],
                'payment_date' => now()->toDateString(),
                'payment_method' => 'Cash',
                'status' => 'Approved',
                'notes' => $validated['note'] ?? null,
            ];

            $payment = Payment::create($paymentData);

            // Update saldo tabungan dan progress
            $tabungan->current_amount += $validated['amount'];
            $tabungan->progress = $tabungan->target_amount > 0
                ? min(100, round(($tabungan->current_amount / $tabungan->target_amount) * 100))
                : 0;
            $tabungan->last_payment_date = now()->toDateString();
            $tabungan->next_payment_date = now()->addDays(30)->toDateString();

            // Jika sudah lunas, update status tabungan dan jamaah
            if ($tabungan->current_amount >= $tabungan->target_amount) {
                $tabungan->status = 'Lunas';
                $jamaah = $tabungan->jamaah;
                if ($jamaah) {
                    $jamaah->status = 'Lunas';
                    $jamaah->save();
                }
            }
            $tabungan->save();

            return new PaymentResource($payment);
        } else {
            // Default: pembayaran reguler (jamaah upload bukti)
            $validated = $request->validate([
                'jamaah_id' => 'required|exists:jamaahs,id',
                'amount' => 'required|numeric|min:0',
                'payment_date' => 'required|date',
                'payment_method' => 'nullable|string|max:50',
                'status' => 'nullable|in:pending,success,failed',
                'proof_file' => 'nullable|string',
            ]);

            $payment = Payment::create($validated);
            return new PaymentResource($payment);
        }
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        
        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'payment_date' => 'sometimes|date',
            'payment_method' => 'nullable|string|max:50',
            'status' => 'sometimes|in:pending,success,failed',
            'proof_file' => 'nullable|string',
        ]);

        $payment->update($validated);
        return new PaymentResource($payment);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        
        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
