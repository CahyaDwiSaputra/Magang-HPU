import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import LayoutNavbar from '@/components/layout-navbar';
import { Map, Marker, Overlay, GeoJson } from 'pigeon-maps';
import {
    Building2,
    Navigation,
    Search,
    Truck,
    Microchip,
    Fuel,
    Gauge,
    Clock,
    Hourglass,
    Activity,
    MapPin,
    User,
    Phone,
    Layers,
    ZoomIn,
    ZoomOut,
    Crosshair,
    Radio,
    Circle,
    Flag,
    CheckCircle2,
    RotateCcw,
    ShieldCheck,
    AlertTriangle,
    Compass
} from 'lucide-react';
import { HPU_FLEET } from '../dashcam/index';

// Tipe data Armada GPS Tracking (Slide 19, 28, 29)
export type GpsVehicle = {
    id: string;
    unitCode: string;
    plateNo: string;
    deviceNo: string;
    category: 'MAIN' | 'GENERAL';
    type: 'HD' | 'EXCA' | 'DT' | 'WT' | 'FT' | 'LT';
    model: string;
    site: 'HPA' | 'BDA';
    status: 'TRAVEL_ISI' | 'TRAVEL_KOSONG' | 'WORKING' | 'IDLING' | 'STANDBY' | 'BREAKDOWN';
    dashcam_status?: 'AVAILABLE' | 'LOST_CONNECTION' | 'NOT_AVAILABLE';
    dashcam_status_label?: string;
    has_dashcam?: boolean;
    speed?: number;
    last_seen?: string | null;
    operator: {
        name: string;
        nik: string;
        phone: string;
        rating?: number;
        simperType: string;
        safetyScore: number;
        shift: string;
    };
    telemetry: {
        speed: number;
        fuelCons: number;
        cycleTimeMinutes: number;
        hourMeter: number;
        tripProgress: number;
        totalRit: number;
        loadType: 'OB' | 'COAL';
        startTime: string;
        currentStatusText: string;
        latitude: number;
        longitude: number;
    };
};

const OPERATOR_POOL = [
    { name: 'TAUFIQ RAHMAN', nik: '90012030', phone: '+62 812-5432-8901' },
    { name: 'BAMBANG HERMANTO', nik: '90011842', phone: '+62 813-8821-4470' },
    { name: 'SANDI SETIAWAN', nik: '90013319', phone: '+62 821-9901-2345' },
    { name: 'AGUS PRASETYO', nik: '90014022', phone: '+62 852-7712-3344' },
    { name: 'DWI CAHYONO', nik: '90015501', phone: '+62 811-5502-1234' },
    { name: 'BUDI SANTOSO', nik: '90016210', phone: '+62 812-4411-9023' },
    { name: 'SLAMET RIYADI', nik: '90017188', phone: '+62 813-5522-8190' },
    { name: 'HENDRA KURNIAWAN', nik: '90018092', phone: '+62 821-3344-7712' },
    { name: 'RIZKY PRATAMA', nik: '90019201', phone: '+62 852-6677-1122' },
    { name: 'WAHYU HIDAYAT', nik: '90020114', phone: '+62 811-7788-9900' },
    { name: 'EKO PRASETYO', nik: '90021305', phone: '+62 812-9900-1133' },
    { name: 'AHMAD FAUZI', nik: '90022419', phone: '+62 813-1122-3344' },
    { name: 'DEDI SURYADI', nik: '90023520', phone: '+62 821-4455-6677' },
    { name: 'RUDI HERMAWAN', nik: '90024631', phone: '+62 852-8899-0011' },
    { name: 'YUDI KUSUMA', nik: '90025742', phone: '+62 811-2233-4455' },
];

export const mapCmsVehicleToGpsVehicle = (cv: any): GpsVehicle => {
    const isExca = cv.type === 'EXCA' || cv.id.startsWith('EX') || (cv.model && cv.model.toUpperCase().includes('PC'));
    const isHd = cv.type === 'HD' || cv.id.startsWith('HD') || (cv.model && (cv.model.includes('777') || cv.model.includes('785')));
    const isMain = isExca || isHd || (cv.model && (cv.model.includes('P460') || cv.model.includes('Hauler') || cv.model.includes('RU-') || cv.type === 'DT'));
    
    let status: GpsVehicle['status'] = 'STANDBY';
    if (cv.dashcam_status === 'AVAILABLE' || cv.status === 'ONLINE') {
        if ((cv.speed || 0) > 0) {
            status = 'TRAVEL_ISI';
        } else {
            status = isExca ? 'WORKING' : 'TRAVEL_KOSONG';
        }
    } else if (cv.dashcam_status === 'LOST_CONNECTION') {
        status = 'IDLING';
    } else {
        status = 'STANDBY';
    }

    const site = (cv.site || 'HPA').toUpperCase().includes('BDA') ? 'BDA' : 'HPA';
    const devNum = parseInt(String(cv.deviceNo || '').slice(-4) || '1000', 10);
    const op = OPERATOR_POOL[devNum % OPERATOR_POOL.length];

    const lat = (typeof cv.latitude === 'number' && !isNaN(cv.latitude) && cv.latitude !== 0) 
        ? cv.latitude 
        : (site === 'BDA' ? -1.135000 + ((devNum % 30) - 15) * 0.001 : 2.052100 + ((devNum % 30) - 15) * 0.001);
    const lng = (typeof cv.longitude === 'number' && !isNaN(cv.longitude) && cv.longitude !== 0) 
        ? cv.longitude 
        : (site === 'BDA' ? 114.920000 + ((devNum % 30) - 15) * 0.001 : 117.214500 + ((devNum % 30) - 15) * 0.001);

    const speed = cv.speed !== undefined ? cv.speed : 0;
    const model = cv.model || 'Dump Truck Hauling';
    const simper = isExca ? 'SIMPER B2 Alat Berat (PC2000)' : (isHd ? 'SIMPER B2 Umum (CAT 777)' : `SIMPER B2 Umum (${model})`);

    return {
        id: cv.id,
        unitCode: cv.id,
        plateNo: cv.plateNo || cv.id,
        deviceNo: cv.deviceNo || '',
        category: isMain ? 'MAIN' : 'GENERAL',
        type: isExca ? 'EXCA' : (isHd ? 'HD' : (cv.type || 'DT')),
        model: model,
        site: site as 'HPA' | 'BDA',
        status: status,
        dashcam_status: cv.dashcam_status,
        dashcam_status_label: cv.dashcam_status_label,
        has_dashcam: cv.has_dashcam,
        speed: speed,
        last_seen: cv.last_seen,
        operator: {
            name: op.name,
            nik: op.nik,
            phone: op.phone,
            simperType: simper,
            safetyScore: 100,
            shift: 'Shift 1 Siang (06:00 - 18:00 WITA)'
        },
        telemetry: {
            speed: speed,
            fuelCons: Math.round((35 + (devNum % 35)) * 10) / 10,
            cycleTimeMinutes: Math.round((20 + (devNum % 15)) * 10) / 10,
            hourMeter: Math.round((4500 + (devNum * 4.2)) * 10) / 10,
            tripProgress: speed > 0 ? (35 + (devNum % 45)) : 0,
            totalRit: 12 + (devNum % 16),
            loadType: (cv.id.includes('COAL') || (devNum % 3 === 0)) ? 'COAL' : 'OB',
            startTime: '06:00 WITA',
            currentStatusText: speed > 0 
                ? `Hauling di Koridor ${site} (Kecepatan ${speed} km/j)` 
                : (cv.dashcam_status === 'AVAILABLE' ? `Operasional Aktif di Pit ${site}` : (cv.dashcam_status === 'LOST_CONNECTION' ? `Lost Connection di Area ${site}` : `Standby di Pool ${site}`)),
            latitude: lat,
            longitude: lng,
        }
    };
};

// Master Fleet data berdasar seluruh unit armada CMSV6 terdaftar
const FLEET_DATA: GpsVehicle[] = HPU_FLEET.map(mapCmsVehicleToGpsVehicle);

// Checkpoint KM Hauling (STA) per Standar Stasioning Tambang HPU
const CHECKPOINTS_HPA = [
    { label: 'KM 13', sta: 'STA 13+000', lat: 2.058000, lng: 117.218000 },
    { label: 'KM 14', sta: 'STA 14+000', lat: 2.068000, lng: 117.228000 },
    { label: 'KM 15', sta: 'STA 15+000', lat: 2.079000, lng: 117.239000 },
    { label: 'KM 16', sta: 'STA 16+000', lat: 2.091000, lng: 117.251000 }
];

// Badge status visual berdasar Standar Enterprise Mining Dispatch (Refined Anti-Slop)
const getStatusBadge = (status: GpsVehicle['status']) => {
    switch (status) {
        case 'TRAVEL_ISI':
            return {
                bg: 'bg-blue-50 text-blue-700 border border-blue-200/90',
                border: 'border-blue-300',
                dot: 'bg-blue-600',
                label: 'TRAVEL ISI'
            };
        case 'TRAVEL_KOSONG':
            return {
                bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
                border: 'border-emerald-300',
                dot: 'bg-emerald-600',
                label: 'TRAVEL KOSONG'
            };
        case 'WORKING':
            return {
                bg: 'bg-teal-50 text-teal-700 border border-teal-200/90',
                border: 'border-teal-300',
                dot: 'bg-teal-600',
                label: 'WORKING'
            };
        case 'IDLING':
            return {
                bg: 'bg-amber-50 text-amber-800 border border-amber-200/90',
                border: 'border-amber-300',
                dot: 'bg-amber-500',
                label: 'IDLING'
            };
        case 'STANDBY':
            return {
                bg: 'bg-slate-100 text-slate-700 border border-slate-200',
                border: 'border-slate-300',
                dot: 'bg-slate-400',
                label: 'STANDBY'
            };
        case 'BREAKDOWN':
            return {
                bg: 'bg-rose-50 text-rose-700 border border-rose-200/90',
                border: 'border-rose-300',
                dot: 'bg-rose-600',
                label: 'BREAKDOWN'
            };
        default:
            return {
                bg: 'bg-slate-100 text-slate-600 border border-slate-200',
                border: 'border-slate-300',
                dot: 'bg-slate-400',
                label: 'OFFLINE'
            };
    }
};

export default function GpsTrackingPage() {
    const [selectedSite, setSelectedSite] = useState<'ALL' | 'HPA' | 'BDA'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'LOST_CONNECTION' | 'NOT_AVAILABLE'>('ALL');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'MAIN' | 'GENERAL'>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('HPA-DT47103VV');
    const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
    const [mapZoom, setMapZoom] = useState<number>(14);
    const [haulingRoutes, setHaulingRoutes] = useState<any>(null);
    const [geofences, setGeofences] = useState<any[]>([]);
    const [operationalPolygons, setOperationalPolygons] = useState<any>(null);
    const [showGeofences, setShowGeofences] = useState<boolean>(true);
    const [fleet, setFleet] = useState<GpsVehicle[]>(FLEET_DATA);

    // Ambil data armada lengkap & status real-time langsung dari server CMSV6 HPU (10.10.0.33)
    useEffect(() => {
        fetch('/api/cmsv6/vehicles')
            .then(res => res.json())
            .then(data => {
                if (data.result === 0 && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
                    const mapped = data.vehicles.map(mapCmsVehicleToGpsVehicle);
                    setFleet(mapped);

                    const onlineUnit = mapped.find((u: GpsVehicle) => u.dashcam_status === 'AVAILABLE' && u.plateNo.startsWith('HPA'))
                                    || mapped.find((u: GpsVehicle) => u.dashcam_status === 'AVAILABLE')
                                    || mapped[0];
                    if (onlineUnit) {
                        setSelectedVehicleId(prev => {
                            const cur = mapped.find((u: GpsVehicle) => u.id === prev);
                            return (cur && cur.dashcam_status === 'AVAILABLE') ? prev : onlineUnit.id;
                        });
                    }
                }
            })
            .catch(() => {});
    }, []);

    const statusCounts = useMemo(() => {
        const avail = fleet.filter(v => v.dashcam_status === 'AVAILABLE').length;
        const lost = fleet.filter(v => v.dashcam_status === 'LOST_CONNECTION').length;
        const notAvail = fleet.filter(v => v.dashcam_status === 'NOT_AVAILABLE').length;
        return { avail, lost, notAvail };
    }, [fleet]);

    // Ambil data unit aktif yang dipilih
    const selectedUnit = useMemo(() => {
        return fleet.find(u => u.id === selectedVehicleId) || fleet[0];
    }, [fleet, selectedVehicleId]);

    // Viewport peta mengikuti unit yang dipilih
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        selectedUnit.telemetry.latitude,
        selectedUnit.telemetry.longitude
    ]);

    useEffect(() => {
        setMapCenter([selectedUnit.telemetry.latitude, selectedUnit.telemetry.longitude]);
    }, [selectedUnit]);

    // Fetch rute hauling polyline & seluruh master geofence tambang
    useEffect(() => {
        fetch('/api/dashcam/hauling-routes')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.data) {
                    setHaulingRoutes(data.data);
                }
            })
            .catch(err => console.error('Error fetching hauling routes:', err));

        fetch('/api/dashcam/geofences?category=operational')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && Array.isArray(data.data)) {
                    setGeofences(data.data);
                }
            })
            .catch(err => console.error('Error fetching geofences:', err));

        fetch('/api/dashcam/geofences-geojson')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.data) {
                    setOperationalPolygons(data.data);
                }
            })
            .catch(err => console.error('Error fetching operational polygons:', err));
    }, []);

    // Filter geofences fasilitas tambang (Pit, Disposal, Stockpile, Workshop) berdasarkan site
    const operationalGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type === 'road') return false;
            if (selectedSite !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSite) return false;
            return true;
        });
    }, [geofences, selectedSite]);

    // Sinkronisasi fokus peta saat pemilihan site konsesi berubah
    useEffect(() => {
        if (selectedSite !== 'ALL') {
            const firstUnit = fleet.find(u => u.site === selectedSite);
            if (firstUnit) {
                setSelectedVehicleId(firstUnit.id);
                setMapCenter([firstUnit.telemetry.latitude, firstUnit.telemetry.longitude]);
            } else if (selectedSite === 'BDA') {
                setMapCenter([-1.119625, 115.020731]);
            } else if (selectedSite === 'HPA') {
                setMapCenter([2.045000, 117.200000]);
            }
        }
    }, [selectedSite, fleet]);

    // Filter armada berdasarkan Site, Status Ketersediaan, Tipe, dan Query Pencarian
    const filteredFleet = useMemo(() => {
        return fleet.filter(unit => {
            if (selectedSite !== 'ALL' && unit.site !== selectedSite) return false;
            if (statusFilter !== 'ALL' && unit.dashcam_status !== statusFilter) return false;
            if (typeFilter !== 'ALL' && unit.category !== typeFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = unit.unitCode.toLowerCase().includes(q) || unit.plateNo.toLowerCase().includes(q);
                const matchOp = unit.operator.name.toLowerCase().includes(q) || unit.operator.nik.includes(q);
                const matchModel = unit.model.toLowerCase().includes(q);
                const matchDev = unit.deviceNo.includes(q);
                return matchName || matchOp || matchModel || matchDev;
            }
            return true;
        });
    }, [fleet, selectedSite, statusFilter, typeFilter, searchQuery]);

    const mainUnits = useMemo(() => filteredFleet.filter(u => u.category === 'MAIN'), [filteredFleet]);
    const generalUnits = useMemo(() => filteredFleet.filter(u => u.category === 'GENERAL'), [filteredFleet]);

    const mapTileProvider = (x: number, y: number, z: number) => {
        if (mapLayer === 'satellite') {
            return `https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;
        }
        return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    };

    return (
        <LayoutNavbar
            containerClassName="w-full max-w-[98%] 2xl:max-w-[1920px]"
            className="!bg-slate-100/70 rounded-2xl shadow-xl border border-slate-200/80 p-3.5 md:p-5"
        >
            <Head title="GPS Tracking - Telemetri, Armada & Hauling | PT Harmoni Panca Utama" />

            <div className="space-y-4">
                {/* ── TOP HEADER (BERSIH, PUTIH & SELARAS SISTEM SMART FLEET) ── */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                            <Navigation className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                                    FLEET CYCLE DISPATCH
                                </h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live Telemetry
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                Pemantauan spasial pergerakan armada, estimasi siklus ritasi, dan koridor hauling 94.5 KM PT Harmoni Panca Utama
                            </p>
                        </div>
                    </div>

                    {/* Quick Site Switcher Dropdown (Poin Revisi Pembimbing: >12 Site) */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-xs">
                            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                                Konsesi / Site:
                            </span>
                            <select
                                value={selectedSite}
                                onChange={(e) => setSelectedSite(e.target.value)}
                                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs min-w-[210px]"
                                title="Pilih Site Konsesi Tambang PT HPU"
                            >
                                    <option value="ALL">Semua Site (ALL HPU)</option>
                                    <option value="HPA">Site HPA (Berau)</option>
                                    <option value="BDA">Site BDA (Barito)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── MAIN GRID LAYOUT (SLIDE 19 MOCKUP STRUCTURE) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* ── LEFT COLUMN: FLEET & ASSET DIRECTORY (ARMADA) ── */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                                            Armada Tambang
                                        </h3>
                                        <p className="text-[11px] text-gray-400">Total {fleet.length} Unit Terdaftar</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono">
                                    {filteredFleet.length} Unit Aktif
                                </span>
                            </div>

                            {/* Search Input Box */}
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari nopol, device, model..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-8 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* Status Ketersediaan / Dashcam Readiness Filters (Persis Dashcam!) */}
                            <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('ALL')}
                                    className={`py-1 px-2 rounded-lg text-center transition cursor-pointer flex items-center justify-between border ${
                                        statusFilter === 'ALL'
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>Semua Unit</span>
                                    <span className="font-mono">{fleet.length}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('AVAILABLE')}
                                    className={`py-1 px-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-between border ${
                                        statusFilter === 'AVAILABLE'
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Live Siap
                                    </span>
                                    <span className="font-mono">{statusCounts.avail}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('LOST_CONNECTION')}
                                    className={`py-1 px-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-between border ${
                                        statusFilter === 'LOST_CONNECTION'
                                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                        Lost Conn
                                    </span>
                                    <span className="font-mono">{statusCounts.lost}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('NOT_AVAILABLE')}
                                    className={`py-1 px-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-between border ${
                                        statusFilter === 'NOT_AVAILABLE'
                                            ? 'bg-slate-600 text-white border-slate-600 shadow-xs'
                                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    <span>Non-Dashcam</span>
                                    <span className="font-mono">{statusCounts.notAvail}</span>
                                </button>
                            </div>

                            {/* Type Filter Tabs */}
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-medium">
                                <button
                                    type="button"
                                    onClick={() => setTypeFilter('ALL')}
                                    className={`flex-1 py-1 rounded text-center transition cursor-pointer text-xs ${
                                        typeFilter === 'ALL'
                                            ? 'bg-white text-gray-900 shadow-xs font-bold'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTypeFilter('MAIN')}
                                    className={`flex-1 py-1 rounded text-center transition cursor-pointer text-xs ${
                                        typeFilter === 'MAIN'
                                            ? 'bg-white text-gray-900 shadow-xs font-bold'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Main Unit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTypeFilter('GENERAL')}
                                    className={`flex-1 py-1 rounded text-center transition cursor-pointer text-xs ${
                                        typeFilter === 'GENERAL'
                                            ? 'bg-white text-gray-900 shadow-xs font-bold'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Support
                                </button>
                            </div>

                            {/* Equipment List (Sama Persis dengan Dashcam) */}
                            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                                {filteredFleet.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-gray-400">
                                        Tidak ada unit armada yang cocok dengan filter pencarian.
                                    </div>
                                ) : (
                                    filteredFleet.map(unit => {
                                        const badge = getStatusBadge(unit.status);
                                        const isSelected = unit.id === selectedVehicleId;
                                        return (
                                            <div
                                                key={unit.id}
                                                onClick={() => setSelectedVehicleId(unit.id)}
                                                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                                    isSelected
                                                        ? 'bg-blue-50/90 border-blue-400 shadow-xs ring-1 ring-blue-400'
                                                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                        isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                                                    }`}>
                                                        {unit.type === 'EXCA' ? (
                                                            <Activity className="w-4 h-4" />
                                                        ) : (
                                                            <Truck className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                                                            <span>{unit.plateNo}</span>
                                                            {unit.site && (
                                                                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                                                                    {unit.site}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5 font-mono">
                                                            <span>Dev: {unit.deviceNo}</span>
                                                            {unit.telemetry.speed > 0 && (
                                                                <span className="text-blue-600 font-bold">• {unit.telemetry.speed} km/j</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                                        unit.dashcam_status === 'AVAILABLE' ? 'bg-emerald-500 shadow-xs animate-pulse' :
                                                        unit.dashcam_status === 'LOST_CONNECTION' ? 'bg-rose-500' : 'bg-slate-300'
                                                    }`} title={unit.dashcam_status_label || badge.label}></span>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1 ${badge.bg}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: MAP, OPERATOR DETAIL, CURRENT TRIP & TELEMETRI ── */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                        {/* Row 1: Interactive Hauling Tracking Map - Peta Diperbesar (Permintaan Pembimbing) */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                                        PETA MONITORING KORIDOR HAULING & ARMADA (LIVE TRACKING)
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                        [{mapCenter[0].toFixed(6)}, {mapCenter[1].toFixed(6)}]
                                    </span>
                                </div>

                                {/* Map Controls */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Toggle Layer Geofence Tambang (Permintaan Pak Taufiq: Semua Geofence Ditampilkan) */}
                                    <button
                                        type="button"
                                        onClick={() => setShowGeofences(!showGeofences)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                            showGeofences
                                                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                                                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                                        }`}
                                        title="Tampilkan / Sembunyikan Poligon & Titik Geofence Tambang"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>Geofence ({operationalGeofences.length} Zona)</span>
                                    </button>

                                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setMapLayer('satellite')}
                                            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                                mapLayer === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                                            }`}
                                        >
                                            Satelit Google Earth
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMapLayer('street')}
                                            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                                mapLayer === 'street' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                                            }`}
                                        >
                                            Peta Jalan
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setMapZoom(z => Math.min(z + 1, 18))}
                                            className="p-1 text-slate-700 hover:bg-white rounded transition-colors"
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMapZoom(z => Math.max(z - 1, 8))}
                                            className="p-1 text-slate-700 hover:bg-white rounded transition-colors"
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMapCenter([selectedUnit.telemetry.latitude, selectedUnit.telemetry.longitude])}
                                            className="p-1 text-blue-600 hover:bg-white rounded transition-colors"
                                            title="Pusatkan ke Armada Terpilih"
                                        >
                                            <Crosshair className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Canvas Map Container */}
                            <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                                <Map
                                    height={520}
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    onBoundsChanged={({ center, zoom }) => {
                                        setMapCenter(center);
                                        setMapZoom(zoom);
                                    }}
                                    provider={mapTileProvider}
                                >
                                    {/* Polyline Rute Hauling Tambang */}
                                    {haulingRoutes && (
                                        <GeoJson
                                            data={haulingRoutes}
                                            styleCallback={(feature: any) => {
                                                const site = feature?.properties?.site || 'HPA';
                                                return {
                                                    stroke: site === 'BDA' ? '#D97706' : '#2563EB',
                                                    strokeWidth: 4,
                                                    strokeOpacity: 0.85,
                                                    fill: 'none'
                                                };
                                            }}
                                        />
                                    )}

                                    {/* Layer Poligon Fasilitas Geofence Operasional (Pit, Disposal, Stockpile, Workshop) */}
                                    {showGeofences && operationalPolygons && (
                                        <GeoJson
                                            data={operationalPolygons}
                                            styleCallback={(feature: any) => {
                                                const featSite = (feature.properties?.site || 'HPA').toUpperCase();
                                                if (selectedSite !== 'ALL' && featSite !== selectedSite) {
                                                    return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                                }

                                                const color = feature.properties?.color || '#2563EB';
                                                return {
                                                    fill: color,
                                                    fillOpacity: 0.22,
                                                    stroke: color,
                                                    strokeWidth: 2,
                                                    strokeDasharray: '4 3',
                                                };
                                            }}
                                        />
                                    )}

                                    {/* Checkpoint STA / KM Markers (Patok Stasioning Hauling) */}
                                    {CHECKPOINTS_HPA.map((cp, idx) => (
                                        <Overlay key={`cp-${idx}`} anchor={[cp.lat, cp.lng]} offset={[30, 14]}>
                                            <div className="bg-white/95 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-300 shadow-md flex items-center gap-1.5 backdrop-blur-xs select-none pointer-events-none">
                                                <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100 shrink-0"></span>
                                                <span className="font-mono tracking-tight text-slate-900 font-bold">{cp.label}</span>
                                                <span className="text-[9px] text-slate-400 font-mono font-medium border-l border-slate-200 pl-1.5">
                                                    {cp.sta}
                                                </span>
                                            </div>
                                        </Overlay>
                                    ))}

                                    {/* Pin & Label Geofence Fasilitas Tambang (Semua Geofence yang Dibuat - Permintaan Pak Taufiq) */}
                                    {showGeofences && operationalGeofences.map(gf => {
                                        const lat = Number(gf.latitude);
                                        const lng = Number(gf.longitude);
                                        if (isNaN(lat) || isNaN(lng)) return null;

                                        return (
                                            <Overlay key={`gf-${gf.id}`} anchor={[lat, lng]} offset={[0, 0]}>
                                                <div className="relative group -translate-x-1/2 -translate-y-1/2 pointer-events-auto select-none">
                                                    <div
                                                        onClick={() => {
                                                            setMapCenter([lat, lng]);
                                                            setMapZoom(16);
                                                        }}
                                                        className="px-2 py-0.5 rounded-lg border backdrop-blur-md text-[10px] font-bold shadow-md flex items-center gap-1.5 bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-50 cursor-pointer transition-transform hover:scale-105"
                                                        title={`${gf.name} (${gf.type} • Radius ${gf.radius}m)`}
                                                    >
                                                        <span
                                                            className="w-2 h-2 rounded-full shrink-0"
                                                            style={{ backgroundColor: gf.color || '#2563EB' }}
                                                        ></span>
                                                        <span className="truncate max-w-[130px]">
                                                            {gf.name}
                                                        </span>
                                                        {gf.material && (
                                                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                                                                {gf.material}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Overlay>
                                        );
                                    })}

                                    {/* Plot Posisi Seluruh Armada Aktif */}
                                    {filteredFleet.map(unit => {
                                        const isSelected = unit.id === selectedVehicleId;
                                        const badge = getStatusBadge(unit.status);
                                        return (
                                            <Overlay
                                                key={`marker-${unit.id}`}
                                                anchor={[unit.telemetry.latitude, unit.telemetry.longitude]}
                                                offset={[45, 20]}
                                            >
                                                <div
                                                    onClick={() => setSelectedVehicleId(unit.id)}
                                                    className={`cursor-pointer transition-all transform hover:scale-110 flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border text-xs font-bold ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white border-white ring-2 ring-blue-400'
                                                            : 'bg-white text-slate-800 border-slate-300'
                                                    }`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        unit.status === 'TRAVEL_ISI' ? 'bg-blue-500' :
                                                        unit.status === 'TRAVEL_KOSONG' || unit.status === 'WORKING' ? 'bg-emerald-500' :
                                                        unit.status === 'IDLING' ? 'bg-amber-400' : 'bg-slate-400'
                                                    }`}></span>
                                                    <span className="font-mono">{unit.unitCode}</span>
                                                    {isSelected && (
                                                        <span className="text-[9px] bg-white text-blue-700 px-1 rounded font-sans">
                                                            {unit.telemetry.speed} km/j
                                                        </span>
                                                    )}
                                                </div>
                                            </Overlay>
                                        );
                                    })}
                                </Map>
                            </div>
                        </div>

                        {/* Row 2: Operator Detail & Current Trip - Dipindah ke Bawah Peta (Permintaan Pembimbing) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card A: Operator Detail Card */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                                        <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1.5 uppercase">
                                            <User className="w-3.5 h-3.5 text-blue-600" />
                                            OPERATOR DETAIL
                                        </span>
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            AKTIF MENUGAS
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-3.5">
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <div>
                                                <div className="text-base font-bold text-slate-900 truncate">
                                                    {selectedUnit.operator.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                    <span className="font-mono font-semibold">NIK: {selectedUnit.operator.nik}</span>
                                                    <span>•</span>
                                                    <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded border border-slate-200/80">
                                                        {selectedUnit.plateNo}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Kredensial Resmi Tambang (Menggantikan Star Rating B2C) */}
                                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                                                    {selectedUnit.operator.simperType || 'SIMPER B2 Umum (Aktif)'}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    Safety: {selectedUnit.operator.safetyScore ?? 100}% (Zero LTI)
                                                </span>
                                            </div>

                                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{selectedUnit.operator.shift}</span>
                                            </div>
                                        </div>

                                        {/* Foto Profil / ID Badge Operator (Bersih, Selaras Light Mode, Bebas Kotak Hitam "DRIVER") */}
                                        <div className="w-20 h-24 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col items-center justify-between p-1.5 shrink-0 shadow-xs">
                                            <div className="w-full flex-1 rounded-lg bg-white border border-slate-200/80 flex flex-col items-center justify-center relative overflow-hidden group">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 font-bold font-mono text-sm shadow-2xs">
                                                    {selectedUnit.operator.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                                            </div>
                                            <div className="w-full text-center pt-1 border-t border-slate-100">
                                                <span className="block text-[8px] font-mono font-bold text-slate-500 tracking-wider uppercase">
                                                    HPU OPERATOR
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                                        {selectedUnit.operator.phone}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                        Site {selectedUnit.site} Tambang
                                    </span>
                                </div>
                            </div>

                            {/* Card B: Current Trip Card (Slide 19 + Poin 10: Waktu Start & Stop + Poin 14: Tanggal & Shift) */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1.5 uppercase">
                                                <Activity className="w-3.5 h-3.5 text-blue-600" />
                                                CURRENT TRIP & HAULING
                                            </span>
                                            {/* Poin 14: Penanda Tanggal & Shift Operasional pada Tampilan Ritase */}
                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} • Shift 1 Siang
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                                                <Flag className="w-3 h-3 text-blue-600" />
                                                {selectedUnit.telemetry.totalRit} RIT SELESAI
                                            </span>
                                            <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Target: 30 RIT / Shift</span>
                                        </div>
                                    </div>

                                    {/* Poin 10: Informasi Waktu Start & Waktu Stop pada Equipment */}
                                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                WAKTU START
                                            </span>
                                            <div className="text-xs font-bold text-emerald-700 mt-0.5 font-mono">
                                                {selectedUnit.telemetry.startTime || '06:00 WITA'}
                                            </div>
                                            <div className="text-[9px] text-slate-400 font-medium">
                                                Mulai Operasi
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                WAKTU STOP
                                            </span>
                                            <div className="text-xs font-bold text-rose-700 mt-0.5 font-mono">
                                                18:00 WITA
                                            </div>
                                            <div className="text-[9px] text-slate-400 font-medium">
                                                Selesai Shift
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                MUATAN
                                            </span>
                                            <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1 truncate">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                    selectedUnit.telemetry.loadType === 'COAL' ? 'bg-slate-900' : 'bg-amber-600'
                                                }`}></span>
                                                <span className="truncate">{selectedUnit.telemetry.loadType === 'COAL' ? 'COAL' : 'OB'}</span>
                                            </div>
                                            <div className="text-[9px] text-slate-400 font-medium truncate">
                                                22 BCM Full
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-2.5 flex items-center justify-between text-xs font-medium text-blue-900">
                                    <div className="flex items-center gap-2 truncate">
                                        <Flag className="w-4 h-4 text-blue-600 shrink-0" />
                                        <span className="truncate">{selectedUnit.telemetry.currentStatusText}</span>
                                    </div>
                                    <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 shrink-0">
                                        {selectedUnit.telemetry.tripProgress}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Summary Telemetri Armada (4 Metric Cards per Slide 19 Mockup) */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1.5 uppercase">
                                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                                    TELEMETRI SUMMARY • {selectedUnit.plateNo}
                                </span>
                                <span className="text-xs font-bold text-slate-500 font-mono">
                                    Device: {selectedUnit.deviceNo}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {/* Metric 1: Fuel Consumption */}
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <Fuel className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Fuel Cons
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-extrabold text-slate-900">
                                            {selectedUnit.telemetry.fuelCons}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">Liter</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Konsumsi Bahan Bakar</p>
                                </div>

                                {/* Metric 2: Current Speed */}
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <Gauge className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Kecepatan
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-extrabold text-slate-900">
                                            {selectedUnit.telemetry.speed}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">km/jam</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Batas Site: {selectedUnit.site === 'HPA' ? '60' : '50'} km/j</p>
                                </div>

                                {/* Metric 3: Cycle Time */}
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Cycle Time
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-extrabold text-slate-900">
                                            {selectedUnit.telemetry.cycleTimeMinutes}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">menit</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Rata-rata 1 Siklus Ritasi</p>
                                </div>

                                {/* Metric 4: Hour Meter */}
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 hover:bg-white hover:shadow-xs transition-all">
                                    <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                            <Hourglass className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Hour Meter
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-extrabold text-slate-900">
                                            {selectedUnit.telemetry.hourMeter.toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">HM</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Total Jam Operasional</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutNavbar>
    );
}
