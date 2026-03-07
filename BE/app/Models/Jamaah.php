<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Jamaah extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'nik',
        'email',
        'phone',
        'address',
        'registration_date',
        'travel_package_id',
        'status',
        'profile_image',
    ];

    protected $casts = [
        'registration_date' => 'date',
    ];

    /**
     * Get the user that owns the jamaah.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the travel package for the jamaah.
     */
    public function travelPackage(): BelongsTo
    {
        return $this->belongsTo(TravelPackage::class);
    }

    /**
     * Get the tabungan for the jamaah.
     */
    public function tabungan(): HasOne
    {
        return $this->hasOne(Tabungan::class);
    }

    /**
     * Get the payments for the jamaah.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the documents for the jamaah.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get the consultations for the jamaah.
     */
    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }
}

