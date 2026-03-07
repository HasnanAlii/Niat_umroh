<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tabungan extends Model
{
    protected $fillable = [
        'jamaah_id',
        'travel_package_id',
        'target_amount',
        'current_amount',
        'progress',
        'status',
        'last_payment_date',
        'next_payment_date',
        'monthly_payment',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'monthly_payment' => 'decimal:2',
        'last_payment_date' => 'date',
        'next_payment_date' => 'date',
    ];

    /**
     * Get the jamaah that owns the tabungan.
     */
    public function jamaah(): BelongsTo
    {
        return $this->belongsTo(Jamaah::class);
    }

    /**
     * Get the travel package for the tabungan.
     */
    public function travelPackage(): BelongsTo
    {
        return $this->belongsTo(TravelPackage::class);
    }

    /**
     * Get the payments for the tabungan.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
