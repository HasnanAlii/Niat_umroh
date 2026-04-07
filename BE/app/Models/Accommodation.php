<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    protected $fillable = [
        'name',
        'type',
        'location',
        'address',
        'rating',
        'capacity',
        'price',
        'status',
        'facilities',
        'description',
        'image',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'facilities' => 'array',
    ];
}
