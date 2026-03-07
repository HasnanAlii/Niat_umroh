<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
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
