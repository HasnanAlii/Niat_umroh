<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JamaahResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'nik' => $this->nik,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'totalPaid' => (float) $this->total_paid,
            'registrationDate' => $this->registration_date?->format('d F Y'),
            'joinDate' => $this->registration_date?->format('d F Y'),
            'status' => $this->status,
            'profileImage' => $this->profile_image ?? '/avatar-placeholder.jpg',
            
            // Relations
            'travelPackage' => $this->whenLoaded('travelPackage', function () {
                return new TravelPackageResource($this->travelPackage);
            }),
            'tabungan' => $this->whenLoaded('tabungan', function () {
                return new TabunganResource($this->tabungan);
            }),
            'documents' => $this->whenLoaded('documents', function () {
                return DocumentResource::collection($this->documents);
            }),
            'payments' => $this->whenLoaded('payments', function () {
                return PaymentResource::collection($this->payments);
            }),
            'consultations' => $this->whenLoaded('consultations', function () {
                return ConsultationResource::collection($this->consultations);
            }),
        ];
    }
}
