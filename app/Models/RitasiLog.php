<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RitasiLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'unit_code',
        'load_type',
        'geofence_id',
        'pit_geofence_id',
        'dumping_geofence_id',
        'loading_time',
        'travel_load_time',
        'dumping_time',
        'travel_empty_time',
        'cycle_time_minutes',
        'distance_km',
        'pto_confirmed',
        'status',
        'entered_at'
    ];

    protected $casts = [
        'entered_at' => 'datetime',
        'pto_confirmed' => 'boolean',
        'cycle_time_minutes' => 'double',
        'distance_km' => 'double',
    ];

    public function geofence()
    {
        return $this->belongsTo(Geofence::class);
    }

    public function pitGeofence()
    {
        return $this->belongsTo(Geofence::class, 'pit_geofence_id');
    }

    public function dumpingGeofence()
    {
        return $this->belongsTo(Geofence::class, 'dumping_geofence_id');
    }
}
