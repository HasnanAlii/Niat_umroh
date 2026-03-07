<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consultation extends Model
{
    protected $fillable = [
        'jamaah_id',
        'name',
        'phone',
        'email',
        'subject',
        'message',
        'category',
        'travel_package_id',
        'preferred_date',
        'status',
        'handled_by',
        'response',
        'responded_at',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'responded_at' => 'datetime',
    ];

    /**
     * Get the jamaah that owns the consultation.
     */
    public function jamaah(): BelongsTo
    {
        return $this->belongsTo(Jamaah::class);
    }

    /**
     * Get the travel package for the consultation.
     */
    public function travelPackage(): BelongsTo
    {
        return $this->belongsTo(TravelPackage::class);
    }

    /**
     * Get the user who handled the consultation.
     */
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
