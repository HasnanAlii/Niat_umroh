<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusMap = [
            'pending' => 'Perlu Upload',
            'verified' => 'Lengkap',
            'rejected' => 'Ditolak',
        ];
        
        return [
            'id' => $this->id,
            'jamaahId' => $this->jamaah_id,
            'name' => $this->document_type,
            'documentType' => $this->document_type,
            'documentNumber' => $this->document_number,
            'filePath' => $this->file_path,
            'expiry' => $this->expiry_date ? $this->expiry_date->format('Y-m-d') : '-',
            'expiryDate' => $this->expiry_date?->format('d F Y'),
            'status' => $statusMap[$this->status] ?? ucfirst($this->status),
            'rawStatus' => $this->status,
            'createdAt' => $this->created_at?->format('d M Y'),
            
            // Relations
            'jamaah' => $this->whenLoaded('jamaah', function () {
                return new JamaahResource($this->jamaah);
            }),
        ];
    }
}
