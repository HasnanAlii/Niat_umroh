<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TravelPackage extends Model
{
    protected $fillable = [
        'name',
        'duration',
        'price',
        'quota',
        'booked',
        'available',
        'departure_date',
        'status',
        'rating',
        'hotel_makkah',
        'hotel_madinah',
        'airline',
        'features',
        'highlights',
        'best_for',
        'description',
        'photo',
        'accommodation_id',
    ];
    public function accommodation()
    {
        return $this->belongsTo(Accommodation::class);
    }

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'departure_date' => 'date',
        'features' => 'array',
        'highlights' => 'array',
    ];

    /**
     * Get the jamaahs for the travel package.
     */
    public function jamaahs(): HasMany
    {
        return $this->hasMany(Jamaah::class);
    }

    /**
     * Get the tabungans for the travel package.
     */
    public function tabungans(): HasMany
    {
        return $this->hasMany(Tabungan::class);
    }

    /**
     * Get the consultations for the travel package.
     */
    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }
}
