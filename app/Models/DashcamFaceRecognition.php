<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashcamFaceRecognition extends Model
{
    use HasFactory;

    protected $table = 'dashcam_face_recognitions';

    protected $fillable = [
        'device_id',
        'driver_name',
        'employee_id',
        'confidence',
        'captured_at',
        'photo_url',
        'source',
        'received_at',
    ];

    protected $casts = [
        'confidence' => 'float',
        'captured_at' => 'datetime',
        'received_at' => 'datetime',
    ];
}
