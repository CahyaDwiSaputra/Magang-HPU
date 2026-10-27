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
        'vehicle_id',
        'plate_no',
        'site',
        'shift',
        'status',
        'verification_method',
        'is_current_active',
        'started_at',
        'ended_at',
        'driver_name',
        'employee_id',
        'confidence',
        'captured_at',
        'photo_url',
        'source',
        'notes',
        'received_at',
    ];

    protected $casts = [
        'confidence' => 'float',
        'is_current_active' => 'boolean',
        'captured_at' => 'datetime',
        'received_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeModel::class, 'employee_id', 'EmployeeID');
    }
}
