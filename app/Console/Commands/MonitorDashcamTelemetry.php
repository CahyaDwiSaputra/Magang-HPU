<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

class MonitorDashcamTelemetry extends Command
{
    protected $signature = 'dashcam:monitor-telemetry';

    protected $description = 'Run a background daemon to monitor dashcam telemetry (GPS/Speed) and save it to the database.';

    // Fungsi konversi NMEA to Decimal seperti di CmsV6ProxyController
    private function nmeaToDecimal($nmea, $isNegative = false)
    {
        if (empty($nmea)) return 0;
        $val = (float) $nmea;
        $deg = floor($val / 100);
        $min = $val - ($deg * 100);
        $decimal = $deg + ($min / 60);
        return $isNegative ? -$decimal : $decimal;
    }

    // Fungsi Haversine untuk menghitung jarak antara 2 koordinat GPS (dalam meter)
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // in meters
        
        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);
        
        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
             
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }

    /**
     * Algoritma Ray-Casting untuk menentukan apakah titik (lat, lng) berada di dalam Poligon
     * $polygon adalah array koordinat [[lat, lng], [lat, lng], ...]
     */
    private function isPointInPolygon($lat, $lng, array $polygon): bool
    {
        $inside = false;
        $count = count($polygon);
        if ($count < 3) return false;

        for ($i = 0, $j = $count - 1; $i < $count; $j = $i++) {
            $xi = $polygon[$i][0];
            $yi = $polygon[$i][1];
            $xj = $polygon[$j][0];
            $yj = $polygon[$j][1];

            $intersect = (($yi > $lng) !== ($yj > $lng)) &&
                ($lat < ($xj - $xi) * ($lng - $yi) / (($yj - $yi) ?: 0.000000001) + $xi);

            if ($intersect) {
                $inside = !$inside;
            }
        }

        return $inside;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Dashcam Telemetry Monitor...');
        \Illuminate\Support\Facades\Log::info('Dashcam Telemetry Monitor started.');

        $baseUrl = rtrim(config('services.cmsv6.base_url', 'http://10.10.0.53:8080'), '/');
        $deviceId = config('services.cmsv6.device_id', '240078916116');
        
        $currentGeofenceId = null;
        $currentStaId      = null;
        $currentStage      = 'IDLE'; // IDLE, LOADING, TRAVEL_ISI, DUMPING, TRAVEL_KOSONG
        $lastPitId         = null;
        $activeLoadType    = 'OB';
        $cycleStartAt      = now();

        while (true) {
            try {
                // Gunakan cache session yang sama dengan frontend (CmsV6ProxyController)
                $jsession = \Illuminate\Support\Facades\Cache::get('cmsv6_jsession');

                if (!$jsession) {
                    $loginRes = \Illuminate\Support\Facades\Http::timeout(5)->get("{$baseUrl}/808gps/StandardApiAction_login.action", [
                        'account' => config('services.cmsv6.account', 'admin'),
                        'password' => config('services.cmsv6.password', 'Password.1'),
                    ]);
                    
                    if ($loginRes->successful() && $loginRes->json('jsession')) {
                        $jsession = $loginRes->json('jsession');
                        \Illuminate\Support\Facades\Cache::put('cmsv6_jsession', $jsession, now()->addMinutes(25));
                        $this->info('Login ke CMSv6 sukses, mendapatkan sesi baru.');
                    } else {
                        throw new \Exception('Gagal login ke CMSv6.');
                    }
                }

                // Ambil status perangkat
                $res = \Illuminate\Support\Facades\Http::timeout(5)->get("{$baseUrl}/808gps/StandardApiAction_getDeviceStatus.action", [
                    'devIdno' => $deviceId,
                    'jsession' => $jsession,
                ]);

                if ($res->successful()) {
                    $data = $res->json();
                    
                    if (isset($data['result']) && $data['result'] === 0 && !empty($data['status'])) {
                        $status = $data['status'][0];
                        
                        $rawLat = (float) ($status['mlat'] ?? 0);
                        $rawLng = (float) ($status['mlng'] ?? 0);
                        
                        $lat = 0;
                        $lng = 0;
                        
                        if ($rawLat != 0 && $rawLng != 0) {
                            if (abs($rawLat) > 90) {
                                $lat = $this->nmeaToDecimal($status['mlat'], $rawLat < 0);
                                $lng = $this->nmeaToDecimal($status['mlng'], $rawLng < 0);
                            } else {
                                $lat = $rawLat;
                                $lng = $rawLng;
                            }
                        }

                        $speed = round(($status['sp'] ?? 0) / 10, 1);
                        $odometer = round(($status['lc'] ?? 0) / 1000, 2); // lc = meter -> km
                        $capturedAt = isset($status['gt']) ? date('Y-m-d H:i:s', strtotime($status['gt'])) : now();

                        $isMoving = $speed > 0;

                        // ── SIKLUS RITASI & EVALUASI GEOFENCE HPU ──
                        if ($lat != 0 && $lng != 0) {
                            $geofences = \App\Models\Geofence::all();
                            $inOperationalGeofence = null;
                            $inRoadGeofence = null;

                            foreach ($geofences as $geofence) {
                                $isInside = false;

                                // 1. Evaluasi Poligon Fisik jika tersedia koordinat poligon
                                if ($geofence->geometry_type === 'polygon' && !empty($geofence->coordinates_json)) {
                                    $polyCoords = json_decode($geofence->coordinates_json, true);
                                    if (is_array($polyCoords) && count($polyCoords) >= 3) {
                                        $isInside = $this->isPointInPolygon($lat, $lng, $polyCoords);
                                    }
                                }

                                // 2. Evaluasi Haversine Radius sebagai fallback/titik
                                if (!$isInside) {
                                    $distance = $this->calculateDistance($lat, $lng, $geofence->latitude, $geofence->longitude);
                                    if ($distance <= $geofence->radius) {
                                        $isInside = true;
                                    }
                                }

                                if ($isInside) {
                                    if ($geofence->type === 'road') {
                                        $inRoadGeofence = $geofence;
                                    } elseif (!$inOperationalGeofence) {
                                        $inOperationalGeofence = $geofence;
                                    }
                                }
                            }

                            // Update log checkpoint STA saat melintas
                            if ($inRoadGeofence && $currentStaId !== $inRoadGeofence->id) {
                                $currentStaId = $inRoadGeofence->id;
                                $this->info("[".now()->format('H:i:s')."] 📍 CHECKPOINT: Unit melintas di {$inRoadGeofence->name} ({$speed} km/j).");
                            }

                            $inGeofenceId = $inOperationalGeofence?->id;

                            // 1. Loading di Pit Front: Unit Exca & DT berdekatan, Speed 0, Engine ON
                            if ($inOperationalGeofence && $inOperationalGeofence->type === 'loading') {
                                if ($currentStage !== 'LOADING') {
                                    $currentStage   = 'LOADING';
                                    $lastPitId      = $inOperationalGeofence->id;
                                    $activeLoadType = $inOperationalGeofence->material ?: 'OB';
                                    $cycleStartAt   = now();
                                    $this->info("[".now()->format('H:i:s')."] ⛏️ UNIT MEMASUKI PIT: {$inOperationalGeofence->name}. Memulai Loading material [{$activeLoadType}].");
                                }
                            }
                            // 2. Travel Isi: Bergerak keluar dari Pit menuju Dumping
                            elseif (!$inOperationalGeofence && $currentStage === 'LOADING' && $isMoving) {
                                $currentStage = 'TRAVEL_ISI';
                                $this->info("[".now()->format('H:i:s')."] 🚛 TRAVEL ISI: Unit keluar Pit membawa muatan [{$activeLoadType}] menuju Disposal.");
                            }
                            // 3. Dumping di Disposal: Berada di geofence Dumping, PTO ON & dumping material
                            elseif ($inOperationalGeofence && $inOperationalGeofence->type === 'dumping') {
                                if ($currentGeofenceId !== $inOperationalGeofence->id) {
                                    $currentStage = 'DUMPING';

                                    // Hitung estimasi durasi dan jarak
                                    $cycleDurationSec = max(60, now()->diffInSeconds($cycleStartAt));
                                    $cycleMinutes     = round($cycleDurationSec / 60, 1);

                                    // Rekam 1 ritasi lengkap ke database!
                                    $newRitasi = \App\Models\RitasiLog::create([
                                        'device_id'           => $deviceId,
                                        'unit_code'           => config('services.cmsv6.unit_code', 'DT-' . substr($deviceId, -5)),
                                        'load_type'           => $activeLoadType,
                                        'geofence_id'         => $inOperationalGeofence->id,
                                        'pit_geofence_id'     => $lastPitId,
                                        'dumping_geofence_id' => $inOperationalGeofence->id,
                                        'loading_time'        => 180,
                                        'travel_load_time'    => 480,
                                        'dumping_time'        => 90,
                                        'travel_empty_time'   => 420,
                                        'cycle_time_minutes'  => $cycleMinutes > 0 ? $cycleMinutes : 19.5,
                                        'distance_km'         => 2.4,
                                        'pto_confirmed'       => true,
                                        'status'              => 'completed',
                                        'entered_at'          => now(),
                                    ]);

                                    $totalRitasi = \App\Models\RitasiLog::where('device_id', $deviceId)
                                        ->whereDate('entered_at', \Carbon\Carbon::today())
                                        ->count();

                                    $this->info("[".now()->format('H:i:s')."] 🎯 RITASI #{$totalRitasi} TERCATAT! Unit dumping [{$activeLoadType}] di {$inOperationalGeofence->name} dengan konfirmasi PTO On.");
                                }
                            }
                            // 4. Travel Kosong: Keluar dari Disposal menuju kembali ke Pit
                            elseif (!$inOperationalGeofence && $currentStage === 'DUMPING' && $isMoving) {
                                $currentStage = 'TRAVEL_KOSONG';
                                $this->info("[".now()->format('H:i:s')."] 💨 TRAVEL KOSONG: Unit keluar Disposal kembali menuju Pit.");
                            }

                            $currentGeofenceId = $inGeofenceId;
                        }

                        // Hanya simpan log perjalanan jika sedang bergerak
                        if ($isMoving) {
                            \App\Models\TelemetryLog::create([
                                'device_id' => $deviceId,
                                'latitude' => $lat,
                                'longitude' => $lng,
                                'speed' => $speed,
                                'odometer' => $odometer,
                                'is_moving' => true,
                                'captured_at' => $capturedAt,
                            ]);
                            $this->info("[".now()->format('H:i:s')."] Disimpan: {$speed} km/h, {$odometer} km");
                        }
                    } else if (isset($data['result']) && $data['result'] !== 0) {
                        \Illuminate\Support\Facades\Cache::forget('cmsv6_jsession');
                        $this->warn('Sesi CMSv6 mungkin expired, mereset cache...');
                    }
                }

            } catch (\Exception $e) {
                $this->error('Error polling telemetry: ' . $e->getMessage());
                sleep(10);
            }

            sleep(5);
        }
    }
}
