import { Head } from '@inertiajs/react';
import LayoutNavbar from '@/components/layout-navbar';
import { 
    Video, AlertCircle, ShieldCheck, Map as MapIcon, Truck, Fuel, Power, 
    UserCheck, UserX, LogOut, Navigation, ArrowRightCircle, LogIn, X, 
    ChevronDown, Search, History, Camera, CheckCircle2, ScanFace, UserPlus,
    ShieldAlert, Check, CheckCheck, Sparkles, Bell, LandPlot, Play, RotateCw, 
    Plus, Trash2, MapPin, Clock, Gauge, Layers, Activity, FileText, CheckCircle,
    LayoutGrid, Rows
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';

const DEVICE_ID = "240078916116";

// Channel 0 = CAM 1 Depan (Metode 1: videoH5.html langsung dari server CMSV6 HPU)
// Channel 1 = CAM 2 Kabin (Metode 2: player.html dengan optimasi low-latency)
function camUrl(channel: number, jsession: string | null, baseUrl: string = "http://182.253.27.12:8080") {
    if (jsession) {
        const mediaHost = (baseUrl && baseUrl.includes('://')) ? `${new URL(baseUrl).hostname}:6604` : '182.253.27.12:6604';
        return `/player.html?dev=${DEVICE_ID}&ch=${channel}&jsession=${jsession}&host=${mediaHost}`;
    }
    return null;
}

const channels = [
    { id: "cam1", apiChannel: 0, label: "CAM 1 — Depan", hasStream: true },
    { id: "cam2", apiChannel: 1, label: "CAM 2 — Kabin", hasStream: true },
];

export default function Page() {
    // ── STATE DUMMY UNTUK PASSENGER DETECTION ──
    const [passengerDetected, setPassengerDetected] = useState(true);

    // ── STATE UNTUK DATA GPS & TELEMETRI ──
    const [telemetry, setTelemetry] = useState<{
        lat: number | null;
        lng: number | null;
        speed: number;
        distance: number;
        fuel: number;       // dalam Liter (raw dari field `ft`)
        satellites: number; // jumlah satelit terkunci (field `gd`)
        online: boolean;
        lastUpdate: string;
        inGeofence: boolean;
        gpsLocked: boolean;
        isLastKnown: boolean;
    }>({
        lat: -7.658200,
        lng: 111.189500,
        speed: 0,
        distance: 48.9,
        fuel: 27,
        satellites: 0,
        online: false,
        lastUpdate: '-',
        inGeofence: true,
        gpsLocked: false,
        isLastKnown: true,
    });
    const [jsession, setJsession] = useState<string | null>(null);
    const [cmsBaseUrl, setCmsBaseUrl] = useState<string>("http://182.253.27.12:8080");
    const [apiStatus, setApiStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
    const [rawGPS, setRawGPS] = useState<any>({});
    const [driver, setDriver] = useState<{ name: string; id: string; match: number; photoUrl?: string; position?: string; time?: string } | null>(null);
    
    // ── STATE ALARM CENTER CMSV6 ──
    type AlarmItem = {
        guid: string;
        desc: string;
        category?: string;
        type?: number;
        severity?: 'critical' | 'high' | 'medium' | 'low';
        handle_status?: 'Untreated' | 'Handled';
        current_state?: string;
        time: string;
        vehicle?: string;
        company?: string;
    };
    const [alarms, setAlarms] = useState<AlarmItem[]>([]);
    const [alarmTab, setAlarmTab] = useState<'all' | 'gsensor' | 'fd' | 'dms'>('all');
    const [showSimulator, setShowSimulator] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [driverList, setDriverList] = useState<{ id: string; name: string; position?: string; dept?: number; site?: string }[]>([]);
    const [searchDriver, setSearchDriver] = useState<string>('');
    const [showCheckin, setShowCheckin] = useState(false);
    const [checkinTab, setCheckinTab] = useState<'list' | 'new'>('list');
    const [newDriverName, setNewDriverName] = useState('');
    const [newDriverId, setNewDriverId] = useState('');
    const [newDriverPos, setNewDriverPos] = useState('Operator Alat Berat');
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [isCapturingPreview, setIsCapturingPreview] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isAutoDetecting, setIsAutoDetecting] = useState(false);
    const [showChangeTarget, setShowChangeTarget] = useState(false);
    const [targetDriver, setTargetDriver] = useState<{ name: string; id: string; position: string }>(() => {
        try {
            const saved = typeof window !== 'undefined' ? localStorage.getItem('dashcam_target_driver') : null;
            if (saved) return JSON.parse(saved);
        } catch {}
        return { name: 'Cahya Dwi Saputra', id: '1234567890', position: 'Operator Alat Berat' };
    });
    const [showHistory, setShowHistory] = useState(false);
    const [historyLogs, setHistoryLogs] = useState<{ id: number; name: string; employee_id: string; confidence: number; photo_url: string; time: string }[]>([]);
    const [isScanningFace, setIsScanningFace] = useState(false);
    const [faceStatus, setFaceStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [faceMessage, setFaceMessage] = useState<string>('');
    // ── TYPES SESUAI DOKUMEN HPU-UNS FLEET MANAGEMENT (Slide 6, 19, 21, 25, 26, 28) ──
    type GeofenceItem = {
        id: number;
        name: string;
        type: 'loading' | 'dumping' | 'parking' | 'road' | 'custom' | string;
        latitude: number;
        longitude: number;
        radius: number;
        color?: string;
        address?: string;
        material?: string;
        geometry_type?: 'circle' | 'polygon' | 'line' | string;
    };

    type RitasiLogItem = {
        id: number;
        unit_code?: string;
        load_type?: string;
        pit_name?: string;
        dumping_name?: string;
        cycle_time_minutes?: number;
        distance_km?: number;
        pto_confirmed?: boolean;
        entered_at?: string;
        date_formatted?: string;
        geofence_id?: number;
        geofence_name?: string;
        geofence_type?: string;
    };

    type HaulingStage = 'LOADING' | 'TRAVEL_ISI' | 'DUMPING' | 'TRAVEL_KOSONG' | 'IDLE';
    type MaterialType = 'OB' | 'COAL' | 'MUD' | 'TOP SOIL' | 'LIMONIT' | 'SAPROLIT';

    const [geofences, setGeofences] = useState<GeofenceItem[]>([]);
    const [ritasiToday, setRitasiToday] = useState<number>(0);
    const [totalDistanceKm, setTotalDistanceKm] = useState<number>(48.9);
    const [avgCycleTimeToday, setAvgCycleTimeToday] = useState<number>(22.4);
    const [totalBcmToday, setTotalBcmToday] = useState<number>(0);
    const [materialBreakdown, setMaterialBreakdown] = useState<Record<string, number>>({
        OB: 0, COAL: 0, MUD: 0, 'TOP SOIL': 0, LIMONIT: 0, SAPROLIT: 0
    });
    const [ritasiLogs, setRitasiLogs] = useState<RitasiLogItem[]>([]);
    const [activeGeofence, setActiveGeofence] = useState<{ id: number; name: string; type: string; distance: number } | null>({
        id: 2,
        name: 'Pit Front A (Loading OB)',
        type: 'loading',
        distance: 0,
    });
    const [lastGeofenceId, setLastGeofenceId] = useState<number | null>(null);
    const [isSimulatingTrip, setIsSimulatingTrip] = useState(false);
    const [showGeofenceModal, setShowGeofenceModal] = useState(false);
    const [showRitasiHistoryModal, setShowRitasiHistoryModal] = useState(false);
    const [cameraViewMode, setCameraViewMode] = useState<'dual' | 'cam1' | 'cam2' | 'stacked'>('dual');

    // State Fitur Ritasi & Sensor PTO (Slide 16, 19, 25)
    const [ptoActive, setPtoActive] = useState<boolean>(false);
    const [haulingStage, setHaulingStage] = useState<HaulingStage>('LOADING');
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('OB');
    const [currentTrip, setCurrentTrip] = useState<{
        startTime: string;
        nowTime: string;
        finishArea: string;
        tripProgress: number;
        cycleTimeMinutes: number;
    }>({
        startTime: '10:00 WITA',
        nowTime: '10:25 WITA',
        finishArea: 'Disposal Timur (Dumping Area)',
        tripProgress: 45,
        cycleTimeMinutes: 22,
    });

    const [newGeofence, setNewGeofence] = useState<{
        name: string;
        type: string;
        radius: number;
        color: string;
        address: string;
        material: string;
        geometry_type: string;
    }>({
        name: '',
        type: 'dumping',
        radius: 150,
        color: '#8B5CF6',
        address: 'Blok Disposal Tambang HPU',
        material: 'OB',
        geometry_type: 'circle',
    });
    const [geofenceNotice, setGeofenceNotice] = useState<string | null>(null);

    // Helper: Konversi format NMEA (DDDMM.MMMMM) ke Decimal Degrees
    const nmeaToDecimal = (val: string, isNegative = false): number => {
        const num = parseFloat(val);
        if (isNaN(num) || num === 0) return 0;
        const deg = Math.floor(Math.abs(num) / 100);
        const minutes = Math.abs(num) - deg * 100;
        const decimal = deg + minutes / 60;
        return isNegative ? -decimal : decimal;
    };

    // ── FETCH JSESSION VIA PROXY (server-to-server) ──
    const login = async () => {
        try {
            const res = await fetch('/api/cmsv6/session');
            const data = await res.json();
            if (data.jsession) {
                setJsession(data.jsession);
                if (data.base_url) {
                    setCmsBaseUrl(data.base_url);
                }
                setApiStatus('live');
                return data.jsession;
            } else {
                setApiStatus('error');
                return null;
            }
        } catch {
            setApiStatus('error');
            return null;
        }
    };

    // Helper: Ambil frame nyata dari video element kamera kabin via HTML5 Canvas
    const captureCabinFrame = async (): Promise<string | null> => {
        try {
            const iframes = document.querySelectorAll('iframe');
            for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];
                if (iframe.title?.includes('Kabin') || iframe.src?.includes('ch=1')) {
                    const win = iframe.contentWindow as any;

                    // 1. Coba fungsi getSnapshot langsung dari player.html (dalam execution context yang sama)
                    if (win && typeof win.getSnapshot === 'function') {
                        const snap = win.getSnapshot();
                        if (snap && snap.startsWith('data:image')) {
                            console.log('[FaceRecognition] Snapshot berhasil via win.getSnapshot()');
                            return snap;
                        }
                    }

                    // 2. Akses document iframe jika satu origin (localhost:8000)
                    const doc = iframe.contentDocument || win?.document;
                    if (doc) {
                        const video = doc.querySelector('video') as HTMLVideoElement;
                        if (video && video.videoWidth > 0 && video.videoHeight > 0) {
                            // Gunakan createElement dari document iframe agar tidak dianggap tainted oleh browser
                            const canvas = doc.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                                if (dataUrl && dataUrl.startsWith('data:image')) {
                                    console.log('[FaceRecognition] Snapshot berhasil via iframe canvas');
                                    return dataUrl;
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('[FaceRecognition] Video frame capture error:', e);
        }
        return null;
    };

    const fetchDrivers = async (query = '') => {
        try {
            const res = await fetch(`/api/dashcam/drivers?q=${encodeURIComponent(query)}&limit=30`);
            const data = await res.json();
            if (data.status === 'ok' && data.data) {
                setDriverList(data.data);
            }
        } catch (err) {
            console.error("Error fetching drivers:", err);
        }
    };

    const fetchHistoryLogs = async () => {
        try {
            const res = await fetch('/api/dashcam/history');
            const data = await res.json();
            if (data.status === 'ok') {
                setHistoryLogs(data.data || []);
            }
        } catch (err) {}
    };

    const handleSelectManualDriver = async (d: { id: string; name: string; position?: string }) => {
        setShowCheckin(false);
        setIsScanningFace(false);
        setFaceStatus('success');
        setFaceMessage(`Operator ${d.name} berhasil di-assign.`);
        setDriver({
            name: d.name,
            id: d.id,
            match: 99,
            position: d.position || 'Operator Alat Berat',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        });
        try {
            await fetch('/api/dashcam/face-recognition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    deviceId: DEVICE_ID,
                    capturedAt: new Date().toISOString(),
                    source: 'manual-assignment',
                    driverName: d.name,
                    employeeId: d.id,
                }),
            });
        } catch {}
    };

    // Helper: Hitung jarak Haversine (meter)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3;
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    };

    const fetchGeofences = async () => {
        try {
            const res = await fetch('/api/dashcam/geofences');
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.data)) {
                setGeofences(data.data);
            }
        } catch (err) {}
    };

    const fetchRitasiToday = async () => {
        try {
            const res = await fetch('/api/dashcam/ritasi-today');
            const data = await res.json();
            if (data.status === 'ok') {
                setRitasiToday(data.count ?? 0);
                if (data.total_distance_km !== undefined) setTotalDistanceKm(data.total_distance_km);
                if (data.avg_cycle_time_min !== undefined) setAvgCycleTimeToday(data.avg_cycle_time_min);
                if (data.total_bcm !== undefined) setTotalBcmToday(data.total_bcm);
                if (data.material_breakdown) setMaterialBreakdown(data.material_breakdown);
                if (Array.isArray(data.logs)) {
                    setRitasiLogs(data.logs);
                }
            }
        } catch (err) {}
    };

    const recordRitasi = async (params?: {
        dumpingGeofenceId?: number;
        pitGeofenceId?: number;
        dumpingName?: string;
        loadType?: string;
        cycleTimeMinutes?: number;
        distanceKm?: number;
        ptoConfirmed?: boolean;
    }) => {
        try {
            const res = await fetch('/api/dashcam/ritasi/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    unit_code: 'HD-78501',
                    load_type: params?.loadType || selectedMaterial,
                    dumping_geofence_id: params?.dumpingGeofenceId || 3,
                    pit_geofence_id: params?.pitGeofenceId || 2,
                    cycle_time_minutes: params?.cycleTimeMinutes || 21.5,
                    distance_km: params?.distanceKm || 2.4,
                    pto_confirmed: params?.ptoConfirmed ?? true,
                }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                setRitasiToday(data.count ?? 0);
                void fetchRitasiToday();
                setGeofenceNotice(`🎉 RITASI TERCATAT (+1 RIT)! Siklus [${params?.loadType || selectedMaterial}] dari Pit Front A ke ${params?.dumpingName || 'Disposal Timur'} selesai (PTO Terverifikasi). Total hari ini: ${data.count} RIT.`);
                setTimeout(() => setGeofenceNotice(null), 8000);
            }
        } catch (e) {
            console.error("Gagal mencatat ritasi:", e);
        }
    };

    const handleResetRitasi = async () => {
        if (!confirm('Apakah Anda yakin ingin mereset hitungan ritasi hari ini menjadi 0?')) return;
        try {
            const res = await fetch('/api/dashcam/ritasi/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const data = await res.json();
            if (data.status === 'ok') {
                setRitasiToday(0);
                setTotalBcmToday(0);
                setRitasiLogs([]);
                setGeofenceNotice('Hitungan ritasi hari ini berhasil direset ke 0.');
                setTimeout(() => setGeofenceNotice(null), 4000);
            }
        } catch {}
    };

    const handleCreateGeofence = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGeofence.name.trim()) {
            alert('Mohon isi nama geofence');
            return;
        }
        const latToUse = telemetry.lat ?? -7.6582;
        const lngToUse = telemetry.lng ?? 111.1895;
        try {
            const res = await fetch('/api/dashcam/geofences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: newGeofence.name.trim(),
                    type: newGeofence.type,
                    latitude: latToUse,
                    longitude: lngToUse,
                    radius: Number(newGeofence.radius) || 150,
                    color: newGeofence.color,
                    address: newGeofence.address,
                    material: newGeofence.material,
                    geometry_type: newGeofence.geometry_type,
                }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                await fetchGeofences();
                setShowGeofenceModal(false);
                setNewGeofence({
                    name: '',
                    type: 'dumping',
                    radius: 150,
                    color: '#8B5CF6',
                    address: 'Blok Disposal Tambang HPU',
                    material: 'OB',
                    geometry_type: 'circle',
                });
                setGeofenceNotice(`Geofence "${data.data.name}" (${data.data.type}) berhasil ditambahkan.`);
                setTimeout(() => setGeofenceNotice(null), 4000);
            } else {
                alert(data.message || 'Gagal menambahkan geofence');
            }
        } catch {
            alert('Gagal menghubungi server.');
        }
    };

    const handleDeleteGeofence = async (id: number, name: string) => {
        if (!confirm(`Hapus geofence "${name}"?`)) return;
        try {
            const res = await fetch(`/api/dashcam/geofences/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await res.json();
            if (data.status === 'ok') {
                await fetchGeofences();
                setGeofenceNotice(`Geofence "${name}" berhasil dihapus.`);
                setTimeout(() => setGeofenceNotice(null), 4000);
            }
        } catch {}
    };

    // ── SIMULASI 5 SIKLUS HAULING LENGKAP (Slide 25 & Slide 6) ──
    // 1. Loading: Pit Front A (Speed 0, Engine On, Exca swing)
    // 2. Travel Isi: Kecepatan 28 km/h menuju Disposal Timur (Warna Biru)
    // 3. Dumping: Speed rendah, Engine On, PTO ON! (Hidrolik Dump aktif)
    // 4. Travel Kosong: Kembali ke Pit Front A (Kecepatan 32 km/h, Warna Hijau)
    // 5. Kembali ke PIT: 1 Ritasi Tercatat (+1 RIT), Cycle Time dihitung, PTO Off
    const runHaulingSimulation = async () => {
        if (isSimulatingTrip) return;
        setIsSimulatingTrip(true);

        const simulationStages = [
            {
                stage: 'LOADING' as HaulingStage,
                pto: false,
                lat: -7.658200,
                lng: 111.189500,
                speed: 0,
                progress: 15,
                notice: `⛏️ [1/5 SIKLUS RITASI] LOADING: Exca PC2000 memuat [${selectedMaterial}] ke HD-78501 di Pit Front A (Speed 0 km/h, Engine ON).`,
                activeGf: { id: 2, name: 'Pit Front A (Loading OB)', type: 'loading', distance: 0 },
            },
            {
                stage: 'TRAVEL_ISI' as HaulingStage,
                pto: false,
                lat: -7.658700,
                lng: 111.190200,
                speed: 28,
                progress: 45,
                notice: `🚛 [2/5 SIKLUS RITASI] TRAVEL ISI: Unit bergerak keluar geofence PIT membawa muatan [${selectedMaterial}] (28 km/jam - Biru).`,
                activeGf: null,
            },
            {
                stage: 'DUMPING' as HaulingStage,
                pto: true, // PTO ON SESUAI SLIDE 25!
                lat: -7.659397,
                lng: 111.191127,
                speed: 5,
                progress: 75,
                notice: `⚡ [3/5 SIKLUS RITASI] DUMPING: Tiba di Disposal Timur, SENSOR PTO ON! Hidrolik dump mengangkat muatan (Slide 25).`,
                activeGf: { id: 3, name: 'Disposal Timur (Waste Dump)', type: 'dumping', distance: 0 },
            },
            {
                stage: 'TRAVEL_KOSONG' as HaulingStage,
                pto: false, // PTO OFF KEMBALI
                lat: -7.658600,
                lng: 111.190000,
                speed: 32,
                progress: 90,
                notice: `🚛 [4/5 SIKLUS RITASI] TRAVEL KOSONG: Keluar Disposal Timur kembali menuju Pit Front A (32 km/jam - Hijau).`,
                activeGf: null,
            },
            {
                stage: 'LOADING' as HaulingStage,
                pto: false,
                lat: -7.658200,
                lng: 111.189500,
                speed: 0,
                progress: 100,
                notice: `✅ [5/5 SIKLUS SELESAI] Unit tiba kembali di Pit Front A! 1 Ritasi Lengkap Tercatat (+1 RIT, PTO Verified, 20 BCM).`,
                activeGf: { id: 2, name: 'Pit Front A (Loading OB)', type: 'loading', distance: 0 },
            }
        ];

        for (let i = 0; i < simulationStages.length; i++) {
            const step = simulationStages[i];
            setHaulingStage(step.stage);
            setPtoActive(step.pto);
            setGeofenceNotice(step.notice);
            setActiveGeofence(step.activeGf);

            setTelemetry(prev => ({
                ...prev,
                lat: step.lat,
                lng: step.lng,
                speed: step.speed,
                distance: parseFloat((prev.distance + (i > 0 ? 0.6 : 0)).toFixed(2)),
                gpsLocked: true,
                isLastKnown: false,
            }));

            setCurrentTrip(prev => ({
                ...prev,
                tripProgress: step.progress,
                nowTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
            }));

            // Saat stage DUMPING (step 2) atau stage selesai (step 4), catat ritasi
            if (i === simulationStages.length - 1) {
                await recordRitasi({
                    dumpingGeofenceId: 3,
                    pitGeofenceId: 2,
                    dumpingName: 'Disposal Timur (Waste Dump)',
                    loadType: selectedMaterial,
                    cycleTimeMinutes: 21.5,
                    distanceKm: 2.4,
                    ptoConfirmed: true,
                });
            }

            await new Promise(r => setTimeout(r, 2200));
        }

        setIsSimulatingTrip(false);
    };

    const activateDemoCoordinates = () => {
        setTelemetry(prev => ({
            ...prev,
            lat: -7.658200,
            lng: 111.189500,
            speed: 0,
            gpsLocked: true,
            isLastKnown: false,
        }));
        setActiveGeofence({
            id: 2,
            name: 'Pit Front A (Loading Point)',
            type: 'loading',
            distance: 0,
        });
        setGeofenceNotice('Peta dipusatkan ke Pit Front A (Zona Tambang HPU).');
        setTimeout(() => setGeofenceNotice(null), 4000);
    };

    const takeDashcamSnapshot = async (): Promise<string | null> => {
        try {
            setFaceMessage('Meminta snapshot dari kamera kabin...');
            const res = await fetch('/api/cmsv6/snapshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ channel: 1 }),
            });
            const data = await res.json();
            return data.photo_url ?? null;
        } catch (e) {
            console.error("Snapshot error:", e);
            return null;
        }
    };

    const submitFaceRecognition = async (
        customPhoto?: string | null
    ) => {
        setShowCheckin(false);
        setIsScanningFace(true);
        setFaceStatus('sending');
        setFaceMessage(`Memindai identitas wajah dengan AI...`);

        // Tampilkan animasi face scanner pada CAM 2 selama 1 detik
        await new Promise(r => setTimeout(r, 1000));

        let actualPhotoUrl: string | null = customPhoto || null;
        if (!actualPhotoUrl) {
            actualPhotoUrl = await captureCabinFrame();
        }

        if (actualPhotoUrl && actualPhotoUrl.startsWith('data:image')) {
            setFaceMessage('Wajah terdeteksi pada kamera kabin! Mencocokkan dengan AI...');
        } else {
            const snapshot = await takeDashcamSnapshot();
            actualPhotoUrl = snapshot || actualPhotoUrl;
            setFaceMessage('Menyimpan data pengemudi...');
        }

        const payload = {
            deviceId: DEVICE_ID,
            capturedAt: new Date().toISOString(),
            source: 'cabin-dashcam-ai',
            photoUrl: actualPhotoUrl,
        };

        try {
            const response = await fetch('/api/dashcam/face-recognition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            setIsScanningFace(false);

            if (response.ok && data.status === 'ok') {
                const savedPhoto = data.data?.photo_url || actualPhotoUrl;
                setFaceStatus('success');
                setFaceMessage(`Verifikasi AI berhasil! ${data.data.driver_name} terdeteksi.`);
                setDriver({
                    name: data.data.driver_name,
                    id: data.data.employee_id,
                    match: data.data.confidence,
                    position: 'Operator Alat Berat',
                    photoUrl: savedPhoto,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                });
            } else {
                throw new Error(data?.message || 'Wajah tidak dikenali oleh AI');
            }
        } catch (error) {
            setIsScanningFace(false);
            const message = error instanceof Error ? error.message : 'Gagal menghubungi server AI';
            setFaceStatus('error');
            setFaceMessage(message);
        }
    };

    // Daftarkan nama teman ke database PT HPU lalu langsung scan wajahnya di kamera kabin
    const handleRegisterAndScan = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newDriverName.trim() || !newDriverId.trim()) {
            alert('Mohon masukkan Nama dan NIK/ID teman Anda.');
            return;
        }
        setIsRegistering(true);
        try {
            const res = await fetch('/api/dashcam/drivers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: newDriverName.trim(),
                    id: newDriverId.trim(),
                    position: newDriverPos.trim() || 'Operator Alat Berat',
                    photoUrl: previewPhoto || null,
                }),
            });
            const data = await res.json();
            setIsRegistering(false);
            if (res.ok && data.status === 'ok') {
                await fetchDrivers('');
                const photoToUse = previewPhoto;
                void submitFaceRecognition(photoToUse);
            } else {
                alert(data.message || 'Gagal mendaftarkan operator.');
            }
        } catch (err) {
            setIsRegistering(false);
            alert('Gagal menghubungi server backend.');
        }
    };

    // ── ANALISIS KEBERADAAN WAJAH MANUSIA (MENCEGAH KABIN KOSONG DIANGGAP SEBAGAI PENGEMUDI) ──
    const checkHumanFacePresence = async (dataUrl: string): Promise<{ hasHuman: boolean; confidence: number; reason?: string }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = async () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width || 400;
                    canvas.height = img.height || 400;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        resolve({ hasHuman: false, confidence: 0, reason: 'Gagal memproses kanvas video kamera.' });
                        return;
                    }
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // 1. Cek Native FaceDetector jika browser Chromium mendukung
                    if (typeof (window as any).FaceDetector === 'function') {
                        try {
                            const detector = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
                            const faces = await detector.detect(canvas);
                            if (faces && faces.length > 0) {
                                resolve({ hasHuman: true, confidence: 98.8 });
                                return;
                            } else {
                                resolve({
                                    hasHuman: false,
                                    confidence: 0,
                                    reason: '⚠️ Kabin Kosong: Kamera aktif, namun tidak ada wajah manusia di kursi kemudi.',
                                });
                                return;
                            }
                        } catch (err) {
                            console.warn('[FacePresence] Native FaceDetector fallback:', err);
                        }
                    }

                    // 2. Analisis Biometrik Piksel (Skin Tone & Kontur Wajah di Kursi Pengemudi)
                    const w = canvas.width;
                    const h = canvas.height;
                    const startX = Math.floor(w * 0.15);
                    const startY = Math.floor(h * 0.15);
                    const zoneW = Math.floor(w * 0.70);
                    const zoneH = Math.floor(h * 0.70);

                    const imgData = ctx.getImageData(startX, startY, zoneW, zoneH);
                    const data = imgData.data;
                    let skinPixels = 0;
                    const totalPixels = zoneW * zoneH;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        // Aturan kromatisitas warna kulit manusia
                        const isSkin = (
                            r > 70 && g > 45 && b > 25 &&
                            r > g && (r - b) > 12 &&
                            (Math.max(r, g, b) - Math.min(r, g, b)) > 15
                        );

                        if (isSkin) {
                            skinPixels++;
                        }
                    }

                    const skinRatio = skinPixels / totalPixels;
                    console.log(`[FacePresence] Skin Pixel Ratio: ${(skinRatio * 100).toFixed(2)}%`);

                    // Jika rasio piksel kulit di bawah 3.5%, kabin terdeteksi kosong (kursi jok hitam / plafon mobil)
                    if (skinRatio < 0.035) {
                        resolve({
                            hasHuman: false,
                            confidence: 0,
                            reason: '⚠️ Kabin Kosong: Kursi kemudi terdeteksi KOSONG (tidak ada orang di depan kamera). Sistem membatalkan check-in.',
                        });
                        return;
                    }

                    resolve({
                        hasHuman: true,
                        confidence: parseFloat(Math.min(99.2, 94.5 + skinRatio * 16).toFixed(1)),
                    });
                } catch (e) {
                    console.error('[FacePresence] Error:', e);
                    resolve({ hasHuman: false, confidence: 0, reason: 'Gagal menganalisis frame kamera kabin.' });
                }
            };
            img.onerror = () => {
                resolve({ hasHuman: false, confidence: 0, reason: 'Gagal memuat cuplikan kamera kabin.' });
            };
            img.src = dataUrl;
        });
    };

    // ── PINDAI WAJAH PENGEMUDI DI KAMERA KABIN DENGAN VALIDASI KEBERADAAN MANUSIA ──
    const scanCabinDriver = async () => {
        setIsScanningFace(true);
        setFaceStatus('sending');
        setFaceMessage('🎯 Menghubungkan ke kamera kabin (CAM 2)...');

        let capturedPhoto: string | null = null;
        for (let attempt = 1; attempt <= 6; attempt++) {
            setFaceMessage(`🎯 Mengambil frame kamera kabin (#${attempt})...`);
            capturedPhoto = await captureCabinFrame();
            if (capturedPhoto && capturedPhoto.startsWith('data:image')) {
                break;
            }
            await new Promise(r => setTimeout(r, 600));
        }

        if (!capturedPhoto) {
            setIsScanningFace(false);
            setFaceStatus('error');
            setFaceMessage('❌ Gagal mengambil cuplikan video CAM 2. Pastikan streaming kamera kabin telah aktif.');
            return;
        }

        setFaceMessage('🔍 Memeriksa apakah ada pengemudi di kursi kemudi...');
        const presence = await checkHumanFacePresence(capturedPhoto);

        if (!presence.hasHuman) {
            setIsScanningFace(false);
            setFaceStatus('error');
            setFaceMessage(presence.reason || '⚠️ Kabin Kosong: Tidak ada pengemudi di kursi kemudi.');
            return;
        }

        setFaceMessage(`✓ Wajah terdeteksi! Memverifikasi identitas AI...`);
        await new Promise(r => setTimeout(r, 800));

        await submitFaceRecognition(capturedPhoto);
    };

    // ── CHECK-OUT PENGEMUDI / KOSONGKAN STATUS KABIN ──
    const handleCheckout = async () => {
        try {
            await fetch('/api/dashcam/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ deviceId: DEVICE_ID }),
            });
        } catch {}
        setDriver(null);
        setFaceStatus('idle');
        setFaceMessage('Kabin telah dikosongkan. Pengemudi telah check-out.');
    };

    useEffect(() => {
        login();
        fetchGeofences();
        fetchRitasiToday();
    }, []);

    // ── POLLING DATA GPS TIAP 5 DETIK SETELAH JSESSION TERSEDIA ──
    useEffect(() => {
        if (!jsession) return;

        const fetchLastKnownLocation = async () => {
            try {
                const now = new Date();
                const yesterday = new Date(now.getTime() - 72 * 60 * 60 * 1000);
                const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

                const res = await fetch(`/api/cmsv6/track?begintime=${encodeURIComponent(fmt(yesterday))}&endtime=${encodeURIComponent(fmt(now))}&page=1&records=1`);
                const data = await res.json();

                if (data.result === 0 && data.tracks?.length > 0) {
                    const t = data.tracks[data.tracks.length - 1];
                    const lat = parseFloat(t.lat || '0') / 1000000;
                    const lng = parseFloat(t.lng || '0') / 1000000;

                    if (lat !== 0 && lng !== 0) {
                        setTelemetry(prev => ({
                            ...prev,
                            lat: prev.lat === null ? lat : prev.lat,
                            lng: prev.lng === null ? lng : prev.lng,
                            isLastKnown: prev.gpsLocked ? false : true
                        }));
                    }
                }
            } catch {
                // Silent fail
            }
        };

        const fetchGPS = async () => {
            try {
                const res = await fetch('/api/cmsv6/status');
                const data = await res.json();

                // Jika server error, coba re-login via proxy
                if (data.result !== 0) {
                    const newSession = await login();
                    if (!newSession) return;
                }

                if (data.result === 0 && data.status?.length > 0) {
                    setApiStatus('live');
                    const s = data.status[0];

                    setRawGPS(s);

                    const rawLat = parseFloat(s.mlat || '0');
                    const rawLng = parseFloat(s.mlng || '0');

                    let finalLat = 0, finalLng = 0;
                    if (rawLat !== 0 && rawLng !== 0) {
                        if (Math.abs(rawLat) > 90) {
                            finalLat = nmeaToDecimal(s.mlat, rawLat < 0);
                            finalLng = nmeaToDecimal(s.mlng, rawLng < 0);
                        } else {
                            finalLat = rawLat;
                            finalLng = rawLng;
                        }
                    }
                    const hasGPS = finalLat !== 0 && finalLng !== 0;

                    let inGeofence = false;
                    let currentFoundGeofence: { id: number; name: string; type: string; distance: number } | null = null;

                    const effectiveLat = hasGPS ? finalLat : (telemetry.lat ?? -7.6582);
                    const effectiveLng = hasGPS ? finalLng : (telemetry.lng ?? 111.1895);

                    if (geofences.length > 0) {
                        for (let g of geofences) {
                            const dist = calculateDistance(effectiveLat, effectiveLng, g.latitude, g.longitude);
                            if (dist <= g.radius) {
                                inGeofence = true;
                                currentFoundGeofence = { id: g.id, name: g.name, type: g.type, distance: dist };
                                break;
                            }
                        }
                    }

                    if (!isSimulatingTrip) {
                        if (currentFoundGeofence) {
                            setActiveGeofence(currentFoundGeofence);
                            if (currentFoundGeofence.type === 'dumping' && lastGeofenceId !== currentFoundGeofence.id) {
                                void recordRitasi(currentFoundGeofence.id, currentFoundGeofence.name);
                            }
                            setLastGeofenceId(currentFoundGeofence.id);
                        } else {
                            setActiveGeofence(null);
                            setLastGeofenceId(null);
                        }
                    }

                    const rawSpeed = Math.round((s.sp || 0) / 10);
                    const speed = rawSpeed <= 1 ? 0 : rawSpeed;

                    setTelemetry(prev => {
                        if (isSimulatingTrip) return prev;

                        let newDistance = prev.distance;

                        // Jika API mengirimkan 'lc' (Mileage), gunakan itu (asumsi dalam satuan meter -> km)
                        if (s.lc !== undefined && s.lc > 0) {
                            newDistance = s.lc / 1000;
                        } else if (speed > 0) {
                            const deltaKm = speed * (5 / 3600);
                            newDistance = prev.distance + deltaKm;
                        }

                        return {
                            lat: hasGPS ? finalLat : prev.lat,
                            lng: hasGPS ? finalLng : prev.lng,
                            speed,
                            distance: parseFloat(newDistance.toFixed(2)),
                            fuel: s.ft || 0,
                            satellites: s.gd || 0,
                            online: s.ol === 1,
                            lastUpdate: s.gt?.split('.')[0] ?? '-',
                            inGeofence,
                            gpsLocked: hasGPS,
                            isLastKnown: hasGPS ? false : prev.isLastKnown,
                        };
                    });

                    if (!hasGPS) {
                        fetchLastKnownLocation();
                    }
                }
            } catch {
                setApiStatus('error');
            }
        };
        const fetchActiveDriver = async () => {
            try {
                // 1. Cek dulu apakah di kabin ada orang
                const photo = await captureCabinFrame();
                let isCabinEmpty = false;
                if (photo && photo.startsWith('data:image')) {
                    const presence = await checkHumanFacePresence(photo);
                    if (!presence.hasHuman) {
                        isCabinEmpty = true;
                    }
                }

                // 2. Jika kosong, jangan set driver, panggil checkout untuk amannya
                if (isCabinEmpty) {
                    await handleCheckout();
                    return;
                }

                // 3. Jika ada orang, baru ambil dari database
                const res = await fetch('/api/dashcam/active-driver');
                const data = await res.json();
                if (data.status === 'ok' && data.driver) {
                    setDriver({
                        name: data.driver.name,
                        id: data.driver.id || '-',
                        match: data.driver.confidence || 95,
                        position: 'Operator Alat Berat',
                        photoUrl: data.driver.photo_url,
                        time: data.driver.received_at ? data.driver.received_at.split('·')[0].trim() : '-',
                    });
                }
            } catch (err) {}
        };



        const fetchAlarms = async () => {
            try {
                const res = await fetch('/api/cmsv6/alarms');
                const data = await res.json();
                if (data.result === 0 && Array.isArray(data.alarms)) {
                    setAlarms(data.alarms);
                }
            } catch (err) {
                console.error('Failed to fetch alarms:', err);
            }
        };


        fetchDrivers('');
        fetchActiveDriver();
        fetchGPS();
        fetchAlarms();
        fetchGeofences();
        fetchRitasiToday();

        const interval = setInterval(() => {
            fetchGPS();
            fetchAlarms();
            fetchRitasiToday();
            fetchGeofences();
        }, 5000);
        return () => clearInterval(interval);
    }, [jsession]);

    // ── AKSI ALARM: HANDLE SATUAN ──
    const handleQuickAction = async (guid: string) => {
        try {
            const res = await fetch('/api/cmsv6/alarms/handle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ guid, handle_remark: 'Diverifikasi oleh Safety Officer' }),
            });
            const data = await res.json();
            if (data.result === 0 && Array.isArray(data.alarms)) {
                setAlarms(data.alarms);
            }
        } catch (e) {
            console.error('Failed to handle alarm:', e);
        }
    };

    // ── AKSI ALARM: BATCH HANDLE SEMUA ──
    const handleBatchAction = async () => {
        try {
            const res = await fetch('/api/cmsv6/alarms/batch-handle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            const data = await res.json();
            if (data.result === 0 && Array.isArray(data.alarms)) {
                setAlarms(data.alarms);
            }
        } catch (e) {
            console.error('Failed to batch handle alarms:', e);
        }
    };

    // ── AKSI ALARM: SIMULASI TRIGGER ALARM BARU ──
    const triggerTestAlarm = async (type: string, desc: string, category: string, severity: 'critical' | 'high' | 'medium' | 'low') => {
        try {
            const res = await fetch('/api/cmsv6/alarms/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ type, desc, category, severity }),
            });
            const data = await res.json();
            if (data.result === 0 && Array.isArray(data.alarms)) {
                setAlarms(data.alarms);
                setBannerDismissed(false);
            }
        } catch (e) {
            console.error('Failed to trigger test alarm:', e);
        }
    };

    // Filter alarms berdasarkan tab
    const filteredAlarms = alarms.filter(a => {
        if (alarmTab === 'all') return true;
        if (alarmTab === 'gsensor') return a.category?.toLowerCase().includes('gsensor') || a.desc.toLowerCase().includes('rollover');
        if (alarmTab === 'fd') return a.category?.toLowerCase().includes('fierce') || a.desc.toLowerCase().includes('collision');
        if (alarmTab === 'dms') return a.category?.toLowerCase().includes('dms') || a.category?.toLowerCase().includes('fatigue') || a.desc.toLowerCase().includes('kantuk') || a.desc.toLowerCase().includes('distract') || a.desc.toLowerCase().includes('phone') || a.desc.toLowerCase().includes('smoke');
        return true;
    });

    const untreatedCount = alarms.filter(a => (a.handle_status ?? 'Untreated') === 'Untreated').length;
    const untreatedCriticalAlarm = alarms.find(a => (a.handle_status ?? 'Untreated') === 'Untreated' && (a.severity === 'critical' || a.severity === 'high'));

    return (
        <>
            <LayoutNavbar className="">
                <Head title="Dashcam Monitoring" />

                <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden shadow-md border border-slate-200 m-1">

                    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 z-10 relative">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <Video className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 leading-tight">Dashcam & Telemetry</h1>
                                <p className="text-sm text-slate-500">Live Surveillance & Fleet Data</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Status Perangkat Hardware (Online / Offline) */}
                            <div className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border ${telemetry.online ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                    'bg-rose-50 border-rose-200 text-rose-600'
                                }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${telemetry.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                    }`}></span>
                                {telemetry.online ? 'ONLINE' : 'OFFLINE'}
                            </div>

                            {/* Status API Connection */}
                            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border ${apiStatus === 'live' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                    'bg-amber-50 border-amber-200 text-amber-600'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${apiStatus === 'live' ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                {apiStatus === 'live' ? 'API Connected' : 'Connecting API'}
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
                                <Truck className="w-4 h-4 text-blue-600" />
                                UNIT: EX-39103CT
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col p-5 md:p-6 overflow-y-auto gap-6">

                        {/* Floating Emergency Alarm Banner */}
                        {untreatedCriticalAlarm && !bannerDismissed && (
                            <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-3.5 rounded-2xl shadow-lg border border-red-400 flex items-center justify-between gap-3 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <ShieldAlert className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-md border border-white/20">
                                                {untreatedCriticalAlarm.category || 'AI Safety Alert'}
                                            </span>
                                            <span className="text-xs font-bold">{untreatedCriticalAlarm.desc}</span>
                                        </div>
                                        <p className="text-[11px] text-white/90 mt-0.5">
                                            Unit: {untreatedCriticalAlarm.vehicle || 'TrialUNS2'} • Waktu: {untreatedCriticalAlarm.time} • Status: Menunggu Tindakan Safety Officer
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleQuickAction(untreatedCriticalAlarm.guid)}
                                        className="text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl shadow transition cursor-pointer"
                                    >
                                        Tangani Sekarang
                                    </button>
                                    <button
                                        onClick={() => setBannerDismissed(true)}
                                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                                        title="Tutup banner"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════════════════════════════════════════════════
                            HERO SECTION: LIVE CCTV SURVEILLANCE (ENLARGED & HIGHLIGHTED)
                           ══════════════════════════════════════════════════════════════ */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                            {/* Surveillance Top Bar */}
                            <div className="px-5 py-3.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Video className="w-5 h-5 text-rose-400" />
                                        <h2 className="text-sm font-bold text-white tracking-wide">
                                            Live Dashcam & In-Cabin AI Surveillance
                                        </h2>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                                        ● DUAL LIVE 1080P HD
                                    </span>
                                    <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
                                        Unit EX-39103CT (ID: 240078916116)
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* View Mode Switcher */}
                                    <div className="bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setCameraViewMode('dual')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                                cameraViewMode === 'dual' 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Tampilan 2 Kamera Berdampingan (Dual Grid)"
                                        >
                                            <LayoutGrid className="w-3.5 h-3.5" />
                                            <span>Dual View (1:1)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCameraViewMode('cam1')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                                cameraViewMode === 'cam1' 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Fokus Kamera Depan (Jalan Hauling)"
                                        >
                                            <Video className="w-3.5 h-3.5" />
                                            <span>CAM 1 Jalan</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCameraViewMode('cam2')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                                cameraViewMode === 'cam2' 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Fokus Kamera Kabin (DMS Driver)"
                                        >
                                            <UserCheck className="w-3.5 h-3.5" />
                                            <span>CAM 2 Kabin</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCameraViewMode('stacked')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                                cameraViewMode === 'stacked' 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Tampilan Kamera Besar Bertumpuk"
                                        >
                                            <Rows className="w-3.5 h-3.5" />
                                            <span>Vertikal</span>
                                        </button>
                                    </div>

                                    {/* Refresh button */}
                                    <button
                                        type="button"
                                        onClick={() => login()}
                                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition cursor-pointer"
                                        title="Muat Ulang Koneksi Stream Kamera"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Large High-Definition Video Feeds (420px height for prominence) */}
                            <div className="p-4 bg-slate-950">
                                {cameraViewMode === 'dual' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {channels.map(ch => {
                                            const notInstalled = !ch.hasStream;
                                            const src = !notInstalled ? camUrl(ch.apiChannel, jsession, cmsBaseUrl) : null;
                                            return (
                                                <div
                                                    key={ch.id}
                                                    className="relative bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl group"
                                                    style={{ height: '420px' }}
                                                >
                                                    {notInstalled ? (
                                                        <div className="w-full h-full absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3">
                                                            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                                                <Video className="w-7 h-7 text-slate-600" />
                                                            </div>
                                                            <p className="text-slate-400 font-semibold text-sm">Kamera Belum Terpasang</p>
                                                        </div>
                                                    ) : src ? (
                                                        <iframe
                                                            src={src}
                                                            className="w-full h-full border-0 absolute inset-0 bg-slate-900"
                                                            title={ch.label}
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full border-0 absolute inset-0 bg-slate-900 flex items-center justify-center">
                                                            <div className="text-slate-500 font-medium text-sm animate-pulse">Menghubungkan ke CMSv6 Server...</div>
                                                        </div>
                                                    )}

                                                    {/* Stream Header Overlay */}
                                                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                                                        <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                                            {ch.label}
                                                        </span>
                                                        <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-mono px-2 py-1 rounded-lg border border-slate-700/50">
                                                            {ch.id === 'cam1' ? 'HAULING ROAD VIEW' : 'DMS DRIVER CABIN'}
                                                        </span>
                                                    </div>

                                                    {/* Stream Footer Watermark Overlay */}
                                                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                                                        <div className="bg-black/60 backdrop-blur-sm text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/10">
                                                            📍 Lat: {telemetry.lat?.toFixed(5) ?? '-7.55596'}, Lng: {telemetry.lng?.toFixed(5) ?? '111.65882'} • Speed: {telemetry.speed} km/j
                                                        </div>
                                                        <div className="bg-black/60 backdrop-blur-sm text-emerald-400 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                            1080P HD • 25 FPS
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {cameraViewMode === 'cam1' && (
                                    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black" style={{ height: '480px' }}>
                                        {camUrl(0, jsession, cmsBaseUrl) ? (
                                            <iframe
                                                src={camUrl(0, jsession, cmsBaseUrl) || ''}
                                                className="w-full h-full border-0 absolute inset-0 bg-slate-900"
                                                title="CAM 1 — Depan"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">Memuat stream CAM 1...</div>
                                        )}
                                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                            <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
                                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                                CAM 1 — Depan (Fokus Utama)
                                            </span>
                                        </div>

                                        {/* Picture-in-Picture CAM 2 Kabin di sudut kanan bawah */}
                                        <div 
                                            onClick={() => setCameraViewMode('cam2')}
                                            className="absolute bottom-4 right-4 z-20 w-64 h-40 bg-black rounded-xl border-2 border-white/40 shadow-2xl overflow-hidden cursor-pointer group hover:scale-105 transition-all"
                                            title="Klik untuk berpindah ke CAM 2"
                                        >
                                            {camUrl(1, jsession, cmsBaseUrl) && (
                                                <iframe
                                                    src={camUrl(1, jsession, cmsBaseUrl) || ''}
                                                    className="w-full h-full border-0 pointer-events-none"
                                                    title="CAM 2 Kabin (PIP)"
                                                />
                                            )}
                                            <div className="absolute bottom-1.5 left-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                CAM 2 — Kabin (Klik untuk ganti)
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {cameraViewMode === 'cam2' && (
                                    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black" style={{ height: '480px' }}>
                                        {camUrl(1, jsession, cmsBaseUrl) ? (
                                            <iframe
                                                src={camUrl(1, jsession, cmsBaseUrl) || ''}
                                                className="w-full h-full border-0 absolute inset-0 bg-slate-900"
                                                title="CAM 2 — Kabin"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">Memuat stream CAM 2...</div>
                                        )}
                                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                            <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
                                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                                CAM 2 — Kabin (Fokus Utama DMS)
                                            </span>
                                        </div>

                                        {/* Picture-in-Picture CAM 1 Depan */}
                                        <div 
                                            onClick={() => setCameraViewMode('cam1')}
                                            className="absolute bottom-4 right-4 z-20 w-64 h-40 bg-black rounded-xl border-2 border-white/40 shadow-2xl overflow-hidden cursor-pointer group hover:scale-105 transition-all"
                                            title="Klik untuk berpindah ke CAM 1"
                                        >
                                            {camUrl(0, jsession, cmsBaseUrl) && (
                                                <iframe
                                                    src={camUrl(0, jsession, cmsBaseUrl) || ''}
                                                    className="w-full h-full border-0 pointer-events-none"
                                                    title="CAM 1 Depan (PIP)"
                                                />
                                            )}
                                            <div className="absolute bottom-1.5 left-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                CAM 1 — Depan (Klik untuk ganti)
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {cameraViewMode === 'stacked' && (
                                    <div className="flex flex-col gap-4">
                                        {channels.map(ch => (
                                            <div key={ch.id} className="relative bg-black rounded-xl overflow-hidden border border-slate-800 shadow-xl" style={{ height: '380px' }}>
                                                {camUrl(ch.apiChannel, jsession, cmsBaseUrl) && (
                                                    <iframe
                                                        src={camUrl(ch.apiChannel, jsession, cmsBaseUrl) || ''}
                                                        className="w-full h-full border-0 absolute inset-0 bg-slate-900"
                                                        title={ch.label}
                                                        allowFullScreen
                                                    />
                                                )}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20">
                                                        {ch.label}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ══════════════════════════════════════════════════════════════
                            OPERATIONAL & TELEMETRY DECK (2 EQUAL BALANCED COLUMNS)
                           ══════════════════════════════════════════════════════════════ */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                            {/* ── KOLOM KIRI (xl:col-span-6): HAULING OPERATIONS & UNIT SENSORS ── */}
                            <div className="xl:col-span-6 flex flex-col gap-6">

                                {/* CARD 1: OPERASIONAL HAULING & RITASI (SLIDE 19 & 25) */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black tracking-wider uppercase text-slate-800">
                                                    OPERASIONAL HAULING & RITASI
                                                </h3>
                                                <p className="text-xs text-slate-400">Siklus Angkut Batubara / OB Pit Front → Disposal</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
                                            haulingStage === 'LOADING' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                            haulingStage === 'TRAVEL_ISI' ? 'bg-blue-600 text-white animate-pulse' :
                                            haulingStage === 'DUMPING' ? 'bg-amber-600 text-white animate-pulse' :
                                            haulingStage === 'TRAVEL_KOSONG' ? 'bg-emerald-600 text-white' :
                                            'bg-yellow-400 text-slate-900'
                                        }`}>
                                            <Activity className="w-3.5 h-3.5" />
                                            {haulingStage === 'LOADING' ? '⛏️ 1. LOADING (PIT)' :
                                             haulingStage === 'TRAVEL_ISI' ? '🚛 2. TRAVEL ISI (BIRU)' :
                                             haulingStage === 'DUMPING' ? '⚡ 3. DUMPING (PTO ON)' :
                                             haulingStage === 'TRAVEL_KOSONG' ? '🚛 4. TRAVEL KOSONG (HIJAU)' :
                                             '⏸️ IDLING'}
                                        </span>
                                    </div>

                                    {/* Hauling Stage Stepper Progress (Slide 29) */}
                                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                                        <div className={`p-2 rounded-xl border transition ${haulingStage === 'LOADING' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                            ⛏️ 1. Loading
                                        </div>
                                        <div className={`p-2 rounded-xl border transition ${haulingStage === 'TRAVEL_ISI' ? 'bg-blue-50 border-blue-300 text-blue-800 font-black shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                            🚛 2. Travel Isi
                                        </div>
                                        <div className={`p-2 rounded-xl border transition ${haulingStage === 'DUMPING' ? 'bg-amber-50 border-amber-300 text-amber-800 font-black shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                            ⚡ 3. Dumping
                                        </div>
                                        <div className={`p-2 rounded-xl border transition ${haulingStage === 'TRAVEL_KOSONG' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                            🚛 4. Trv Kosong
                                        </div>
                                    </div>

                                    {/* Trip Information & Big RIT Box */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                                        <div className="md:col-span-7 flex flex-col gap-2.5 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0"></span>
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase w-20">Start Pit:</span>
                                                <span className="font-bold text-slate-700">{currentTrip.startTime}, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100 animate-pulse shrink-0"></span>
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase w-20">Durasi:</span>
                                                <span className="font-bold text-slate-700">{currentTrip.nowTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-purple-100 shrink-0"></span>
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase w-20">Tujuan:</span>
                                                <span className="font-bold text-slate-800 truncate">{currentTrip.finishArea}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="mt-1">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                    <span>Trip Progress</span>
                                                    <span className="font-mono text-blue-600">{currentTrip.tripProgress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${currentTrip.tripProgress}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side: Big RIT Display + Action Button */}
                                        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-purple-200 shadow-sm text-center gap-1.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Ritasi Hari Ini</p>
                                            <p className="text-3xl font-black text-purple-700 tracking-tight leading-none">
                                                {ritasiToday} <span className="text-sm font-bold text-slate-500 uppercase">RIT</span>
                                            </p>
                                            <button
                                                type="button"
                                                onClick={runHaulingSimulation}
                                                disabled={isSimulatingTrip}
                                                className="w-full mt-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-white" />
                                                {isSimulatingTrip ? 'Siklus Berjalan...' : 'Simulasi 5 Siklus Hauling'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Load Type Material Selector (Slide 21) */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                <Layers className="w-4 h-4 text-slate-400" />
                                                Jenis Material Muatan (Slide 21):
                                            </span>
                                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                                Aktif: {selectedMaterial}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                            {[
                                                { name: 'OB', label: 'OB (Overburden)', bg: 'bg-slate-600' },
                                                { name: 'COAL', label: 'Coal (Batubara)', bg: 'bg-slate-900' },
                                                { name: 'MUD', label: 'Mud (Lumpur)', bg: 'bg-amber-800' },
                                                { name: 'TOP SOIL', label: 'Top Soil', bg: 'bg-orange-600' },
                                                { name: 'LIMONIT', label: 'Limonit', bg: 'bg-yellow-700' },
                                                { name: 'SAPROLIT', label: 'Saprolit', bg: 'bg-emerald-700' },
                                            ].map(mat => (
                                                <button
                                                    key={mat.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMaterial(mat.name as MaterialType);
                                                        setGeofenceNotice(`Material angkut diubah ke: ${mat.name}`);
                                                        setTimeout(() => setGeofenceNotice(null), 3000);
                                                    }}
                                                    className={`py-2 px-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer text-center truncate ${mat.bg} ${
                                                        selectedMaterial === mat.name ? 'ring-2 ring-offset-2 ring-blue-500 shadow-md font-black scale-102' : 'opacity-75 hover:opacity-100'
                                                    }`}
                                                    title={mat.label}
                                                >
                                                    {mat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 4 KPI Summary Badges (Slide 19) */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2 border-t border-slate-100">
                                        <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1.5">
                                                <Gauge className="w-4 h-4" />
                                            </div>
                                            <p className="text-base font-black text-slate-800 leading-tight">
                                                {telemetry.speed} <span className="text-[10px] font-normal text-slate-500">km/j</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Current Speed</p>
                                        </div>
                                        <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1.5">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <p className="text-base font-black text-purple-700 leading-tight">
                                                {avgCycleTimeToday || 22} <span className="text-[10px] font-normal text-slate-500">min</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Cycle Time</p>
                                        </div>
                                        <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1.5">
                                                <Power className="w-4 h-4" />
                                            </div>
                                            <p className="text-base font-black text-emerald-700 leading-tight">
                                                98,765 <span className="text-[10px] font-normal text-slate-500">HM</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Hour Meter</p>
                                        </div>
                                        <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1.5">
                                                <Fuel className="w-4 h-4" />
                                            </div>
                                            <p className="text-base font-black text-amber-700 leading-tight">
                                                {telemetry.fuel} <span className="text-[10px] font-normal text-slate-500">L</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Fuel Cons</p>
                                        </div>
                                    </div>

                                    {/* BCM Production & Riwayat Button */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                                                    PRODUKSI BCM (SLIDE 5-6)
                                                </span>
                                                <span className="text-xs text-slate-300">Vessel: 20 BCM/trip</span>
                                            </div>
                                            <p className="text-lg font-black text-white mt-0.5">
                                                {totalBcmToday} <span className="text-xs font-semibold text-slate-300">BCM hari ini</span>
                                                <span className="text-xs text-slate-400 ml-3 font-mono font-normal">Jarak Total: {totalDistanceKm.toFixed(1)} km</span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowRitasiHistoryModal(true)}
                                            className="w-full sm:w-auto py-2 px-3 rounded-lg text-xs font-bold text-purple-200 bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                                        >
                                            <FileText className="w-3.5 h-3.5 text-purple-300" />
                                            Riwayat Lengkap ({ritasiLogs.length})
                                        </button>
                                    </div>
                                </div>

                                {/* CARD 2: HARDWARE SENSORS & TELEMETRY */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Engine Status */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
                                            <Power className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engine Status</p>
                                        <p className="text-sm font-black text-emerald-600 mt-0.5">ON (RUNNING)</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Normal Operasi</p>
                                    </div>

                                    {/* PTO Dump Sensor */}
                                    <div className={`rounded-2xl border shadow-sm p-4 text-center flex flex-col items-center justify-center transition-all ${
                                        ptoActive 
                                            ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse' 
                                            : 'bg-white text-slate-700 border-slate-200'
                                    }`}>
                                        <ArrowRightCircle className={`w-8 h-8 mb-1.5 transition-transform duration-300 ${
                                            ptoActive ? 'text-white rotate-[-45deg] scale-110' : 'text-slate-400 rotate-[-90deg]'
                                        }`} />
                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${ptoActive ? 'text-amber-100' : 'text-slate-400'}`}>
                                            PTO (Dump Sensor)
                                        </p>
                                        <p className={`font-black text-sm mt-0.5 ${ptoActive ? 'text-white' : 'text-slate-700'}`}>
                                            {ptoActive ? '⚡ ON (DUMPING)' : 'OFF (NORMAL)'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextPto = !ptoActive;
                                                setPtoActive(nextPto);
                                                setGeofenceNotice(nextPto ? '⚡ Sensor PTO ON: Hidrolik dump aktif! Siap rekam dumping.' : 'Sensor PTO OFF: Dump diturunkan.');
                                                setTimeout(() => setGeofenceNotice(null), 3500);
                                            }}
                                            className={`mt-2 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition ${
                                                ptoActive ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {ptoActive ? 'Turunkan Dump' : 'Uji Dump (PTO)'}
                                        </button>
                                    </div>

                                    {/* Fuel Sensor */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <Fuel className="w-3.5 h-3.5 text-blue-600" /> Fuel Sensor
                                                </span>
                                                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                                    No Theft
                                                </span>
                                            </div>
                                            <p className="text-base font-black text-slate-800 mt-1">{telemetry.fuel} L</p>
                                            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                                                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, Math.round((telemetry.fuel / 500) * 100))}%` }}></div>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 mt-2">Kapasitas tangki: ~500 L</p>
                                    </div>
                                </div>

                            </div>

                            {/* ── KOLOM KANAN (xl:col-span-6): GPS MAP, CREW HUB & AI SAFETY ── */}
                            <div className="xl:col-span-6 flex flex-col gap-6">

                                {/* CARD 3: LIVE GPS LOCATION & GEOFENCE TAMBANG */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                        <div className="flex items-center gap-2">
                                            <Navigation className="w-4 h-4 text-blue-600" />
                                            <h3 className="text-sm font-bold text-slate-800">Live GPS Location & Geofence Tambang</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                -7.555961, 111.658822
                                            </span>
                                            <button
                                                onClick={() => setShowGeofenceModal(true)}
                                                className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Tambah Zona
                                            </button>
                                        </div>
                                    </div>

                                    {/* Map Container */}
                                    <div className="relative h-[250px] w-full bg-slate-100">
                                        <Map
                                            center={[telemetry.lat || -7.6582, telemetry.lng || 111.1895]}
                                            zoom={14}
                                            height={250}
                                        >
                                            <Marker
                                                width={40}
                                                anchor={[telemetry.lat || -7.6582, telemetry.lng || 111.1895]}
                                                color="#2563EB"
                                            />
                                            {geofences.map(gf => (
                                                <Overlay
                                                    key={gf.id}
                                                    anchor={[gf.latitude, gf.longitude]}
                                                    offset={[0, 0]}
                                                >
                                                    <div className="flex flex-col items-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                                                        <div 
                                                            className="rounded-full border-2 border-dashed opacity-40 animate-pulse"
                                                            style={{
                                                                width: `${Math.max(30, gf.radius / 3)}px`,
                                                                height: `${Math.max(30, gf.radius / 3)}px`,
                                                                borderColor: gf.color || '#8B5CF6',
                                                                backgroundColor: `${gf.color || '#8B5CF6'}20`
                                                            }}
                                                        />
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm bg-white/90 border border-slate-200 text-slate-800 whitespace-nowrap mt-1">
                                                            {gf.name}
                                                        </span>
                                                    </div>
                                                </Overlay>
                                            ))}
                                        </Map>

                                        {/* Status badge di atas map */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <span className="text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-rose-500" />
                                                Pigeon OSM • Site BDA Pit
                                            </span>
                                        </div>
                                    </div>

                                    {/* Map Footer HUD */}
                                    <div className="grid grid-cols-4 divide-x divide-slate-100 p-3 bg-white border-t border-slate-100 text-center">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Speed</p>
                                            <p className="text-sm font-black text-slate-800">{telemetry.speed} km/j</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Odometer</p>
                                            <p className="text-sm font-black text-blue-600">{telemetry.distance.toFixed(1)} km</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Geofence</p>
                                            <p className="text-xs font-bold text-purple-700 truncate px-1">
                                                {activeGeofence ? activeGeofence.name : 'Luar Geofence'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Ritasi</p>
                                            <p className="text-sm font-black text-purple-600">{ritasiToday} trip</p>
                                        </div>
                                    </div>

                                    {/* Mining Zones List (Slide 26) */}
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-700">Daftar Zona Tambang ({geofences.length}):</span>
                                            <button
                                                onClick={handleResetRitasi}
                                                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                                            >
                                                <RotateCw className="w-3 h-3" /> Reset Ritasi
                                            </button>
                                        </div>
                                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                                            {geofences.map(gf => (
                                                <div key={gf.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: gf.color || '#8B5CF6' }}></span>
                                                        <span className="font-bold text-slate-800 truncate">{gf.name}</span>
                                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                                            {gf.type}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">R: {gf.radius}m</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 4: DRIVER IDENTIFICATION & CABIN OCCUPANCY AI */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-blue-600" />
                                            <h3 className="text-sm font-bold text-slate-800">Operator & Cabin Occupancy AI</h3>
                                        </div>
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                            ⭐ 4.9 Rating
                                        </span>
                                    </div>

                                    {/* Driver Profile Row */}
                                    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base border-2 border-white shadow-sm overflow-hidden shrink-0">
                                                {previewPhoto ? (
                                                    <img src={previewPhoto} alt="Driver" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ScanFace className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{driver ? driver.name : targetDriver.name}</p>
                                                <p className="text-[10px] text-slate-400">NIK: {driver ? driver.id : targetDriver.id} • {driver ? (driver.position || 'Operator') : targetDriver.position}</p>
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-0.5">
                                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Terverifikasi Face Recognition
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Cabin Alert */}
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setIsScanningFace(true);
                                                const snap = await captureCabinFrame();
                                                if (snap) {
                                                    setPreviewPhoto(snap);
                                                }
                                                setIsScanningFace(false);
                                            }}
                                            disabled={isScanningFace}
                                            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            <Camera className="w-4 h-4" />
                                            {isScanningFace ? 'Memindai dari Kamera Kabin...' : 'Pindai Wajah Pengemudi di Kabin'}
                                        </button>

                                        {/* Cabin Occupancy SOP Violation Alert */}
                                        {passengerDetected ? (
                                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-xs font-bold text-rose-800">SOP Violation: Penumpang Terdeteksi di Kabin Depan!</h4>
                                                    <p className="text-[10px] text-rose-600 mt-0.5">
                                                        Kamera mendeteksi lebih dari 1 orang di kabin. Aturan K3 tambang melarang penumpang duduk di kabin depan saat operasi hauling.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span className="text-xs font-bold text-emerald-800">All Clear — 1 Pengemudi di Kabin (SOP Sesuai)</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowCheckin(!showCheckin)}
                                                className="text-blue-600 hover:underline font-semibold cursor-pointer"
                                            >
                                                {showCheckin ? 'Tutup Pilihan Driver' : 'Pilih Manual dari 118 Operator PT HPU'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { fetchHistoryLogs(); setShowHistory(true); }}
                                                className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                                            >
                                                <History className="w-3 h-3" /> Riwayat Check-in
                                            </button>
                                        </div>

                                        {/* Dropdown list if opened */}
                                        {showCheckin && (
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Cari nama atau NIK operator..."
                                                    value={searchDriver}
                                                    onChange={e => setSearchDriver(e.target.value)}
                                                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                                                />
                                                <div className="max-h-40 overflow-y-auto space-y-1">
                                                    {driverList.filter(d => d.name.toLowerCase().includes(searchDriver.toLowerCase()) || d.id.includes(searchDriver)).map(d => (
                                                        <div
                                                            key={d.id}
                                                            onClick={() => {
                                                                setTargetDriver({ name: d.name, id: d.id, position: d.position || 'Operator' });
                                                                setShowCheckin(false);
                                                            }}
                                                            className="p-1.5 hover:bg-white rounded cursor-pointer text-xs flex justify-between"
                                                        >
                                                            <span className="font-bold text-slate-700">{d.name}</span>
                                                            <span className="text-slate-400 font-mono text-[10px]">{d.id}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CARD 5: AI SAFETY & ALARM CENTER */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {/* Header */}
                                    <div className="p-3.5 border-b border-slate-100 bg-rose-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                                            <h3 className="text-sm font-bold text-slate-800">AI Safety & Alarm Center</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {untreatedCount > 0 ? (
                                                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                                                    {untreatedCount} Belum Ditangani
                                                </span>
                                            ) : (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Aman
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setShowSimulator(!showSimulator)}
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                                                    showSimulator 
                                                        ? 'bg-amber-500 text-white border-amber-600' 
                                                        : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                                                }`}
                                            >
                                                ⚡ Tes Alarm
                                            </button>
                                        </div>
                                    </div>

                                    {/* Simulator Drawer if open */}
                                    {showSimulator && (
                                        <div className="p-3 bg-amber-50/80 border-b border-amber-200 text-xs">
                                            <p className="font-bold text-amber-900 mb-2">Simulasikan Pemicu Alarm AI Safety:</p>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    onClick={() => triggerTestAlarm('fatigue', 'Driver Fatigue (Mengantuk Berat)', 'DMS Camera AI', 'critical')}
                                                    className="p-1.5 bg-white hover:bg-rose-50 border border-amber-200 rounded-lg text-[11px] font-semibold text-slate-700 text-left cursor-pointer"
                                                >
                                                    😴 Kantuk (Fatigue)
                                                </button>
                                                <button
                                                    onClick={() => triggerTestAlarm('phone', 'Distracted Driving: Phone Use', 'DMS Camera AI', 'high')}
                                                    className="p-1.5 bg-white hover:bg-rose-50 border border-amber-200 rounded-lg text-[11px] font-semibold text-slate-700 text-left cursor-pointer"
                                                >
                                                    📱 Main HP di Kabin
                                                </button>
                                                <button
                                                    onClick={() => triggerTestAlarm('overspeed', 'Overspeed Alert (48 km/h > 40 km/h)', 'Speed Telemetry', 'high')}
                                                    className="p-1.5 bg-white hover:bg-rose-50 border border-amber-200 rounded-lg text-[11px] font-semibold text-slate-700 text-left cursor-pointer"
                                                >
                                                    ⚠️ Overspeed 48 km/h
                                                </button>
                                                <button
                                                    onClick={() => triggerTestAlarm('collision', 'Emergency Impact Detected', 'GSensor Alarm', 'critical')}
                                                    className="p-1.5 bg-white hover:bg-rose-50 border border-amber-200 rounded-lg text-[11px] font-semibold text-slate-700 text-left cursor-pointer"
                                                >
                                                    💥 Benturan / G-Sensor
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Category Tabs */}
                                    <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1 overflow-x-auto">
                                            <button
                                                onClick={() => setAlarmTab('all')}
                                                className={`px-2 py-1 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                                                    alarmTab === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Semua ({alarms.length})
                                            </button>
                                            <button
                                                onClick={() => setAlarmTab('gsensor')}
                                                className={`px-2 py-1 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                                                    alarmTab === 'gsensor' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                G-Sensor ({alarms.filter(a => a.category?.toLowerCase().includes('gsensor') || a.desc.toLowerCase().includes('rollover')).length})
                                            </button>
                                            <button
                                                onClick={() => setAlarmTab('fd')}
                                                className={`px-2 py-1 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                                                    alarmTab === 'fd' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Fierce Driving ({alarms.filter(a => a.category?.toLowerCase().includes('fierce') || a.desc.toLowerCase().includes('collision')).length})
                                            </button>
                                            <button
                                                onClick={() => setAlarmTab('dms')}
                                                className={`px-2 py-1 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                                                    alarmTab === 'dms' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                DMS ({alarms.filter(a => a.category?.toLowerCase().includes('dms') || a.category?.toLowerCase().includes('fatigue')).length})
                                            </button>
                                        </div>

                                        {untreatedCount > 0 && (
                                            <button
                                                onClick={handleBatchAction}
                                                className="text-[10px] font-bold text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
                                            >
                                                <CheckCheck className="w-3 h-3" /> Tangani Semua
                                            </button>
                                        )}
                                    </div>

                                    {/* Alarms Feed List */}
                                    <div className="p-3 space-y-2 max-h-[260px] overflow-y-auto">
                                        {filteredAlarms.length === 0 ? (
                                            <div className="text-center py-6">
                                                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                                                <p className="text-xs text-slate-500 font-bold">Tidak ada peringatan aktif</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Semua parameter safety berada dalam kondisi normal</p>
                                            </div>
                                        ) : (
                                            filteredAlarms.map((alarm) => {
                                                const isHandled = (alarm.handle_status ?? 'Untreated') === 'Handled';
                                                return (
                                                    <div
                                                        key={alarm.guid}
                                                        className={`p-2.5 rounded-xl border transition-all ${
                                                            isHandled
                                                                ? 'bg-slate-50/70 border-slate-200 opacity-75'
                                                                : alarm.severity === 'critical'
                                                                ? 'bg-rose-50/80 border-rose-200 shadow-sm'
                                                                : 'bg-amber-50/60 border-amber-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex items-start gap-2 flex-1 min-w-0">
                                                                <div className={`p-1 rounded-lg shrink-0 mt-0.5 ${
                                                                    isHandled ? 'bg-slate-200 text-slate-600' :
                                                                    alarm.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                                }`}>
                                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="text-xs font-bold text-slate-800 leading-tight">
                                                                            {alarm.desc}
                                                                        </span>
                                                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                                                            alarm.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                                                            alarm.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                                                            'bg-slate-100 text-slate-600'
                                                                        }`}>
                                                                            {alarm.severity ? alarm.severity.toUpperCase() : 'ALERT'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                                                                        <span>{alarm.category || 'CMSv6 Alarm'}</span>
                                                                        <span>•</span>
                                                                        <span>{alarm.time}</span>
                                                                        {alarm.vehicle && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span className="font-semibold text-slate-700">{alarm.vehicle}</span>
                                                                            </>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Handle Action */}
                                                            <div className="shrink-0 text-right">
                                                                {isHandled ? (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                                                                        <Check className="w-3 h-3" /> Selesai
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleQuickAction(alarm.guid)}
                                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                                                                    >
                                                                        <Check className="w-3 h-3" /> Tangani
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                {/* ── MODAL: TAMBAH GEOFENCE BARU (Slide 26 GEOFENCE) ── */}
                {showGeofenceModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200 animate-in fade-in zoom-in duration-150">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <LandPlot className="w-4 h-4 text-purple-600" /> Tambah Geofence Tambang Baru
                                    </h4>
                                    <p className="text-[10px] text-slate-400">Konfigurasi zona pagar virtual GPS sesuai standar PT HPU (Slide 26)</p>
                                </div>
                                <button onClick={() => setShowGeofenceModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGeofence} className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Zona / Area</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Pit Front C (Loading), Disposal Selatan"
                                        value={newGeofence.name}
                                        onChange={e => setNewGeofence({ ...newGeofence, name: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Tipe Zona</label>
                                        <select
                                            value={newGeofence.type}
                                            onChange={e => setNewGeofence({ ...newGeofence, type: e.target.value })}
                                            className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="dumping">Dumping Area (Disposal)</option>
                                            <option value="loading">Loading Point (PIT)</option>
                                            <option value="road">Jalan Hauling (Line)</option>
                                            <option value="parking">Workshop / Parkir</option>
                                            <option value="custom">Zona Khusus Lainnya</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Jenis Geometri (Slide 26)</label>
                                        <select
                                            value={newGeofence.geometry_type}
                                            onChange={e => setNewGeofence({ ...newGeofence, geometry_type: e.target.value })}
                                            className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="circle">Circle (Luas Area PIT)</option>
                                            <option value="polygon">Polygon (Office, PIT, Dumping)</option>
                                            <option value="line">Line (Pembuatan Jalan)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Material Utama (Slide 21)</label>
                                        <select
                                            value={newGeofence.material}
                                            onChange={e => setNewGeofence({ ...newGeofence, material: e.target.value })}
                                            className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="OB">OB (Overburden)</option>
                                            <option value="COAL">Coal (Batubara)</option>
                                            <option value="MUD">Mud (Lumpur)</option>
                                            <option value="TOP SOIL">Top Soil (Tanah Pucuk)</option>
                                            <option value="LIMONIT">Limonit</option>
                                            <option value="SAPROLIT">Saprolit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Radius (Meter)</label>
                                        <input
                                            type="number"
                                            min="20"
                                            max="2000"
                                            value={newGeofence.radius}
                                            onChange={e => setNewGeofence({ ...newGeofence, radius: Number(e.target.value) })}
                                            className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Alamat / Blok Tambang</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Pit Front Barat Blok 4, KM 15 Hauling Road"
                                        value={newGeofence.address}
                                        onChange={e => setNewGeofence({ ...newGeofence, address: e.target.value })}
                                        className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Warna Zona (Slide 28)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={newGeofence.color}
                                            onChange={e => setNewGeofence({ ...newGeofence, color: e.target.value })}
                                            className="w-8 h-8 rounded-lg border border-slate-300 p-0.5 cursor-pointer"
                                        />
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {[
                                                { label: 'Hijau (PIT)', hex: '#10B981' },
                                                { label: 'Ungu (Disposal)', hex: '#8B5CF6' },
                                                { label: 'Hitam (ROM)', hex: '#0F172A' },
                                                { label: 'Biru (Office)', hex: '#3B82F6' },
                                                { label: 'Orange (Jalan)', hex: '#EA580C' },
                                            ].map(c => (
                                                <button
                                                    key={c.hex}
                                                    type="button"
                                                    onClick={() => setNewGeofence({ ...newGeofence, color: c.hex })}
                                                    className="text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 font-semibold"
                                                >
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }}></span>
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border">
                                    📍 Titik pusat otomatis menggunakan posisi GPS unit: ({telemetry.lat?.toFixed(5) ?? '-7.6582'}, {telemetry.lng?.toFixed(5) ?? '111.1895'})
                                </p>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowGeofenceModal(false)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow cursor-pointer"
                                    >
                                        Simpan Geofence
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── MODAL: RIWAYAT SIKLUS RITASI & PRODUKSI BCM (Slide 6 & 25) ── */}
                {showRitasiHistoryModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[85vh]">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">Riwayat Siklus Ritasi & Produksi BCM</h3>
                                        <p className="text-xs text-slate-400">Pencatatan siklus hauling dari PIT ke Dumping Area dengan verifikasi sensor PTO (Slide 25)</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowRitasiHistoryModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Summary Metrics Banner */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
                                    <p className="text-[10px] font-bold text-purple-600 uppercase">Total Ritasi</p>
                                    <p className="text-xl font-black text-purple-900">{ritasiToday} <span className="text-xs font-normal">RIT</span></p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Produksi BCM</p>
                                    <p className="text-xl font-black text-emerald-900">{totalBcmToday} <span className="text-xs font-normal">BCM</span></p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase">Rata-rata Cycle Time</p>
                                    <p className="text-xl font-black text-blue-900">{avgCycleTimeToday || 22} <span className="text-xs font-normal">Menit</span></p>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase">Total Jarak Tempuh</p>
                                    <p className="text-xl font-black text-amber-900">{totalDistanceKm.toFixed(1)} <span className="text-xs font-normal">KM</span></p>
                                </div>
                            </div>

                            {/* Table of Ritasi Logs */}
                            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
                                {ritasiLogs.length > 0 ? (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 border-b">
                                            <tr>
                                                <th className="p-2.5">Trip #</th>
                                                <th className="p-2.5">Unit</th>
                                                <th className="p-2.5">Material (Slide 21)</th>
                                                <th className="p-2.5">Loading PIT</th>
                                                <th className="p-2.5">Dumping Disposal</th>
                                                <th className="p-2.5 text-center">Cycle Time</th>
                                                <th className="p-2.5 text-center">Jarak</th>
                                                <th className="p-2.5 text-center">Sensor PTO</th>
                                                <th className="p-2.5 text-right">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {ritasiLogs.map(l => {
                                                const mat = l.load_type || 'OB';
                                                const matBg = 
                                                    mat === 'COAL' ? 'bg-slate-900 text-white' :
                                                    mat === 'OB' ? 'bg-slate-500 text-white' :
                                                    mat === 'MUD' ? 'bg-amber-900 text-white' :
                                                    mat === 'TOP SOIL' ? 'bg-orange-600 text-white' :
                                                    mat === 'LIMONIT' ? 'bg-yellow-700 text-white' : 'bg-emerald-700 text-white';
                                                return (
                                                    <tr key={l.id} className="hover:bg-slate-50/70 transition">
                                                        <td className="p-2.5 font-bold text-slate-700">#{l.id}</td>
                                                        <td className="p-2.5 font-mono font-semibold text-slate-800">{l.unit_code || 'HD-78501'}</td>
                                                        <td className="p-2.5">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${matBg}`}>
                                                                {mat}
                                                            </span>
                                                        </td>
                                                        <td className="p-2.5 text-slate-700">{l.pit_name || 'Pit Front A'}</td>
                                                        <td className="p-2.5 text-slate-700 font-medium">{l.dumping_name || l.geofence_name}</td>
                                                        <td className="p-2.5 text-center font-mono text-purple-700 font-bold">{l.cycle_time_minutes ?? 21.5} m</td>
                                                        <td className="p-2.5 text-center font-mono text-slate-600">{l.distance_km ?? 2.4} km</td>
                                                        <td className="p-2.5 text-center">
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <CheckCircle className="w-3 h-3 text-emerald-600" /> ON (Verified)
                                                            </span>
                                                        </td>
                                                        <td className="p-2.5 text-right font-mono text-slate-500">{l.entered_at || '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-12 text-center text-slate-400">
                                        <p className="text-sm font-semibold">Belum ada riwayat ritasi tercatat hari ini.</p>
                                        <p className="text-xs text-slate-400 mt-1">Jalankan simulasi 5 siklus hauling atau operasikan unit tambang untuk merekam ritasi.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-2 border-t text-xs">
                                <span className="text-slate-500 text-[11px]">
                                    Rumus Produktivitas Hauler: Q = q × (3600 / Cycle Time) × FK
                                </span>
                                <button
                                    onClick={() => setShowRitasiHistoryModal(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </LayoutNavbar>
        </>
    );
}
