<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelemetryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'latitude',
        'longitude',
        'speed',
        'odometer',
        'is_moving',
        'captured_at',
    ];

    protected $casts = [
        'is_moving' => 'boolean',
        'latitude' => 'double',
        'longitude' => 'double',
        'speed' => 'double',
        'odometer' => 'double',
        'captured_at' => 'datetime',
    ];
}
