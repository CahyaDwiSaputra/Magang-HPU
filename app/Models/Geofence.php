<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Geofence extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'latitude',
        'longitude',
        'radius',
        'color',
        'address',
        'material',
        'geometry_type',
        'coordinates_json'
    ];

    protected $casts = [
        'latitude' => 'double',
        'longitude' => 'double',
        'radius' => 'integer'
    ];

    public function ritasiLogs()
    {
        return $this->hasMany(RitasiLog::class);
    }
}
