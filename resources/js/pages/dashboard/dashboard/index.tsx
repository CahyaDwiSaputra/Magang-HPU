import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import LayoutNavbar from '@/components/layout-navbar';
import { Map, Marker, Overlay, GeoJson } from 'pigeon-maps';
import {
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
    Star,
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
    operator: {
        name: string;
        nik: string;
        phone: string;
        rating: number;
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

// Master Fleet data berdasar Slide 19, 28 & 29 PPTX Acuan HPU
const FLEET_DATA: GpsVehicle[] = [
    {
        id: 'HD45108MB',
        unitCode: 'HD45108MB',
        plateNo: 'HPA-HD45108MB',
        deviceNo: '240078735201',
        category: 'MAIN',
        type: 'HD',
        model: 'CAT 777D Heavy Dump Truck',
        site: 'HPA',
        status: 'TRAVEL_ISI',
        operator: {
            name: 'TAUFIQ RAHMAN',
            nik: '90012030',
            phone: '+62 812-5432-8901',
            rating: 5,
            shift: 'Shift 1 Siang (06:00 - 18:00 WITA)'
        },
        telemetry: {
            speed: 38,
            fuelCons: 68.5,
            cycleTimeMinutes: 24.5,
            hourMeter: 14250.2,
            tripProgress: 65,
            totalRit: 18,
            loadType: 'OB',
            startTime: '10:00 WITA',
            currentStatusText: 'Hauling Menuju Disposal OPD LW (KM 14)',
            latitude: 2.052100,
            longitude: 117.214500
        }
    },
    {
        id: 'EX39103CT',
        unitCode: 'EX39103CT',
        plateNo: 'HPA-EX39103CT',
        deviceNo: '240078916025',
        category: 'MAIN',
        type: 'EXCA',
        model: 'Komatsu PC2000-8 Excavator',
        site: 'HPA',
        status: 'WORKING',
        operator: {
            name: 'BAMBANG HERMANTO',
            nik: '90011842',
            phone: '+62 813-8821-4470',
            rating: 4,
            shift: 'Shift 1 Siang (06:00 - 18:00 WITA)'
        },
        telemetry: {
            speed: 0,
            fuelCons: 92.0,
            cycleTimeMinutes: 22.0,
            hourMeter: 18910.8,
            tripProgress: 100,
            totalRit: 34,
            loadType: 'OB',
            startTime: '06:30 WITA',
            currentStatusText: 'Loading Material di Pit Front Selatan',
            latitude: 2.045000,
            longitude: 117.200000
        }
    },
    {
        id: 'DT49132MB',
        unitCode: 'DT49132MB',
        plateNo: 'BDA-DT49132MB',
        deviceNo: '240078740672',
        category: 'GENERAL',
        type: 'DT',
        model: 'Scania P460 Hauling Dump Truck',
        site: 'BDA',
        status: 'TRAVEL_KOSONG',
        operator: {
            name: 'SANDI SETIAWAN',
            nik: '90013319',
            phone: '+62 821-9901-2345',
            rating: 5,
            shift: 'Shift 1 Siang (06:00 - 18:00 WITA)'
        },
        telemetry: {
            speed: 46,
            fuelCons: 42.0,
            cycleTimeMinutes: 38.0,
            hourMeter: 8420.5,
            tripProgress: 40,
            totalRit: 12,
            loadType: 'COAL',
            startTime: '09:45 WITA',
            currentStatusText: 'Kembali dari Port Jetty Barito KM 16 Menuju Pit BDA',
            latitude: -1.135000,
            longitude: 114.920000
        }
    },
    {
        id: 'WT49113MB',
        unitCode: 'WT49113MB',
        plateNo: 'HPA-WT49113MB',
        deviceNo: '240079658477',
        category: 'GENERAL',
        type: 'WT',
        model: 'Hino 500 Water Truck 20KL',
        site: 'HPA',
        status: 'WORKING',
        operator: {
            name: 'AGUS PRASETYO',
            nik: '90014022',
            phone: '+62 852-7712-3344',
            rating: 4,
            shift: 'Shift 1 Siang (06:00 - 18:00 WITA)'
        },
        telemetry: {
            speed: 22,
            fuelCons: 28.5,
            cycleTimeMinutes: 15.0,
            hourMeter: 6120.0,
            tripProgress: 80,
            totalRit: 8,
            loadType: 'OB',
            startTime: '08:00 WITA',
            currentStatusText: 'Penyiraman Debu Jalan Hauling KM 13 s.d KM 15',
            latitude: 2.068000,
            longitude: 117.228000
        }
    },
    {
        id: 'LT45105MB',
        unitCode: 'LT45105MB',
        plateNo: 'BDA-LT45105MB',
        deviceNo: '240079636952',
        category: 'GENERAL',
        type: 'LT',
        model: 'Toyota Hilux 4x4 Support Unit',
        site: 'BDA',
        status: 'STANDBY',
        operator: {
            name: 'DWI CAHYONO',
            nik: '90015501',
            phone: '+62 811-5502-1234',
            rating: 5,
            shift: 'Shift 1 Siang (06:00 - 18:00 WITA)'
        },
        telemetry: {
            speed: 0,
            fuelCons: 14.0,
            cycleTimeMinutes: 0.0,
            hourMeter: 4200.1,
            tripProgress: 0,
            totalRit: 0,
            loadType: 'OB',
            startTime: '07:00 WITA',
            currentStatusText: 'Standby di Workshop HPU Barito KM 30',
            latitude: -1.180000,
            longitude: 114.980000
        }
    }
];

// Checkpoint KM Hauling (STA) per Slide 19 Mockup
const CHECKPOINTS_HPA = [
    { label: 'KM 13', lat: 2.058000, lng: 117.218000 },
    { label: 'KM 14', lat: 2.068000, lng: 117.228000 },
    { label: 'KM 15', lat: 2.079000, lng: 117.239000 },
    { label: 'KM 16', lat: 2.091000, lng: 117.251000 }
];

// Badge status visual berdasar Slide 28 & 29 PPTX
const getStatusBadge = (status: GpsVehicle['status']) => {
    switch (status) {
        case 'TRAVEL_ISI':
            return {
                bg: 'bg-blue-600 text-white',
                border: 'border-blue-700',
                dot: 'bg-white',
                label: 'TRAVEL ISI'
            };
        case 'TRAVEL_KOSONG':
            return {
                bg: 'bg-emerald-600 text-white',
                border: 'border-emerald-700',
                dot: 'bg-white',
                label: 'TRAVEL KOSONG'
            };
        case 'WORKING':
            return {
                bg: 'bg-emerald-500 text-white',
                border: 'border-emerald-600',
                dot: 'bg-white',
                label: 'WORKING'
            };
        case 'IDLING':
            return {
                bg: 'bg-amber-500 text-white',
                border: 'border-amber-600',
                dot: 'bg-white',
                label: 'IDLING'
            };
        case 'STANDBY':
            return {
                bg: 'bg-slate-500 text-white',
                border: 'border-slate-600',
                dot: 'bg-white',
                label: 'STANDBY'
            };
        case 'BREAKDOWN':
            return {
                bg: 'bg-rose-600 text-white',
                border: 'border-rose-700',
                dot: 'bg-white',
                label: 'BREAKDOWN'
            };
        default:
            return {
                bg: 'bg-slate-400 text-white',
                border: 'border-slate-500',
                dot: 'bg-white',
                label: 'OFFLINE'
            };
    }
};

export default function FleetCyclePage() {
    const [selectedSite, setSelectedSite] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('HD45108MB');
    const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
    const [mapZoom, setMapZoom] = useState<number>(14);
    const [haulingRoutes, setHaulingRoutes] = useState<any>(null);
    const [haulingStage, setHaulingStage] = useState<'LOADING' | 'TRAVEL_ISI' | 'DUMPING' | 'TRAVEL_KOSONG'>('LOADING');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('OB');

    // Ambil data unit aktif yang dipilih
    const selectedUnit = useMemo(() => {
        return FLEET_DATA.find(u => u.id === selectedVehicleId) || FLEET_DATA[0];
    }, [selectedVehicleId]);

    // Viewport peta mengikuti unit yang dipilih
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        selectedUnit.telemetry.latitude,
        selectedUnit.telemetry.longitude
    ]);

    useEffect(() => {
        setMapCenter([selectedUnit.telemetry.latitude, selectedUnit.telemetry.longitude]);
    }, [selectedUnit]);

    // Fetch rute hauling polyline
    useEffect(() => {
        fetch('/api/dashcam/hauling-routes')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.data) {
                    setHaulingRoutes(data.data);
                }
            })
            .catch(err => console.error('Error fetching hauling routes:', err));
    }, []);

    // Filter armada berdasarkan Site dan Query Pencarian
    const filteredFleet = useMemo(() => {
        return FLEET_DATA.filter(unit => {
            if (selectedSite !== 'ALL' && unit.site !== selectedSite) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = unit.unitCode.toLowerCase().includes(q) || unit.plateNo.toLowerCase().includes(q);
                const matchOp = unit.operator.name.toLowerCase().includes(q) || unit.operator.nik.includes(q);
                const matchModel = unit.model.toLowerCase().includes(q);
                return matchName || matchOp || matchModel;
            }
            return true;
        });
    }, [selectedSite, searchQuery]);

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
            <Head title="Fleet Cycle - Telemetri, Armada & Hauling | PT Harmoni Panca Utama" />

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

                    {/* Quick Site Switcher Pills */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konsesi:</span>
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setSelectedSite('ALL')}
                                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                    selectedSite === 'ALL'
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                ALL HPU ({FLEET_DATA.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedSite('HPA')}
                                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                    selectedSite === 'HPA'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Site HPA (Berau)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedSite('BDA')}
                                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                    selectedSite === 'BDA'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Site BDA (Barito)
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── MAIN GRID LAYOUT (SLIDE 19 MOCKUP STRUCTURE) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* ── LEFT COLUMN: FLEET & ASSET DIRECTORY (ARMADA) ── */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1.5 uppercase">
                                    <Search className="w-3.5 h-3.5 text-blue-600" />
                                    ARMADA TAMBANG
                                </span>
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                    {filteredFleet.length} UNIT AKTIF
                                </span>
                            </div>

                            {/* Search Input Box */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari nomor unit, operator..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3.5 pr-9 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                />
                                <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
                            </div>

                            {/* Poin Revisi 1.1 Sheet Dashboard: Site Drop Down dibawah search */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Site Drop Down:
                                </label>
                                <select
                                    value={selectedSite}
                                    onChange={e => setSelectedSite(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
                                >
                                    <option value="ALL">Semua Site (Seluruh Konsesi)</option>
                                    <option value="HPU">HPU - Harmoni Panca Utama</option>
                                    <option value="HPA">HPA - Hamparan Anugrah Abadi (Berau)</option>
                                    <option value="KJA">KJA - Kaltim Jaya Bara</option>
                                    <option value="BDA">BDA - Batubara Duaribu Abadi (Barito)</option>
                                    <option value="DTA">DTA - Delta</option>
                                    <option value="HPMU">HPMU - Head Office / Central</option>
                                    <option value="GAS">GAS - Gane Tambang Sentosa</option>
                                    <option value="OBI">OBI - Harita Nikel Obi</option>
                                    <option value="KDA">KDA - Kendawangan</option>
                                </select>
                            </div>

                            {/* Equipment Hierarchy List per Slide 19 */}
                            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                                {/* Section 1: MAIN UNIT (Heavy Production) */}
                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                                        <span className="flex items-center gap-1.5">
                                            <Microchip className="w-3.5 h-3.5 text-blue-600" />
                                            MAIN UNIT (ALAT UTAMA):
                                        </span>
                                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                                            {mainUnits.length}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 pl-2 border-l-2 border-blue-500/30">
                                        {mainUnits.map(unit => {
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
                                                            <div className="text-xs font-bold text-slate-900 truncate">
                                                                {unit.unitCode}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 truncate">
                                                                {unit.model}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${badge.bg}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Section 2: UNIT GENERAL / SUPPORT (Auxiliary) */}
                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 pt-2">
                                        <span className="flex items-center gap-1.5">
                                            <Truck className="w-3.5 h-3.5 text-amber-600" />
                                            UNIT GENERAL & SUPPORT:
                                        </span>
                                        <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono">
                                            {generalUnits.length}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/30">
                                        {generalUnits.map(unit => {
                                            const badge = getStatusBadge(unit.status);
                                            const isSelected = unit.id === selectedVehicleId;
                                            return (
                                                <div
                                                    key={unit.id}
                                                    onClick={() => setSelectedVehicleId(unit.id)}
                                                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                                        isSelected
                                                            ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-1 ring-amber-400'
                                                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                            isSelected ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                                                        }`}>
                                                            <Truck className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs font-bold text-slate-900 truncate">
                                                                {unit.unitCode}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 truncate">
                                                                {unit.model}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${badge.bg}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                                        {/* ── RIGHT COLUMN: FLEET CYCLE COMPLETE LAYOUT (SHEET 1 & IMAGES 1, 2, 3, 5, 6, 8, 9, 10) ── */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                        {/* 1. MAPS: Interactive Hauling Tracking Map (Pigeon Maps + Google Earth Tiles - Image 2) */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                                        PETA MONITORING KORIDOR HAULING & ARMADA (FLEET CYCLE MAP)
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                        [{mapCenter[0].toFixed(6)}, {mapCenter[1].toFixed(6)}]
                                    </span>
                                </div>

                                {/* Map Controls */}
                                <div className="flex items-center gap-2">
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
                            <div className="w-full h-[360px] rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                                <Map
                                    height={360}
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

                                    {/* Checkpoint STA / KM Markers */}
                                    {CHECKPOINTS_HPA.map((cp, idx) => (
                                        <Overlay key={`cp-${idx}`} anchor={[cp.lat, cp.lng]} offset={[30, 15]}>
                                            <div className="bg-slate-900/90 text-amber-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/50 shadow-md pointer-events-none select-none">
                                                📍 {cp.label}
                                            </div>
                                        </Overlay>
                                    ))}

                                    {/* Plot Posisi Seluruh Armada Aktif */}
                                    {filteredFleet.map(unit => {
                                        const isSelected = unit.id === selectedVehicleId;
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

                        {/* 2. STRIP 6 METRIK DI BAWAH MAPS (IMAGE 5 PADA REVISI 1.1) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-xs">
                            <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Kecepatan GPS</p>
                                <p className="font-black text-sm text-gray-900 mt-0.5">
                                    {selectedUnit.telemetry.speed} <span className="text-[10px] font-normal text-gray-500">km/j</span>
                                </p>
                                <span className="text-[9px] font-mono text-slate-500">Batas: {selectedUnit.site === 'HPA' ? '60' : '50'} km/j</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Odometer Hari Ini</p>
                                <p className="font-black text-blue-600 text-sm mt-0.5">
                                    65,648.5 <span className="text-[10px] font-normal text-gray-500">km</span>
                                </p>
                                <span className="text-[9px] font-mono text-slate-400">Total Akumulasi</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Zona Geofence</p>
                                <p className="font-bold text-gray-800 truncate px-1 text-xs mt-0.5" title="Koridor Hauling">
                                    Koridor Site {selectedUnit.site}
                                </p>
                                <span className="text-[9px] font-mono text-slate-400">STA KM 14</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Total Ritasi</p>
                                <p className="font-black text-emerald-700 text-sm mt-0.5">
                                    {selectedUnit.telemetry.totalRit} <span className="text-[10px] font-normal text-gray-500">Trip</span>
                                </p>
                                <span className="text-[9px] font-mono text-emerald-600 font-medium">Shift 1 Berjalan</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Cycle Time</p>
                                <p className="font-black text-amber-600 text-sm mt-0.5">
                                    {selectedUnit.telemetry.cycleTimeMinutes} <span className="text-[10px] font-normal text-gray-500">mnt</span>
                                </p>
                                <span className="text-[9px] font-mono text-slate-400">Rata-rata trip</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                                <p className="text-gray-400 font-bold uppercase text-[9px]">Kondisi Mesin</p>
                                <p className="font-bold text-xs text-emerald-600 mt-0.5">
                                    {selectedUnit.status === 'IDLING' ? 'Standby (Idle)' : 'ON (Running)'}
                                </p>
                                <span className="text-[9px] font-mono text-slate-400">Engine Active</span>
                            </div>
                        </div>

                        {/* 3. ROW TENGAH: SIKLUS OPERASIONAL HAULING (IMAGE 8) & TELEMETRI SENSOR (IMAGE 1) */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                            {/* Card A: Siklus Operasional Hauling (Image 8) */}
                            <div className="xl:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                SIKLUS OPERASIONAL HAULING
                                            </span>
                                        </div>
                                        <span className="bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                                            Tahap: {haulingStage}
                                        </span>
                                    </div>

                                    {/* 4 Hauling Steps */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-bold text-center mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setHaulingStage('LOADING')}
                                            className={`p-2 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-left ${
                                                haulingStage === 'LOADING'
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <Layers className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">1. Loading</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHaulingStage('TRAVEL_ISI')}
                                            className={`p-2 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-left ${
                                                haulingStage === 'TRAVEL_ISI'
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <Truck className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">2. Travel Isi</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHaulingStage('DUMPING')}
                                            className={`p-2 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-left ${
                                                haulingStage === 'DUMPING'
                                                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">3. Dumping</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHaulingStage('TRAVEL_KOSONG')}
                                            className={`p-2 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-left ${
                                                haulingStage === 'TRAVEL_KOSONG'
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">4. Trv Kosong</span>
                                        </button>
                                    </div>

                                    {/* Operational Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 mb-2.5 text-xs">
                                        <div className="sm:col-span-8 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="font-bold text-slate-400 uppercase text-[10px] w-20">Start Pit:</span>
                                                <span className="font-bold text-slate-800">Pit Front Alfa (HPA)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                <span className="font-bold text-slate-400 uppercase text-[10px] w-20">Waktu Mulai:</span>
                                                <span className="font-bold text-slate-800 font-mono">10:14 WITA</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                <span className="font-bold text-slate-400 uppercase text-[10px] w-20">Tujuan:</span>
                                                <span className="font-bold text-slate-800 truncate">Disposal OPD LW (KM 14)</span>
                                            </div>
                                            <div className="pt-1">
                                                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                                                    <span>Produksi Terakumulasi</span>
                                                    <span className="font-mono text-blue-600 font-bold">220 BCM</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center gap-0.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Ritasi</span>
                                            <span className="text-2xl font-black text-blue-700 leading-none">
                                                {selectedUnit.telemetry.totalRit} <span className="text-xs font-bold text-slate-500">RIT</span>
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium mt-1">Shift 1 Siang</span>
                                        </div>
                                    </div>

                                    {/* Material Muatan Selector (OB / Coal / Mud / Soil) */}
                                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-bold text-slate-700 text-[11px]">Material:</span>
                                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                                                {selectedMaterial} (Overburden)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] font-bold">
                                            {['OB', 'COAL', 'MUD', 'TOP SOIL'].map(mat => (
                                                <button
                                                    key={mat}
                                                    type="button"
                                                    onClick={() => setSelectedMaterial(mat)}
                                                    className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                                                        selectedMaterial === mat
                                                            ? 'bg-slate-900 text-white shadow-2xs'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {mat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card B: Telemetri & Sensor Hardware (Image 1) */}
                            <div className="xl:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <Gauge className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                TELEMETRI & SENSOR HARDWARE
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Live Device: {selectedUnit.deviceNo}
                                        </span>
                                    </div>

                                    {/* 4 Metric Boxes */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-3">
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1">
                                                <Gauge className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-sm font-extrabold text-slate-900 leading-tight">
                                                {selectedUnit.telemetry.speed} <span className="text-[10px] font-normal text-slate-500">km/j</span>
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Kecepatan</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-1">
                                                <Clock className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-sm font-extrabold text-purple-700 leading-tight">
                                                {selectedUnit.telemetry.cycleTimeMinutes} <span className="text-[10px] font-normal text-slate-500">min</span>
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Cycle Time</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                                                <Activity className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-sm font-extrabold text-emerald-700 leading-tight">
                                                65,648.5 <span className="text-[10px] font-normal text-slate-500">KM</span>
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Odometer GPS</p>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1">
                                                <Fuel className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-sm font-extrabold text-amber-700 leading-tight">
                                                {selectedUnit.telemetry.fuelCons} <span className="text-[10px] font-normal text-slate-500">L</span>
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Konsumsi BBM</p>
                                        </div>
                                    </div>

                                    {/* Bottom 3 Status Row */}
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Engine Status</p>
                                            <p className="font-bold text-emerald-600 text-xs mt-0.5">ON (RUNNING)</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Waktu Start / Stop</p>
                                            <p className="font-bold text-slate-800 text-[10px] mt-0.5 font-mono">06:00 - 18:00</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Produksi BCM</p>
                                            <p className="font-bold text-slate-900 text-xs mt-0.5">220 BCM (2.4 km)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. ROW BAWAH: OPERATOR DETAIL (IMAGE 6) & KESIAPAN ARMADA (IMAGE 9) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card C: Operator Detail (Image 6) */}
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

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="text-base font-extrabold text-slate-900">
                                                {selectedUnit.operator.name}
                                            </div>
                                            <div className="text-xs font-mono text-slate-500 font-semibold">
                                                NIK: {selectedUnit.operator.nik}
                                            </div>

                                            <div className="flex items-center gap-2 pt-1">
                                                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                                                    {selectedUnit.plateNo}
                                                </span>
                                                <div className="flex items-center text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${
                                                                i < selectedUnit.operator.rating
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-slate-300'
                                                            }`}
                                                        />
                                                    ))}
                                                    <span className="text-xs font-bold text-slate-700 ml-1">
                                                        ({selectedUnit.operator.rating}.0)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Avatar Thumbnail */}
                                        <div className="w-16 h-20 rounded-xl bg-slate-900 text-amber-400 flex flex-col items-center justify-center shrink-0 border border-slate-800 shadow-inner">
                                            <User className="w-7 h-7" />
                                            <span className="text-[9px] font-bold uppercase mt-1 text-slate-300">
                                                DRIVER
                                            </span>
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

                            {/* Card D: Kesiapan Armada (Image 9) */}
                            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                KESIAPAN ARMADA
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            20/20 Aktif
                                        </span>
                                    </div>

                                    {/* 3 Categories Breakdown */}
                                    <div className="grid grid-cols-3 gap-2.5 text-center mb-2">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">DT Hauler</p>
                                            <p className="text-xl font-black text-blue-700 mt-0.5">14 Unit</p>
                                            <span className="text-[9px] text-slate-400 font-medium">Dump Trucks</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Excavator</p>
                                            <p className="text-xl font-black text-amber-600 mt-0.5">4 Unit</p>
                                            <span className="text-[9px] text-slate-400 font-medium">Front Loading</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Fuel Truck</p>
                                            <p className="text-xl font-black text-emerald-700 mt-0.5">2 Unit</p>
                                            <span className="text-[9px] text-slate-400 font-medium">Support Unit</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                                    <span>Konsesi Operasional: {selectedSite === 'ALL' ? 'Seluruh Site HPU' : 'Site ' + selectedSite}</span>
                                    <span className="text-emerald-600 font-bold">100% Siap Beroperasi</span>
                                </div>
                            </div>
                        </div>

                        {/* 5. DIAGNOSTIK HARDWARE (IMAGE 10) */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <Microchip className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        DIAGNOSTIK HARDWARE MDVR & GPS
                                    </span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-500">
                                    Unit: {selectedUnit.plateNo}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Sinyal 4G MDVR</span>
                                    <span className="font-bold text-slate-900 text-xs mt-0.5 block">Kuat (-68 dBm)</span>
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">GPS Satelit</span>
                                    <span className="font-bold text-blue-700 text-xs mt-0.5 block">18 Terkunci</span>
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Storage MDVR</span>
                                    <span className="font-bold text-emerald-700 text-xs mt-0.5 block">256 GB (Normal)</span>
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Kondisi Mesin</span>
                                    <span className="font-bold text-slate-900 text-xs mt-0.5 block">ON (Running)</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                                <span className="font-bold text-[11px] flex items-center gap-1.5">
                                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                                    Kanal Video Aktif:
                                </span>
                                <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                    CH1 Jalan • CH2 Kabin DMS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutNavbar>
    );
}