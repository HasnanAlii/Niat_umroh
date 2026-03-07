<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'jamaahId' => $this->jamaah_id,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => ucfirst($this->status),
            'rawStatus' => $this->status,
            'response' => $this->response,
            'date' => $this->created_at?->format('d M Y'),
            'time' => $this->created_at?->format('H:i'),
            'createdAt' => $this->created_at?->format('d M Y H:i'),
            
            // Relations
            'jamaah' => $this->whenLoaded('jamaah', function () {
                return new JamaahResource($this->jamaah);
            }),
        ];
    }
}
