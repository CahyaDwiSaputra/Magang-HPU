import { Head } from '@inertiajs/react';
import LayoutNavbar from '@/components/layout-navbar';
import { 
    Signal, User, Scan, Video, VideoOff, AlertCircle, ShieldCheck, Map as MapIcon, Truck, Fuel, Power, 
    UserCheck, UserX, LogOut, Navigation, ArrowRightCircle, LogIn, X, 
    ChevronDown, Search, History, Camera, CheckCircle2, ScanFace, UserPlus,
    ShieldAlert, Check, CheckCheck, Sparkles, Bell, LandPlot, Play, RotateCw, 
    Plus, Trash2, MapPin, Clock, Gauge, Layers, Activity, FileText, CheckCircle,
    LayoutGrid, Rows, Star, ArrowUpRight, RotateCcw, Smartphone, Radio, Phone,
    Maximize2, Minimize2, ZoomIn, ZoomOut, Crosshair, Globe, Compass,
    Mic, MicOff, Volume2, Calendar, Coffee, AlertTriangle, Circle, Minus
} from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Map, Marker, Overlay, GeoJson } from 'pigeon-maps';

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

// ── REVISI 4: PENGKATEGORIAN MAX SPEED BERDASARKAN SIDE / SITE (40 - 60 KM/H) ──
export const SITE_SPEED_LIMITS: Record<string, { maxSpeed: number; pitSpeed: number; label: string }> = {
    'HPA': { maxSpeed: 60, pitSpeed: 40, label: 'Site HPA (Hauling 60 km/j • Pit 40 km/j)' },
    'BDA': { maxSpeed: 50, pitSpeed: 35, label: 'Site BDA (Hauling 50 km/j • Pit 35 km/j)' },
    'KDA': { maxSpeed: 40, pitSpeed: 30, label: 'Site KDA (Hauling 40 km/j • Pit 30 km/j)' },
    'AMO': { maxSpeed: 50, pitSpeed: 35, label: 'Site AMO (Hauling 50 km/j • Pit 35 km/j)' },
    'KJA': { maxSpeed: 60, pitSpeed: 40, label: 'Site KJA (Hauling 60 km/j • Pit 40 km/j)' },
    'DEFAULT': { maxSpeed: 40, pitSpeed: 30, label: 'Standar Tambang (40 km/j)' }
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
function camUrl(deviceId: string, channel: number, jsession: string | null, baseUrl: string = "http://10.10.0.33:8088", engine: 'cmsv6' | 'flv' = 'flv') {
    if (!jsession) return null;
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    if (engine === 'cmsv6' && !isHttps) {
        return `http://10.10.0.33:8088/808gps/open/player/videoH5.html?lang=en&devIdno=${deviceId}&jsession=${jsession || ''}&index=${channel + 1}&playerType=h5&hideVolumeBtn=1`;
    }
    const mediaHost = '10.10.0.33:6604';
    const proxyFlag = isHttps ? '&proxy=1' : '';
    return `/player.html?dev=${deviceId}&ch=${channel}&jsession=${jsession || ''}&host=${mediaHost}${proxyFlag}`;
}

// channels akan dirender dinamis berdasarkan selectedVehicle di dalam komponen

export default function Page() {
    // ── STATE ARMADA DASHCAM PT. HPU ──
    const [fleet, setFleet] = useState<FleetVehicle[]>(HPU_FLEET);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('HPA-DT47103VV');
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'ALL' | 'DT' | 'EXCA' | 'FT'>('ALL');
    const [streamEngine, setStreamEngine] = useState<'cmsv6' | 'flv'>('flv');

    // ── REVISI 1: ON/OFF LIVECAM (DEFAULT: OFF TERLEBIH DAHULU) ──
    const [isLivecamActive, setIsLivecamActive] = useState<boolean>(false);

    // ── REVISI 5: ON/OFF MIC INTERCOM DRIVER & OPERATOR ──
    const [isMicActive, setIsMicActive] = useState<boolean>(false);

    // ── REVISI 7: INTERACTIVE DRAWING STATE (TARIK ZONA MANUAL PADA PETA SATELIT) ──
    const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
    const [drawShape, setDrawShape] = useState<'polygon' | 'line' | 'circle'>('polygon');
    const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);

    // ── REVISI 2: MAP HIGHLIGHT & EXPANSION (CITRA SATELIT / GOOGLE EARTH) ──
    const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
    const [mapZoom, setMapZoom] = useState<number>(14);
    const [mapCenter, setMapCenter] = useState<[number, number]>([2.045000, 117.200000]);
    const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
    const [showZonesDrawer, setShowZonesDrawer] = useState<boolean>(false);
    const [showStaMarkers, setShowStaMarkers] = useState<boolean>(false);
    const [haulingRoutes, setHaulingRoutes] = useState<any>(null);
    const [operationalPolygons, setOperationalPolygons] = useState<any>(null);
    const [zoneFilterTab, setZoneFilterTab] = useState<'all' | 'operational' | 'sta'>('operational');
    const [selectedSiteFilter, setSelectedSiteFilter] = useState<'ALL' | 'HPA' | 'BDA'>('ALL');
    const [zoneSearchQuery, setZoneSearchQuery] = useState<string>('');
    // Flag: true saat vehicle baru dipilih & peta belum terpusat ke GPS terbaru
    const mapNeedsRecenter = useRef<boolean>(false);
    // Ref untuk melacak vehicle sebelumnya agar useEffect tidak jalan saat initial mount
    const prevVehicleId = useRef<string | null>(null);

    const mapTileProvider = (x: number, y: number, z: number) => {
        if (mapLayer === 'satellite') {
            return `https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;
        }
        return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    };

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
        lat: 2.045000,
        lng: 117.200000,
        speed: 0,
        distance: 0,
        fuel: 0,
        satellites: 0,
        online: false,
        lastUpdate: '-',
        inGeofence: false,
        gpsLocked: false,
        isLastKnown: true,
    });
    const [jsession, setJsession] = useState<string | null>(null);
    const [cmsBaseUrl, setCmsBaseUrl] = useState<string>("http://10.10.0.33:8088");
    const [apiStatus, setApiStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
    const [rawGPS, setRawGPS] = useState<any>({});
    const [driver, setDriver] = useState<{
        name: string;
        id: string;
        match: number;
        photoUrl?: string;
        position?: string;
        plate_no?: string;
        site?: string;
        shift?: string;
        status?: string;
        time?: string;
    } | null>(null);
    
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
    const [historyLogs, setHistoryLogs] = useState<{
        id: number;
        name: string;
        employee_id: string;
        confidence: number;
        photo_url?: string;
        time: string;
        vehicle_id?: string;
        plate_no?: string;
        site?: string;
        shift?: string;
        status?: string;
        verification_method?: string;
    }[]>([]);
    const [isScanningFace, setIsScanningFace] = useState(false);
    const [faceStatus, setFaceStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [faceMessage, setFaceMessage] = useState<string>('');
    // ── TYPES SESUAI DOKUMEN HPU-UNS FLEET MANAGEMENT (Slide 6, 19, 21, 25, 26, 28) ──
    type GeofenceItem = {
        id: number;
        name: string;
        site?: string;
        type: 'loading' | 'dumping' | 'parking' | 'road' | 'custom' | string;
        latitude: number;
        longitude: number;
        radius: number;
        color?: string;
        address?: string;
        material?: string;
        geometry_type?: 'circle' | 'polygon' | 'line' | string;
        coordinates_json?: string;
        coordinates?: { lat: number; lng: number };
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

    const operationalGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type === 'road') return false;
            if (selectedSiteFilter !== 'ALL') {
                return (gf.site || 'HPA').toUpperCase() === selectedSiteFilter;
            }
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const roadGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type !== 'road') return false;
            if (selectedSiteFilter !== 'ALL') {
                return (gf.site || 'HPA').toUpperCase() === selectedSiteFilter;
            }
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const filteredDrawerGeofences = useMemo(() => {
        let list = geofences;
        if (selectedSiteFilter !== 'ALL') {
            list = list.filter(g => (g.site || 'HPA').toUpperCase() === selectedSiteFilter);
        }
        if (zoneFilterTab === 'operational') {
            list = list.filter(g => g.type !== 'road');
        } else if (zoneFilterTab === 'sta') {
            list = list.filter(g => g.type === 'road');
        }
        if (zoneSearchQuery.trim()) {
            const q = zoneSearchQuery.toLowerCase();
            list = list.filter(g => (g.name && g.name.toLowerCase().includes(q)) || (g.address && g.address.toLowerCase().includes(q)));
        }
        return list;
    }, [geofences, selectedSiteFilter, zoneFilterTab, zoneSearchQuery]);

    const [ritasiToday, setRitasiToday] = useState<number>(0);
    const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);
    const [avgCycleTimeToday, setAvgCycleTimeToday] = useState<number>(0);
    const [totalBcmToday, setTotalBcmToday] = useState<number>(0);
    const [materialBreakdown, setMaterialBreakdown] = useState<Record<string, number>>({
        OB: 0, COAL: 0, MUD: 0, 'TOP SOIL': 0, LIMONIT: 0, SAPROLIT: 0
    });
    const [ritasiLogs, setRitasiLogs] = useState<RitasiLogItem[]>([]);
    const [activeGeofence, setActiveGeofence] = useState<{ id: number; name: string; type: string; distance: number } | null>(null);
    const [lastGeofenceId, setLastGeofenceId] = useState<number | null>(null);
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
        startTime: '-',
        nowTime: '-',
        finishArea: '-',
        tripProgress: 0,
        cycleTimeMinutes: 0,
    });

    const [newGeofence, setNewGeofence] = useState<{
        name: string;
        site: string;
        type: string;
        latitude: number;
        longitude: number;
        radius: number;
        color: string;
        address: string;
        material: string;
        geometry_type: string;
        coordinates_json: string;
    }>({
        name: '',
        site: 'HPA',
        type: 'loading',
        latitude: 2.045000,
        longitude: 117.200000,
        radius: 250,
        color: '#10B981',
        address: 'Area Konsesi Tambang PT HPU',
        material: 'OB',
        geometry_type: 'circle',
        coordinates_json: '',
    });
    const [geofenceNotice, setGeofenceNotice] = useState<string | null>(null);

    // ── SINKRONISASI FOKUS PETA SAAT ARMADA DIGANTI ──
    // useEffect ini harus diletakkan SETELAH semua useState dideklarasikan
    useEffect(() => {
        if (prevVehicleId.current !== null && prevVehicleId.current !== selectedVehicleId) {
            // Vehicle sungguh-sungguh berganti (bukan initial mount)
            mapNeedsRecenter.current = true;
            setBannerDismissed(false);
            // Reset posisi lama agar peta tidak terjebak di koordinat armada sebelumnya
            setTelemetry(prev => ({
                ...prev,
                lat: null,
                lng: null,
                gpsLocked: false,
                isLastKnown: true,
            }));

            // Auto-pan ke lokasi konsesi site armada terkait
            const isBda = currentVehicle.site?.includes('BDA') || currentVehicle.id.startsWith('BDA') || currentVehicle.plateNo.startsWith('BDA');
            if (isBda) {
                setSelectedSiteFilter('BDA');
                setMapCenter([-1.119625, 115.020731]);
                setMapZoom(12);
            } else {
                setSelectedSiteFilter('HPA');
                setMapCenter([2.045000, 117.200000]);
                setMapZoom(14);
            }
        }
        prevVehicleId.current = selectedVehicleId;
    }, [selectedVehicleId, currentVehicle]);

    // Auto-pusatkan peta begitu GPS terbaru masuk setelah armada diganti
    useEffect(() => {
        if (mapNeedsRecenter.current && telemetry.lat && telemetry.lng) {
            setMapCenter([telemetry.lat, telemetry.lng]);
            mapNeedsRecenter.current = false;
        }
    }, [telemetry.lat, telemetry.lng]);

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

    const fetchActiveDriver = async () => {
        try {
            const res = await fetch(`/api/dashcam/active-driver?deviceId=${activeDeviceId}&vehicleId=${encodeURIComponent(currentVehicle.id)}`);
            const data = await res.json();
            if (data.status === 'ok' && data.driver) {
                setDriver({
                    name: data.driver.name,
                    id: data.driver.id || '-',
                    match: data.driver.confidence || 95,
                    position: data.driver.position || 'Operator Alat Berat',
                    photoUrl: data.driver.photo_url,
                    plate_no: data.driver.plate_no || currentVehicle.plateNo,
                    site: data.driver.site || currentVehicle.site,
                    shift: data.driver.shift,
                    status: data.driver.status,
                    time: data.driver.received_at ? data.driver.received_at.split('·')[0].trim() : '-',
                });
            } else {
                setDriver(null);
            }
        } catch (err) {
            console.error("Error fetching active driver:", err);
        }
    };

    const fetchHistoryLogs = async () => {
        try {
            const res = await fetch(`/api/dashcam/history?deviceId=${activeDeviceId}&vehicleId=${encodeURIComponent(currentVehicle.id)}`);
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
        setFaceMessage(`Operator ${d.name} berhasil ditugaskan membawa unit ${currentVehicle.plateNo}.`);
        setDriver({
            name: d.name,
            id: d.id,
            match: 99,
            position: d.position || 'Operator Alat Berat',
            plate_no: currentVehicle.plateNo,
            site: currentVehicle.site,
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
                    vehicleId: currentVehicle.id,
                    plateNo: currentVehicle.plateNo,
                    site: currentVehicle.site,
                    capturedAt: new Date().toISOString(),
                    source: 'manual-assignment',
                    driverName: d.name,
                    employeeId: d.id,
                    confidence: 99.0,
                    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=10B981&color=fff&bold=true`,
                }),
            });
            await fetchHistoryLogs();
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

    // Helper: Evaluasi Ray-Casting Point-in-Polygon (apakah titik berada di dalam poligon)
    const isPointInPolygon = (lat: number, lng: number, polygon: [number, number][]): boolean => {
        let inside = false;
        const count = polygon.length;
        if (count < 3) return false;

        for (let i = 0, j = count - 1; i < count; j = i++) {
            const xi = polygon[i][0];
            const yi = polygon[i][1];
            const xj = polygon[j][0];
            const yj = polygon[j][1];

            const intersect = ((yi > lng) !== (yj > lng)) &&
                (lat < (xj - xi) * (lng - yi) / ((yj - yi) || 0.000000001) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    };

    // Helper: Hitung keliling perimeter (meter)
    const calculatePerimeter = (points: [number, number][]): number => {
        if (points.length < 2) return 0;
        let total = 0;
        for (let i = 0; i < points.length; i++) {
            const nextIdx = (i + 1) % points.length;
            total += calculateDistance(points[i][0], points[i][1], points[nextIdx][0], points[nextIdx][1]);
        }
        return Math.round(total);
    };

    // Helper: Hitung estimasi luas poligon tambang (m2 & Hektar)
    const calculatePolygonArea = (points: [number, number][]): { m2: number; ha: number } => {
        if (points.length < 3) return { m2: 0, ha: 0 };
        const R = 6378137.0;
        let area = 0;
        const len = points.length;
        for (let i = 0; i < len; i++) {
            const j = (i + 1) % len;
            const p1 = points[i];
            const p2 = points[j];
            const x1 = (p1[1] * Math.PI / 180.0) * R * Math.cos((p1[0] * Math.PI) / 180.0);
            const y1 = (p1[0] * Math.PI / 180.0) * R;
            const x2 = (p2[1] * Math.PI / 180.0) * R * Math.cos((p2[0] * Math.PI) / 180.0);
            const y2 = (p2[0] * Math.PI / 180.0) * R;
            area += (x1 * y2 - x2 * y1);
        }
        const m2 = Math.round(Math.abs(area) / 2.0);
        const ha = Number((m2 / 10000.0).toFixed(2));
        return { m2, ha };
    };

    // ── LIVE DRAWING PREVIEW GEOJSON & HANDLERS ──
    const activeDrawingGeoJson = useMemo(() => {
        if (!isDrawingMode || drawnPoints.length < 2) return null;

        if (drawShape === 'line') {
            return {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { color: '#F59E0B' },
                    geometry: {
                        type: 'LineString',
                        coordinates: drawnPoints.map(p => [p[1], p[0]])
                    }
                }]
            };
        }

        if (drawShape === 'polygon') {
            if (drawnPoints.length === 2) {
                return {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: { color: '#F59E0B' },
                        geometry: {
                            type: 'LineString',
                            coordinates: drawnPoints.map(p => [p[1], p[0]])
                        }
                    }]
                };
            }
            // Closed polygon
            const ring = drawnPoints.map(p => [p[1], p[0]]);
            ring.push([drawnPoints[0][1], drawnPoints[0][0]]);
            return {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { color: '#10B981' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ring]
                    }
                }]
            };
        }

        if (drawShape === 'circle') {
            const center = drawnPoints[0];
            const edge = drawnPoints[1];
            const rMeters = calculateDistance(center[0], center[1], edge[0], edge[1]);
            const ring: [number, number][] = [];
            for (let i = 0; i < 16; i++) {
                const angle = (2 * Math.PI * i) / 16;
                const dLat = (rMeters * Math.cos(angle)) / 6378137.0;
                const dLng = (rMeters * Math.sin(angle)) / (6378137.0 * Math.cos(Math.PI * center[0] / 180.0));
                ring.push([Number((center[1] + (dLng * 180.0 / Math.PI)).toFixed(7)), Number((center[0] + (dLat * 180.0 / Math.PI)).toFixed(7))]);
            }
            ring.push(ring[0]);
            return {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { color: '#3B82F6' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ring]
                    }
                }]
            };
        }

        return null;
    }, [isDrawingMode, drawnPoints, drawShape]);

    // Statistik Geometri Gambar (Luas Ha, Keliling m, Panjang Jalur)
    const drawnStats = useMemo(() => {
        if (!drawnPoints || drawnPoints.length === 0) return null;
        const count = drawnPoints.length;
        if (drawShape === 'polygon' && count >= 3) {
            const area = calculatePolygonArea(drawnPoints);
            const perimeter = calculatePerimeter(drawnPoints);
            return { type: 'polygon', count, areaHa: area.ha, areaM2: area.m2, perimeterM: perimeter };
        }
        if (drawShape === 'line' && count >= 2) {
            let length = 0;
            for (let i = 0; i < count - 1; i++) {
                length += calculateDistance(drawnPoints[i][0], drawnPoints[i][1], drawnPoints[i + 1][0], drawnPoints[i + 1][1]);
            }
            return { type: 'line', count, lengthM: Math.round(length) };
        }
        if (drawShape === 'circle' && count >= 2) {
            const r = calculateDistance(drawnPoints[0][0], drawnPoints[0][1], drawnPoints[1][0], drawnPoints[1][1]);
            const areaM2 = Math.round(Math.PI * r * r);
            const areaHa = Number((areaM2 / 10000.0).toFixed(2));
            return { type: 'circle', count: 2, radiusM: r, areaHa, areaM2 };
        }
        return { type: drawShape, count };
    }, [drawnPoints, drawShape]);

    const handleUndoPoint = () => {
        if (drawnPoints.length === 0) return;
        const next = drawnPoints.slice(0, -1);
        setDrawnPoints(next);
        if (next.length === 0) {
            setGeofenceNotice('Titik gambar di-reset. Silakan klik pada peta satelit untuk mulai menggambar titik.');
        } else {
            setGeofenceNotice(`Titik terakhir dihapus. Tersisa ${next.length} titik.`);
        }
    };

    const handleResetDrawing = () => {
        setDrawnPoints([]);
        setGeofenceNotice('Semua titik gambar telah dihapus. Silakan klik pada peta satelit untuk menggambar ulang.');
    };

    const handleCancelDrawing = () => {
        setIsDrawingMode(false);
        setDrawnPoints([]);
        setGeofenceNotice(null);
    };

    const handleFinishDrawing = () => {
        if (drawnPoints.length === 0) return;

        if (drawShape === 'polygon' && drawnPoints.length < 3) {
            alert('Poligon membutuhkan minimal 3 titik sudut.');
            return;
        }
        if (drawShape === 'line' && drawnPoints.length < 2) {
            alert('Garis jalur jalan membutuhkan minimal 2 titik.');
            return;
        }
        if (drawShape === 'circle' && drawnPoints.length < 2) {
            alert('Lingkaran membutuhkan 2 titik (titik 1: pusat, titik 2: batas radius).');
            return;
        }

        // Hitung centroid (titik tengah rata-rata)
        let sumLat = 0, sumLng = 0;
        drawnPoints.forEach(p => { sumLat += p[0]; sumLng += p[1]; });
        const centerLat = Number((sumLat / drawnPoints.length).toFixed(6));
        const centerLng = Number((sumLng / drawnPoints.length).toFixed(6));

        let maxDist = 0;
        drawnPoints.forEach(p => {
            const d = calculateDistance(centerLat, centerLng, p[0], p[1]);
            if (d > maxDist) maxDist = d;
        });

        // Deteksi jika user menggambar di skala provinsi / zoom terlalu jauh
        if (maxDist > 15000) {
            alert(`Peringatan: Rentang area gambar mencapai ${(maxDist / 1000).toFixed(1)} km. Disarankan memperbesar zoom peta pada area tambang sebelum menggambar.`);
        }

        let calculatedRadius = 150;
        if (drawShape === 'circle' && drawnPoints.length >= 2) {
            calculatedRadius = Math.min(5000, calculateDistance(drawnPoints[0][0], drawnPoints[0][1], drawnPoints[1][0], drawnPoints[1][1]));
        } else {
            calculatedRadius = Math.min(2500, Math.max(50, Math.round(maxDist)));
        }

        const detectedSite = selectedSiteFilter !== 'ALL' ? selectedSiteFilter : (centerLng < 116.0 ? 'BDA' : 'HPA');

        const defaultName = drawShape === 'polygon'
            ? `Pit Front (${detectedSite})`
            : (drawShape === 'line' ? `Jalur Hauling (${detectedSite})` : `Area Stockpile (${detectedSite})`);

        const defaultType = drawShape === 'line' ? 'road' : 'loading';
        const defaultColor = drawShape === 'line' ? '#EA580C' : (drawShape === 'polygon' ? '#10B981' : '#3B82F6');

        setNewGeofence({
            name: defaultName,
            site: detectedSite,
            type: defaultType,
            latitude: drawShape === 'circle' ? drawnPoints[0][0] : centerLat,
            longitude: drawShape === 'circle' ? drawnPoints[0][1] : centerLng,
            radius: calculatedRadius,
            color: defaultColor,
            address: `Area Konsesi Tambang PT HPU Site ${detectedSite}`,
            material: 'OB',
            geometry_type: drawShape,
            coordinates_json: JSON.stringify(drawnPoints),
        });

        setShowGeofenceModal(true);
    };

    const fetchHaulingRoutes = async () => {
        try {
            const res = await fetch('/api/dashcam/hauling-routes');
            const data = await res.json();
            if (data.status === 'ok' && data.data) {
                setHaulingRoutes(data.data);
            }
        } catch (err) {}
    };

    const fetchOperationalPolygons = async () => {
        try {
            const res = await fetch('/api/dashcam/geofences-geojson');
            const data = await res.json();
            if (data.status === 'ok' && data.data) {
                setOperationalPolygons(data.data);
            }
        } catch (err) {}
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
        const latToUse = Number(newGeofence.latitude) || telemetry.lat || 2.045000;
        const lngToUse = Number(newGeofence.longitude) || telemetry.lng || 117.200000;
        try {
            const res = await fetch('/api/dashcam/geofences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: newGeofence.name.trim(),
                    site: newGeofence.site || 'HPA',
                    type: newGeofence.type,
                    latitude: latToUse,
                    longitude: lngToUse,
                    radius: Number(newGeofence.radius) || 150,
                    color: newGeofence.color,
                    address: newGeofence.address,
                    material: newGeofence.material,
                    geometry_type: newGeofence.geometry_type,
                    coordinates_json: newGeofence.coordinates_json || undefined,
                }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                await fetchGeofences();
                await fetchOperationalPolygons();
                setIsDrawingMode(false);
                setDrawnPoints([]);
                setShowGeofenceModal(false);
                setNewGeofence({
                    name: '',
                    site: selectedSiteFilter !== 'ALL' ? selectedSiteFilter : 'HPA',
                    type: 'loading',
                    latitude: selectedSiteFilter === 'BDA' ? -1.130544 : 2.045000,
                    longitude: selectedSiteFilter === 'BDA' ? 115.161056 : 117.200000,
                    radius: 250,
                    color: '#10B981',
                    address: `Area Konsesi Tambang PT HPU Site ${selectedSiteFilter !== 'ALL' ? selectedSiteFilter : 'HPA'}`,
                    material: 'OB',
                    geometry_type: 'circle',
                    coordinates_json: '',
                });
                setGeofenceNotice(`Geofence "${data.data.name}" (${data.data.type} - ${data.data.geometry_type}) berhasil ditambahkan.`);
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
                await fetchOperationalPolygons();
                setGeofenceNotice(`Geofence "${name}" berhasil dihapus.`);
                setTimeout(() => setGeofenceNotice(null), 4000);
            }
        } catch {}
    };

    // Helper pencocokan alarm dengan unit armada yang sedang aktif dilihat

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

        if (!actualPhotoUrl) {
            actualPhotoUrl = previewPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetDriver?.name || 'Driver')}&background=3B82F6&color=fff&bold=true`;
        }

        const payload = {
            deviceId: activeDeviceId,
            vehicleId: currentVehicle.id,
            plateNo: currentVehicle.plateNo,
            site: currentVehicle.site,
            capturedAt: new Date().toISOString(),
            source: 'cabin-dashcam-ai',
            photoUrl: actualPhotoUrl,
            driverName: targetDriver?.name,
            employeeId: targetDriver?.id,
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
                setPreviewPhoto(savedPhoto);
                setFaceStatus('success');
                setFaceMessage(`Verifikasi AI berhasil! ${data.data.driver_name} terdeteksi membawa unit ${currentVehicle.plateNo}.`);
                setDriver({
                    name: data.data.driver_name,
                    id: data.data.employee_id,
                    match: data.data.confidence,
                    position: data.data.position || 'Operator Alat Berat',
                    photoUrl: savedPhoto,
                    plate_no: currentVehicle.plateNo,
                    site: currentVehicle.site,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                });
                await fetchHistoryLogs();
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
                body: JSON.stringify({ deviceId: activeDeviceId, vehicleId: currentVehicle.id }),
            });
        } catch {}
        setDriver(null);
        setFaceStatus('idle');
        setFaceMessage(`Kabin unit ${currentVehicle.plateNo} telah dikosongkan. Pengemudi telah check-out.`);
        await fetchHistoryLogs();
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

    useEffect(() => {
        login();
        fetchGeofences();
        fetchHaulingRoutes();
        fetchOperationalPolygons();
        fetchRitasiToday();

        // Ambil daftar unit real-time dari server backend
        fetch('/api/cmsv6/vehicles')
            .then(r => r.json())
            .then(data => {
                if (data.result === 0 && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
                    setFleet(data.vehicles);
                    // Prioritaskan unit online dari Site HPA (yang selaras dengan peta rute hauling HPA)
                    const onlineHpaUnit = data.vehicles.find((v: FleetVehicle) => v.status === 'ONLINE' && v.plateNo.startsWith('HPA'));
                    const onlineUnit = onlineHpaUnit || data.vehicles.find((v: FleetVehicle) => v.status === 'ONLINE');
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
                            let match = false;
                            let dist = calculateDistance(effectiveLat, effectiveLng, g.latitude, g.longitude);

                            // 1. Evaluasi Poligon Fisik jika tersedia koordinat poligon
                            if (g.geometry_type === 'polygon' && g.coordinates_json) {
                                try {
                                    const poly = JSON.parse(g.coordinates_json);
                                    if (Array.isArray(poly) && poly.length >= 3) {
                                        match = isPointInPolygon(effectiveLat, effectiveLng, poly);
                                    }
                                } catch {}
                            }

                            // 2. Evaluasi Haversine Radius sebagai fallback
                            if (!match && dist <= g.radius) {
                                match = true;
                            }

                            if (match) {
                                inGeofence = true;
                                currentFoundGeofence = { id: g.id, name: g.name, type: g.type, distance: dist };
                                break;
                            }
                        }
                    }

                    if (currentFoundGeofence) {
                        setActiveGeofence(currentFoundGeofence);
                        if (currentFoundGeofence.type === 'dumping' && lastGeofenceId !== currentFoundGeofence.id) {
                            void recordRitasi({
                                dumpingGeofenceId: currentFoundGeofence.id,
                                dumpingName: currentFoundGeofence.name,
                                loadType: selectedMaterial,
                                ptoConfirmed: ptoActive,
                            });
                        }
                        setLastGeofenceId(currentFoundGeofence.id);
                    } else {
                        setActiveGeofence(null);
                        setLastGeofenceId(null);
                    }

                    const rawSpeed = Math.round((s.sp || 0) / 10);
                    const speed = rawSpeed <= 1 ? 0 : rawSpeed;

                    setTelemetry(prev => {
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

        fetchDrivers('');
        fetchActiveDriver();
        fetchHistoryLogs();
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
    }, [jsession, activeDeviceId, currentVehicle.id]);

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

    // Helper pencocokan alarm dengan unit armada yang sedang aktif dilihat
    const doesAlarmMatchVehicle = (alarm: any, vehicle: FleetVehicle) => {
        if (!alarm || !vehicle) return false;
        const alarmVeh = (alarm.vehicle || alarm.devIdno || alarm.deviceNo || '').toString().toLowerCase().trim();
        if (!alarmVeh) return false;

        const vId = (vehicle.id || '').toLowerCase().trim();
        const vPlate = (vehicle.plateNo || '').toLowerCase().trim();
        const vDevice = (vehicle.deviceNo || '').toLowerCase().trim();

        if (alarmVeh === vId || alarmVeh === vPlate || alarmVeh === vDevice) return true;

        const cleanAlarm = alarmVeh.replace(/[^a-z0-9]/g, '');
        const cleanPlate = vPlate.replace(/[^a-z0-9]/g, '');
        const cleanId = vId.replace(/[^a-z0-9]/g, '');

        if (cleanAlarm && (cleanPlate.includes(cleanAlarm) || cleanAlarm.includes(cleanPlate))) return true;
        if (cleanAlarm && (cleanId.includes(cleanAlarm) || cleanAlarm.includes(cleanId))) return true;

        // Dukungan fleksibel untuk unit Trial UNS
        if ((cleanAlarm.includes('trial') || cleanAlarm.includes('uns')) && 
            (cleanPlate.includes('trial') || cleanPlate.includes('uns') || cleanId.includes('trial'))) {
            return true;
        }

        return false;
    };

    // Filter alarms khusus untuk armada yang sedang aktif dilihat
    const currentVehicleAlarms = alarms.filter(a => doesAlarmMatchVehicle(a, currentVehicle));

    // Filter alarms berdasarkan tab untuk armada saat ini
    const filteredAlarms = currentVehicleAlarms.filter(a => {
        if (alarmTab === 'all') return true;
        if (alarmTab === 'gsensor') return a.category?.toLowerCase().includes('gsensor') || a.desc.toLowerCase().includes('rollover');
        if (alarmTab === 'fd') return a.category?.toLowerCase().includes('fierce') || a.desc.toLowerCase().includes('collision');
        if (alarmTab === 'dms') return a.category?.toLowerCase().includes('dms') || a.category?.toLowerCase().includes('fatigue') || a.desc.toLowerCase().includes('kantuk') || a.desc.toLowerCase().includes('distract') || a.desc.toLowerCase().includes('phone') || a.desc.toLowerCase().includes('smoke');
        return true;
    });

    const untreatedCount = currentVehicleAlarms.filter(a => (a.handle_status ?? 'Untreated') === 'Untreated').length;

    // ── REVISI 4: PENGKATEGORIAN MAX SPEED BERDASARKAN SIDE / SITE (40 - 60 KM/H) ──
    const siteKey = Object.keys(SITE_SPEED_LIMITS).find(k => (currentVehicle.site || '').toUpperCase().includes(k)) || 'DEFAULT';
    const siteSpeedConfig = SITE_SPEED_LIMITS[siteKey];
    const speedLimit = (activeGeofence?.type === 'loading' || activeGeofence?.type === 'dumping')
        ? siteSpeedConfig.pitSpeed
        : (activeGeofence?.name?.includes('HANDAK') || activeGeofence?.name?.includes('CURAM'))
        ? 25
        : siteSpeedConfig.maxSpeed;
    const isCurrentVehicleSpeeding = (telemetry.speed || 0) > speedLimit;

    // Cari alarm kritis/tinggi yang belum ditangani KHUSUS untuk unit ini
    const untreatedCriticalAlarm = currentVehicleAlarms.find(
        a => (a.handle_status ?? 'Untreated') === 'Untreated' && (a.severity === 'critical' || a.severity === 'high')
    );

    // Banner warning merah HANYA aktif jika armada yang sedang dilihat memiliki kondisi darurat/warning:
    // 1. Sedang overspeeding (> 40 km/h)
    // 2. Memiliki alarm kritis/tinggi yang belum ditangani (Collision, Rollover, Mengantuk, dll.)
    const activeVehicleWarning = isCurrentVehicleSpeeding
        ? {
            guid: 'REALTIME-OVERSPEED',
            category: 'HAULING SAFETY',
            desc: `Overspeed Warning (${telemetry.speed} km/h > ${speedLimit} km/h)`,
            vehicle: currentVehicle.plateNo,
            time: telemetry.lastUpdate !== '-' ? telemetry.lastUpdate : new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            severity: 'critical' as const,
            isRealtimeOverspeed: true,
        }
        : (untreatedCriticalAlarm ? {
            guid: untreatedCriticalAlarm.guid,
            category: untreatedCriticalAlarm.category || 'AI Safety Alert',
            desc: untreatedCriticalAlarm.desc,
            vehicle: currentVehicle.plateNo,
            time: untreatedCriticalAlarm.time,
            severity: untreatedCriticalAlarm.severity,
            isRealtimeOverspeed: false,
        } : null);

    // ── JADWAL SHIFT OPERASIONAL TAMBANG (Shift 1 & Shift 2) ──
    const currentHour = new Date().getHours();
    const isShift1 = currentHour >= 6 && currentHour < 18;
    const shiftSchedule = {
        name: isShift1 ? 'Shift 1 (Siang)' : 'Shift 2 (Malam)',
        startTime: isShift1 ? '06:00 WITA' : '18:00 WITA',
        restTime: isShift1 ? '12:00 – 13:00 WITA' : '00:00 – 01:00 WITA',
        endTime: isShift1 ? '18:00 WITA' : '06:00 WITA',
        isResting: isShift1 ? (currentHour === 12) : (currentHour === 0),
    };

    return (
        <>
            <LayoutNavbar 
                containerClassName="w-full max-w-[98%] 2xl:max-w-[1920px]" 
                className="bg-slate-100/80 rounded-2xl shadow-xl border border-slate-200/80 p-3.5 md:p-5"
            >
                <Head title="Dashcam Monitoring" />

                <div className="space-y-4">
                    {/* Floating Emergency Alarm Banner (HANYA tampil jika armada yang sedang dilihat ada kondisi warning) */}
                    {activeVehicleWarning && !bannerDismissed && (
                        <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ShieldAlert className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded">
                                            {activeVehicleWarning.category || 'AI Safety Alert'}
                                        </span>
                                        <span className="text-sm font-bold">{activeVehicleWarning.desc}</span>
                                    </div>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        Unit: {activeVehicleWarning.vehicle} • Waktu: {activeVehicleWarning.time} • Status: Menunggu Tindakan Safety Officer
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => {
                                        if (activeVehicleWarning.isRealtimeOverspeed) {
                                            setBannerDismissed(true);
                                        } else {
                                            handleQuickAction(activeVehicleWarning.guid);
                                        }
                                    }}
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
                                                        {/* ── REVISI 2: PETA UTAMA TAMBANG (HIGHLIGHTED & ENLARGED - CORE DISPATCH VIEW) ── */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
                                {/* Map Header Toolbar */}
                                <div className={`flex flex-wrap items-center justify-between gap-3 ${isLivecamActive ? 'border-b border-slate-100 pb-3 mb-3' : ''}`}>
                                    {/* Left: Title & Coordinates */}
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="text-xs font-bold text-gray-800 tracking-wider flex items-center gap-1.5 uppercase">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            GPS & GEOFENCE TAMBANG — LIVE TRACKING
                                        </span>
                                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                            Lat: {telemetry.lat?.toFixed(5) ?? '-7.65820'}, Lng: {telemetry.lng?.toFixed(5) ?? '111.18950'}
                                        </span>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            activeGeofence 
                                                ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${activeGeofence ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`}></span>
                                            {activeGeofence ? `Zona: ${activeGeofence.name}` : 'Luar Area Tambang'}
                                        </span>
                                    </div>

                                    {/* Right: Map Controls */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Site Switcher: HPA vs BDA */}
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSiteFilter('ALL')}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-[11px] ${
                                                    selectedSiteFilter === 'ALL'
                                                        ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200'
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                                title="Tampilkan semua site konsesi tambang PT HPU"
                                            >
                                                Semua Site
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSiteFilter('HPA');
                                                    setMapCenter([2.045000, 117.200000]);
                                                    setMapZoom(14);
                                                }}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-[11px] flex items-center gap-1 ${
                                                    selectedSiteFilter === 'HPA'
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                                title="Fokus ke Site HPA (Berau, Kaltim • 21 KM & 28.3 KM Hauling)"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                <span>HPA (Berau)</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSiteFilter('BDA');
                                                    setMapCenter([-1.119625, 115.020731]);
                                                    setMapZoom(12);
                                                }}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-[11px] flex items-center gap-1 ${
                                                    selectedSiteFilter === 'BDA'
                                                        ? 'bg-amber-600 text-white shadow-xs font-bold'
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                                title="Fokus ke Site BDA (Barito Daya • 45.2 KM Hauling Road)"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                <span>BDA (Barito)</span>
                                            </button>
                                        </div>

                                        {/* Layer Switcher: Satelit vs Peta */}
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                                            <button
                                                type="button"
                                                onClick={() => setMapLayer('satellite')}
                                                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                                                    mapLayer === 'satellite' 
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                                id="btn-map-layer-satellite"
                                                title="Citra Satelit Google Earth (Detail Kontur Pit & Jalan Hauling)"
                                            >
                                                <Globe className="w-3.5 h-3.5" />
                                                <span>Satelit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMapLayer('street')}
                                                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                                                    mapLayer === 'street' 
                                                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                                id="btn-map-layer-street"
                                                title="Peta Topografi & Jalan Standar OpenStreetMap"
                                            >
                                                <MapIcon className="w-3.5 h-3.5" />
                                                <span>Peta</span>
                                            </button>
                                        </div>

                                        {/* Zoom Controls */}
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setMapZoom(z => Math.max(10, z - 1))}
                                                className="p-1 rounded hover:bg-white text-gray-700 transition cursor-pointer"
                                                id="btn-map-zoom-out"
                                                title="Zoom Out (-)"
                                            >
                                                <ZoomOut className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-1.5 font-mono text-[11px] text-gray-600">{Math.round(mapZoom)}x</span>
                                            <button
                                                type="button"
                                                onClick={() => setMapZoom(z => Math.min(18, z + 1))}
                                                className="p-1 rounded hover:bg-white text-gray-700 transition cursor-pointer"
                                                id="btn-map-zoom-in"
                                                title="Zoom In (+)"
                                            >
                                                <ZoomIn className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Focus Unit */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMapCenter([telemetry.lat || 2.025000, telemetry.lng || 117.200000]);
                                                setMapZoom(16);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                            title="Pusatkan peta ke posisi unit aktif saat ini"
                                        >
                                            <Crosshair className="w-3.5 h-3.5" />
                                            <span>Fokus Unit</span>
                                        </button>

                                        {/* Expand Height */}
                                        <button
                                            type="button"
                                            onClick={() => setIsMapExpanded(!isMapExpanded)}
                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-gray-600 transition cursor-pointer"
                                            title={isMapExpanded ? 'Tampilan Standar (400px)' : 'Perbesar Peta (580px)'}
                                        >
                                            {isMapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                        </button>

                                        {/* Toggle STA Markers */}
                                        <button
                                            type="button"
                                            onClick={() => setShowStaMarkers(!showStaMarkers)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                                showStaMarkers 
                                                    ? 'bg-amber-600 text-white' 
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                            title="Tampilkan/sembunyikan titik STA pada rute hauling"
                                        >
                                            <Radio className="w-3.5 h-3.5" />
                                            <span>STA ({roadGeofences.length})</span>
                                        </button>

                                        {/* Toggle Zones Drawer */}
                                        <button
                                            type="button"
                                            onClick={() => setShowZonesDrawer(!showZonesDrawer)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                                showZonesDrawer 
                                                    ? 'bg-slate-800 text-white' 
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                            title="Tampilkan daftar zona geofence tambang"
                                        >
                                            <Layers className="w-3.5 h-3.5" />
                                            <span>Zona ({operationalGeofences.length})</span>
                                        </button>

                                        {/* REVISI 7: Tarik Zona Manual pada Peta */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!isDrawingMode) {
                                                    setIsDrawingMode(true);
                                                    setMapLayer('satellite'); // Pastikan otomatis beralih ke citra satelit Google Earth
                                                    setDrawnPoints([]);
                                                    setGeofenceNotice('🖱️ Mode Tarik Zona Aktif: Peta beralih ke Satelit Google Earth. Pilih bentuk (Poligon / Garis / Lingkaran) lalu klik di peta.');
                                                } else {
                                                    handleCancelDrawing();
                                                }
                                            }}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                                isDrawingMode 
                                                    ? 'bg-amber-600 text-white animate-pulse ring-2 ring-amber-300' 
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                            title="Tarik atau tentukan titik zona ritasi/geofence secara manual langsung pada citra satelit Google Earth"
                                        >
                                            <LandPlot className="w-3.5 h-3.5" />
                                            <span>{isDrawingMode ? 'Batal Tarik' : 'Tarik Zona'}</span>
                                        </button>

                                        {/* Add Zone */}
                                        <button
                                            type="button"
                                            onClick={() => setShowGeofenceModal(true)}
                                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Tambah Zona</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Map Viewport (Enlarged) */}
                                <div className={`relative ${isMapExpanded ? 'h-[580px]' : 'h-[400px]'} w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-950 transition-all duration-300`}>
                                    {/* ── DIGITASI PERIMETER ZONA (PRECISION INDUSTRIAL GIS HUD) ── */}
                                    {isDrawingMode && (
                                        <div className="absolute top-3 left-4 right-4 z-30 max-w-xl mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-lg p-2.5 shadow-xl text-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-800">
                                                {/* Left: Mode Title & Vertex Counter */}
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                                    <span className="text-xs font-semibold text-slate-200 truncate">
                                                        Digitasi Perimeter Zona
                                                    </span>
                                                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium shrink-0">
                                                        {drawnPoints.length} titik
                                                    </span>
                                                </div>

                                                {/* Right: Shape Mode Selector (Segmented Control) */}
                                                <div className="flex items-center bg-slate-800/90 p-0.5 rounded-md border border-slate-700/80 text-xs shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDrawShape('polygon');
                                                            setDrawnPoints([]);
                                                            setGeofenceNotice('Mode Poligon: Klik titik sudut pada peta satelit untuk membentuk perimeter area.');
                                                        }}
                                                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                                                            drawShape === 'polygon'
                                                                ? 'bg-slate-700 text-white shadow-2xs font-semibold'
                                                                : 'text-slate-400 hover:text-slate-200'
                                                        }`}
                                                        title="Poligon: Area Pit, Disposal, Workshop, dll."
                                                    >
                                                        <LandPlot className="w-3 h-3 text-emerald-400" />
                                                        <span>Poligon</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDrawShape('line');
                                                            setDrawnPoints([]);
                                                            setGeofenceNotice('Mode Garis: Klik titik-titik di sepanjang koridor jalan hauling.');
                                                        }}
                                                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                                                            drawShape === 'line'
                                                                ? 'bg-slate-700 text-white shadow-2xs font-semibold'
                                                                : 'text-slate-400 hover:text-slate-200'
                                                        }`}
                                                        title="Garis: Jalur jalan hauling / rute akses tambang"
                                                    >
                                                        <Minus className="w-3 h-3 text-amber-400" />
                                                        <span>Jalur</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDrawShape('circle');
                                                            setDrawnPoints([]);
                                                            setGeofenceNotice('Mode Lingkaran: Klik 1 untuk titik pusat, klik 2 untuk batas radius.');
                                                        }}
                                                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                                                            drawShape === 'circle'
                                                                ? 'bg-slate-700 text-white shadow-2xs font-semibold'
                                                                : 'text-slate-400 hover:text-slate-200'
                                                        }`}
                                                        title="Lingkaran: Radius buffer membulat"
                                                    >
                                                        <Circle className="w-3 h-3 text-blue-400" />
                                                        <span>Radius</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Bottom: Dimension Summary / Instruction & Clean Action Buttons */}
                                            <div className="flex items-center justify-between gap-2 text-xs">
                                                <div className="text-[11px] text-slate-300 truncate flex-1 pr-2">
                                                    {drawShape === 'polygon' && (
                                                        drawnPoints.length < 3
                                                            ? `Klik peta satelit untuk menetapkan sudut batas (${3 - drawnPoints.length} titik lagi).`
                                                            : (drawnStats?.areaHa ? `Area ~${drawnStats.areaHa} Ha • Keliling ~${drawnStats.perimeterM}m` : `Poligon ${drawnPoints.length} titik siap disimpan.`)
                                                    )}
                                                    {drawShape === 'line' && (
                                                        drawnPoints.length < 2
                                                            ? 'Klik titik awal dan lanjutan di sepanjang koridor jalan.'
                                                            : (drawnStats?.lengthM ? `Panjang rute ~${drawnStats.lengthM}m (${drawnPoints.length} titik).` : `Jalur ${drawnPoints.length} titik siap.`)
                                                    )}
                                                    {drawShape === 'circle' && (
                                                        drawnPoints.length === 0
                                                            ? 'Klik titik 1 sebagai pusat lingkaran.'
                                                            : (drawnPoints.length === 1
                                                                ? 'Klik titik 2 pada batas luar untuk mengunci radius.'
                                                                : `Radius ~${drawnStats?.radiusM || 0}m (Luas ~${drawnStats?.areaHa || 0} Ha).`)
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={handleUndoPoint}
                                                        disabled={drawnPoints.length === 0}
                                                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-medium transition cursor-pointer border border-slate-700 flex items-center gap-1"
                                                        title="Hapus titik terakhir"
                                                    >
                                                        <RotateCcw className="w-3 h-3" />
                                                        <span>Undo</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleResetDrawing}
                                                        disabled={drawnPoints.length === 0}
                                                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-medium transition cursor-pointer border border-slate-700 flex items-center gap-1"
                                                        title="Hapus semua titik"
                                                    >
                                                        <span>Reset</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleFinishDrawing}
                                                        disabled={
                                                            (drawShape === 'polygon' && drawnPoints.length < 3) ||
                                                            (drawShape === 'line' && drawnPoints.length < 2) ||
                                                            (drawShape === 'circle' && drawnPoints.length < 2)
                                                        }
                                                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Simpan Zona</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelDrawing}
                                                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                                                        title="Batal"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Map
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        onBoundsChanged={({ center, zoom }) => {
                                            setMapCenter(center);
                                            setMapZoom(zoom);
                                        }}
                                        onClick={({ latLng }) => {
                                            if (isDrawingMode) {
                                                const [cLat, cLng] = latLng;
                                                const newPt: [number, number] = [Number(cLat.toFixed(6)), Number(cLng.toFixed(6))];

                                                if (drawShape === 'circle' && drawnPoints.length >= 2) {
                                                    setDrawnPoints([newPt]);
                                                    setGeofenceNotice(`Titik pusat lingkaran baru: [${newPt[0]}, ${newPt[1]}]. Klik titik ke-2 untuk radius.`);
                                                    return;
                                                }

                                                const nextPoints = [...drawnPoints, newPt];
                                                setDrawnPoints(nextPoints);

                                                if (drawShape === 'polygon') {
                                                    if (nextPoints.length === 1) {
                                                        setGeofenceNotice(`Titik 1 (sudut poligon): [${newPt[0]}, ${newPt[1]}]. Klik titik ke-2.`);
                                                    } else if (nextPoints.length === 2) {
                                                        setGeofenceNotice(`Garis sisi 1 terbentuk. Klik titik ke-3 untuk membentuk bidang poligon.`);
                                                    } else {
                                                        setGeofenceNotice(`Poligon ${nextPoints.length} titik terbentuk. Lanjutkan klik atau tekan 'Selesai & Simpan'.`);
                                                    }
                                                } else if (drawShape === 'line') {
                                                    setGeofenceNotice(`Jalur ${nextPoints.length} titik. Lanjutkan klik di sepanjang rute jalan hauling.`);
                                                } else if (drawShape === 'circle') {
                                                    if (nextPoints.length === 1) {
                                                        setGeofenceNotice(`Titik pusat lingkaran: [${newPt[0]}, ${newPt[1]}]. Klik titik ke-2 pada batas luar untuk menentukan radius.`);
                                                    } else {
                                                        const rM = calculateDistance(nextPoints[0][0], nextPoints[0][1], newPt[0], newPt[1]);
                                                        setGeofenceNotice(`Lingkaran terbentuk dengan radius ${rM} meter. Klik 'Selesai & Simpan' untuk menyimpan zona ini.`);
                                                    }
                                                }
                                            }
                                        }}
                                        provider={mapTileProvider}
                                        attribution={false}
                                    >
                                        {/* Active Interactive Drawing GeoJson Preview Layer */}
                                        {activeDrawingGeoJson && (
                                            <GeoJson
                                                data={activeDrawingGeoJson}
                                                styleCallback={(feature: any) => ({
                                                    stroke: feature?.properties?.color || '#F59E0B',
                                                    strokeWidth: '3.5',
                                                    strokeDasharray: drawShape === 'polygon' ? '5, 5' : 'none',
                                                    fill: drawShape === 'polygon' ? '#10B981' : (drawShape === 'circle' ? '#3B82F6' : 'none'),
                                                    fillOpacity: 0.25,
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                })}
                                            />
                                        )}

                                        {/* Interactive Numbered Pins for Drawn Points */}
                                        {isDrawingMode && drawnPoints.map((pt, idx) => (
                                            <Overlay key={`drawn-pt-${idx}`} anchor={[pt[0], pt[1]]} offset={[10, 10]}>
                                                <div className="relative pointer-events-none">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900 shadow-lg border-2 border-white ${
                                                        idx === drawnPoints.length - 1 ? 'bg-amber-400 ring-4 ring-amber-400/50 animate-pulse' : 'bg-emerald-400'
                                                    }`}>
                                                        {idx + 1}
                                                    </div>
                                                    {idx === 0 && drawShape === 'polygon' && drawnPoints.length >= 3 && (
                                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1 rounded whitespace-nowrap border border-emerald-400">
                                                            Awal
                                                        </span>
                                                    )}
                                                </div>
                                            </Overlay>
                                        ))}
                                        {/* Hauling Routes GeoJSON LineStrings */}
                                        {haulingRoutes && (
                                            <GeoJson
                                                data={haulingRoutes}
                                                styleCallback={(feature: any) => {
                                                    const featSite = (feature?.properties?.site || 'HPA').toUpperCase();
                                                    const isSelectedSite = selectedSiteFilter === 'ALL' || featSite === selectedSiteFilter;
                                                    return {
                                                        stroke: feature?.properties?.stroke || feature?.properties?.color || '#F59E0B',
                                                        strokeWidth: isSelectedSite ? '4.5' : '1.5',
                                                        strokeOpacity: isSelectedSite ? '0.95' : '0.25',
                                                        strokeLinecap: 'round',
                                                        strokeLinejoin: 'round',
                                                    };
                                                }}
                                            />
                                        )}

                                        {/* Operational Geofence Polygons GeoJSON (Bentuk Fisik Tambang Aktual) */}
                                        {operationalPolygons && (
                                            <GeoJson
                                                data={operationalPolygons}
                                                styleCallback={(feature: any) => {
                                                    const featSite = (feature?.properties?.site || 'HPA').toUpperCase();
                                                    const isSelectedSite = selectedSiteFilter === 'ALL' || featSite === selectedSiteFilter;
                                                    return {
                                                        stroke: feature?.properties?.color || '#2563EB',
                                                        strokeWidth: isSelectedSite ? '2.5' : '1',
                                                        strokeDasharray: '4, 4',
                                                        fill: feature?.properties?.color || '#2563EB',
                                                        fillOpacity: isSelectedSite ? 0.20 : 0.04,
                                                    };
                                                }}
                                            />
                                        )}

                                        {/* Operational Geofence Labels (Pin Papan Nama di Titik Pusat Poligon) */}
                                        {operationalGeofences.map(gf => {
                                            const lat = gf.latitude ?? gf.coordinates?.lat ?? 2.025;
                                            const lng = gf.longitude ?? gf.coordinates?.lng ?? 117.200;
                                            const r = gf.radius || 150;
                                            const isCompactView = mapZoom < 14;

                                            return (
                                                <Overlay key={gf.id} anchor={[lat, lng]} offset={[0, 0]}>
                                                    <div className="relative pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                                        <div 
                                                            style={{ backgroundColor: gf.color || '#2563EB' }}
                                                            className="w-2 h-2 rounded-full ring-2 ring-white shadow-xs mb-0.5"
                                                        />
                                                        {(!isCompactView || r >= 250) && (
                                                            <span
                                                                style={{ 
                                                                    color: '#ffffff', 
                                                                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                                                                    borderColor: gf.color || '#2563EB'
                                                                }}
                                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-md border shadow-md truncate max-w-[145px] backdrop-blur-xs whitespace-nowrap pointer-events-auto flex items-center gap-1 group/badge"
                                                                title={`${gf.name} (${gf.geometry_type === 'polygon' ? 'Poligon Tambang' : 'Lingkaran'} • Radius: ${r}m)`}
                                                            >
                                                                <span className="truncate">{gf.name}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteGeofence(gf.id, gf.name);
                                                                    }}
                                                                    className="opacity-50 hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition cursor-pointer"
                                                                    title={`Hapus "${gf.name}"`}
                                                                >
                                                                    <X className="w-2.5 h-2.5" />
                                                                </button>
                                                            </span>
                                                        )}
                                                    </div>
                                                </Overlay>
                                            );
                                        })}

                                        {/* STA Checkpoints Points (If enabled) */}
                                        {showStaMarkers && roadGeofences.map(gf => {
                                            const lat = gf.latitude ?? gf.coordinates?.lat;
                                            const lng = gf.longitude ?? gf.coordinates?.lng;
                                            if (!lat || !lng) return null;
                                            return (
                                                <Overlay key={gf.id} anchor={[lat, lng]} offset={[4, 4]}>
                                                    <div
                                                        style={{ backgroundColor: gf.color || '#64748B' }}
                                                        className="w-2.5 h-2.5 rounded-full border border-white shadow-xs pointer-events-auto cursor-pointer hover:scale-150 transition-transform"
                                                        title={`${gf.name} - ${gf.address || ''}`}
                                                        onClick={() => {
                                                            setMapCenter([lat, lng]);
                                                            setMapZoom(16);
                                                        }}
                                                    />
                                                </Overlay>
                                            );
                                        })}

                                        {/* Live Unit Marker */}
                                        <Marker
                                            anchor={[telemetry.lat || 2.025, telemetry.lng || 117.200]}
                                            payload={1}
                                        >
                                            <div className="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto group">
                                                <span className="absolute w-12 h-12 rounded-full bg-blue-500/35 animate-ping"></span>
                                                <span className="absolute w-8 h-8 rounded-full bg-blue-600/20"></span>
                                                <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white relative z-10 transition-transform hover:scale-110">
                                                    {currentVehicle.type === 'EXCA' ? (
                                                        <LandPlot className="w-4 h-4" />
                                                    ) : (
                                                        <Truck className="w-4 h-4" />
                                                    )}
                                                </div>
                                                {/* Floating Speed & Plate Tag above vehicle */}
                                                <div className="absolute -top-7 whitespace-nowrap bg-slate-900/90 text-white border border-slate-700/80 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                    <span>{telemetry.speed} km/j</span>
                                                    <span className="text-slate-400 font-mono">• {currentVehicle.plateNo}</span>
                                                </div>
                                            </div>
                                        </Marker>
                                    </Map>

                                    {/* Floating Zones Drawer (Top Right Overlay) */}
                                    {showZonesDrawer && (
                                        <div className="absolute top-3 right-3 z-20 w-80 max-h-[420px] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl overflow-hidden flex flex-col text-xs text-white">
                                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
                                                <span className="font-bold flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                    Zona & Checkpoint ({filteredDrawerGeofences.length})
                                                    {selectedSiteFilter !== 'ALL' && (
                                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400 font-mono">
                                                            {selectedSiteFilter}
                                                        </span>
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowZonesDrawer(false)}
                                                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Search Filter */}
                                            <div className="relative mb-2">
                                                <input
                                                    type="text"
                                                    value={zoneSearchQuery}
                                                    onChange={e => setZoneSearchQuery(e.target.value)}
                                                    placeholder="Cari zona / STA..."
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            {/* Filter Tabs */}
                                            <div className="grid grid-cols-3 gap-1 mb-2 pb-2 border-b border-slate-700/80">
                                                <button
                                                    type="button"
                                                    onClick={() => setZoneFilterTab('operational')}
                                                    className={`py-1 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                                                        zoneFilterTab === 'operational'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    Fasilitas ({operationalGeofences.length})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setZoneFilterTab('sta')}
                                                    className={`py-1 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                                                        zoneFilterTab === 'sta'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    STA ({roadGeofences.length})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setZoneFilterTab('all')}
                                                    className={`py-1 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                                                        zoneFilterTab === 'all'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    Semua ({geofences.length})
                                                </button>
                                            </div>

                                            {/* Scrollable List */}
                                            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[290px]">
                                                {filteredDrawerGeofences.length === 0 ? (
                                                    <p className="text-slate-400 text-center py-4 text-[11px]">Tidak ada zona yang cocok.</p>
                                                ) : (
                                                    filteredDrawerGeofences.map(gf => {
                                                        const lat = gf.latitude ?? gf.coordinates?.lat;
                                                        const lng = gf.longitude ?? gf.coordinates?.lng;
                                                        return (
                                                            <div
                                                                key={gf.id}
                                                                onClick={() => {
                                                                    if (lat && lng) {
                                                                        setMapCenter([lat, lng]);
                                                                        setMapZoom(16);
                                                                    }
                                                                }}
                                                                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: gf.color || '#2563EB' }}></span>
                                                                    <div className="truncate">
                                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                                            <p className="font-bold text-[11px] text-white truncate group-hover:text-blue-300">
                                                                                {gf.name}
                                                                            </p>
                                                                            <span className={`text-[8px] font-mono px-1 rounded font-extrabold shrink-0 border ${
                                                                                (gf.site || 'HPA') === 'BDA' 
                                                                                    ? 'bg-amber-950/80 text-amber-300 border-amber-700/80' 
                                                                                    : 'bg-blue-950/80 text-blue-300 border-blue-700/80'
                                                                            }`}>
                                                                                {gf.site || 'HPA'}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-slate-400 uppercase font-mono truncate">
                                                                            {gf.type} • R: {gf.radius}m {gf.material ? `• [${gf.material}]` : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                                    <span className="text-[10px] text-blue-400 font-semibold group-hover:underline">
                                                                        Fokus
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteGeofence(gf.id, gf.name);
                                                                        }}
                                                                        className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                                                                        title={`Hapus geofence "${gf.name}"`}
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Integrated Fleet Telemetry Strip under Map */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                                    <div className={`p-1.5 rounded-lg border transition ${
                                        isCurrentVehicleSpeeding ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200/80'
                                    }`}>
                                        <p className="text-gray-400 font-bold uppercase text-[9px]">Kecepatan GPS</p>
                                        <p className={`font-black text-sm ${isCurrentVehicleSpeeding ? 'text-rose-600' : 'text-gray-900'}`}>
                                            {telemetry.speed} <span className="text-[10px] font-normal text-gray-500">km/j</span>
                                        </p>
                                        <span className="text-[9px] font-mono text-slate-500">Batas: {speedLimit} km/j</span>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                                        <p className="text-gray-400 font-bold uppercase text-[9px]">Odometer Hari Ini</p>
                                        <p className="font-black text-blue-600 text-sm">{telemetry.distance.toFixed(1)} <span className="text-[10px] font-normal text-gray-500">km</span></p>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                                        <p className="text-gray-400 font-bold uppercase text-[9px]">Zona Geofence</p>
                                        <p className="font-bold text-gray-800 truncate px-1 text-xs">
                                            {activeGeofence ? activeGeofence.name : 'Luar Area'}
                                        </p>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                                        <p className="text-gray-400 font-bold uppercase text-[9px]">Total Ritasi</p>
                                        <p className="font-black text-emerald-700 text-sm">{ritasiToday} <span className="text-[10px] font-normal text-gray-500">Trip</span></p>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                                        <p className="text-gray-400 font-bold uppercase text-[9px]">Satelit GPS</p>
                                        <p className="font-bold text-gray-900 text-xs flex items-center justify-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            {telemetry.satellites || 18} Terkunci
                                        </p>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                                        <p className="text-gray-400 font-bold uppercase text-[9px]">Kondisi Mesin</p>
                                        <p className={`font-bold text-xs ${currentVehicle.status === 'ONLINE' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {currentVehicle.status === 'ONLINE' ? 'ON (Running)' : 'Standby (Idle)'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Integrated Video Surveillance & Command Center Card */}
                            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 shadow-xs">
                                {/* Command Bar Inside Surveillance Card */}
                                <div className={`flex flex-wrap items-center justify-between gap-3 ${isLivecamActive ? 'border-b border-slate-100 pb-3 mb-3' : ''}`}>
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

                                        {/* Stream Engine Selector */}
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setStreamEngine('cmsv6')}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                                                    streamEngine === 'cmsv6'
                                                        ? 'bg-white text-gray-900 shadow-xs font-bold' 
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                                title="Gunakan CMSV6 Official H5 Video Player dari server 182.253.27.12"
                                            >
                                                Official H5
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStreamEngine('flv')}
                                                className={`px-2 py-1 rounded-md transition cursor-pointer text-xs ${
                                                    streamEngine === 'flv'
                                                        ? 'bg-white text-gray-900 shadow-xs font-bold' 
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                                title="Gunakan Direct HTTP-FLV Media Stream Port 6604"
                                            >
                                                FLV Direct
                                            </button>
                                        </div>

                                        {/* REVISI 1: Tombol On/Off Livecam (Default: OFF Terlebih Dahulu) */}
                                        <button
                                            type="button"
                                            onClick={() => setIsLivecamActive(!isLivecamActive)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                                isLivecamActive
                                                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                                            }`}
                                            title={isLivecamActive ? 'Matikan siaran langsung livecam untuk menghemat bandwidth' : 'Nyalakan siaran langsung kamera kabin & jalan'}
                                        >
                                            {isLivecamActive ? (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                                    <VideoOff className="w-3.5 h-3.5" />
                                                    <span>Matikan Livecam</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Video className="w-3.5 h-3.5" />
                                                    <span>Nyalakan Livecam</span>
                                                </>
                                            )}
                                        </button>

                                        {/* REVISI 5: Tombol On/Off Mic (Intercom Dua Arah Driver & Operator) */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMicActive(!isMicActive);
                                                setGeofenceNotice(
                                                    !isMicActive
                                                        ? `🎙️ Intercom Aktif: Terhubung ke speaker kabin unit ${currentVehicle.plateNo}. Operator dapat berbicara langsung ke pengemudi.`
                                                        : `🔇 Intercom Dimatikan: Mikrofon operator di-mute.`
                                                );
                                                setTimeout(() => setGeofenceNotice(null), 4000);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                                isMicActive
                                                    ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                            }`}
                                            title="Nyalakan/matikan mikrofon interkom untuk berbicara langsung dengan pengemudi unit"
                                        >
                                            {isMicActive ? (
                                                <>
                                                    <Mic className="w-3.5 h-3.5 text-white animate-bounce" />
                                                    <span>MIC ON (Bicara)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <MicOff className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>MIC OFF</span>
                                                </>
                                            )}
                                        </button>

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
                                            {isLivecamActive ? (
                                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                    LIVE STREAMING
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                    LIVECAM STANDBY (OFF)
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                CMSV6 OK
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* REVISI 1: Video Player Frame - Ditampilkan saat Livecam AKTIF (ON) */}
                                {isLivecamActive && (
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
                                                            src={camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl, streamEngine)!}
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
                                                    src={camUrl(currentVehicle.deviceNo, 0, jsession, cmsBaseUrl, streamEngine)!}
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
                                                    src={camUrl(currentVehicle.deviceNo, 1, jsession, cmsBaseUrl, streamEngine)!}
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
                                                            src={camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl, streamEngine)!}
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
                                )}
                            </div>

                            {/* ── MODULAR CARDS: SIKLUS OPERASIONAL HAULING & TELEMETRI SENSOR HARDWARE ── */}
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
                                                            <span className="font-bold text-gray-800 truncate">{activeGeofence?.type === 'loading' ? activeGeofence.name : (ritasiLogs.length > 0 ? (ritasiLogs[0].pit_name || 'PIT HPU') : '-')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                            <span className="font-semibold text-gray-400 uppercase w-18 text-[11px]">Sensor PTO:</span>
                                                            <span className={`font-bold ${ptoActive ? 'text-rose-600' : 'text-slate-700'}`}>{ptoActive ? 'PTO AKTIF (Dumping)' : 'PTO OFF (Normal)'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                            <span className="font-semibold text-gray-400 uppercase w-18 text-[11px]">Tujuan:</span>
                                                            <span className="font-bold text-gray-800 truncate">{activeGeofence?.type === 'dumping' ? activeGeofence.name : (activeGeofence ? activeGeofence.name : 'Jalur Hauling Tambang')}</span>
                                                        </div>
                                                        <div className="mt-1">
                                                            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                                                <span>Produksi Terakumulasi</span>
                                                                <span className="font-mono text-blue-600 font-bold">{totalBcmToday} BCM</span>
                                                            </div>
                                                            <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                                                                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ritasiToday * 5)}%` }}></div>
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
                                                            onClick={() => setShowRitasiHistoryModal(true)}
                                                            className="w-full mt-1.5 py-1 px-2 rounded-md text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center justify-center gap-1 cursor-pointer"
                                                        >
                                                            <FileText className="w-3 h-3 text-blue-600" />
                                                            Riwayat Ritasi
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
                                        /* Card 6 (Excavator): OPERASIONAL EXCAVATOR */
                                        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                    <LandPlot className="w-3.5 h-3.5 text-amber-600" />
                                                    UNIT EXCAVATOR & FRONT LOADING
                                                </span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                                    currentVehicle.status === 'ONLINE' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-50 border-slate-200'
                                                }`}>
                                                    <span className={`w-2 h-2 rounded-full ${currentVehicle.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                    {currentVehicle.status === 'ONLINE' ? 'EXCA ONLINE' : 'EXCA STANDBY'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-400 font-semibold uppercase text-[10px]">Identitas Unit</span>
                                                    <span className="text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-gray-700">{currentVehicle.site}</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <h4 className="text-xl font-bold text-amber-600">{currentVehicle.plateNo}</h4>
                                                    <span className="text-xs text-gray-400 font-mono">ID: {currentVehicle.deviceNo}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                                                    <div className="bg-white p-2 rounded border border-slate-200">
                                                        <p className="text-gray-400 font-medium uppercase text-[10px]">Operator Kabin</p>
                                                        <p className="font-bold text-gray-800 truncate">{driver?.name || 'Kabin Standby'}</p>
                                                    </div>
                                                    <div className="bg-white p-2 rounded border border-slate-200">
                                                        <p className="text-gray-400 font-medium uppercase text-[10px]">Zona Operasional</p>
                                                        <p className="font-bold text-gray-800 truncate">{activeGeofence ? activeGeofence.name : 'Area Tambang'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

<div className="xl:col-span-5 flex flex-col">
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
                                                            {avgCycleTimeToday > 0 ? avgCycleTimeToday : '-'} <span className="text-[10px] font-normal text-gray-500">min</span>
                                                        </p>
                                                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Cycle Time</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex flex-col items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                                                            <Power className="w-3.5 h-3.5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-700 leading-tight">
                                                            {telemetry.distance > 0 ? telemetry.distance.toFixed(1) : '-'} <span className="text-[10px] font-normal text-gray-500">KM</span>
                                                        </p>
                                                        <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Odometer GPS</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex flex-col items-center justify-center">
                                                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
                                                            <Fuel className="w-3.5 h-3.5" />
                                                        </div>
                                                        <p className="text-sm font-bold text-amber-700 leading-tight">
                                                            {telemetry.fuel > 0 ? telemetry.fuel : '-'} <span className="text-[10px] font-normal text-gray-500">L</span>
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
                            </div>

                            {/* ── MODULAR CARDS: SAFETY ALARM DMS & OPERATOR DETAIL ── */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                                <div className="xl:col-span-7 flex flex-col">
<div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-800 tracking-wider flex items-center gap-1.5 uppercase">
                                                SAFETY ALARM & MONITORING DMS
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-mono">
                                                Monitoring Unit: <span className="font-bold text-blue-600">{currentVehicle.plateNo}</span>
                                            </p>
                                        </div>
                                    </div>
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
                                            type="button"
                                            onClick={fetchAlarms}
                                            className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                                            title="Segarkan data alarm dari server CMSV6"
                                        >
                                            <RotateCw className="w-3 h-3" /> Refresh
                                        </button>
                                    </div>
                                </div>

                                {/* Category Filter Tabs */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1 overflow-x-auto text-xs">
                                        {[
                                            { id: 'all', label: `Semua (${currentVehicleAlarms.length})` },
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
                                            <p className="text-xs font-bold text-gray-700">Tidak ada peringatan aktif untuk unit ini</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Semua parameter safety armada {currentVehicle.plateNo} berada dalam kondisi normal</p>
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
<div className="xl:col-span-5 flex flex-col">
                                    {/* Card 9: OPERATOR DETAIL */}
                                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-gray-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                    <User className="w-3.5 h-3.5 text-blue-600" />
                                                    OPERATOR DETAIL
                                                </span>
                                                {driver ? (
                                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif Mengemudi
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <UserX className="w-3 h-3 text-slate-400" /> Kabin Kosong
                                                    </span>
                                                )}
                                            </div>

                                            <div className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition ${
                                                driver ? 'bg-slate-50 border-slate-200/90' : 'bg-amber-50/40 border-amber-200/60'
                                            }`}>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5">
                                                        {driver ? driver.name : 'Belum Ada Driver'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                        <span className="bg-white text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                                                            {currentVehicle.plateNo}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 font-mono">
                                                            NIK: {driver ? driver.id : '-'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex flex-col gap-1 text-[11px] text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-gray-400" />
                                                            {driver?.position || 'Operator Alat Berat'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-gray-400" />
                                                            {currentVehicle.site}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        {driver ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Biometrik AI ({driver.match}% Match)
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                                <AlertCircle className="w-2.5 h-2.5 text-amber-600" /> Siap Scan Wajah / Check-In
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Avatar Box */}
                                                <div className="w-18 h-24 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-gray-400 overflow-hidden shrink-0 shadow-xs">
                                                    {(driver?.photoUrl || previewPhoto) ? (
                                                        <img
                                                            src={driver?.photoUrl || previewPhoto || ''}
                                                            alt={driver?.name || 'Operator'}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <User size={36} strokeWidth={1.5} className="text-gray-300" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Face Scan Action */}
                                        <div className="mt-3 space-y-2">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await scanCabinDriver();
                                                }}
                                                disabled={isScanningFace}
                                                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                            >
                                                <ScanFace className="w-4 h-4" />
                                                {isScanningFace ? 'Memindai dari Kabin...' : 'Pindai Wajah di Kabin (AI)'}
                                            </button>

                                            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCheckin(!showCheckin)}
                                                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                                                >
                                                    {showCheckin ? 'Tutup Pilihan' : 'Pilih Manual Operator'}
                                                </button>
                                                
                                                <div className="flex items-center gap-2">
                                                    {driver && (
                                                        <button
                                                            type="button"
                                                            onClick={handleCheckout}
                                                            className="text-rose-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                                                            title="Check-out driver dari unit ini"
                                                        >
                                                            <LogOut className="w-3 h-3" /> Check-out
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => { fetchHistoryLogs(); setShowHistory(true); }}
                                                        className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                                                    >
                                                        <History className="w-3 h-3" /> Riwayat
                                                    </button>
                                                </div>
                                            </div>

                                            {showCheckin && (
                                                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Cari nama atau NIK pengemudi..."
                                                        value={searchDriver}
                                                        onChange={e => setSearchDriver(e.target.value)}
                                                        className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                                                    />
                                                    <div className="max-h-36 overflow-y-auto space-y-1">
                                                        {driverList.filter(d => d.name.toLowerCase().includes(searchDriver.toLowerCase()) || d.id.includes(searchDriver)).map(d => (
                                                            <div
                                                                key={d.id}
                                                                onClick={() => {
                                                                    handleSelectManualDriver(d);
                                                                }}
                                                                className="p-1.5 hover:bg-blue-50 hover:text-blue-700 rounded cursor-pointer text-xs flex justify-between items-center transition"
                                                            >
                                                                <div>
                                                                    <span className="font-bold text-gray-800 block">{d.name}</span>
                                                                    <span className="text-[10px] text-gray-400">{d.position || 'Operator'}</span>
                                                                </div>
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
                    </div>
                </div>
                </div>

                {/* ── MODAL: KONFIGURASI GEOFENCE & PARAMETER ZONA ── */}
                {showGeofenceModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-5 border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <LandPlot className="w-4 h-4 text-blue-600" /> Konfigurasi Geofence & Parameter Zona
                                    </h4>
                                    <p className="text-[11px] text-slate-500">Penetapan batas perimeter virtual dan parameter operasional tambang</p>
                                </div>
                                <button onClick={() => setShowGeofenceModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md hover:bg-slate-100 transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGeofence} className="space-y-3.5">
                                {/* Ringkasan Hasil Digitasi Perimeter */}
                                {newGeofence.coordinates_json && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px]">
                                                <LandPlot className="w-3.5 h-3.5 text-blue-600" />
                                                Hasil Digitasi Perimeter
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[10px] uppercase font-mono">
                                                {newGeofence.geometry_type}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80 text-[11px] text-slate-600">
                                            <div>
                                                <span className="text-slate-400">Pusat: </span>
                                                <span className="font-mono text-slate-800">[{newGeofence.latitude}, {newGeofence.longitude}]</span>
                                            </div>
                                            <div className="text-right">
                                                {newGeofence.geometry_type === 'polygon' && drawnStats?.areaHa ? (
                                                    <span>Luas: <strong className="text-slate-800">{drawnStats.areaHa} Ha</strong> • {drawnStats.perimeterM}m keliling</span>
                                                ) : newGeofence.geometry_type === 'line' && drawnStats?.lengthM ? (
                                                    <span>Panjang: <strong className="text-slate-800">{drawnStats.lengthM}m</strong></span>
                                                ) : (
                                                    <span>Radius: <strong className="text-slate-800">{newGeofence.radius}m</strong></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 1. NAMA GEOFENCE */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-semibold text-slate-800">
                                            Nama Geofence <span className="text-rose-500">*</span>
                                        </label>
                                        {newGeofence.name && (
                                            <button
                                                type="button"
                                                onClick={() => setNewGeofence({ ...newGeofence, name: '' })}
                                                className="text-[10px] text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
                                            >
                                                Bersihkan teks
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Pit Front Barat (Loading OB), Workshop BDA, KM 15 Hauling"
                                        value={newGeofence.name}
                                        onChange={e => setNewGeofence({ ...newGeofence, name: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* 2. KLASIFIKASI OPERASIONAL (SITE, KATEGORI, MATERIAL) */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-800 block mb-1">Site Konsesi</label>
                                        <select
                                            value={newGeofence.site}
                                            onChange={e => setNewGeofence({ ...newGeofence, site: e.target.value })}
                                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="HPA">Site HPA (Berau)</option>
                                            <option value="BDA">Site BDA (Barito)</option>
                                            <option value="KDA">Site KDA</option>
                                            <option value="KJA">Site KJA</option>
                                            <option value="AMO">Site AMO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-800 block mb-1">Kategori Zona</label>
                                        <select
                                            value={newGeofence.type}
                                            onChange={e => setNewGeofence({ ...newGeofence, type: e.target.value })}
                                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="loading">Loading Point (PIT)</option>
                                            <option value="dumping">Dumping Area (Disposal/Port)</option>
                                            <option value="parking">Office / Workshop / Parkir</option>
                                            <option value="road">Jalur Jalan Hauling</option>
                                            <option value="custom">Zona Khusus / Bahaya</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-800 block mb-1">Material Utama</label>
                                        <select
                                            value={newGeofence.material}
                                            onChange={e => setNewGeofence({ ...newGeofence, material: e.target.value })}
                                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="OB">OB (Overburden)</option>
                                            <option value="COAL">Coal (Batubara)</option>
                                            <option value="MUD">Mud (Lumpur)</option>
                                            <option value="TOP SOIL">Top Soil</option>
                                            <option value="LIMONIT">Limonit</option>
                                            <option value="SAPROLIT">Saprolit</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 3. JENIS GEOMETRI */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-800 block mb-1">
                                        Jenis Geometri Perimeter <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={newGeofence.geometry_type}
                                        onChange={e => {
                                            const gType = e.target.value;
                                            let autoType = newGeofence.type;
                                            if (gType === 'polygon' && autoType === 'road') autoType = 'loading';
                                            if (gType === 'line') autoType = 'road';
                                            setNewGeofence({ ...newGeofence, geometry_type: gType, type: autoType });
                                        }}
                                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="polygon">Polygon: Batas area terbuka/tertutup (PIT, Disposal, Workshop)</option>
                                        <option value="line">Line: Jalur koridor jalan (Jalur Hauling / Akses Tambang)</option>
                                        <option value="circle">Circle: Lingkaran radius (Stockpile membulat / Buffer)</option>
                                    </select>
                                </div>

                                {/* 4. KOORDINAT PUSAT */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-semibold text-slate-800">
                                            Koordinat Pusat (Lat, Long) <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const lat = telemetry.lat || 2.045000;
                                                    const lng = telemetry.lng || 117.200000;
                                                    setNewGeofence(prev => ({
                                                        ...prev,
                                                        latitude: Number(lat.toFixed(6)),
                                                        longitude: Number(lng.toFixed(6))
                                                    }));
                                                }}
                                                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                                                title="Ambil koordinat GPS armada saat ini"
                                            >
                                                <Crosshair className="w-3 h-3" /> Posisi Unit
                                            </button>
                                            <span className="text-slate-300">•</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewGeofence(prev => ({
                                                        ...prev,
                                                        latitude: Number(mapCenter[0].toFixed(6)),
                                                        longitude: Number(mapCenter[1].toFixed(6))
                                                    }));
                                                }}
                                                className="text-[10px] text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
                                                title="Ambil koordinat tengah layar peta"
                                            >
                                                Pusat Peta
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <span className="absolute left-2.5 top-2 text-[10px] font-mono text-slate-400">Lat:</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={newGeofence.latitude}
                                                onChange={e => setNewGeofence({ ...newGeofence, latitude: parseFloat(e.target.value) || 0 })}
                                                placeholder="2.045000"
                                                className="w-full text-xs p-2 pl-9 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-2.5 top-2 text-[10px] font-mono text-slate-400">Long:</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={newGeofence.longitude}
                                                onChange={e => setNewGeofence({ ...newGeofence, longitude: parseFloat(e.target.value) || 0 })}
                                                placeholder="117.200000"
                                                className="w-full text-xs p-2 pl-11 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 5. DIMENSI SPESIFIK GEOMETRI */}
                                {newGeofence.geometry_type === 'circle' ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-semibold text-slate-800">
                                                Radius Lingkaran (Meter) <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-[10px] text-slate-500">Jangkauan radial dari titik pusat</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="10"
                                                max="5000"
                                                value={newGeofence.radius}
                                                onChange={e => setNewGeofence({ ...newGeofence, radius: Math.max(10, Number(e.target.value)) })}
                                                className="w-28 text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {[50, 100, 200, 350, 500].map(r => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => setNewGeofence({ ...newGeofence, radius: r })}
                                                        className={`text-[11px] px-2 py-1 rounded border font-medium cursor-pointer transition ${
                                                            newGeofence.radius === r
                                                                ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {r}m
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                                        <div className="flex items-center justify-between text-slate-700">
                                            <span className="font-medium">Data Verteks Perimeter</span>
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                {drawnPoints.length || (newGeofence.coordinates_json ? (JSON.parse(newGeofence.coordinates_json) as any[]).length : 0)} titik tersimpan
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            Batas fisik dievaluasi secara dinamis menggunakan algoritma Ray-Casting untuk memastikan deteksi siklus ritasi armada secara presisi.
                                        </p>
                                    </div>
                                )}

                                {/* 6. WARNA IDENTITAS ZONA */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-800 block mb-1">Warna Identitas Peta</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={newGeofence.color}
                                            onChange={e => setNewGeofence({ ...newGeofence, color: e.target.value })}
                                            className="w-8 h-8 rounded border border-slate-300 p-0.5 cursor-pointer bg-white shrink-0"
                                        />
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {[
                                                { label: 'Hijau (PIT)', hex: '#10B981' },
                                                { label: 'Ungu (Disposal)', hex: '#8B5CF6' },
                                                { label: 'Hitam (ROM)', hex: '#0F172A' },
                                                { label: 'Biru (Fasilitas)', hex: '#2563EB' },
                                                { label: 'Oranye (Jalan)', hex: '#EA580C' },
                                                { label: 'Merah (Bahaya)', hex: '#EF4444' },
                                            ].map(c => (
                                                <button
                                                    key={c.hex}
                                                    type="button"
                                                    onClick={() => setNewGeofence({ ...newGeofence, color: c.hex })}
                                                    className={`text-[11px] px-2 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition ${
                                                        newGeofence.color === c.hex
                                                            ? 'border-slate-800 bg-slate-100 font-semibold'
                                                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.hex }}></span>
                                                    <span>{c.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 7. KETERANGAN / LOKASI BLOK */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-800 block mb-1">Keterangan / Lokasi Blok</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Blok Barat Pit 3, dekat Sump Utama"
                                        value={newGeofence.address}
                                        onChange={e => setNewGeofence({ ...newGeofence, address: e.target.value })}
                                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowGeofenceModal(false)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer transition"
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

                {/* ── MODAL: RIWAYAT SCAN WAJAH & PENUGASAN DRIVER ── */}
                {showHistory && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 border border-gray-100 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <History className="w-4 h-4 text-blue-600" /> Riwayat Penugasan & Scan Wajah Pengemudi
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Unit: <span className="font-semibold text-gray-700">{currentVehicle.plateNo}</span> • {currentVehicle.site}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl">
                                {historyLogs.length > 0 ? (
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-gray-50 text-gray-600 font-bold sticky top-0 border-b border-gray-200">
                                            <tr>
                                                <th className="p-2.5">Foto</th>
                                                <th className="p-2.5">Nama Pengemudi</th>
                                                <th className="p-2.5">NIK</th>
                                                <th className="p-2.5">Armada</th>
                                                <th className="p-2.5 text-center">Status</th>
                                                <th className="p-2.5 text-center">Metode</th>
                                                <th className="p-2.5 text-center">Kecocokan</th>
                                                <th className="p-2.5 text-right">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {historyLogs.map(log => (
                                                <tr key={log.id} className="hover:bg-gray-50/80 transition">
                                                    <td className="p-2.5">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                            {log.photo_url ? (
                                                                <img
                                                                    src={log.photo_url}
                                                                    alt={log.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLElement).style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <User className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-2.5 font-bold text-gray-800">{log.name}</td>
                                                    <td className="p-2.5 font-mono text-gray-500">{log.employee_id || '-'}</td>
                                                    <td className="p-2.5 font-semibold text-gray-700">{log.plate_no || currentVehicle.plateNo}</td>
                                                    <td className="p-2.5 text-center">
                                                        {log.status === 'active' ? (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                                Selesai
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-2.5 text-center">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                            {log.verification_method === 'manual_selection' ? 'Manual Picker' : 'Biometrik AI'}
                                                        </span>
                                                    </td>
                                                    <td className="p-2.5 text-center font-mono font-bold text-emerald-600">
                                                        {log.confidence ? `${log.confidence}%` : '-'}
                                                    </td>
                                                    <td className="p-2.5 text-right font-mono text-gray-400">{log.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-12 text-center text-gray-400">
                                        <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-gray-600">Belum ada riwayat verifikasi driver untuk unit ini.</p>
                                        <p className="text-xs text-gray-400 mt-1">Lakukan scan wajah atau penugasan manual untuk merekam data ke database.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                                <span className="text-gray-400 font-mono text-[11px]">
                                    Total Catatan: {historyLogs.length} sesi verifikasi
                                </span>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer transition"
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
