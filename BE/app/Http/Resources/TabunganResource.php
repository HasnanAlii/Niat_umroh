<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TabunganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $currentAmount = (float) $this->current_amount;
        $targetAmount = (float) $this->target_amount;
        $progress = $targetAmount > 0 ? round(($currentAmount / $targetAmount) * 100) : 0;
        
        return [
            'id' => $this->id,
            'jamaahId' => $this->jamaah_id,
            'saldo' => $currentAmount,
            'target' => $targetAmount,
            'progress' => $progress,
            'monthlyPayment' => (float) $this->monthly_payment,
            'paymentAmount' => (float) $this->monthly_payment,
            'nextPayment' => $this->next_payment_date?->format('d F Y'),
            'nextPaymentDate' => $this->next_payment_date?->format('d F Y'),
            'status' => ucfirst($this->status),
            'createdAt' => $this->created_at?->format('d M Y'),
            
            // Relations
            'jamaah' => $this->whenLoaded('jamaah', function () {
                return new JamaahResource($this->jamaah);
            }),
        ];
    }
}
