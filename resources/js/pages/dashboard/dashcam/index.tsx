import { Head } from '@inertiajs/react';
import LayoutNavbar from '@/components/layout-navbar';
import { 
    Signal, User, Scan, Video, AlertCircle, ShieldCheck, Map as MapIcon, Truck, Fuel, Power, 
    UserCheck, UserX, LogOut, Navigation, ArrowRightCircle, LogIn, X, 
    ChevronDown, Search, History, Camera, CheckCircle2, ScanFace, UserPlus,
    ShieldAlert, Check, CheckCheck, Sparkles, Bell, LandPlot, Play, RotateCw, 
    Plus, Trash2, MapPin, Clock, Gauge, Layers, Activity, FileText, CheckCircle,
    LayoutGrid, Rows, Star, ArrowUpRight, RotateCcw, Smartphone, Radio, Phone
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';

export type FleetVehicle = {
    id: string;
    plateNo: string;
    deviceNo: string;
    sim?: string;
    type: 'DT' | 'EXCA' | 'FT';
    model: string;
    site: string;
    status?: 'ONLINE' | 'STANDBY';
    is_registered?: boolean;
    last_ping?: string | null;
    server_name?: string;
    channels?: { channel: number; name: string }[];
};

export const HPU_FLEET: FleetVehicle[] = [
    {
        id: 'BDA-DT41107VV-RU-225',
        plateNo: 'BDA-DT41107VV (RU-225)',
        deviceNo: '240078740672',
        sim: '08115125648',
        type: 'DT',
        model: 'Dump Truck RU-225',
        site: 'BDA Pit Area',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'BDA-DT41110VV-RU-230',
        plateNo: 'BDA-DT41110VV (RU-230)',
        deviceNo: '240078740557',
        sim: '08115125650',
        type: 'DT',
        model: 'Dump Truck RU-230',
        site: 'BDA Pit Area',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'HPA-DT47101VV',
        plateNo: 'HPA-DT47101VV',
        deviceNo: '240078735201',
        sim: '081119759089',
        type: 'DT',
        model: 'Dump Truck Hauling (47101)',
        site: 'HPA Pit Front',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'KIA-DT42101VV-HAUL',
        plateNo: 'KIA-DT42101VV (HAUL)',
        deviceNo: '240079676909',
        sim: '08115219637',
        type: 'DT',
        model: 'Dump Truck Hauling (42101)',
        site: 'KIA Hauling Road',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'KJA-DT49115MB-HAUL',
        plateNo: 'KJA-DT49115MB (HAUL)',
        deviceNo: '240079636952',
        sim: '08115219314',
        type: 'DT',
        model: 'Dump Truck Hauling (49115)',
        site: 'KJA Hauling Road',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'HPA-DT49109MB',
        plateNo: 'HPA-DT49109MB',
        deviceNo: '240078916025',
        sim: '081100105674',
        type: 'DT',
        model: 'Dump Truck Hauling (49109MB)',
        site: 'HPA Pit Front',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'KDA-FT40003MB',
        plateNo: 'KDA-FT40003MB',
        deviceNo: '240079658477',
        sim: '08115219305',
        type: 'FT',
        model: 'Fuel Truck 40,000L',
        site: 'KDA Pit Area',
        status: 'ONLINE',
        is_registered: true,
    },
    {
        id: 'HPA-CWR-DT44121XC',
        plateNo: 'HPA-CWR-DT44121XC',
        deviceNo: '240078921678',
        sim: '081119759094',
        type: 'DT',
        model: 'Dump Truck Hauling (44121XC)',
        site: 'HPA CWR Pit',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'HPA-CWR-DT44123XC',
        plateNo: 'HPA-CWR-DT44123XC',
        deviceNo: '240078921470',
        sim: '081119759083',
        type: 'DT',
        model: 'Dump Truck Hauling (44123XC)',
        site: 'HPA CWR Pit',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'HPA-DT47103VV',
        plateNo: 'HPA-DT47103VV',
        deviceNo: '240078735110',
        sim: '081119759087',
        type: 'DT',
        model: 'Dump Truck Hauling (47103)',
        site: 'HPA Pit Front',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'HPA-DT47106VV',
        plateNo: 'HPA-DT47106VV',
        deviceNo: '240078734980',
        sim: '081119759080',
        type: 'DT',
        model: 'Dump Truck Hauling (47106)',
        site: 'HPA Pit Front',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'HPA-DT47109VV',
        plateNo: 'HPA-DT47109VV',
        deviceNo: '240078734998',
        sim: '081119759085',
        type: 'DT',
        model: 'Dump Truck Hauling (47109)',
        site: 'HPA Pit Front',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'KDA-FT28001HN',
        plateNo: 'KDA-FT28001HN',
        deviceNo: '240079626307',
        sim: '08115219303',
        type: 'FT',
        model: 'Fuel Truck 28,000L',
        site: 'KDA Pit Area',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'KJA-DT49125MB-HAUL',
        plateNo: 'KJA-DT49125MB (HAUL)',
        deviceNo: '240079664063',
        sim: '08115219644',
        type: 'DT',
        model: 'Dump Truck Hauling (49125)',
        site: 'KJA Hauling Road',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'KJA-DT49113MB-HAUL',
        plateNo: 'KJA-DT49113MB (HAUL)',
        deviceNo: '240079608836',
        sim: '08115219307',
        type: 'DT',
        model: 'Dump Truck Hauling (49113)',
        site: 'KJA Hauling Road',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'BDA-DT41121VV-RU-227',
        plateNo: 'BDA-DT41121VV (RU-227)',
        deviceNo: '291073208720',
        sim: '081120270220',
        type: 'DT',
        model: 'Dump Truck RU-227',
        site: 'BDA Pit Area',
        status: 'STANDBY',
        is_registered: false,
    },
    {
        id: 'EXCA-PC2000-01',
        plateNo: 'EX-2001 (Komatsu PC2000)',
        deviceNo: '240078915951',
        sim: '08115219999',
        type: 'EXCA',
        model: 'Excavator Komatsu PC2000-8',
        site: 'Pit Front Alfa',
        status: 'STANDBY',
        is_registered: true,
    },
    {
        id: 'EXCA-PC1250-02',
        plateNo: 'EX-1252 (Komatsu PC1250)',
        deviceNo: '240078915952',
        sim: '08115219998',
        type: 'EXCA',
        model: 'Excavator Komatsu PC1250-8',
        site: 'Pit Front Bravo',
        status: 'STANDBY',
        is_registered: true,
    },
];

// Channel 0 = CAM 1 Depan (Metode 1: videoH5.html langsung dari server CMSV6 HPU)
// Channel 1 = CAM 2 Kabin (Metode 2: player.html dengan optimasi low-latency)
function camUrl(deviceId: string, channel: number, jsession: string | null, baseUrl: string = "http://10.10.0.33:8088", engine: 'cmsv6' | 'flv' = 'cmsv6', isDemo: boolean = false) {
    if (!jsession && !isDemo) return null;
    if (isDemo) {
        return `/player.html?dev=${deviceId}&ch=${channel}&demo=1`;
    }
    if (engine === 'cmsv6') {
        return `http://10.10.0.33:8088/808gps/open/player/video.html?lang=en&devIdno=${deviceId}&jsession=${jsession || ''}&index=${channel + 1}&playerType=h5&hideVolumeBtn=1`;
    }
    const mediaHost = '10.10.0.33:6604';
    return `/player.html?dev=${deviceId}&ch=${channel}&jsession=${jsession || ''}&host=${mediaHost}`;
}

// channels akan dirender dinamis berdasarkan selectedVehicle di dalam komponen

export default function Page() {
    // ── STATE ARMADA DASHCAM PT. HPU ──
    const [fleet, setFleet] = useState<FleetVehicle[]>(HPU_FLEET);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('BDA-DT41107VV-RU-225');
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'ALL' | 'DT' | 'EXCA' | 'FT'>('ALL');
    const [streamEngine, setStreamEngine] = useState<'cmsv6' | 'flv'>('cmsv6');
    const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

    // Listen postMessage dari player.html untuk navigasi ke armada terdaftar
    useEffect(() => {
        const handleMsg = (e: MessageEvent) => {
            if (e.data && e.data.type === 'SELECT_VEHICLE' && e.data.deviceId) {
                const target = fleet.find(v => v.deviceNo === e.data.deviceId);
                if (target) {
                    setSelectedVehicleId(target.id);
                }
            }
        };
        window.addEventListener('message', handleMsg);
        return () => window.removeEventListener('message', handleMsg);
    }, [fleet]);

    const currentVehicle = fleet.find(v => v.id === selectedVehicleId) || fleet[0];
    const activeDeviceId = currentVehicle.deviceNo;
    const selectedVehicle: 'DT' | 'EXCA' = currentVehicle.type === 'EXCA' ? 'EXCA' : 'DT';

    const activeChannels = currentVehicle.type === 'EXCA' 
        ? [
            { id: "cam1", deviceId: activeDeviceId, apiChannel: 0, label: "CAM 1 — Area Kerja (Loading)", hasStream: true },
            { id: "cam2", deviceId: activeDeviceId, apiChannel: 1, label: "CAM 2 — Kabin Operator", hasStream: true },
        ]
        : [
            { id: "cam1", deviceId: activeDeviceId, apiChannel: 0, label: "CAM 1 — Depan (Jalan)", hasStream: true },
            { id: "cam2", deviceId: activeDeviceId, apiChannel: 1, label: "CAM 2 — Kabin Pengemudi", hasStream: true },
        ];

    // Filter daftar kendaraan berdasarkan pencarian & filter tipe
    const filteredVehicles = fleet.filter(v => {
        if (vehicleTypeFilter !== 'ALL' && v.type !== vehicleTypeFilter) return false;
        if (!vehicleSearchQuery.trim()) return true;
        const q = vehicleSearchQuery.toLowerCase();
        return (
            v.plateNo.toLowerCase().includes(q) ||
            v.deviceNo.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.site.toLowerCase().includes(q)
        );
    });

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
    const [cmsBaseUrl, setCmsBaseUrl] = useState<string>("http://10.10.0.33:8088");
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
                    deviceId: activeDeviceId,
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
                notice: `⚡ [3/5 SIKLUS RITASI] DUMPING: Tiba di Disposal Timur, SENSOR PTO ON! Hidrolik dump mengangkat muatan.`,
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
            deviceId: activeDeviceId,
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

        // Ambil daftar unit real-time dari server backend
        fetch('/api/cmsv6/vehicles')
            .then(r => r.json())
            .then(data => {
                if (data.result === 0 && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
                    setFleet(data.vehicles);
                    const onlineUnit = data.vehicles.find((v: FleetVehicle) => v.status === 'ONLINE');
                    if (onlineUnit) {
                        setSelectedVehicleId(prev => {
                            const cur = data.vehicles.find((v: FleetVehicle) => v.id === prev);
                            return (cur && cur.status === 'ONLINE') ? prev : onlineUnit.id;
                        });
                    }
                }
            })
            .catch(() => {});
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
                const res = await fetch(`/api/cmsv6/status?devIdno=${activeDeviceId}`);
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
                            online: (s.ol === 1 || s.net === 3 || Boolean(s.gt)),
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
    }, [jsession, activeDeviceId]);

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
            <LayoutNavbar 
                containerClassName="w-full max-w-[98%] 2xl:max-w-[1920px]" 
                className="bg-slate-100/80 rounded-2xl shadow-xl border border-slate-200/80 p-3.5 md:p-5"
            >
                <Head title="Dashcam Monitoring" />

                <div className="space-y-4">
                    {/* Floating Emergency Alarm Banner (Jika ada alarm kritis) */}
                    {untreatedCriticalAlarm && !bannerDismissed && (
                        <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ShieldAlert className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded">
                                            {untreatedCriticalAlarm.category || 'AI Safety Alert'}
                                        </span>
                                        <span className="text-sm font-bold">{untreatedCriticalAlarm.desc}</span>
                                    </div>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        Unit: {untreatedCriticalAlarm.vehicle || currentVehicle.plateNo} • Waktu: {untreatedCriticalAlarm.time} • Status: Menunggu Tindakan Safety Officer
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleQuickAction(untreatedCriticalAlarm.guid)}
                                    className="text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
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
                        MAIN 2-COLUMN BALANCED FULL-HEIGHT DASHBOARD LAYOUT (CARD SEPARATION)
                       ══════════════════════════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                        {/* ── KOLOM KIRI (lg:col-span-3): SIDEBAR UNIT ARMADA (CARD SEPARATORS) ── */}
                        <div className="lg:col-span-3 flex flex-col gap-4">
                            {/* Card 1: Armada Fleet Selector */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
                                {/* Header Card */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                                                Armada Dashcam
                                            </h3>
                                            <p className="text-[11px] text-gray-400">Total {fleet.length} Unit Terdaftar</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Live Ready
                                    </span>
                                </div>

                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Cari nopol, device, site..."
                                        value={vehicleSearchQuery}
                                        onChange={(e) => setVehicleSearchQuery(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    {vehicleSearchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setVehicleSearchQuery('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-medium">
                                    {(['ALL', 'DT', 'EXCA', 'FT'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setVehicleTypeFilter(tab)}
                                            className={`flex-1 py-1 rounded text-center transition cursor-pointer text-xs ${
                                                vehicleTypeFilter === tab 
                                                    ? 'bg-white text-gray-900 shadow-xs font-bold' 
                                                    : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            {tab === 'ALL' ? 'Semua' : tab === 'DT' ? 'Truck' : tab === 'EXCA' ? 'Exca' : 'Fuel'}
                                        </button>
                                    ))}
                                </div>

                                {/* Vehicle List Panel */}
                                <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto pr-1">
                                    {filteredVehicles.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-gray-400">
                                            Tidak ada unit yang cocok dengan pencarian "{vehicleSearchQuery}"
                                        </div>
                                    ) : (
                                        filteredVehicles.map((v) => {
                                            const isSelected = v.id === currentVehicle.id;
                                            return (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    onClick={() => setSelectedVehicleId(v.id)}
                                                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2 transition cursor-pointer border ${
                                                        isSelected 
                                                            ? 'bg-blue-50/90 border-blue-300 text-blue-900 shadow-xs ring-1 ring-blue-300' 
                                                            : 'bg-slate-50/60 hover:bg-slate-100/90 border-slate-200/80 text-gray-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className={`p-1.5 rounded-lg shrink-0 ${
                                                            v.type === 'EXCA' ? 'bg-amber-100 text-amber-700' :
                                                            v.type === 'FT' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {v.type === 'EXCA' ? <LandPlot className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-xs truncate text-gray-900">{v.plateNo}</span>
                                                                {v.is_registered && (
                                                                    <span className="text-[8px] font-extrabold px-1 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300">
                                                                        CMSV6
                                                                    </span>
                                                                )}
                                                                <span className={`text-[9px] font-bold px-1 rounded ${
                                                                    v.type === 'EXCA' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                                                    v.type === 'FT' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                                                    'bg-blue-50 text-blue-800 border border-blue-200'
                                                                }`}>
                                                                    {v.type}
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 truncate font-mono">
                                                                Device: {v.deviceNo} • {v.site}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            v.status === 'ONLINE' ? 'bg-emerald-500 shadow-xs' : 
                                                            v.is_registered ? 'bg-amber-400' : 'bg-slate-300'
                                                        }`} title={v.status === 'ONLINE' ? 'Online' : v.is_registered ? 'Standby di Pit' : 'Belum Terdaftar'}></span>
                                                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Diagnostik Hardware Unit Terpilih */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col gap-2.5">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                                        Diagnostik Hardware
                                    </span>
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                                        {currentVehicle.plateNo}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-medium">Sinyal 4G MDVR</span>
                                        <span className={`font-bold mt-0.5 ${
                                            currentVehicle.status === 'ONLINE' ? 'text-emerald-600' :
                                            currentVehicle.is_registered ? 'text-amber-600' : 'text-slate-500'
                                        }`}>
                                            {currentVehicle.status === 'ONLINE' ? 'Kuat (-68 dBm)' : 
                                             currentVehicle.is_registered ? 'Standby di Pit' : 'Belum Terdaftar'}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-medium">GPS Satelit</span>
                                        <span className="font-bold text-blue-700 mt-0.5">
                                            {currentVehicle.is_registered ? '18 Terkunci' : '0 Terkunci'}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-medium">Storage MDVR</span>
                                        <span className="font-bold text-gray-800 mt-0.5">256 GB (Normal)</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-medium">Kondisi Mesin</span>
                                        <span className={`font-bold mt-0.5 ${
                                            currentVehicle.status === 'ONLINE' ? 'text-emerald-600' :
                                            currentVehicle.is_registered ? 'text-amber-600' : 'text-slate-500'
                                        }`}>
                                            {currentVehicle.status === 'ONLINE' ? 'ON (Running)' :
                                             currentVehicle.is_registered ? 'STANDBY (Engine OFF)' : 'STANDBY (Virtual)'}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-[11px] flex items-center justify-between">
                                    <span className="text-gray-500">Kanal Video Aktif:</span>
                                    <span className="font-semibold text-gray-800">CH1 Jalan • CH2 Kabin DMS</span>
                                </div>
                            </div>

                            {/* Card 3: CMSV6 Gateway & Dispatch Network */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col gap-2">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                                    <span className="font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Radio className="w-3.5 h-3.5 text-blue-600" />
                                        Gateway & Dispatch
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        Online 100%
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                                        <span className="text-gray-500 text-[11px]">Server CMSV6:</span>
                                        <span className="font-mono font-bold text-gray-800 text-[11px]">10.10.0.33:8088</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                                        <span className="text-gray-500 text-[11px]">Radio Tambang:</span>
                                        <span className="font-semibold text-blue-700 text-[11px]">CH-04 Pit Front West</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                                        <span className="text-gray-500 text-[11px]">Safety Officer:</span>
                                        <span className="font-semibold text-gray-800 text-[11px]">Rahmat H. (HSE-09)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Status Kesiapan Armada Tambang */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs flex flex-col gap-2">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-xs">
                                    <span className="font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                                        Kesiapan Armada
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        20/20 Aktif
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">DT Hauler</span>
                                        <span className="font-bold text-blue-700 text-xs">14 Unit</span>
                                    </div>
                                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Excavator</span>
                                        <span className="font-bold text-amber-700 text-xs">4 Unit</span>
                                    </div>
                                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Fuel Truck</span>
                                        <span className="font-bold text-emerald-700 text-xs">2 Unit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── KOLOM KANAN (lg:col-span-9): LIVECAM SURVEILLANCE & MODULAR METRICS (CARDS) ── */}
                        <div className="lg:col-span-9 space-y-4 min-w-0">
                            {/* Card 5: Integrated Video Surveillance & Command Center Card */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
                                {/* Command Bar Inside Surveillance Card */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                    {/* Left: Selected Unit Info */}
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${
                                            currentVehicle.type === 'EXCA' ? 'bg-amber-100 text-amber-700' :
                                            currentVehicle.type === 'FT' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {currentVehicle.type === 'EXCA' ? <LandPlot className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                                                    {currentVehicle.plateNo}
                                                </h2>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                                    currentVehicle.type === 'EXCA' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                                    currentVehicle.type === 'FT' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                                    'bg-blue-50 text-blue-800 border border-blue-200'
                                                }`}>
                                                    {currentVehicle.type}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 font-mono">
                                                Device ID: {currentVehicle.deviceNo} • Site: {currentVehicle.site}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: View Mode, Stream Engine & Status Indicators */}
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {/* View Mode Switcher */}
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                                            <button
                                                type="button"
                                                onClick={() => setCameraViewMode('dual')}
                                                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                                                    cameraViewMode === 'dual' 
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <LayoutGrid className="w-3.5 h-3.5" />
                                                <span>Dual View</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCameraViewMode('cam1')}
                                                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                                                    cameraViewMode === 'cam1' 
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <Video className="w-3.5 h-3.5" />
                                                <span>CAM 1</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCameraViewMode('cam2')}
                                                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                                                    cameraViewMode === 'cam2' 
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <User className="w-3.5 h-3.5" />
                                                <span>CAM 2</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCameraViewMode('stacked')}
                                                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                                                    cameraViewMode === 'stacked' 
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <Rows className="w-3.5 h-3.5" />
                                                <span>Vertikal</span>
                                            </button>
                                        </div>

                                        {/* Stream Engine Selector & Demo Toggle */}
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() => { setStreamEngine('cmsv6'); setIsDemoMode(false); }}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                                                    streamEngine === 'cmsv6' && !isDemoMode
                                                        ? 'bg-white text-gray-900 shadow-xs font-bold' 
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                                title="Gunakan CMSV6 Official H5 Video Player dari server 182.253.27.12"
                                            >
                                                Official H5
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setStreamEngine('flv'); setIsDemoMode(false); }}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                                                    streamEngine === 'flv' && !isDemoMode
                                                        ? 'bg-white text-gray-900 shadow-xs font-bold' 
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                                title="Gunakan Direct HTTP-FLV Media Stream Port 6604"
                                            >
                                                FLV Direct
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsDemoMode(!isDemoMode)}
                                                className={`px-2.5 py-1 rounded-md transition cursor-pointer text-xs font-bold flex items-center gap-1 ${
                                                    isDemoMode
                                                        ? 'bg-emerald-600 text-white shadow-xs' 
                                                        : 'text-slate-600 hover:text-emerald-700 bg-white/70'
                                                }`}
                                                title="Aktifkan simulasi streaming video demo pit hauling & kabin DMS saat armada offline"
                                            >
                                                <span>🎬</span>
                                                <span>{isDemoMode ? 'Demo Aktif' : 'Demo Stream'}</span>
                                            </button>
                                        </div>

                                        {/* Refresh Player Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const oldJ = jsession;
                                                setJsession('');
                                                setTimeout(() => setJsession(oldJ), 300);
                                            }}
                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-gray-600 hover:text-blue-600 transition cursor-pointer"
                                            title="Muat Ulang Video Feed"
                                        >
                                            <RotateCw className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Live Status Indicators */}
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                LIVE
                                            </span>
                                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                CMSV6 OK
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Video Player Frame (Aspect Ratio Preserved) */}
                                <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
                                    {/* Video Player Top Bar (CCTV OSD Header) */}
                                    <div className="bg-slate-900/95 border-b border-slate-800/80 px-3.5 py-2 flex items-center justify-between text-xs text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 -ml-4.5"></span>
                                            <span className="font-bold tracking-wide uppercase text-white text-[11px]">
                                                Live CCTV & Cabin AI Surveillance
                                            </span>
                                            <span className="text-slate-500">•</span>
                                            <span className="font-mono text-slate-400 text-[11px]">
                                                {currentVehicle.plateNo} ({currentVehicle.deviceNo})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 font-mono text-[11px]">
                                            <span className="text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                                                1080P HD 30FPS
                                            </span>
                                            <span className="text-slate-400">
                                                {new Date().toLocaleTimeString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Video Feeds Container */}
                                    <div className="p-2 sm:p-2.5 bg-black">
                                        {cameraViewMode === 'dual' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                                                {activeChannels.map(ch => (
                                                    <div 
                                                        key={ch.id}
                                                        className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group"
                                                    >
                                                        <iframe
                                                            src={camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl, streamEngine, isDemoMode)!}
                                                            className="w-full h-full border-0 absolute inset-0 bg-slate-950 overflow-hidden"
                                                            scrolling="no"
                                                            style={{ overflow: 'hidden' }}
                                                            title={ch.label}
                                                            allowFullScreen
                                                            allow="autoplay; fullscreen; camera; microphone; encrypted-media"
                                                        />
                                                        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                                                            <span className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.8 rounded-md border border-white/10">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                                {ch.label}
                                                            </span>
                                                        </div>
                                                        <div className="absolute bottom-1.5 left-2 right-2 z-10 pointer-events-none flex items-center justify-between text-[10px] text-white/80 font-mono bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                                                            <span>Lat: {telemetry.lat?.toFixed(5) ?? '-7.65820'}, Lng: {telemetry.lng?.toFixed(5) ?? '111.18950'} • Speed: {telemetry.speed} km/j</span>
                                                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {cameraViewMode === 'cam1' && (
                                            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-slate-800">
                                                <iframe
                                                    src={camUrl(currentVehicle.deviceNo, 0, jsession, cmsBaseUrl, streamEngine, isDemoMode)!}
                                                    className="w-full h-full border-0 absolute inset-0 bg-slate-950 overflow-hidden"
                                                    scrolling="no"
                                                    style={{ overflow: 'hidden' }}
                                                    title="CAM 1 - Depan (Jalan)"
                                                    allowFullScreen
                                                    allow="autoplay; fullscreen; camera; microphone; encrypted-media"
                                                />
                                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                                    <span className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10">
                                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                                        CAM 1 — Depan (Jalan)
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {cameraViewMode === 'cam2' && (
                                            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-slate-800">
                                                <iframe
                                                    src={camUrl(currentVehicle.deviceNo, 1, jsession, cmsBaseUrl, streamEngine, isDemoMode)!}
                                                    className="w-full h-full border-0 absolute inset-0 bg-slate-950 overflow-hidden"
                                                    scrolling="no"
                                                    style={{ overflow: 'hidden' }}
                                                    title="CAM 2 - Kabin Pengemudi"
                                                    allowFullScreen
                                                    allow="autoplay; fullscreen; camera; microphone; encrypted-media"
                                                />
                                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                                    <span className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10">
                                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                                        CAM 2 — Kabin Pengemudi
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {cameraViewMode === 'stacked' && (
                                            <div className="flex flex-col gap-3">
                                                {activeChannels.map(ch => (
                                                    <div
                                                        key={ch.id}
                                                        className="relative bg-black rounded-lg overflow-hidden border border-slate-800 h-[360px]"
                                                    >
                                                        <iframe
                                                            src={camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl, streamEngine, isDemoMode)!}
                                                            className="w-full h-full border-0 absolute inset-0 bg-slate-950 overflow-hidden"
                                                            scrolling="no"
                                                            style={{ overflow: 'hidden' }}
                                                            title={ch.label}
                                                            allowFullScreen
                                                            allow="autoplay; fullscreen; camera; microphone; encrypted-media"
                                                        />
                                                        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                                                            <span className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10">
                                                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                                                {ch.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── MODULAR CARDS: ROW 1 (HAULING / EXCA + GPS & GEOFENCE) ── */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                                <div className="xl:col-span-7 flex flex-col">
                                    {selectedVehicle === 'DT' ? (
                                        /* Card 6: SIKLUS OPERASIONAL HAULING */
                                        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                                                    <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                                                        SIKLUS OPERASIONAL HAULING
                                                    </span>
                                                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                                        Tahap: {haulingStage}
                                                    </span>
                                                </div>

                                                {/* Stepper Progress */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs font-bold">
                                                    <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${
                                                        haulingStage === 'LOADING' 
                                                            ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs' 
                                                            : 'bg-slate-50 border-slate-200/80 text-gray-500'
                                                    }`}>
                                                        <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                        <span className="truncate">1. Loading</span>
                                                    </div>
                                                    <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${
                                                        haulingStage === 'TRAVEL_ISI' 
                                                            ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs' 
                                                            : 'bg-slate-50 border-slate-200/80 text-gray-500'
                                                    }`}>
                                                        <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                        <span className="truncate">2. Travel Isi</span>
                                                    </div>
                                                    <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${
                                                        haulingStage === 'DUMPING' 
                                                            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs' 
                                                            : 'bg-slate-50 border-slate-200/80 text-gray-500'
                                                    }`}>
                                                        <ArrowRightCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                        <span className="truncate">3. Dumping</span>
                                                    </div>
                                                    <div className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${
                                                        haulingStage === 'TRAVEL_KOSONG' 
                                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs' 
                                                            : 'bg-slate-50 border-slate-200/80 text-gray-500'
                                                    }`}>
                                                        <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                        <span className="truncate">4. Trv Kosong</span>
                                                    </div>
                                                </div>

                                                {/* Trip Info & Big RIT Box */}
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                                                    <div className="md:col-span-8 flex flex-col gap-1.5 text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                            <span className="font-semibold text-gray-400 uppercase w-18 text-[11px]">Start Pit:</span>
                                                            <span className="font-bold text-gray-800">{currentTrip.startTime}, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                            <span className="font-semibold text-gray-400 uppercase w-18 text-[11px]">Durasi:</span>
                                                            <span className="font-bold text-gray-800">{currentTrip.nowTime}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                            <span className="font-semibold text-gray-400 uppercase w-18 text-[11px]">Tujuan:</span>
                                                            <span className="font-bold text-gray-800 truncate">{currentTrip.finishArea}</span>
                                                        </div>
                                                        <div className="mt-1">
                                                            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                                                <span>Progress Trip</span>
                                                                <span className="font-mono text-blue-600 font-bold">{currentTrip.tripProgress}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                                                                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${currentTrip.tripProgress}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-4 flex flex-col items-center justify-center p-2.5 bg-white rounded-lg border border-slate-200/80 text-center gap-0.5">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Ritasi</p>
                                                        <p className="text-2xl font-black text-blue-700 leading-none">
                                                            {ritasiToday} <span className="text-xs font-bold text-gray-500">RIT</span>
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={runHaulingSimulation}
                                                            disabled={isSimulatingTrip}
                                                            className="w-full mt-1.5 py-1 px-2 rounded-md text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs transition flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <Play className="w-2.5 h-2.5 fill-white" />
                                                            {isSimulatingTrip ? 'Berjalan...' : 'Simulasi 5 Siklus'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Material Selector */}
                                            <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                                                <div className="flex items-center justify-between mb-1.5 text-xs">
                                                    <span className="font-bold text-gray-700 flex items-center gap-1">
                                                        <Layers className="w-3 h-3 text-gray-400" /> Material Muatan:
                                                    </span>
                                                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                                                        {selectedMaterial}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                                                    {[
                                                        { name: 'OB', label: 'OB (Overburden)', bg: 'bg-slate-700' },
                                                        { name: 'COAL', label: 'Coal (Batubara)', bg: 'bg-gray-900' },
                                                        { name: 'MUD', label: 'Mud (Lumpur)', bg: 'bg-amber-800' },
                                                        { name: 'TOP SOIL', label: 'Top Soil', bg: 'bg-orange-700' },
                                                        { name: 'LIMONIT', label: 'Limonit', bg: 'bg-yellow-700' },
                                                        { name: 'SAPROLIT', label: 'Saprolit', bg: 'bg-emerald-800' },
                                                    ].map(mat => (
                                                        <button
                                                            key={mat.name}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedMaterial(mat.name as MaterialType);
                                                                setGeofenceNotice(`Material diubah ke: ${mat.name}`);
                                                                setTimeout(() => setGeofenceNotice(null), 3000);
                                                            }}
                                                            className={`py-1 px-1.5 rounded-lg text-[11px] font-bold text-white transition cursor-pointer text-center truncate ${mat.bg} ${
                                                                selectedMaterial === mat.name ? 'ring-2 ring-blue-500 shadow-xs' : 'opacity-80 hover:opacity-100'
                                                            }`}
                                                            title={mat.label}
                                                        >
                                                            {mat.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Card 6 (Excavator): AI TRUCK DETECTION */
                                        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                    <Scan className="w-3.5 h-3.5 text-blue-600" />
                                                    AI TRUCK DETECTION & LOADING ZONE
                                                </span>
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                                    <Truck className="w-3 h-3" /> TRUK TERDETEKSI
                                                </span>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Unit DT Terkunci</span>
                                                    <span className="text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-gray-700">Jarak: 3.2m</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <h4 className="text-xl font-bold text-blue-700">HD-78501</h4>
                                                    <span className="text-xs text-gray-400 font-mono">ID: 240078916116</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                                                    <div className="bg-white p-2 rounded border border-slate-200">
                                                        <p className="text-gray-400 font-medium uppercase text-[10px]">Operator DT</p>
                                                        <p className="font-bold text-gray-800">Sandi Setiawan</p>
                                                    </div>
                                                    <div className="bg-white p-2 rounded border border-slate-200">
                                                        <p className="text-gray-400 font-medium uppercase text-[10px]">Kapasitas Vessel</p>
                                                        <p className="font-bold text-gray-800">~20 BCM (30 Ton)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="xl:col-span-5 flex flex-col">
                                    {/* Card 7: LIVE GPS LOCATION & GEOFENCE TAMBANG */}
                                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                    GPS & GEOFENCE TAMBANG
                                                </span>
                                                <button
                                                    onClick={() => setShowGeofenceModal(true)}
                                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Plus className="w-3 h-3" /> Tambah Zona
                                                </button>
                                            </div>

                                            {/* Map Viewport */}
                                            <div className="relative h-[220px] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                                                <Map
                                                    center={[telemetry.lat || -7.6582, telemetry.lng || 111.1895]}
                                                    zoom={14}
                                                    attribution={false}
                                                >
                                                    {/* Geofence Circles */}
                                                    {geofences.map(gf => {
                                                        const lat = gf.coordinates?.lat || -7.6582;
                                                        const lng = gf.coordinates?.lng || 111.1895;
                                                        const r = gf.radius || 100;
                                                        const pxRadius = Math.max(20, Math.min(100, Math.round(r / 3.5)));
                                                        return (
                                                            <Overlay key={gf.id} anchor={[lat, lng]} offset={[pxRadius, pxRadius]}>
                                                                <div
                                                                    style={{
                                                                        width: `${pxRadius * 2}px`,
                                                                        height: `${pxRadius * 2}px`,
                                                                        borderColor: gf.color || '#2563EB',
                                                                        backgroundColor: `${gf.color || '#2563EB'}22`,
                                                                    }}
                                                                    className="rounded-full border-2 border-dashed pointer-events-none flex items-center justify-center"
                                                                >
                                                                    <span
                                                                        style={{ color: gf.color || '#2563EB', backgroundColor: 'rgba(255,255,255,0.85)' }}
                                                                        className="text-[9px] font-bold px-1 rounded shadow-xs truncate max-w-[90px]"
                                                                    >
                                                                        {gf.name}
                                                                    </span>
                                                                </div>
                                                            </Overlay>
                                                        );
                                                    })}

                                                    {/* Live Unit Marker */}
                                                    <Marker
                                                        anchor={[telemetry.lat || -7.6582, telemetry.lng || 111.1895]}
                                                        payload={1}
                                                    >
                                                        <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                                                            <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
                                                            <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white">
                                                                <Truck className="w-3.5 h-3.5" />
                                                            </div>
                                                        </div>
                                                    </Marker>
                                                </Map>
                                            </div>

                                            {/* Quick Telemetry Under Map */}
                                            <div className="grid grid-cols-4 gap-1 text-center mt-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
                                                <div>
                                                    <p className="text-gray-400 font-semibold uppercase text-[9px]">Speed</p>
                                                    <p className="font-bold text-gray-900 text-xs">{telemetry.speed} km/j</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 font-semibold uppercase text-[9px]">Odometer</p>
                                                    <p className="font-bold text-blue-600 text-xs">{telemetry.distance.toFixed(1)} km</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 font-semibold uppercase text-[9px]">Geofence</p>
                                                    <p className="font-bold text-gray-800 truncate px-1 text-[11px]">
                                                        {activeGeofence ? activeGeofence.name : 'Luar Area'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 font-semibold uppercase text-[9px]">Ritasi</p>
                                                    <p className="font-bold text-blue-600 text-xs">{ritasiToday} trip</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Zones List */}
                                        <div className="mt-2 pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-1 text-xs">
                                                <span className="font-bold text-gray-700 text-[11px]">Zona Tambang ({geofences.length}):</span>
                                                <button
                                                    onClick={handleResetRitasi}
                                                    className="text-[10px] font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    <RotateCw className="w-2.5 h-2.5" /> Reset
                                                </button>
                                            </div>
                                            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                                                {geofences.map(gf => (
                                                    <div key={gf.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: gf.color || '#2563EB' }}></span>
                                                            <span className="font-semibold text-gray-800 truncate">{gf.name}</span>
                                                            <span className="text-[9px] font-bold uppercase px-1 rounded bg-white text-gray-600 shrink-0 border border-slate-200">
                                                                {gf.type}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-gray-400 shrink-0">R: {gf.radius}m</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── MODULAR CARDS: ROW 2 (TELEMETRI & SENSOR + OPERATOR DETAIL) ── */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                                <div className="xl:col-span-7 flex flex-col">
                                    {selectedVehicle === 'DT' ? (
                                        /* Card 8: TELEMETRI & SENSOR HARDWARE */
                                        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                    <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                        <Gauge className="w-3.5 h-3.5 text-blue-600" />
                                                        TELEMETRI & SENSOR HARDWARE
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowRitasiHistoryModal(true)}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Riwayat Ritasi ({ritasiLogs.length})
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-3">
                                                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex flex-col items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
                                                            <Gauge className="w-3.5 h-3.5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 leading-tight">
                                                            {telemetry.speed} <span className="text-[10px] font-normal text-gray-500">km/j</span>
                                                        </p>
                                                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Kecepatan</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex flex-col items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-purple-700 leading-tight">
                                                            {avgCycleTimeToday || 22} <span className="text-[10px] font-normal text-gray-500">min</span>
                                                        </p>
                                                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Cycle Time</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex flex-col items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                                                            <Power className="w-3.5 h-3.5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-700 leading-tight">
                                                            98,765 <span className="text-[10px] font-normal text-gray-500">HM</span>
                                                        </p>
                                                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Hour Meter</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex flex-col items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
                                                            <Fuel className="w-3.5 h-3.5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-amber-700 leading-tight">
                                                            {telemetry.fuel} <span className="text-[10px] font-normal text-gray-500">L</span>
                                                        </p>
                                                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Konsumsi BBM</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sensors Row */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                                                <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 text-center flex flex-col items-center justify-center">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Engine Status</p>
                                                    <p className={`text-xs font-bold mt-0.5 ${
                                                        currentVehicle.status === 'ONLINE' ? 'text-emerald-600' :
                                                        currentVehicle.is_registered ? 'text-amber-600' : 'text-slate-500'
                                                    }`}>
                                                        {currentVehicle.status === 'ONLINE' ? 'ON (RUNNING)' :
                                                         currentVehicle.is_registered ? 'STANDBY (OFF)' : 'VIRTUAL (OFF)'}
                                                    </p>
                                                </div>
                                                <div className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-center transition ${
                                                    ptoActive ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200/80 text-gray-700'
                                                }`}>
                                                    <p className="text-[10px] font-bold uppercase text-gray-400">Sensor Hidrolik PTO</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="font-bold text-xs">{ptoActive ? 'ON (DUMPING)' : 'OFF (NORMAL)'}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setPtoActive(!ptoActive)}
                                                            className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer"
                                                        >
                                                            {ptoActive ? '(Turunkan)' : '(Uji)'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 text-center flex flex-col items-center justify-center">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Produksi BCM</p>
                                                    <p className="text-xs font-bold text-gray-900 mt-0.5">{totalBcmToday} BCM ({totalDistanceKm.toFixed(1)} km)</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Card 8 (Excavator): STATUS PEMUATAN */
                                        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                                                    STATUS PEMUATAN (LOADING)
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-end text-xs">
                                                    <div>
                                                        <p className="text-gray-400 font-medium uppercase text-[10px]">Estimasi Muatan</p>
                                                        <p className="text-lg font-bold text-amber-600">14.5 <span className="text-xs font-normal text-gray-500">BCM</span></p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-400 font-medium uppercase text-[10px]">Target</p>
                                                        <p className="text-lg font-bold text-gray-900">20.0 <span className="text-xs font-normal text-gray-500">BCM</span></p>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                                    <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
                                                </div>
                                                <div className="flex justify-between text-xs font-semibold text-gray-500">
                                                    <span>Pass 3 dari 4</span>
                                                    <span className="text-amber-600 font-bold">72% Terisi</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="xl:col-span-5 flex flex-col">
                                    {/* Card 9: OPERATOR DETAIL */}
                                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                    <User className="w-3.5 h-3.5 text-blue-600" />
                                                    OPERATOR DETAIL
                                                </span>
                                                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.6
                                                </span>
                                            </div>

                                            <div className="flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-900 truncate">
                                                        {driver ? driver.name : targetDriver.name}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="bg-white text-gray-700 text-[11px] font-semibold px-2 py-0.2 rounded-full border border-slate-200">
                                                            {currentVehicle.plateNo}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 font-mono">
                                                            NIK: {driver ? driver.id : targetDriver.id}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-gray-400" />
                                                            +62 812 3456 7890
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-gray-400" />
                                                            {currentVehicle.site}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Biometrik AI
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Avatar Box */}
                                                <div className="w-18 h-24 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                                                    {previewPhoto ? (
                                                        <img src={previewPhoto} alt="Operator" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={36} strokeWidth={1.5} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Face Scan Action */}
                                        <div className="mt-3 space-y-2">
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
                                                className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                            >
                                                <Camera className="w-3.5 h-3.5" />
                                                {isScanningFace ? 'Memindai dari Kabin...' : 'Pindai Wajah di Kabin'}
                                            </button>

                                            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCheckin(!showCheckin)}
                                                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                                                >
                                                    {showCheckin ? 'Tutup Pilihan' : 'Pilih Manual Operator'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { fetchHistoryLogs(); setShowHistory(true); }}
                                                    className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                                                >
                                                    <History className="w-3 h-3" /> Riwayat
                                                </button>
                                            </div>

                                            {showCheckin && (
                                                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Cari nama atau NIK..."
                                                        value={searchDriver}
                                                        onChange={e => setSearchDriver(e.target.value)}
                                                        className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                                                    />
                                                    <div className="max-h-36 overflow-y-auto space-y-1">
                                                        {driverList.filter(d => d.name.toLowerCase().includes(searchDriver.toLowerCase()) || d.id.includes(searchDriver)).map(d => (
                                                            <div
                                                                key={d.id}
                                                                onClick={() => {
                                                                    setTargetDriver({ name: d.name, id: d.id, position: d.position || 'Operator' });
                                                                    setShowCheckin(false);
                                                                }}
                                                                className="p-1.5 hover:bg-slate-200/70 rounded cursor-pointer text-xs flex justify-between"
                                                            >
                                                                <span className="font-bold text-gray-800">{d.name}</span>
                                                                <span className="text-gray-400 font-mono text-[10px]">{d.id}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── MODULAR CARDS: ROW 3 (SAFETY ALARM & MONITORING DMS - FULL WIDTH CARD) ── */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                        SAFETY ALARM & MONITORING DMS
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {untreatedCount > 0 ? (
                                            <span className="text-[11px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded-full">
                                                {untreatedCount} Perlu Tindakan
                                            </span>
                                        ) : (
                                            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Aman
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setShowSimulator(!showSimulator)}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                        >
                                            <Sparkles className="w-3 h-3" /> Tes Simulasi
                                        </button>
                                    </div>
                                </div>

                                {/* Simulator Drawer */}
                                {showSimulator && (
                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                                        <p className="font-bold text-gray-700 mb-1.5 text-[11px]">Pemicu Uji Alarm AI Safety:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                            <button
                                                onClick={() => triggerTestAlarm('fatigue', 'Driver Fatigue (Mengantuk Berat)', 'DMS Camera AI', 'critical')}
                                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded border border-rose-200 font-semibold text-[11px] cursor-pointer"
                                            >
                                                Uji Mengantuk
                                            </button>
                                            <button
                                                onClick={() => triggerTestAlarm('phone', 'Penggunaan Ponsel saat Mengemudi', 'DMS Camera AI', 'high')}
                                                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 font-semibold text-[11px] cursor-pointer"
                                            >
                                                Uji Main Ponsel
                                            </button>
                                            <button
                                                onClick={() => triggerTestAlarm('smoking', 'Merokok di Kabin', 'DMS Camera AI', 'medium')}
                                                className="p-1.5 bg-slate-200 hover:bg-slate-300 text-gray-800 rounded border border-slate-300 font-semibold text-[11px] cursor-pointer"
                                            >
                                                Uji Merokok
                                            </button>
                                            <button
                                                onClick={() => triggerTestAlarm('yawn', 'Menguap Berulang', 'DMS Camera AI', 'low')}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 font-semibold text-[11px] cursor-pointer"
                                            >
                                                Uji Menguap
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Category Filter Tabs */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1 overflow-x-auto text-xs">
                                        {[
                                            { id: 'all', label: `Semua (${alarms.length})` },
                                            { id: 'gsensor', label: 'G-Sensor' },
                                            { id: 'fd', label: 'Fierce Driving' },
                                            { id: 'dms', label: 'DMS' },
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setAlarmTab(tab.id as any)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                                                    alarmTab === tab.id
                                                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                                                        : 'bg-slate-50 text-gray-600 hover:bg-slate-100 border border-slate-200'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {untreatedCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleBatchAction}
                                            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <CheckCheck className="w-3 h-3" /> Tangani Semua
                                        </button>
                                    )}
                                </div>

                                {/* Alarms Feed List */}
                                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                    {filteredAlarms.length === 0 ? (
                                        <div className="text-center py-5 text-gray-400">
                                            <ShieldCheck className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
                                            <p className="text-xs font-bold text-gray-700">Tidak ada peringatan aktif</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Semua parameter safety berada dalam kondisi normal</p>
                                        </div>
                                    ) : (
                                        filteredAlarms.map((alarm) => {
                                            const isHandled = (alarm.handle_status ?? 'Untreated') === 'Handled';
                                            return (
                                                <div
                                                    key={alarm.guid}
                                                    className={`p-2 rounded-lg border transition ${
                                                        isHandled 
                                                            ? 'bg-slate-100/70 border-slate-200 opacity-70' 
                                                            : alarm.severity === 'critical' 
                                                            ? 'bg-rose-50 border-rose-200' 
                                                            : 'bg-amber-50 border-amber-200'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-start gap-2 min-w-0">
                                                            <div className={`p-1 rounded shrink-0 mt-0.5 ${
                                                                isHandled ? 'bg-slate-200 text-gray-600' :
                                                                alarm.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                                <AlertCircle className="w-3 h-3" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1 flex-wrap">
                                                                    <span className="text-xs font-bold text-gray-900 leading-tight">
                                                                        {alarm.desc}
                                                                    </span>
                                                                    <span className={`text-[9px] font-bold px-1 rounded ${
                                                                        alarm.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                                                                        alarm.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                                                                        'bg-slate-200 text-gray-700'
                                                                    }`}>
                                                                        {alarm.severity ? alarm.severity.toUpperCase() : 'ALERT'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 font-mono">
                                                                    <span>{alarm.category || 'CMSV6'}</span>
                                                                    <span>•</span>
                                                                    <span>{alarm.time}</span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="shrink-0">
                                                            {isHandled ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                                                    <Check className="w-3 h-3" /> Selesai
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleQuickAction(alarm.guid)}
                                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded transition active:scale-95 cursor-pointer"
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

                {/* ── MODAL: TAMBAH GEOFENCE BARU ── */}
                {showGeofenceModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <LandPlot className="w-4 h-4 text-blue-600" /> Tambah Geofence Tambang Baru
                                    </h4>
                                    <p className="text-xs text-gray-400">Konfigurasi zona pagar virtual GPS sesuai standar PT. HPU</p>
                                </div>
                                <button onClick={() => setShowGeofenceModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGeofence} className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Zona / Area</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Pit Front C (Loading), Disposal Selatan"
                                        value={newGeofence.name}
                                        onChange={e => setNewGeofence({ ...newGeofence, name: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 block mb-1">Tipe Zona</label>
                                        <select
                                            value={newGeofence.type}
                                            onChange={e => setNewGeofence({ ...newGeofence, type: e.target.value })}
                                            className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="dumping">Dumping Area (Disposal)</option>
                                            <option value="loading">Loading Point (PIT)</option>
                                            <option value="road">Jalan Hauling (Line)</option>
                                            <option value="parking">Workshop / Parkir</option>
                                            <option value="custom">Zona Khusus Lainnya</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 block mb-1">Jenis Geometri</label>
                                        <select
                                            value={newGeofence.geometry_type}
                                            onChange={e => setNewGeofence({ ...newGeofence, geometry_type: e.target.value })}
                                            className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="circle">Circle (Radius Melingkar)</option>
                                            <option value="polygon">Polygon (Area Tertutup)</option>
                                            <option value="line">Line (Jalur Jalan)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 block mb-1">Material Utama</label>
                                        <select
                                            value={newGeofence.material}
                                            onChange={e => setNewGeofence({ ...newGeofence, material: e.target.value })}
                                            className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
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
                                        <label className="text-xs font-semibold text-gray-700 block mb-1">Radius (Meter)</label>
                                        <input
                                            type="number"
                                            min="20"
                                            max="2000"
                                            value={newGeofence.radius}
                                            onChange={e => setNewGeofence({ ...newGeofence, radius: Number(e.target.value) })}
                                            className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Alamat / Blok Tambang</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Pit Front Barat Blok 4, KM 15 Hauling Road"
                                        value={newGeofence.address}
                                        onChange={e => setNewGeofence({ ...newGeofence, address: e.target.value })}
                                        className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-1">Warna Zona</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={newGeofence.color}
                                            onChange={e => setNewGeofence({ ...newGeofence, color: e.target.value })}
                                            className="w-8 h-8 rounded-lg border border-gray-200 p-0.5 cursor-pointer"
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
                                                    className="text-[11px] px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1 font-semibold"
                                                >
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }}></span>
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                    Titik pusat otomatis menggunakan posisi GPS unit saat ini: ({telemetry.lat?.toFixed(5) ?? '-7.6582'}, {telemetry.lng?.toFixed(5) ?? '111.1895'})
                                </p>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowGeofenceModal(false)}
                                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
                                    >
                                        Simpan Geofence
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── MODAL: RIWAYAT SIKLUS RITASI & PRODUKSI BCM ── */}
                {showRitasiHistoryModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Riwayat Siklus Ritasi & Produksi BCM</h3>
                                        <p className="text-xs text-gray-400">Pencatatan siklus hauling dari PIT ke Dumping Area dengan verifikasi sensor PTO</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowRitasiHistoryModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Summary Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                                    <p className="text-[11px] font-bold text-blue-600 uppercase">Total Ritasi</p>
                                    <p className="text-xl font-bold text-blue-900">{ritasiToday} <span className="text-xs font-normal">RIT</span></p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                                    <p className="text-[11px] font-bold text-emerald-600 uppercase">Produksi BCM</p>
                                    <p className="text-xl font-bold text-emerald-900">{totalBcmToday} <span className="text-xs font-normal">BCM</span></p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                                    <p className="text-[11px] font-bold text-purple-600 uppercase">Rata-rata Cycle Time</p>
                                    <p className="text-xl font-bold text-purple-900">{avgCycleTimeToday || 22} <span className="text-xs font-normal">Menit</span></p>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                                    <p className="text-[11px] font-bold text-amber-600 uppercase">Total Jarak Tempuh</p>
                                    <p className="text-xl font-bold text-amber-900">{totalDistanceKm.toFixed(1)} <span className="text-xs font-normal">KM</span></p>
                                </div>
                            </div>

                            {/* Table of Ritasi Logs */}
                            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl">
                                {ritasiLogs.length > 0 ? (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-gray-50 text-gray-600 font-bold sticky top-0 border-b border-gray-200">
                                            <tr>
                                                <th className="p-2.5">Trip #</th>
                                                <th className="p-2.5">Unit</th>
                                                <th className="p-2.5">Material</th>
                                                <th className="p-2.5">Loading PIT</th>
                                                <th className="p-2.5">Dumping Disposal</th>
                                                <th className="p-2.5 text-center">Cycle Time</th>
                                                <th className="p-2.5 text-center">Jarak</th>
                                                <th className="p-2.5 text-center">Sensor PTO</th>
                                                <th className="p-2.5 text-right">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {ritasiLogs.map(l => {
                                                const mat = l.load_type || 'OB';
                                                return (
                                                    <tr key={l.id} className="hover:bg-gray-50/80 transition">
                                                        <td className="p-2.5 font-bold text-gray-700">#{l.id}</td>
                                                        <td className="p-2.5 font-mono font-semibold text-gray-900">{l.unit_code || 'HD-78501'}</td>
                                                        <td className="p-2.5">
                                                            <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-gray-100 text-gray-700">
                                                                {mat}
                                                            </span>
                                                        </td>
                                                        <td className="p-2.5 text-gray-700">{l.pit_name || 'Pit Front A'}</td>
                                                        <td className="p-2.5 text-gray-700 font-medium">{l.dumping_name || l.geofence_name}</td>
                                                        <td className="p-2.5 text-center font-mono text-blue-700 font-bold">{l.cycle_time_minutes ?? 21.5} m</td>
                                                        <td className="p-2.5 text-center font-mono text-gray-600">{l.distance_km ?? 2.4} km</td>
                                                        <td className="p-2.5 text-center">
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <CheckCircle className="w-3 h-3 text-emerald-600" /> Terverifikasi
                                                            </span>
                                                        </td>
                                                        <td className="p-2.5 text-right font-mono text-gray-500">{l.entered_at || '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-12 text-center text-gray-400">
                                        <p className="text-sm font-semibold text-gray-600">Belum ada riwayat ritasi tercatat hari ini.</p>
                                        <p className="text-xs text-gray-400 mt-1">Jalankan simulasi siklus hauling untuk merekam ritasi.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-xs">
                                <span className="text-gray-400">
                                    Rumus Produktivitas Hauler: Q = q × (3600 / Cycle Time) × FK
                                </span>
                                <button
                                    onClick={() => setShowRitasiHistoryModal(false)}
                                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold cursor-pointer transition"
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
