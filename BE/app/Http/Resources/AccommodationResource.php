<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccommodationResource extends JsonResource
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
            'type' => $this->type,
            'location'    => $this->location,
            'address'     => $this->address,
            'rating'      => $this->rating,
            'rooms' => $this->capacity,
            'capacity' => $this->capacity,
            'price' => $this->price,
            'status' => $this->status,
            'facilities' => $this->facilities ?? [],
            'description' => $this->description,
            'image' => $this->image,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
