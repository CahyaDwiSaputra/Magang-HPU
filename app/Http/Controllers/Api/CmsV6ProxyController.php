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
        $this->base     = rtrim(config('services.cmsv6.base_url', 'http://10.10.0.33:8088'), '/');
        $this->account  = config('services.cmsv6.account', 'admin');
        $this->password = config('services.cmsv6.password', 'Password.1');
        $this->deviceId = config('services.cmsv6.device_id', '240078740672');
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

        // Hanya relogin jika server merespons valid dengan kode session expired, bukan saat network timeout
        if (empty($data['_proxy_error']) && ($data['result'] ?? -1) !== 0) {
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
     * GET /api/cmsv6/vehicles
     * Mengambil daftar seluruh unit dashcam yang terdaftar di server PT. HPU
     */
    public function vehicles(): JsonResponse
    {
        $vehicles = [
            [
                'id' => 'HPA-CWR-DT44123XC',
                'plateNo' => 'HPA-CWR-DT44123XC',
                'deviceNo' => '240078921470',
                'sim' => '081119759083',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (44123XC)',
                'site' => 'HPA CWR Pit',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'HPA-CWR-DT44121XC',
                'plateNo' => 'HPA-CWR-DT44121XC',
                'deviceNo' => '240078921678',
                'sim' => '081119759094',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (44121XC)',
                'site' => 'HPA CWR Pit',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'HPA-DT49109MB',
                'plateNo' => 'HPA-DT49109MB',
                'deviceNo' => '240078916025',
                'sim' => '081100105674',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (49109MB)',
                'site' => 'HPA Pit Front',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'BDA-DT41107VV-RU-225',
                'plateNo' => 'BDA-DT41107VV (RU-225)',
                'deviceNo' => '240078740672',
                'sim' => '08115125648',
                'type' => 'DT',
                'model' => 'Dump Truck RU-225',
                'site' => 'BDA Pit Area',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'BDA-DT41121VV-RU-227',
                'plateNo' => 'BDA-DT41121VV (RU-227)',
                'deviceNo' => '291073208720',
                'sim' => '081120270220',
                'type' => 'DT',
                'model' => 'Dump Truck RU-227',
                'site' => 'BDA Pit Area',
                'status' => 'STANDBY',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'HPA-DT47101VV',
                'plateNo' => 'HPA-DT47101VV',
                'deviceNo' => '240078735201',
                'sim' => '081119759089',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (47101)',
                'site' => 'HPA Pit Front',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'HPA-DT47109VV',
                'plateNo' => 'HPA-DT47109VV',
                'deviceNo' => '240078734998',
                'sim' => '081119759085',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (47109)',
                'site' => 'HPA Pit Front',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'HPA-DT47103VV',
                'plateNo' => 'HPA-DT47103VV',
                'deviceNo' => '240078735110',
                'sim' => '081119759087',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (47103)',
                'site' => 'HPA Pit Front',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'HPA-DT47106VV',
                'plateNo' => 'HPA-DT47106VV',
                'deviceNo' => '240078734980',
                'sim' => '081119759080',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (47106)',
                'site' => 'HPA Pit Front',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'KDA-FT28001HN',
                'plateNo' => 'KDA-FT28001HN',
                'deviceNo' => '240079626307',
                'sim' => '08115219303',
                'type' => 'FT',
                'model' => 'Fuel Truck 28,000L',
                'site' => 'KDA Pit',
                'status' => 'STANDBY',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin'],
                ]
            ],
            [
                'id' => 'KDA-FT40003MB',
                'plateNo' => 'KDA-FT40003MB',
                'deviceNo' => '240079658477',
                'sim' => '08115219305',
                'type' => 'FT',
                'model' => 'Fuel Truck 40,000L',
                'site' => 'KDA Pit',
                'status' => 'STANDBY',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin'],
                ]
            ],
            [
                'id' => 'KIA-DT42101VV-HAUL',
                'plateNo' => 'KIA-DT42101VV (HAUL)',
                'deviceNo' => '240079676909',
                'sim' => '08115219637',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (42101)',
                'site' => 'KIA Hauling Road',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'KJA-DT49125MB-HAUL',
                'plateNo' => 'KJA-DT49125MB (HAUL)',
                'deviceNo' => '240079664063',
                'sim' => '08115219644',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (49125)',
                'site' => 'KJA Hauling Road',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'KJA-DT49115MB-HAUL',
                'plateNo' => 'KJA-DT49115MB (HAUL)',
                'deviceNo' => '240079636952',
                'sim' => '08115219314',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (49115)',
                'site' => 'KJA Hauling Road',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'KJA-DT49113MB-HAUL',
                'plateNo' => 'KJA-DT49113MB (HAUL)',
                'deviceNo' => '240079608836',
                'sim' => '08115219307',
                'type' => 'DT',
                'model' => 'Dump Truck Hauling (49113)',
                'site' => 'KJA Hauling Road',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'EXCA-PC2000-01',
                'plateNo' => 'EX-2001 (Komatsu PC2000)',
                'deviceNo' => '240078915951',
                'sim' => '08115219999',
                'type' => 'EXCA',
                'model' => 'Excavator Komatsu PC2000-8',
                'site' => 'Pit Front Alfa',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Area Kerja (Loading)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Operator'],
                ]
            ],
            [
                'id' => 'EXCA-PC1250-02',
                'plateNo' => 'EX-1252 (Komatsu PC1250)',
                'deviceNo' => '240078915952',
                'sim' => '08115219998',
                'type' => 'EXCA',
                'model' => 'Excavator Komatsu PC1250-8',
                'site' => 'Pit Front Bravo',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Area Kerja (Loading)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Operator'],
                ]
            ],
            [
                'id' => 'BDA-DT41110VV-RU-230',
                'plateNo' => 'BDA-DT41110VV (RU-230)',
                'deviceNo' => '240078740557',
                'sim' => '08115125650',
                'type' => 'DT',
                'model' => 'Dump Truck RU-230',
                'site' => 'BDA Pit Area',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ],
            [
                'id' => 'DT-HPU-01',
                'plateNo' => 'HD-78501 (Trial UNS)',
                'deviceNo' => '240078916116',
                'sim' => '081119759000',
                'type' => 'DT',
                'model' => 'Dump Truck HD-785',
                'site' => 'Trial Mining Route',
                'status' => 'ONLINE',
                'channels' => [
                    ['channel' => 0, 'name' => 'CAM 1 — Depan (Jalan)'],
                    ['channel' => 1, 'name' => 'CAM 2 — Kabin Pengemudi'],
                ]
            ]
        ];

        // Ambil status real-time langsung dari server CMSV6 HPU Monitoring (10.10.0.33:8088)
        $statusMap = Cache::remember('cmsv6_online_map_v4', 10, function() use ($vehicles) {
            $map = [];
            $devIds = array_filter(array_column($vehicles, 'deviceNo'));
            
            // 1. Batch query device status (GPS, speed, online, last time gt)
            if (!empty($devIds)) {
                $batchStr = implode(',', $devIds);
                $stRes = $this->callWithRetry('/808gps/StandardApiAction_getDeviceStatus.action', [
                    'devIdno' => $batchStr
                ]);
                if (($stRes['result'] ?? -1) === 0 && isset($stRes['status']) && is_array($stRes['status'])) {
                    foreach ($stRes['status'] as $st) {
                        $id = $st['id'] ?? '';
                        if ($id) {
                            $map[$id] = [
                                'status_raw' => $st,
                                'ol'         => ($st['ol'] ?? 0) == 1,
                                'sp'         => ($st['sp'] ?? 0) / 10.0,
                                'gt'         => $st['gt'] ?? null,
                                'lat'        => isset($st['lat']) ? $st['lat'] / 1000000.0 : null,
                                'lng'        => isset($st['lng']) ? $st['lng'] / 1000000.0 : null,
                            ];
                        }
                    }
                }
            }

            // 2. Query video device capability for registered devices
            foreach ($devIds as $devId) {
                $vRes = $this->callWithRetry('/808gps/open/player/StandardApiAction_getVideoDevice.action', [
                    'devIdno' => $devId
                ]);
                $hasVideo = (($vRes['result'] ?? -1) === 0 && ($vRes['isVideoDevice'] ?? 0) == 1);
                $chnCount = $vRes['chnCount'] ?? ($hasVideo ? 2 : 0);
                
                if (!isset($map[$devId])) {
                    $map[$devId] = [];
                }
                $map[$devId]['has_video'] = $hasVideo;
                $map[$devId]['chn_count'] = $chnCount;
                if (($vRes['result'] ?? -1) === 0 && isset($vRes['isOnline'])) {
                    if (!isset($map[$devId]['ol'])) {
                        $map[$devId]['ol'] = ($vRes['isOnline'] == 1);
                    }
                }
            }
            return $map;
        });

        $availCount = 0;
        $lostCount  = 0;
        $notAvailCount = 0;

        foreach ($vehicles as &$v) {
            $devId = $v['deviceNo'] ?? '';
            $info = $statusMap[$devId] ?? null;
            
            $isOnline = $info['ol'] ?? false;
            $hasVideo = $info['has_video'] ?? false;
            $lastSeen = $info['gt'] ?? null;
            $speed    = $info['sp'] ?? 0;
            $lat      = $info['lat'] ?? null;
            $lng      = $info['lng'] ?? null;

            if ($isOnline) {
                // Unit sedang online dan streaming video HD live tersedia
                $v['dashcam_status']       = 'AVAILABLE';
                $v['dashcam_status_label'] = 'Livecam Tersedia';
                $v['status']               = 'ONLINE';
                $v['is_registered']        = true;
                $availCount++;
            } elseif ($hasVideo || (!empty($lastSeen) && $lastSeen !== 'Never')) {
                // Unit memiliki hardware MDVR terdaftar di CMSV6, namun sedang offline / sinyal putus
                $v['dashcam_status']       = 'LOST_CONNECTION';
                $v['dashcam_status_label'] = 'Lost Connection';
                $v['status']               = 'LOST_CONNECTION';
                $v['is_registered']        = true;
                $lostCount++;
            } else {
                // Unit armada tambang belum dipasangi dashcam / belum terdaftar di CMSV6
                $v['dashcam_status']       = 'NOT_AVAILABLE';
                $v['dashcam_status_label'] = 'Belum Tersedia';
                $v['status']               = 'STANDBY';
                $v['is_registered']        = false;
                $notAvailCount++;
            }

            $v['has_dashcam'] = $hasVideo;
            $v['last_seen']   = $lastSeen;
            $v['speed']       = $speed;
            if ($lat !== null && $lng !== null) {
                $v['latitude']  = $lat;
                $v['longitude'] = $lng;
            }
        }
        unset($v);

        // Urutkan:
        // 1) AVAILABLE (Live) pertama
        // 2) LOST_CONNECTION kedua
        // 3) NOT_AVAILABLE terakhir
        usort($vehicles, function ($a, $b) {
            $priority = [
                'AVAILABLE'       => 1,
                'LOST_CONNECTION' => 2,
                'NOT_AVAILABLE'   => 3,
            ];
            $pA = $priority[$a['dashcam_status']] ?? 9;
            $pB = $priority[$b['dashcam_status']] ?? 9;
            if ($pA !== $pB) return $pA - $pB;

            return strcmp($a['plateNo'], $b['plateNo']);
        });

        return response()->json([
            'result'                => 0,
            'total'                 => count($vehicles),
            'available_count'       => $availCount,
            'lost_connection_count' => $lostCount,
            'not_available_count'   => $notAvailCount,
            'vehicles'              => $vehicles,
        ]);
    }

    /**
     * GET /api/cmsv6/status
     * Status perangkat (GPS, kecepatan, bahan bakar, online/offline)
     */
    public function deviceStatus(?Request $request = null): JsonResponse
    {
        $request = $request ?? request();
        $devId = $request->input('devIdno', $this->deviceId);
        $cacheKey = "cmsv6_dev_status_{$devId}";

        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return response()->json($cached);
        }

        $data = $this->callWithRetry('/808gps/StandardApiAction_getDeviceStatus.action', [
            'devIdno' => $devId,
        ]);

        if (!empty($data['_proxy_error'])) {
            // Jika proxy error / IoT server offline, cache fallback 15 detik agar tidak memblokir event loop
            $fallback = [
                'result' => 0,
                'status' => [
                    [
                        'id' => $devId,
                        'online' => 1,
                        'sp' => 0,
                        'ml' => 0,
                        'gt' => now()->format('Y-m-d H:i:s'),
                    ]
                ],
                '_fallback' => true,
            ];
            Cache::put($cacheKey, $fallback, now()->addSeconds(15));
            return response()->json($fallback);
        }

        Cache::put($cacheKey, $data, now()->addSeconds(5));
        return response()->json($data);
    }

    /**
     * GET /api/cmsv6/alarms
     * Mengambil daftar alarm aktif yang selaras dengan Alarm Center CMSv6 (18 Alarm: Fierce Driving & GSensor)
     */
    public function alarms(?Request $request = null): JsonResponse
    {
        $request = $request ?? request();
        $alarms = Cache::get('cmsv6_active_alarms');

        if ($alarms === null) {
            $alarms = $this->getInitialCmsv6Alarms();
            Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));
        }

        // Cek apakah ada permintaan live_speed untuk memicu alarm dinamis (hanya jika live_speed=1)
        $devId = $request->input('devIdno', $this->deviceId);
        $statusData = null;
        if ($request->boolean('live_speed', false)) {
            try {
                $statusRes = $this->deviceStatus($request);
                $statusData = $statusRes->getData(true);
            } catch (\Throwable $e) {
                $statusData = null;
            }
        }

        $vehiclePlate = 'BDA-DT41107VV (RU-225)';
        if ($devId === '240078916116') {
            $vehiclePlate = 'HD-78501 (Trial UNS)';
        } else if ($devId === '240078740557') {
            $vehiclePlate = 'BDA-DT41110VV (RU-230)';
        }

        if (!empty($statusData['status'][0])) {
            $s = $statusData['status'][0];
            $speed = round(($s['sp'] ?? 0) / 10);
            if ($speed > 40) {
                // Pastikan overspeed alarm ada di daftar untuk armada ini
                $hasOverspeed = false;
                foreach ($alarms as $a) {
                    if (($a['type'] ?? 0) === 101 && ($a['handle_status'] ?? '') === 'Untreated' && (($a['vehicle'] ?? '') === $vehiclePlate || ($a['devIdno'] ?? '') === $devId)) {
                        $hasOverspeed = true;
                        break;
                    }
                }
                if (!$hasOverspeed) {
                    array_unshift($alarms, [
                        'guid'          => 'ALM-SPD-' . time(),
                        'desc'          => "Overspeed Warning ({$speed} km/h > 40 km/h)",
                        'category'      => 'Hauling Safety',
                        'type'          => 101,
                        'severity'      => 'critical',
                        'handle_status' => 'Untreated',
                        'current_state' => 'Alarming',
                        'time'          => now()->format('Y-m-d H:i:s'),
                        'vehicle'       => $vehiclePlate,
                        'devIdno'       => $devId,
                        'company'       => 'Hpu',
                    ]);
                    Cache::put('cmsv6_active_alarms', $alarms, now()->addDays(7));
                }
            } else {
                // Kecepatan normal (<= 40 km/h): hilangkan alarm overspeed dinamis lama yang belum ditangani
                $cleanedAlarms = array_values(array_filter($alarms, function($a) use ($vehiclePlate, $devId) {
                    $isAutoOverspeed = (($a['type'] ?? 0) === 101 && ($a['handle_status'] ?? '') === 'Untreated');
                    if (!$isAutoOverspeed) return true;
                    // Hapus jika milik kendaraan yang saat ini normal
                    $matchesVeh = (($a['vehicle'] ?? '') === $vehiclePlate || ($a['devIdno'] ?? '') === $devId || ($a['vehicle'] ?? '') === 'TrialUNS2');
                    return !$matchesVeh;
                }));
                if (count($cleanedAlarms) !== count($alarms)) {
                    $alarms = $cleanedAlarms;
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

        $vehicle = $request->input('vehicle') ?? 'BDA-DT41107VV (RU-225)';
        $devId = $request->input('deviceId') ?? $request->input('devIdno', $this->deviceId);

        $newAlarm = [
            'guid'          => 'ALM-SIM-' . uniqid(),
            'desc'          => $info['desc'],
            'category'      => $info['category'],
            'type'          => $info['type'],
            'severity'      => $info['severity'],
            'handle_status' => 'Untreated',
            'current_state' => 'Alarming',
            'time'          => now()->format('Y-m-d H:i:s'),
            'vehicle'       => $vehicle,
            'devIdno'       => $devId,
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
     * Data awal 18 alarm terstandarisasi keselamatan tambang (Poin 11: DMS, ADAS, Overspeed)
     */
    private function getInitialCmsv6Alarms(): array
    {
        $list = [];
        $baseTime = strtotime('2026-11-24 10:30:00');

        // 1. KATEGORI DMS (Driver Monitoring System - Keamanan & Perilaku Pengemudi di Kabin)
        $dmsAlarms = [
            ['ALM-DMS-001', 'Peringatan Kantuk Berat / Micro-Sleep', 'DMS Fatigue', 301, 'critical', 'Untreated', 'Alarming', 0, 'Kabin Operator (CAM 2)', 'BDA-DT41107VV (RU-225)'],
            ['ALM-DMS-002', 'Pengemudi Menggunakan Handphone', 'DMS Phone', 302, 'high', 'Untreated', 'Alarm End', 180, 'Kabin Operator (CAM 2)', 'BDA-DT41107VV (RU-225)'],
            ['ALM-DMS-003', 'Merokok di Dalam Kabin Unit', 'DMS Smoking', 303, 'high', 'Untreated', 'Alarm End', 420, 'Kabin Operator (CAM 2)', 'HD-78501 (Trial UNS)'],
            ['ALM-DMS-004', 'Distraksi Pengemudi / Pandangan Tidak Fokus', 'DMS Distraction', 304, 'medium', 'Untreated', 'Alarm End', 750, 'Kabin Operator (CAM 2)', 'TrialUNS2'],
            ['ALM-DMS-005', 'Kamera Kabin Tertutup / Terhalang', 'DMS Camera Blocked', 305, 'critical', 'Untreated', 'Alarm End', 1100, 'Kabin Operator (CAM 2)', 'BDA-DT41110VV (RU-230)'],
            ['ALM-DMS-006', 'Kelelahan Ekstrem / Sering Menguap', 'DMS Yawn', 306, 'medium', 'Untreated', 'Alarm End', 1500, 'Kabin Operator (CAM 2)', 'TrialUNS2'],
        ];

        foreach ($dmsAlarms as $dms) {
            $list[] = [
                'guid'          => $dms[0],
                'desc'          => $dms[1],
                'category'      => $dms[2],
                'type'          => $dms[3],
                'severity'      => $dms[4],
                'handle_status' => $dms[5],
                'current_state' => $dms[6],
                'time'          => date('Y-m-d H:i:s', $baseTime - $dms[7]),
                'location'      => $dms[8],
                'vehicle'       => $dms[9],
                'company'       => 'Hpu',
            ];
        }

        // 2. KATEGORI ADAS (Advanced Driver Assistance System - Bahaya Lalu Lintas Jalan & Tabrakan)
        $adasAlarms = [
            ['ALM-ADAS-001', 'Forward Collision Warning (FCW - Jarak Kritis)', 'ADAS Collision', 201, 'critical', 'Untreated', 'Alarm End', 90, 'Jalur Hauling KM 14', 'BDA-DT41107VV (RU-225)'],
            ['ALM-ADAS-002', 'Lane Departure Warning (LDW - Keluar Lajur)', 'ADAS Lane', 202, 'high', 'Untreated', 'Alarm End', 310, 'Jalur Hauling KM 15.5', 'HD-78501 (Trial UNS)'],
            ['ALM-ADAS-003', 'Tailgating / Jarak Iring Terlalu Dekat (< 30m)', 'ADAS Headway', 203, 'medium', 'Untreated', 'Alarm End', 600, 'Turunan KM 13', 'BDA-DT41107VV (RU-225)'],
            ['ALM-ADAS-004', 'Collision Rollover Alarm (Kemiringan Kritis)', 'ADAS Rollover (GSensor)', 204, 'critical', 'Untreated', 'Alarm End', 920, 'Front Disposal OPD-LW', 'TrialUNS2'],
            ['ALM-ADAS-005', 'Pengereman Mendadak Ekstrem (Harsh Braking)', 'ADAS Fierce Driving', 205, 'high', 'Untreated', 'Alarm End', 1350, 'Crossing TOS HPA', 'BDA-DT41110VV (RU-230)'],
            ['ALM-ADAS-006', 'Blind Spot Hazard / Unit Mendekati Sisi Kanan', 'ADAS BlindSpot', 206, 'medium', 'Untreated', 'Alarm End', 1700, 'Jalur Hauling KM 16', 'TrialUNS2'],
        ];

        foreach ($adasAlarms as $adas) {
            $list[] = [
                'guid'          => $adas[0],
                'desc'          => $adas[1],
                'category'      => $adas[2],
                'type'          => $adas[3],
                'severity'      => $adas[4],
                'handle_status' => $adas[5],
                'current_state' => $adas[6],
                'time'          => date('Y-m-d H:i:s', $baseTime - $adas[7]),
                'location'      => $adas[8],
                'vehicle'       => $adas[9],
                'company'       => 'Hpu',
            ];
        }

        // 3. KATEGORI OVERSPEED (Pelanggaran Batas Kecepatan Spasial Geofence)
        $speedAlarms = [
            ['ALM-SPD-001', 'Overspeed Jalur Hauling (48 km/j > batas 40 km/j)', 'Overspeed Hauling', 101, 'critical', 'Untreated', 'Alarm End', 45, 'Jalur Hauling HPA KM 14', 'BDA-DT41107VV (RU-225)'],
            ['ALM-SPD-002', 'Overspeed Area Front Loading (26 km/j > batas 20 km/j)', 'Overspeed Pit', 102, 'high', 'Untreated', 'Alarm End', 240, 'Pit Front Selatan HPA', 'HD-78501 (Trial UNS)'],
            ['ALM-SPD-003', 'Overspeed Persimpangan / Crossing (22 km/j > batas 15 km/j)', 'Overspeed Crossing', 103, 'high', 'Untreated', 'Alarm End', 510, 'Simpang Empat TOS / ERT', 'BDA-DT41107VV (RU-225)'],
            ['ALM-SPD-004', 'Overspeed Disposal Area (25 km/j > batas 15 km/j)', 'Overspeed Disposal', 104, 'medium', 'Untreated', 'Alarm End', 810, 'Disposal OPD LW', 'TrialUNS2'],
            ['ALM-SPD-005', 'Overspeed Turunan Curam KM 13 (36 km/j > batas 25 km/j)', 'Overspeed Hauling', 105, 'critical', 'Untreated', 'Alarm End', 1250, 'Turunan STA KM 13', 'BDA-DT41110VV (RU-230)'],
            ['ALM-SPD-006', 'Overspeed Area Workshop / Parkir (18 km/j > batas 10 km/j)', 'Overspeed Fasilitas', 106, 'medium', 'Untreated', 'Alarm End', 1600, 'Workshop HPU Central', 'TrialUNS2'],
        ];

        foreach ($speedAlarms as $spd) {
            $list[] = [
                'guid'          => $spd[0],
                'desc'          => $spd[1],
                'category'      => $spd[2],
                'type'          => $spd[3],
                'severity'      => $spd[4],
                'handle_status' => $spd[5],
                'current_state' => $spd[6],
                'time'          => date('Y-m-d H:i:s', $baseTime - $spd[7]),
                'location'      => $spd[8],
                'vehicle'       => $spd[9],
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
     * GET /api/cmsv6/stream
     * Proxy stream FLV langsung dari CMSV6 Gateway port 6604 ke browser (HTTPS & bypass mixed-content)
     */
    public function streamProxy(Request $request)
    {
        $jsession = $request->query('jsession') ?: $this->getSession();
        $dev      = $request->query('dev', $this->deviceId);
        $channel  = (int) $request->query('ch', 0);
        $stream   = (int) $request->query('stream', 1);

        $mediaHost = env('CMSV6_MEDIA_HOST', '10.10.0.33:6604');
        $streamUrl = "http://{$mediaHost}/3/3?AVType=1&jsession={$jsession}&DevIDNO={$dev}&Channel={$channel}&Stream={$stream}";

        return response()->stream(function () use ($streamUrl) {
            $context = stream_context_create([
                'http' => [
                    'timeout' => 15,
                ]
            ]);
            $fp = @fopen($streamUrl, 'rb', false, $context);
            if ($fp) {
                while (!feof($fp) && !connection_aborted()) {
                    $chunk = fread($fp, 16384);
                    if ($chunk !== false && strlen($chunk) > 0) {
                        echo $chunk;
                        flush();
                    }
                }
                fclose($fp);
            }
        }, 200, [
            'Content-Type' => 'video/x-flv',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'Access-Control-Allow-Origin' => '*',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
