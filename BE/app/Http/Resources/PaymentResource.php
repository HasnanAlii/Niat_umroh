<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $proofPath = $this->receipt_path ?? $this->proof_file;

        return [
            'id' => $this->id,
            'jamaahId' => $this->jamaah_id,
            'title' => 'Pembayaran ' . $this->payment_method,
            'amount' => (float) $this->amount,
            'paymentDate' => $this->payment_date?->format('d M Y'),
            'date' => $this->payment_date?->format('d M Y'),
            'time' => $this->payment_date?->format('H:i'),
            'paymentMethod' => $this->payment_method,
            'status' => ucfirst($this->status),
            'rawStatus' => $this->status,
            'proofFile' => $proofPath,
            'file_path' => $proofPath,
            'receiptPath' => $proofPath,
            'createdAt' => $this->created_at?->format('d M Y'),
            
            // Relations
            'jamaah' => $this->whenLoaded('jamaah', function () {
                return new JamaahResource($this->jamaah);
            }),
        ];
    }
}
