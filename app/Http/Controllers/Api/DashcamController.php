<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DashcamFaceRecognition;
use App\Models\EmployeeModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DashcamController extends Controller
{
    /**
     * Simpan verifikasi pengemudi / Face Recognition dari Dashcam
     */
    public function faceRecognition(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'deviceId'   => ['required', 'string', 'min:1'],
            'vehicleId'  => ['nullable', 'string'],
            'plateNo'    => ['nullable', 'string'],
            'site'       => ['nullable', 'string'],
            'shift'      => ['nullable', 'string'],
            'driverName' => ['nullable', 'string'],
            'employeeId' => ['nullable', 'string'],
            'confidence' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'capturedAt' => ['nullable', 'date'],
            'photoUrl'   => ['required', 'string'],
            'source'     => ['nullable', 'string'],
            'notes'      => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        $deviceId  = trim((string) $request->input('deviceId'));
        $vehicleId = trim((string) $request->input('vehicleId', ''));
        $plateNo   = trim((string) $request->input('plateNo', ''));
        $site      = trim((string) $request->input('site', ''));
        $shift     = trim((string) $request->input('shift', ''));
        $photoUrl  = $request->input('photoUrl', null);

        // Tentukan shift otomatis jika kosong
        if (empty($shift)) {
            $hour = (int) now()->format('H');
            $shift = ($hour >= 6 && $hour < 18) ? 'Shift 1 (Siang)' : 'Shift 2 (Malam)';
        }

        // Jika foto dikirim dalam format data URL Base64 dari HTML5 Canvas kamera kabin
        if ($photoUrl && str_starts_with($photoUrl, 'data:image')) {
            try {
                @list($meta, $data) = explode(';', $photoUrl);
                @list(, $data)      = explode(',', $data);
                $decoded = base64_decode($data);

                if ($decoded !== false) {
                    $ext = 'jpg';
                    if (str_contains($meta, 'png')) $ext = 'png';

                    $filename = 'dashcam/faces/face_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                    Storage::disk('public')->put($filename, $decoded);
                    $photoUrl = '/storage/' . $filename;
                }
            } catch (\Throwable $e) {
                Log::warning('[FaceRecognition] Gagal menyimpan foto base64: ' . $e->getMessage());
            }
        }

        // Fallback jika tidak ada foto
        if (!$photoUrl) {
            $photoUrl = sprintf(
                'https://ui-avatars.com/api/?name=%s&background=3B82F6&color=fff&bold=true',
                urlencode(trim((string) $request->input('driverName', 'Unknown')))
            );
        }

        // Tanya ke AI Service Python (Port 5001)
        $aiMatch = null;
        $aiConfidence = 0;
        $verificationMethod = 'face_recognition';
        $rawPhotoUrl = $request->input('photoUrl', null);
        
        if ($rawPhotoUrl) {
            try {
                $aiResponse = \Illuminate\Support\Facades\Http::timeout(5)->post('http://127.0.0.1:5001/recognize', [
                    'image' => $rawPhotoUrl,
                ]);
                
                if ($aiResponse->successful()) {
                    $aiData = $aiResponse->json();
                    if (isset($aiData['status']) && $aiData['status'] === 'ok' && !empty($aiData['match'])) {
                        $aiMatch = $aiData['match'];
                        $aiConfidence = (float) ($aiData['confidence'] ?? 95);
                        $verificationMethod = 'face_recognition_ai';
                    }
                } else {
                    Log::error('AI Service Error: ' . $aiResponse->body());
                }
            } catch (\Exception $e) {
                Log::warning('Gagal menghubungi AI Service Python: ' . $e->getMessage());
            }
        }

        // Fallback: Jika AI belum mengenali tapi ada employeeId / driverName yang dipilih user
        if (!$aiMatch && $request->filled('employeeId')) {
            $aiMatch = trim((string) $request->input('employeeId'));
            $aiConfidence = (float) $request->input('confidence', 95.0);
            $verificationMethod = 'manual_selection';
        }

        if (!$aiMatch) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Wajah tidak dikenali oleh AI. Pastikan wajah pengemudi sudah didaftarkan pada sistem biometrik kabin.',
            ], 404);
        }

        // Cari data employee di database msemployee
        $employee = EmployeeModel::where('EmployeeID', $aiMatch)->first();
        $driverName = $employee ? $employee->EmployeeName : ($request->input('driverName') ?: 'Driver ' . $aiMatch);

        // Nonaktifkan sesi driver aktif sebelumnya pada unit / armada ini
        DashcamFaceRecognition::where(function ($q) use ($deviceId, $vehicleId) {
            if (!empty($deviceId)) {
                $q->where('device_id', $deviceId);
            }
            if (!empty($vehicleId)) {
                $q->orWhere('vehicle_id', $vehicleId);
            }
        })
        ->where('is_current_active', true)
        ->update([
            'is_current_active' => false,
            'status'            => 'completed',
            'ended_at'          => now(),
        ]);

        $payload = [
            'device_id'           => $deviceId,
            'vehicle_id'          => $vehicleId ?: null,
            'plate_no'            => $plateNo ?: null,
            'site'                => $site ?: ($employee?->SiteId ?: null),
            'shift'               => $shift,
            'status'              => 'active',
            'verification_method' => $verificationMethod,
            'is_current_active'   => true,
            'started_at'          => now(),
            'driver_name'         => $driverName,
            'employee_id'         => $aiMatch,
            'confidence'          => $aiConfidence,
            'captured_at'         => $request->input('capturedAt', now()->toISOString()),
            'photo_url'           => $photoUrl,
            'source'              => $request->input('source', 'cabin-dashcam-ai'),
            'notes'               => $request->input('notes'),
            'received_at'         => now()->toDateTimeString(),
        ];

        $record = DashcamFaceRecognition::create($payload);

        return response()->json([
            'status'  => 'ok',
            'message' => "Pengemudi {$driverName} berhasil diverifikasi & ditugaskan membawa unit {$plateNo}",
            'data'    => [
                'id'                  => $record->id,
                'driver_name'         => $record->driver_name,
                'device_id'           => $record->device_id,
                'vehicle_id'          => $record->vehicle_id,
                'plate_no'            => $record->plate_no,
                'site'                => $record->site,
                'shift'               => $record->shift,
                'status'              => $record->status,
                'verification_method' => $record->verification_method,
                'employee_id'         => $record->employee_id,
                'position'            => $employee?->PositionName ?: 'Operator Alat Berat',
                'confidence'          => $record->confidence,
                'captured_at'         => $record->captured_at,
                'started_at'          => $record->started_at,
                'photo_url'           => $record->photo_url,
                'source'              => $record->source,
                'received_at'         => $record->received_at,
            ],
        ], 201);
    }

    /**
     * Ambil daftar operator / driver dari database msemployee PT HPU
     */
    public function getDrivers(Request $request): JsonResponse
    {
        $query = EmployeeModel::query();

        $q = trim((string) $request->input('q', ''));
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('EmployeeName', 'ilike', "%{$q}%")
                  ->orWhere('EmployeeID', 'ilike', "%{$q}%")
                  ->orWhere('PositionName', 'ilike', "%{$q}%");
            });
        }

        $limit = (int) $request->input('limit', 25);
        $employees = $query->orderBy('EmployeeName')->take($limit)->get();

        $data = $employees->map(function ($emp) {
            return [
                'id'       => (string) $emp->EmployeeID,
                'name'     => $emp->EmployeeName,
                'position' => $emp->PositionName ?: 'Operator Alat Berat',
                'dept'     => $emp->DeptID,
                'site'     => $emp->SiteId,
            ];
        });

        return response()->json([
            'status' => 'ok',
            'total'  => $employees->count(),
            'data'   => $data,
        ]);
    }

    /**
     * Daftarkan driver / operator baru ke database msemployee PT HPU
     */
    public function registerDriver(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => ['required', 'string', 'min:2'],
            'id'       => ['required', 'string', 'min:1'],
            'position' => ['nullable', 'string'],
            'photoUrl' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $site = \App\Models\SiteModel::first()?->siteID ?? 'DMI';
        $dept = \App\Models\DepartmentModel::first()?->deptID ?? 29;

        $employee = EmployeeModel::updateOrCreate(
            ['EmployeeID' => trim($request->input('id'))],
            [
                'EmployeeName' => trim($request->input('name')),
                'PositionName' => $request->input('position') ?: 'Operator Dashcam Trial',
                'SiteId'       => $site,
                'DeptID'       => $dept,
                'Class'        => '1',
                'Status'       => 'Active',
            ]
        );

        $photoUrl = $request->input('photoUrl', null);
        if ($photoUrl) {
            try {
                $response = \Illuminate\Support\Facades\Http::post('http://127.0.0.1:5001/train', [
                    'employee_id' => $employee->EmployeeID,
                    'image'       => $photoUrl,
                ]);
                
                if (!$response->successful()) {
                    Log::error('AI Service mengembalikan error: ' . $response->body());
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Gagal mendaftarkan wajah di AI: ' . ($response->json('message') ?? 'Wajah tidak terdeteksi jelas.')
                    ], 400);
                }
            } catch (\Exception $e) {
                Log::error('Gagal mengirim foto ke AI Service: ' . $e->getMessage());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal menghubungi AI Service.'
                ], 500);
            }
        }

        return response()->json([
            'status' => 'ok',
            'data'   => [
                'id'       => (string) $employee->EmployeeID,
                'name'     => $employee->EmployeeName,
                'position' => $employee->PositionName,
            ],
        ]);
    }

    /**
     * Ambil driver aktif saat ini pada unit
     */
    public function getActiveDriver(Request $request): JsonResponse
    {
        $deviceId  = $request->input('deviceId');
        $vehicleId = $request->input('vehicleId');

        $query = DashcamFaceRecognition::query();
        if (!empty($deviceId) && !empty($vehicleId)) {
            $query->where(function ($q) use ($deviceId, $vehicleId) {
                $q->where('device_id', $deviceId)->orWhere('vehicle_id', $vehicleId);
            });
        } elseif (!empty($deviceId)) {
            $query->where('device_id', $deviceId);
        } elseif (!empty($vehicleId)) {
            $query->where('vehicle_id', $vehicleId);
        } else {
            $deviceId = config('services.cmsv6.device_id', '240078916116');
            $query->where('device_id', $deviceId);
        }

        $latest = (clone $query)->where('driver_name', '!=', 'CHECKOUT')
            ->where('status', 'active')
            ->latest()
            ->first();

        // Fallback: jika status 'active' belum terset pada record terdahulu
        if (!$latest) {
            $candidate = (clone $query)->latest()->first();
            if ($candidate && $candidate->driver_name !== 'CHECKOUT' && $candidate->status !== 'checkout') {
                $latest = $candidate;
            }
        }

        if (!$latest || $latest->driver_name === 'CHECKOUT' || $latest->status === 'checkout' || empty($latest->driver_name)) {
            return response()->json([
                'status' => 'ok',
                'driver' => null,
            ]);
        }

        $employee = EmployeeModel::where('EmployeeID', $latest->employee_id)->first();

        return response()->json([
            'status' => 'ok',
            'driver' => [
                'id'                  => $latest->employee_id,
                'name'                => $latest->driver_name,
                'position'            => $employee?->PositionName ?: 'Operator Alat Berat',
                'confidence'          => $latest->confidence,
                'photo_url'           => $latest->photo_url,
                'vehicle_id'          => $latest->vehicle_id,
                'plate_no'            => $latest->plate_no,
                'site'                => $latest->site,
                'shift'               => $latest->shift,
                'status'              => $latest->status,
                'verification_method' => $latest->verification_method,
                'started_at'          => $latest->started_at ? $latest->started_at->toIso8601String() : null,
                'captured_at'         => $latest->captured_at ? $latest->captured_at->toIso8601String() : null,
                'received_at'         => $latest->received_at ? $latest->received_at->format('H:i · d/m/Y') : null,
            ],
        ]);
    }

    /**
     * Kosongkan pengemudi aktif unit (Check-out pengemudi / kabin kosong)
     */
    public function checkout(Request $request): JsonResponse
    {
        $deviceId  = $request->input('deviceId');
        $vehicleId = $request->input('vehicleId');

        if (empty($deviceId) && empty($vehicleId)) {
            $deviceId = config('services.cmsv6.device_id', '240078916116');
        }

        DashcamFaceRecognition::where(function ($q) use ($deviceId, $vehicleId) {
            if (!empty($deviceId)) $q->where('device_id', $deviceId);
            if (!empty($vehicleId)) $q->orWhere('vehicle_id', $vehicleId);
        })
        ->where('is_current_active', true)
        ->update([
            'is_current_active' => false,
            'status'            => 'checkout',
            'ended_at'          => now(),
        ]);

        DashcamFaceRecognition::create([
            'device_id'           => $deviceId,
            'vehicle_id'          => $vehicleId ?: null,
            'driver_name'         => 'CHECKOUT',
            'employee_id'         => null,
            'confidence'          => 0,
            'captured_at'         => now(),
            'photo_url'           => null,
            'source'              => 'manual-checkout',
            'status'              => 'checkout',
            'verification_method' => 'manual',
            'is_current_active'   => false,
            'ended_at'            => now(),
            'received_at'         => now(),
        ]);

        return response()->json([
            'status'  => 'ok',
            'message' => 'Status kabin berhasil direset menjadi kosong (pengemudi telah check-out)',
        ]);
    }

    /**
     * Riwayat verifikasi Face Recognition
     */
    public function history(Request $request): JsonResponse
    {
        $deviceId  = $request->input('deviceId');
        $vehicleId = $request->input('vehicleId');
        $limit     = (int) $request->input('limit', 20);

        $query = DashcamFaceRecognition::query();
        if (!empty($deviceId) && !empty($vehicleId)) {
            $query->where(function ($q) use ($deviceId, $vehicleId) {
                $q->where('device_id', $deviceId)->orWhere('vehicle_id', $vehicleId);
            });
        } elseif (!empty($deviceId)) {
            $query->where('device_id', $deviceId);
        } elseif (!empty($vehicleId)) {
            $query->where('vehicle_id', $vehicleId);
        }

        $records = $query->where('driver_name', '!=', 'CHECKOUT')
            ->latest()
            ->take($limit)
            ->get();

        return response()->json([
            'status' => 'ok',
            'data'   => $records->map(function ($r) {
                return [
                    'id'                  => $r->id,
                    'name'                => $r->driver_name,
                    'employee_id'         => $r->employee_id,
                    'vehicle_id'          => $r->vehicle_id,
                    'plate_no'            => $r->plate_no,
                    'site'                => $r->site,
                    'shift'               => $r->shift,
                    'status'              => $r->status,
                    'verification_method' => $r->verification_method,
                    'confidence'          => $r->confidence,
                    'photo_url'           => $r->photo_url,
                    'started_at'          => $r->started_at ? $r->started_at->format('H:i · d M Y') : null,
                    'ended_at'            => $r->ended_at ? $r->ended_at->format('H:i · d M Y') : null,
                    'time'                => $r->created_at ? $r->created_at->format('H:i · d M Y') : '-',
                ];
            }),
        ]);
    }

    /**
     * Ambil log JSON face recognition terakhir (legacy compatibility)
     */
    public function latest(): JsonResponse
    {
        $records = DashcamFaceRecognition::latest()->take(20)->get();

        return response()->json([
            'status' => 'ok',
            'data'   => $records,
        ]);
    }

    /**
     * Ambil daftar geofences
     */
    public function getGeofences(): JsonResponse
    {
        $geofences = \App\Models\Geofence::orderBy('id', 'asc')->get();
        
        return response()->json([
            'status' => 'ok',
            'data'   => $geofences
        ]);
    }

    /**
     * Buat Geofence baru
     */
    /**
     * Buat Geofence baru
     */
    public function createGeofence(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'          => ['required', 'string', 'min:2'],
            'type'          => ['required', 'string', 'in:loading,dumping,parking,road,custom'],
            'latitude'      => ['required', 'numeric'],
            'longitude'     => ['required', 'numeric'],
            'radius'        => ['required', 'numeric', 'min:10', 'max:10000'],
            'color'         => ['nullable', 'string', 'max:20'],
            'address'       => ['nullable', 'string', 'max:255'],
            'material'      => ['nullable', 'string', 'max:30'],
            'geometry_type' => ['nullable', 'string', 'in:circle,polygon,line'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $color = $request->input('color');
        if (!$color) {
            $type = $request->input('type');
            $material = strtoupper((string) $request->input('material', 'OB'));
            if ($type === 'loading') {
                $color = ($material === 'COAL') ? '#1E293B' : '#6B7280';
            } elseif ($type === 'dumping') {
                $color = ($material === 'COAL') ? '#0F172A' : '#8B5CF6';
            } elseif ($type === 'parking') {
                $color = '#10B981';
            } else {
                $color = '#3B82F6';
            }
        }

        $geofence = \App\Models\Geofence::create([
            'name'          => trim((string) $request->input('name')),
            'type'          => $request->input('type'),
            'latitude'      => (float) $request->input('latitude'),
            'longitude'     => (float) $request->input('longitude'),
            'radius'        => (int) $request->input('radius'),
            'color'         => $color,
            'address'       => $request->input('address', 'Area Tambang HPU'),
            'material'      => strtoupper((string) $request->input('material', 'OB')),
            'geometry_type' => $request->input('geometry_type', 'circle'),
            'coordinates_json' => $request->input('coordinates_json', null),
        ]);

        return response()->json([
            'status'  => 'ok',
            'message' => 'Geofence berhasil ditambahkan.',
            'data'    => $geofence,
        ], 201);
    }

    /**
     * Hapus Geofence
     */
    public function deleteGeofence($id): JsonResponse
    {
        $geofence = \App\Models\Geofence::find($id);
        if (!$geofence) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Geofence tidak ditemukan.',
            ], 404);
        }

        $geofence->delete();

        return response()->json([
            'status'  => 'ok',
            'message' => 'Geofence berhasil dihapus.',
        ]);
    }

    /**
     * Rekam 1 ritasi lengkap (Loading -> Travel Isi -> Dumping PTO -> Travel Kosong)
     */
    public function recordRitasi(Request $request): JsonResponse
    {
        $deviceId = $request->input('deviceId', config('services.cmsv6.device_id', '240078916116'));
        $unitCode = $request->input('unit_code', 'HD-78501');
        $loadType = strtoupper((string) $request->input('load_type', 'OB'));

        $pitGeofenceId = $request->input('pit_geofence_id');
        $dumpingGeofenceId = $request->input('dumping_geofence_id') ?: $request->input('geofence_id');

        if (!$pitGeofenceId) {
            $pitGeofence = \App\Models\Geofence::where('type', 'loading')->first();
            $pitGeofenceId = $pitGeofence?->id;
        }

        if (!$dumpingGeofenceId) {
            $dumpingGeofence = \App\Models\Geofence::where('type', 'dumping')->first() 
                ?: \App\Models\Geofence::first();
            $dumpingGeofenceId = $dumpingGeofence?->id;
        }

        $loadingTime     = (int) $request->input('loading_time', 180);       // detik (3 menit)
        $travelLoadTime  = (int) $request->input('travel_load_time', 480);   // detik (8 menit)
        $dumpingTime     = (int) $request->input('dumping_time', 90);        // detik (1.5 menit)
        $travelEmptyTime = (int) $request->input('travel_empty_time', 420);  // detik (7 menit)
        $distanceKm      = (float) $request->input('distance_km', 2.4);
        $ptoConfirmed    = (bool) $request->input('pto_confirmed', true);

        $totalCycleSeconds = $loadingTime + $travelLoadTime + $dumpingTime + $travelEmptyTime;
        $cycleTimeMinutes  = (float) $request->input('cycle_time_minutes', round($totalCycleSeconds / 60, 1));

        $log = \App\Models\RitasiLog::create([
            'device_id'           => $deviceId,
            'unit_code'           => $unitCode,
            'load_type'           => $loadType,
            'geofence_id'         => $dumpingGeofenceId ?: ($pitGeofenceId ?: 1),
            'pit_geofence_id'     => $pitGeofenceId,
            'dumping_geofence_id' => $dumpingGeofenceId,
            'loading_time'        => $loadingTime,
            'travel_load_time'    => $travelLoadTime,
            'dumping_time'        => $dumpingTime,
            'travel_empty_time'   => $travelEmptyTime,
            'cycle_time_minutes'  => $cycleTimeMinutes,
            'distance_km'         => $distanceKm,
            'pto_confirmed'       => $ptoConfirmed,
            'status'              => 'completed',
            'entered_at'          => now(),
        ]);

        $count = \App\Models\RitasiLog::where('device_id', $deviceId)
            ->whereDate('entered_at', \Carbon\Carbon::today())
            ->count();

        $pitName     = \App\Models\Geofence::find($pitGeofenceId)?->name ?? 'Pit Front';
        $dumpingName = \App\Models\Geofence::find($dumpingGeofenceId)?->name ?? 'Disposal Area';

        return response()->json([
            'status'   => 'ok',
            'message'  => "Ritasi #{$count} Berhasil! [{$loadType}] dari {$pitName} ke {$dumpingName} (PTO: Verified, Cycle Time: {$cycleTimeMinutes}m)",
            'count'    => $count,
            'data'     => [
                'id'                 => $log->id,
                'unit_code'          => $unitCode,
                'load_type'          => $loadType,
                'pit_name'           => $pitName,
                'dumping_name'       => $dumpingName,
                'cycle_time_minutes' => $cycleTimeMinutes,
                'distance_km'        => $distanceKm,
                'pto_confirmed'      => $ptoConfirmed,
                'entered_at'         => $log->entered_at ? $log->entered_at->format('H:i:s') : now()->format('H:i:s'),
            ],
        ]);
    }

    /**
     * Ambil jumlah ritasi hari ini beserta daftar log perjalanannya dan ringkasan metrik
     */
    public function getRitasiToday(Request $request): JsonResponse
    {
        $deviceId = $request->input('deviceId', config('services.cmsv6.device_id', '240078916116'));
        
        $logs = \App\Models\RitasiLog::with(['pitGeofence', 'dumpingGeofence', 'geofence'])
            ->where('device_id', $deviceId)
            ->whereDate('entered_at', \Carbon\Carbon::today())
            ->orderBy('id', 'desc')
            ->get();
            
        $count = $logs->count();
        $totalDistance = round($logs->sum('distance_km'), 2);
        $avgCycleTime  = $count > 0 ? round($logs->avg('cycle_time_minutes'), 1) : 0;
        
        // Breakdown material (Slide 21)
        $materialCounts = [
            'OB'       => $logs->where('load_type', 'OB')->count(),
            'COAL'     => $logs->where('load_type', 'COAL')->count(),
            'MUD'      => $logs->where('load_type', 'MUD')->count(),
            'TOP SOIL' => $logs->where('load_type', 'TOP SOIL')->count(),
            'LIMONIT'  => $logs->where('load_type', 'LIMONIT')->count(),
            'SAPROLIT' => $logs->where('load_type', 'SAPROLIT')->count(),
        ];

        // Estimasi Bcm Produksi (Kapasitas vessel rata-rata 20 BCM x Ritasi)
        $totalBcm = $count * 20;

        return response()->json([
            'status'             => 'ok',
            'count'              => $count,
            'total_distance_km'  => $totalDistance,
            'avg_cycle_time_min' => $avgCycleTime,
            'total_bcm'          => $totalBcm,
            'material_breakdown' => $materialCounts,
            'logs'               => $logs->map(function ($l) {
                return [
                    'id'                 => $l->id,
                    'unit_code'          => $l->unit_code ?? 'HD-78501',
                    'load_type'          => $l->load_type ?? 'OB',
                    'pit_name'           => $l->pitGeofence?->name ?? 'Pit Front A',
                    'dumping_name'       => $l->dumpingGeofence?->name ?? ($l->geofence?->name ?? 'Disposal'),
                    'cycle_time_minutes' => $l->cycle_time_minutes ?? 19.5,
                    'distance_km'        => $l->distance_km ?? 2.4,
                    'pto_confirmed'      => (bool) $l->pto_confirmed,
                    'entered_at'         => $l->entered_at ? $l->entered_at->format('H:i:s') : '-',
                    'date_formatted'     => $l->entered_at ? $l->entered_at->format('d/m/Y') : '-',
                ];
            }),
        ]);
    }

    /**
     * Reset ritasi hari ini untuk testing demo
     */
    public function resetRitasi(Request $request): JsonResponse
    {
        $deviceId = $request->input('deviceId', config('services.cmsv6.device_id', '240078916116'));

        \App\Models\RitasiLog::where('device_id', $deviceId)
            ->whereDate('entered_at', \Carbon\Carbon::today())
            ->delete();

        return response()->json([
            'status'  => 'ok',
            'message' => 'Ritasi hari ini berhasil direset menjadi 0.',
            'count'   => 0,
        ]);
    }
}
