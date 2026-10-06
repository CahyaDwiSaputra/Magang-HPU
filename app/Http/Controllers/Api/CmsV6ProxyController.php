<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CmsV6ProxyController extends Controller
{
    private string $base;
    private string $account;
    private string $password;
    private string $deviceId;
    private int $timeout = 10;

    public function __construct()
    {
        $this->base     = rtrim(config('services.cmsv6.base_url', 'http://10.10.0.53:8080'), '/');
        $this->account  = config('services.cmsv6.account', 'admin');
        $this->password = config('services.cmsv6.password', 'Password.1');
        $this->deviceId = config('services.cmsv6.device_id', '240078916116');
    }

    // ── INTERNAL: Ambil jsession dari cache atau login ulang ──
    private function getSession(): ?string
    {
        $cached = Cache::get('cmsv6_jsession');
        if ($cached) return $cached;
        return $this->doLogin();
    }

    private function doLogin(): ?string
    {
        try {
            $res = Http::timeout($this->timeout)
                ->get("{$this->base}/808gps/StandardApiAction_login.action", [
                    'account'  => $this->account,
                    'password' => $this->password,
                ]);
            $data = $res->json();
            if (!empty($data['jsession'])) {
                Cache::put('cmsv6_jsession', $data['jsession'], now()->addMinutes(25));
                return $data['jsession'];
            }
            Log::warning('[CMSV6] Login gagal', ['response' => $data]);
        } catch (\Throwable $e) {
            Log::error('[CMSV6] Login exception: ' . $e->getMessage());
        }
        return null;
    }

    // ── HELPER: panggil CMSV6, retry sekali jika session expired ──
    private function callWithRetry(string $endpoint, array $params = []): array
    {
        $jsession = $this->getSession();
        if (!$jsession) {
            return ['result' => -1, '_proxy_error' => 'Tidak bisa login ke CMSV6'];
        }

        $params['jsession'] = $jsession;
        $data = $this->httpGet($endpoint, $params);

        if (($data['result'] ?? -1) !== 0) {
            // Session mungkin expired — hapus cache & coba sekali lagi
            Cache::forget('cmsv6_jsession');
            $jsession = $this->doLogin();
            if ($jsession) {
                $params['jsession'] = $jsession;
                $data = $this->httpGet($endpoint, $params);
            }
        }

        return $data;
    }

    private function httpGet(string $endpoint, array $params): array
    {
        try {
            $res = Http::timeout($this->timeout)
                ->get("{$this->base}{$endpoint}", $params);
            return $res->json() ?? ['result' => -1, '_proxy_error' => 'Response bukan JSON'];
        } catch (\Throwable $e) {
            Log::error("[CMSV6] httpGet error: {$endpoint} — " . $e->getMessage());
            return ['result' => -1, '_proxy_error' => $e->getMessage()];
        }
    }

    // ── PUBLIC API ──

    /**
     * GET /api/cmsv6/session
     * Kembalikan jsession aktif ke frontend
     */
    public function session(): JsonResponse
    {
        $jsession = $this->getSession();
        if (!$jsession) {
            return response()->json([
                'result'       => -1,
                '_proxy_error' => 'Tidak bisa login ke server CMSV6. Periksa koneksi jaringan.',
            ], 503);
        }
        return response()->json([
            'result'    => 0,
            'jsession'  => $jsession,
            'base_url'  => $this->base,
            'device_id' => $this->deviceId,
        ]);
    }

    /**
     * GET /api/cmsv6/status
     * Status perangkat (GPS, kecepatan, bahan bakar, online/offline)
     */
    public function deviceStatus(): JsonResponse
    {
        $data = $this->callWithRetry('/808gps/StandardApiAction_getDeviceStatus.action', [
            'devIdno' => $this->deviceId,
        ]);
        return response()->json($data);
    }

    /**
     * GET /api/cmsv6/alarms
     * Mengambil daftar alarm aktif yang selaras dengan Alarm Center CMSv6 (18 Alarm: Fierce Driving & GSensor)
     */
    public function alarms(): JsonResponse
    {
        $alarms = Cache::get('cmsv6_active_alarms');

        if ($alarms === null) {
            $alarms = $this->getInitialCmsv6Alarms();
            Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));
        }

        // Cek apakah ada telemetri real-time yang memicu alarm dinamis (misal overspeed)
        $statusRes = $this->deviceStatus();
        $statusData = $statusRes->getData(true);
        if (!empty($statusData['status'][0])) {
            $s = $statusData['status'][0];
            $speed = round(($s['sp'] ?? 0) / 10);
            if ($speed > 40) {
                // Pastikan overspeed alarm ada di daftar
                $hasOverspeed = false;
                foreach ($alarms as $a) {
                    if (($a['type'] ?? 0) === 101 && ($a['handle_status'] ?? '') === 'Untreated') {
                        $hasOverspeed = true;
                        break;
                    }
                }
                if (!$hasOverspeed) {
                    array_unshift($alarms, [
                        'guid' => 'ALM-SPD-' . time(),
                        'desc' => "Overspeed Warning ({$speed} km/h > 40 km/h)",
                        'category' => 'Hauling Safety',
                        'type' => 101,
                        'severity' => 'critical',
                        'handle_status' => 'Untreated',
                        'current_state' => 'Alarming',
                        'time' => now()->format('Y-m-d H:i:s'),
                        'vehicle' => 'TrialUNS2',
                        'company' => 'Hpu',
                    ]);
                    Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));
                }
            }
        }

        $untreatedCount = count(array_filter($alarms, fn($a) => ($a['handle_status'] ?? 'Untreated') === 'Untreated'));

        return response()->json([
            'result' => 0,
            'total' => count($alarms),
            'untreated_count' => $untreatedCount,
            'alarms' => $alarms,
        ]);
    }

    /**
     * POST /api/cmsv6/alarms/handle
     * Selesaikan / Tangani 1 alarm spesifik (mirip Quick Handle di CMSv6)
     */
    public function handleAlarm(Request $request): JsonResponse
    {
        $guid = $request->input('guid');
        $alarms = Cache::get('cmsv6_active_alarms', $this->getInitialCmsv6Alarms());

        foreach ($alarms as &$a) {
            if ($a['guid'] === $guid) {
                $a['handle_status'] = 'Handled';
                $a['handled_at'] = now()->format('Y-m-d H:i:s');
                break;
            }
        }
        unset($a);

        Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));
        $untreatedCount = count(array_filter($alarms, fn($a) => ($a['handle_status'] ?? 'Untreated') === 'Untreated'));

        return response()->json([
            'result' => 0,
            'message' => "Alarm berhasil ditandai selesai (Handled).",
            'untreated_count' => $untreatedCount,
            'alarms' => $alarms,
        ]);
    }

    /**
     * POST /api/cmsv6/alarms/batch-handle
     * Selesaikan semua alarm yang belum ditangani (Batch Handle)
     */
    public function batchHandleAlarms(): JsonResponse
    {
        $alarms = Cache::get('cmsv6_active_alarms', $this->getInitialCmsv6Alarms());

        foreach ($alarms as &$a) {
            $a['handle_status'] = 'Handled';
            $a['handled_at'] = now()->format('Y-m-d H:i:s');
        }
        unset($a);

        Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));

        return response()->json([
            'result' => 0,
            'message' => 'Semua alarm berhasil ditandai selesai (Batch Handled).',
            'untreated_count' => 0,
            'alarms' => $alarms,
        ]);
    }

    /**
     * POST /api/cmsv6/alarms/trigger
     * Memicu simulasi alarm AI DMS / ADAS untuk pengujian demo
     */
    public function triggerAlarm(Request $request): JsonResponse
    {
        $type = $request->input('type', 'drowsiness');

        $typeMap = [
            'drowsiness' => ['desc' => 'DMS: Driver Fatigue / Drowsiness Detected', 'category' => 'DMS (Kabin)', 'severity' => 'critical', 'type' => 301],
            'phone'      => ['desc' => 'DMS: Distracted Driving (Calling / Phone Use)', 'category' => 'DMS (Kabin)', 'severity' => 'high', 'type' => 302],
            'smoking'    => ['desc' => 'DMS: Smoking Detected in Cabin', 'category' => 'DMS (Kabin)', 'severity' => 'high', 'type' => 303],
            'overspeed'  => ['desc' => 'ADAS: Speed Limit Exceeded (46 km/h > 40 km/h)', 'category' => 'Hauling Safety', 'severity' => 'critical', 'type' => 101],
            'collision'  => ['desc' => 'ADAS: Forward Collision Warning (FCW)', 'category' => 'ADAS (Depan)', 'severity' => 'critical', 'type' => 202],
            'occlusion'  => ['desc' => 'DMS: Camera Occlusion / Lens Blocked', 'category' => 'DMS (Kabin)', 'severity' => 'medium', 'type' => 304],
        ];

        $info = $typeMap[$type] ?? ['desc' => 'Custom Safety Alert', 'category' => 'DMS', 'severity' => 'high', 'type' => 300];

        $newAlarm = [
            'guid'          => 'ALM-SIM-' . uniqid(),
            'desc'          => $info['desc'],
            'category'      => $info['category'],
            'type'          => $info['type'],
            'severity'      => $info['severity'],
            'handle_status' => 'Untreated',
            'current_state' => 'Alarming',
            'time'          => now()->format('Y-m-d H:i:s'),
            'vehicle'       => 'TrialUNS2',
            'company'       => 'Hpu',
        ];

        $alarms = Cache::get('cmsv6_active_alarms', $this->getInitialCmsv6Alarms());
        array_unshift($alarms, $newAlarm);
        Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));

        $untreatedCount = count(array_filter($alarms, fn($a) => ($a['handle_status'] ?? 'Untreated') === 'Untreated'));

        return response()->json([
            'result'          => 0,
            'message'         => "Alarm {$newAlarm['desc']} berhasil dipicu.",
            'untreated_count' => $untreatedCount,
            'alarm'           => $newAlarm,
            'alarms'          => $alarms,
        ]);
    }

    /**
     * Data awal 18 alarm persis dari server CMSv6 Alarm Center
     */
    private function getInitialCmsv6Alarms(): array
    {
        $list = [];
        $baseTime = strtotime('2026-09-24 22:10:00');

        // 1x Collision Rollover Alarm (GSensor Alarm)
        $list[] = [
            'guid'          => 'ALM-RO-001',
            'desc'          => 'Collision Rollover Alarm',
            'category'      => 'GSensor Alarm',
            'type'          => 201,
            'severity'      => 'critical',
            'handle_status' => 'Untreated',
            'current_state' => 'Alarm End',
            'time'          => date('Y-m-d H:i:s', $baseTime),
            'vehicle'       => 'TrialUNS2',
            'company'       => 'Hpu',
        ];

        // 17x Collision Alarm (Fierce Driving)
        for ($i = 1; $i <= 17; $i++) {
            $offsetSeconds = $i * 55;
            $list[] = [
                'guid'          => sprintf('ALM-FD-%03d', $i),
                'desc'          => 'Collision Alarm',
                'category'      => 'Fierce Driving(FD)',
                'type'          => 202,
                'severity'      => 'high',
                'handle_status' => 'Untreated',
                'current_state' => 'Alarm End',
                'time'          => date('Y-m-d H:i:s', $baseTime - $offsetSeconds),
                'vehicle'       => 'TrialUNS2',
                'company'       => 'Hpu',
            ];
        }

        return $list;
    }

    /**
     * GET /api/cmsv6/track?begintime=...&endtime=...&page=1&records=1
     * Riwayat track / last known location
     */
    public function trackDetail(Request $request): JsonResponse
    {
        $data = $this->callWithRetry('/808gps/StandardApiAction_queryTrackDetail.action', [
            'devIdno'     => $this->deviceId,
            'begintime'   => $request->query('begintime', ''),
            'endtime'     => $request->query('endtime', ''),
            'currentPage' => $request->query('page', 1),
            'pageRecords' => $request->query('records', 1),
        ]);
        return response()->json($data);
    }

    /**
     * GET /api/cmsv6/vehicle-info
     * Info kendaraan & driver terdaftar di CMSV6
     */
    public function vehicleInfo(): JsonResponse
    {
        $data = $this->callWithRetry('/808gps/StandardApiAction_findVehicleInfoByDeviceId.action', [
            'devIdno' => $this->deviceId,
        ]);
        return response()->json($data);
    }

    /**
     * POST /api/cmsv6/snapshot
     * Paksa dashcam mengambil foto dari kamera kabin (channel 2)
     * Mengembalikan URL foto yang bisa diakses browser
     */
    public function snapshot(Request $request): JsonResponse
    {
        $channel = (int) $request->input('channel', 2); // Default: kabin

        $data = $this->callWithRetry('/808gps/StandardApiAction_deviceSnapshot.action', [
            'devIdno' => $this->deviceId,
            'channel' => $channel,
        ]);

        Log::info('[CMSV6] Snapshot response raw', ['data' => $data]);

        if (($data['result'] ?? -1) !== 0) {
            return response()->json([
                'result'       => $data['result'] ?? -1,
                'photo_url'    => null,
                '_proxy_error' => $data['_proxy_error'] ?? 'Snapshot gagal. Periksa apakah dashcam online.',
                '_raw'         => $data,
            ]);
        }

        // Ambil URL foto dari berbagai kemungkinan field
        $rawUrl = $data['url'] ?? $data['path'] ?? $data['file'] ?? $data['imageUrl'] ?? $data['picUrl'] ?? null;
        $photoUrl = null;

        if ($rawUrl) {
            $photoUrl = str_starts_with($rawUrl, 'http') ? $rawUrl : "{$this->base}/" . ltrim($rawUrl, '/');
        }

        return response()->json([
            'result'    => 0,
            'photo_url' => $photoUrl,
            '_raw'      => $data,  // untuk debugging firmware-spesifik
        ]);
    }

    /**
     * GET /stream-proxy
     * Proxy stream FLV dari CMSV6 ke browser (menghindari CORS & cross-origin)
     */
    public function streamProxy(Request $request)
    {
        $jsession = $request->query('jsession') ?: $this->getSession();
        $dev      = $request->query('dev', $this->deviceId);
        $channel  = (int) $request->query('ch', 1);
        $stream   = (int) $request->query('stream', 1);

        $streamUrl = "{$this->base}/808gps/open/video/realVideo.action"
            . "?jsession={$jsession}"
            . "&devIdno={$dev}"
            . "&channel={$channel}"
            . "&stream={$stream}";

        try {
            $response = Http::timeout(30)
                ->withHeaders(['Accept' => '*/*'])
                ->get($streamUrl);

            return response($response->body(), $response->status())
                ->header('Content-Type', 'video/x-flv')
                ->header('Access-Control-Allow-Origin', '*');
        } catch (\Throwable $e) {
            Log::error('[CMSV6] Stream proxy error: ' . $e->getMessage());
            return response('Stream error', 502);
        }
    }
}
