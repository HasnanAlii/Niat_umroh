<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload document file
     */
    public function uploadDocument(Request $request)
    {
        $validated = $request->validate([
            'document_id' => 'required|exists:documents,id',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        $document = Document::findOrFail($validated['document_id']);

        // Delete old file if exists
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        // Store new file
        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        // Update document
        $document->file_path = $path;
        $document->status = 'Dalam Review';
        $document->save();

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => $document,
            'file_url' => Storage::url($path),
        ]);
    }

    /**
     * Upload payment proof
     */
    public function uploadPaymentProof(Request $request)
    {
        $validated = $request->validate([
            'jamaah_id' => 'required|exists:jamaahs,id',
            'tabungan_id' => 'required|exists:tabungans,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:Transfer BCA,Transfer BRI,Transfer Mandiri,Transfer BNI,Cash,E-Wallet',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        // Store file
        $file = $request->file('file');
        $path = $file->store('payment-proofs', 'public');

        // Create payment record
        $payment = Payment::create([
            'jamaah_id' => $validated['jamaah_id'],
            'tabungan_id' => $validated['tabungan_id'],
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'receipt_path' => $path,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Payment proof uploaded successfully. Waiting for admin approval.',
            'payment' => $payment,
            'file_url' => Storage::url($path),
        ], 201);
    }

    /**
     * Approve payment
     */
    public function approvePayment(Request $request, $paymentId)
    {
        $payment = Payment::findOrFail($paymentId);

        if ($payment->status !== 'Pending') {
            return response()->json([
                'message' => 'Payment already processed',
            ], 400);
        }

        $payment->status = 'Approved';
        $payment->save();

        // Update tabungan
        $tabungan = $payment->tabungan;
        if ($tabungan) {
            $tabungan->current_amount += $payment->amount;
            $tabungan->last_payment_date = $payment->payment_date;
            
            // Calculate next payment date
            $tabungan->next_payment_date = now()->addDays(30);
            
            // Update progress
            $tabungan->progress = min(100, round(($tabungan->current_amount / $tabungan->target_amount) * 100));
            
            // Update status if fully paid
            if ($tabungan->progress >= 100) {
                $tabungan->status = 'Lunas';
                
                // Update jamaah status
                $jamaah = $tabungan->jamaah;
                if ($jamaah) {
                    $jamaah->status = 'Lunas';
                    $jamaah->save();
                }
            }
            
            $tabungan->save();
        }

        return response()->json([
            'message' => 'Payment approved successfully',
            'payment' => $payment,
            'tabungan' => $tabungan,
        ]);
    }

    /**
     * Reject payment
     */
    public function rejectPayment(Request $request, $paymentId)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $payment = Payment::findOrFail($paymentId);

        if ($payment->status !== 'Pending') {
            return response()->json([
                'message' => 'Payment already processed',
            ], 400);
        }

        $payment->status = 'Rejected';
        $payment->notes = $validated['reason'];
        $payment->save();

        return response()->json([
            'message' => 'Payment rejected',
            'payment' => $payment,
        ]);
    }

    /**
     * Verify document
     */
    public function verifyDocument(Request $request, $documentId)
    {
        $document = Document::findOrFail($documentId);

        $document->status = 'Lengkap';
        $document->verified_by = $request->user()->id;
        $document->verified_at = now();
        $document->save();

        return response()->json([
            'message' => 'Document verified successfully',
            'document' => $document,
        ]);
    }

    /**
     * Reject document
     */
    public function rejectDocument(Request $request, $documentId)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $document = Document::findOrFail($documentId);

        $document->status = 'Ditolak';
        $document->notes = $validated['reason'];
        $document->save();

        return response()->json([
            'message' => 'Document rejected',
            'document' => $document,
        ]);
    }

    /**
     * Download document
     */
    public function downloadDocument($documentId)
    {
        $document = Document::findOrFail($documentId);

        if (!$document->file_path) {
            return response()->json([
                'message' => 'No file found',
            ], 404);
        }

        return response()->download(Storage::disk('public')->path($document->file_path));
    }

    /**
     * Download payment proof
     */
    public function downloadPaymentProof($paymentId)
    {
        $payment = Payment::findOrFail($paymentId);

        $proofPath = $payment->receipt_path ?? $payment->proof_file ?? null;

        if (!$proofPath) {
            return response()->json([
                'message' => 'No file found',
            ], 404);
        }

        return response()->download(Storage::disk('public')->path($proofPath));
    }
}
