<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TravelPackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'duration' => $this->duration,
            'price' => $this->price,
            'quota' => $this->quota,
            'booked' => $this->booked,
            'available' => $this->available,
            'date' => $this->departure_date->format('d M Y'),
            'departure_date' => $this->departure_date->format('Y-m-d'),
            'status' => $this->status,
            'rating' => $this->rating,
            'hotel' => $this->hotel_makkah,
            'hotelMakkah' => $this->hotel_makkah,
            'hotelMadinah' => $this->hotel_madinah,
            'airline' => $this->airline,
            'features' => $this->features ?? [],
            'highlights' => $this->highlights ?? [],
            'bestFor' => $this->best_for,
            'best_for' => $this->best_for,
            'description' => $this->description,
            'seats' => $this->quota,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
