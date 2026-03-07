<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'tabungan_id',
        'jamaah_id',
        'amount',
        'payment_date',
        'payment_method',
        'status',
        'receipt_path',
        'notes',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'verified_at' => 'datetime',
    ];

    /**
     * Get the tabungan that owns the payment.
     */
    public function tabungan(): BelongsTo
    {
        return $this->belongsTo(Tabungan::class);
    }

    /**
     * Get the jamaah that owns the payment.
     */
    public function jamaah(): BelongsTo
    {
        return $this->belongsTo(Jamaah::class);
    }

    /**
     * Get the user who verified the payment.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
