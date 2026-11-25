import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/components/layout-navbar';
import { Map, Marker, Overlay, GeoJson } from 'pigeon-maps';
import {
    MapPin,
    Map as MapIcon,
    Navigation,
    Layers,
    Plus,
    Trash2,
    Edit3,
    Search,
    SlidersHorizontal,
    Maximize2,
    Minimize2,
    ZoomIn,
    ZoomOut,
    Crosshair,
    RotateCcw,
    Undo2,
    CheckCircle2,
    AlertTriangle,
    X,
    LandPlot,
    Eye,
    EyeOff,
    Compass,
    Route,
    Truck,
    Info,
    Check,
    ChevronRight,
    Activity,
    Filter,
    Boxes,
    Building2,
    Flame,
    Radio,
} from 'lucide-react';

// ── TIPE DATA GEOFENCE ──
export type GeofenceItem = {
    id: number;
    name: string;
    site: string;
    type: 'loading' | 'dumping' | 'parking' | 'road' | 'custom';
    latitude: number;
    longitude: number;
    radius: number;
    color: string;
    address?: string;
    material?: string;
    geometry_type?: 'circle' | 'polygon' | 'line';
    coordinates_json?: string;
    created_at?: string;
    updated_at?: string;
};

// ── HELPER SPASIAL & GEODESI WGS84 ──
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radius bumi (meter)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const calculatePerimeter = (points: [number, number][]): number => {
    if (points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length; i++) {
        const nextIdx = (i + 1) % points.length;
        total += calculateDistance(points[i][0], points[i][1], points[nextIdx][0], points[nextIdx][1]);
    }
    return Math.round(total);
};

const calculatePolygonArea = (points: [number, number][]): { m2: number; ha: number } => {
    if (points.length < 3) return { m2: 0, ha: 0 };
    const R = 6378137.0; // WGS84 Major Radius
    let area = 0;
    const len = points.length;
    for (let i = 0; i < len; i++) {
        const j = (i + 1) % len;
        const p1 = points[i];
        const p2 = points[j];
        const x1 = ((p1[1] * Math.PI) / 180.0) * R * Math.cos((p1[0] * Math.PI) / 180.0);
        const y1 = ((p1[0] * Math.PI) / 180.0) * R;
        const x2 = ((p2[1] * Math.PI) / 180.0) * R * Math.cos((p2[0] * Math.PI) / 180.0);
        const y2 = ((p2[0] * Math.PI) / 180.0) * R;
        area += x1 * y2 - x2 * y1;
    }
    const m2 = Math.round(Math.abs(area) / 2.0);
    const ha = Number((m2 / 10000.0).toFixed(2));
    return { m2, ha };
};

// Palet warna standar K3 & Operasional Tambang HPU
const MINING_COLOR_PALETTE = [
    { name: 'Loading Coal (Hitam Pekat)', hex: '#0F172A' },
    { name: 'Loading OB (Abu Tambang)', hex: '#475569' },
    { name: 'Dumping Port (Ungu)', hex: '#7C3AED' },
    { name: 'Disposal Timbunan (Biru)', hex: '#2563EB' },
    { name: 'Workshop & Parkir (Hijau K3)', hex: '#16A34A' },
    { name: 'Jalan Hauling (Oranye)', hex: '#EA580C' },
    { name: 'Infrastruktur & Khusus (Ungu)', hex: '#8B5CF6' },
    { name: 'Kolam WMP (Cyan)', hex: '#0891B2' },
];

export default function GeofencePage() {
    // ── STATE MASTER GEOFENCE & SPASIAL ──
    const [geofences, setGeofences] = useState<GeofenceItem[]>([]);
    // Poin 2 Revisi 1.1: State Master Pit Location untuk Penamaan Geofence
    interface PitLocationItem {
        id: number;
        location_name: string;
        site: string;
        parent_id?: number | null;
    }
    const [pitLocations, setPitLocations] = useState<PitLocationItem[]>([]);
    const [isLoadingGeofences, setIsLoadingGeofences] = useState<boolean>(true);
    const [haulingRoutes, setHaulingRoutes] = useState<any>(null);
    const [operationalPolygons, setOperationalPolygons] = useState<any>(null);

    // ── STATE TELEMETRI STRIP (DI BAWAH MAPS - POIN 2) ──
    const [fleetTelemetry, setFleetTelemetry] = useState({
        speed: 0,
        distance: 0.0,
        satellites: 18,
        cycleTimeMinutes: 24.5,
        status: 'ONLINE',
        totalRitasi: 0,
    });

    // ── STATE VIEWPORT PETA ──
    const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
    const [mapZoom, setMapZoom] = useState<number>(13.5);
    const [mapCenter, setMapCenter] = useState<[number, number]>([2.045000, 117.200000]); // Default: HPA Berau
    const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

    // ── STATE FILTER & SELEKSI (POIN 4) ──
    const [selectedSiteFilter, setSelectedSiteFilter] = useState<'ALL' | 'HPA' | 'BDA'>('ALL');
    const [zoneFilterTab, setZoneFilterTab] = useState<'all' | 'loading' | 'dumping' | 'facility' | 'infrastructure' | 'road'>('all');
    const [zoneSearchQuery, setZoneSearchQuery] = useState<string>('');
    const [focusedGeofenceId, setFocusedGeofenceId] = useState<number | null>(null);
    const [showZonesDrawer, setShowZonesDrawer] = useState<boolean>(false);

    // ── STATE VISIBILITAS LAYER (POIN 5) ──
    const [showHaulingRoutes, setShowHaulingRoutes] = useState<boolean>(true);
    const [showPolygons, setShowPolygons] = useState<boolean>(true);

    // ── STATE RIWAYAT OVERSPEED PADA GEOFENCE (POIN 12) ──
    interface OverspeedLogItem {
        id: string;
        unit_code: string;
        driver_name: string;
        site: string;
        geofence_id: number;
        geofence_name: string;
        geofence_type: string;
        speed: number;
        speed_limit: number;
        excess_speed: number;
        duration_seconds: number;
        duration_formatted: string;
        time: string;
        time_formatted: string;
        status: string;
        latitude: number;
        longitude: number;
    }
    const [overspeedLogs, setOverspeedLogs] = useState<OverspeedLogItem[]>([]);
    const [showOverspeedModal, setShowOverspeedModal] = useState<boolean>(false);
    const [overspeedSearchQuery, setOverspeedSearchQuery] = useState<string>('');
    const [showLabels, setShowLabels] = useState<boolean>(true);
    const [showStaMarkers, setShowStaMarkers] = useState<boolean>(false);
    const [hiddenZoneIds, setHiddenZoneIds] = useState<Set<number>>(new Set());

    // ── STATE MODE TARIK ZONA ──
    const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
    const [drawShape, setDrawShape] = useState<'polygon' | 'line' | 'circle'>('polygon');
    const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);

    // ── STATE MODAL KONFIGURASI / EDIT GEOFENCE (POIN 3) ──
    const [showGeofenceModal, setShowGeofenceModal] = useState<boolean>(false);
    const [editingGeofenceId, setEditingGeofenceId] = useState<number | null>(null);
    const [isSavingGeofence, setIsSavingGeofence] = useState<boolean>(false);
    const [geofenceNotice, setGeofenceNotice] = useState<string | null>(null);

    const [formGeofence, setFormGeofence] = useState<{
        name: string;
        site: string;
        type: 'loading' | 'dumping' | 'parking' | 'road' | 'custom';
        latitude: number;
        longitude: number;
        radius: number;
        color: string;
        address: string;
        material: string;
        geometry_type: 'circle' | 'polygon' | 'line';
        coordinates_json: string;
    }>({
        name: '',
        site: 'HPA',
        type: 'loading',
        latitude: 2.045000,
        longitude: 117.200000,
        radius: 250,
        color: '#16A34A',
        address: 'Area Konsesi Tambang PT HPU Site HPA',
        material: 'OB',
        geometry_type: 'circle',
        coordinates_json: '',
    });

    // ── FETCH DATA SPASIAL ──
    const fetchGeofences = async () => {
        try {
            setIsLoadingGeofences(true);
            const res = await fetch('/api/dashcam/geofences');
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.data)) {
                setGeofences(data.data);
            }
        } catch (e) {
            console.error('Error fetching geofences:', e);
        } finally {
            setIsLoadingGeofences(false);
        }
    };

    const fetchHaulingRoutes = async () => {
        try {
            const res = await fetch('/api/dashcam/hauling-routes');
            const data = await res.json();
            if (data.status === 'ok' && data.data) {
                setHaulingRoutes(data.data);
            }
        } catch (e) {
            console.error('Error fetching hauling routes:', e);
        }
    };

    const fetchOperationalPolygons = async () => {
        try {
            const res = await fetch('/api/dashcam/geofences-geojson');
            const data = await res.json();
            if (data.status === 'ok' && data.data) {
                setOperationalPolygons(data.data);
            }
        } catch (e) {
            console.error('Error fetching operational polygons:', e);
        }
    };

    // Fetch Riwayat Pelanggaran Overspeed pada Geofence (Poin 12)
    const fetchOverspeedLogs = async () => {
        try {
            const res = await fetch(`/api/dashcam/geofences/overspeed-history?site=${selectedSiteFilter}`);
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.data)) {
                setOverspeedLogs(data.data);
            }
        } catch (e) {
            console.error('Error fetching overspeed history:', e);
        }
    };

    // Poin 2 Revisi 1.1: Fetch Master Pit Locations dari API Backend
    const fetchPitLocations = async () => {
        try {
            const res = await fetch('/api/dashcam/geofences/pit-locations?site=ALL');
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.data)) {
                setPitLocations(data.data);
            }
        } catch (e) {
            console.error('Error fetching pit locations:', e);
        }
    };

    const fetchFleetTelemetry = async () => {
        try {
            const [ritasiRes, statusRes] = await Promise.allSettled([
                fetch('/api/dashcam/ritasi-today'),
                fetch('/api/cmsv6/status'),
            ]);

            let totalRitasi = 0;
            let distance = 0.0;
            let cycleTimeMinutes = 24.5;
            let speed = 0;
            let status = 'ONLINE';

            if (ritasiRes.status === 'fulfilled' && ritasiRes.value.ok) {
                const rData = await ritasiRes.value.json();
                if (rData.status === 'ok') {
                    totalRitasi = rData.count ?? 0;
                    distance = Number(rData.total_distance_km ?? 0);
                    if (rData.avg_cycle_time_minutes > 0) {
                        cycleTimeMinutes = Number(rData.avg_cycle_time_minutes);
                    }
                }
            }

            if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
                const sData = await statusRes.value.json();
                if (sData.status === 'ok' && sData.data) {
                    speed = Math.round(Number(sData.data.speed || 0));
                    status = sData.data.online ? 'ONLINE' : 'OFFLINE';
                }
            }

            setFleetTelemetry(prev => ({
                ...prev,
                speed,
                distance,
                totalRitasi,
                cycleTimeMinutes,
                status,
            }));
        } catch (e) {
            console.error('Error fetching fleet telemetry:', e);
        }
    };

    useEffect(() => {
        fetchGeofences();
        fetchHaulingRoutes();
        fetchOperationalPolygons();
        fetchFleetTelemetry();
        fetchOverspeedLogs();
        fetchPitLocations();
    }, [selectedSiteFilter]);

    // ── TILE PROVIDER PETA ──
    const mapTileProvider = (x: number, y: number, z: number) => {
        if (mapLayer === 'satellite') {
            return `https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;
        }
        return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    };

    // ── DATA FILTERING & PENGELOMPOKAN ZONA (POIN 4) ──
    const activeSpeedLimit = useMemo(() => {
        if (selectedSiteFilter === 'BDA') return 50;
        if (selectedSiteFilter === 'HPA') return 60;
        return 40;
    }, [selectedSiteFilter]);

    const activeZoneLabel = useMemo(() => {
        if (focusedGeofenceId) {
            const found = geofences.find(g => g.id === focusedGeofenceId);
            if (found) return found.name;
        }
        return 'Luar Area';
    }, [focusedGeofenceId, geofences]);

    const focusedGeofence = useMemo(() => {
        if (!focusedGeofenceId) return null;
        return geofences.find(g => g.id === focusedGeofenceId) || null;
    }, [focusedGeofenceId, geofences]);

    // Breakdown grup zona (Poin 4)
    const loadingGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type !== 'loading') return false;
            if (selectedSiteFilter !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSiteFilter) return false;
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const dumpingGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type !== 'dumping') return false;
            if (selectedSiteFilter !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSiteFilter) return false;
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const facilityGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type !== 'parking') return false;
            if (selectedSiteFilter !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSiteFilter) return false;
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const roadGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type !== 'road') return false;
            if (selectedSiteFilter !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSiteFilter) return false;
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const infrastructureGeofences = useMemo(() => {
        return geofences.filter(gf => {
            const isSpecial =
                gf.type === 'custom' ||
                gf.name.toLowerCase().includes('handak') ||
                gf.name.toLowerCase().includes('curam') ||
                gf.name.toLowerCase().includes('wmp');
            if (!isSpecial) return false;
            if (selectedSiteFilter !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSiteFilter) return false;
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    const operationalGeofences = useMemo(() => {
        return geofences.filter(gf => {
            if (gf.type === 'road') return false;
            if (selectedSiteFilter !== 'ALL' && (gf.site || 'HPA').toUpperCase() !== selectedSiteFilter) return false;
            return true;
        });
    }, [geofences, selectedSiteFilter]);

    // Daftar zona untuk drawer (hanya menampilkan fasilitas operasional secara default agar tidak tertimbun 1,400 STA)
    const drawerZones = useMemo(() => {
        let list = geofences;
        if (selectedSiteFilter !== 'ALL') {
            list = list.filter(g => (g.site || 'HPA').toUpperCase() === selectedSiteFilter);
        }

        if (zoneFilterTab === 'loading') {
            list = list.filter(g => g.type === 'loading');
        } else if (zoneFilterTab === 'dumping') {
            list = list.filter(g => g.type === 'dumping');
        } else if (zoneFilterTab === 'facility') {
            list = list.filter(g => g.type === 'parking');
        } else if (zoneFilterTab === 'infrastructure') {
            list = list.filter(
                g =>
                    g.type === 'custom' ||
                    g.name.toLowerCase().includes('handak') ||
                    g.name.toLowerCase().includes('curam') ||
                    g.name.toLowerCase().includes('wmp')
            );
        } else if (zoneFilterTab === 'road') {
            list = list.filter(g => g.type === 'road');
        } else {
            // Tab 'all': tampilkan semua fasilitas operasional (tanpa menimbun dengan ribuan STA)
            list = list.filter(g => g.type !== 'road');
        }

        if (zoneSearchQuery.trim()) {
            const q = zoneSearchQuery.toLowerCase();
            list = list.filter(
                g =>
                    g.name.toLowerCase().includes(q) ||
                    (g.site && g.site.toLowerCase().includes(q)) ||
                    (g.type && g.type.toLowerCase().includes(q)) ||
                    (g.material && g.material.toLowerCase().includes(q)) ||
                    (g.address && g.address.toLowerCase().includes(q))
            );
        }
        return list;
    }, [geofences, selectedSiteFilter, zoneFilterTab, zoneSearchQuery]);

    // ── FITUR VISIBILITAS PER-ZONA & MASSAL (POIN 5) ──
    const toggleZoneVisibility = (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setHiddenZoneIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleHideAllDrawerZones = () => {
        const ids = drawerZones.map(z => z.id);
        setHiddenZoneIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => next.add(id));
            return next;
        });
    };

    const handleShowAllDrawerZones = () => {
        const ids = drawerZones.map(z => z.id);
        setHiddenZoneIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => next.delete(id));
            return next;
        });
    };

    // ── PERHITUNGAN GEODESI SAAT MENGGAMBAR DI PETA ──
    const drawnStats = useMemo(() => {
        if (!isDrawingMode || drawnPoints.length === 0) return null;
        if (drawShape === 'polygon') {
            const area = calculatePolygonArea(drawnPoints);
            const perimeter = calculatePerimeter(drawnPoints);
            return {
                areaHa: area.ha,
                areaM2: area.m2,
                perimeterM: perimeter,
                lengthM: null,
                radiusM: null,
            };
        } else if (drawShape === 'line') {
            let len = 0;
            for (let i = 0; i < drawnPoints.length - 1; i++) {
                len += calculateDistance(
                    drawnPoints[i][0],
                    drawnPoints[i][1],
                    drawnPoints[i + 1][0],
                    drawnPoints[i + 1][1]
                );
            }
            return {
                areaHa: null,
                areaM2: null,
                perimeterM: null,
                lengthM: Math.round(len),
                radiusM: null,
            };
        } else if (drawShape === 'circle') {
            if (drawnPoints.length >= 2) {
                const r = Math.round(
                    calculateDistance(
                        drawnPoints[0][0],
                        drawnPoints[0][1],
                        drawnPoints[1][0],
                        drawnPoints[1][1]
                    )
                );
                const areaM2 = Math.round(Math.PI * r * r);
                const areaHa = Number((areaM2 / 10000).toFixed(2));
                return {
                    areaHa,
                    areaM2,
                    perimeterM: Math.round(2 * Math.PI * r),
                    lengthM: null,
                    radiusM: r,
                };
            }
        }
        return null;
    }, [isDrawingMode, drawnPoints, drawShape]);

    const activeDrawingGeoJson = useMemo(() => {
        if (!isDrawingMode || drawnPoints.length === 0) return null;
        if (drawShape === 'line') {
            if (drawnPoints.length < 2) return null;
            return {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: { color: '#F59E0B' },
                        geometry: {
                            type: 'LineString',
                            coordinates: drawnPoints.map(p => [p[1], p[0]]),
                        },
                    },
                ],
            };
        } else if (drawShape === 'polygon') {
            if (drawnPoints.length < 3) return null;
            const ring = drawnPoints.map(p => [p[1], p[0]]);
            ring.push([drawnPoints[0][1], drawnPoints[0][0]]);
            return {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: { color: '#3B82F6' },
                        geometry: {
                            type: 'Polygon',
                            coordinates: [ring],
                        },
                    },
                ],
            };
        } else if (drawShape === 'circle') {
            if (drawnPoints.length < 2) return null;
            const center = drawnPoints[0];
            const r = calculateDistance(center[0], center[1], drawnPoints[1][0], drawnPoints[1][1]);
            const ring: [number, number][] = [];
            const R_EARTH = 6378137.0;
            for (let i = 0; i <= 36; i++) {
                const angle = (2 * Math.PI * i) / 36;
                const dLat = (r * Math.cos(angle)) / R_EARTH;
                const dLng = (r * Math.sin(angle)) / (R_EARTH * Math.cos((Math.PI * center[0]) / 180.0));
                ring.push([center[1] + (dLng * 180.0) / Math.PI, center[0] + (dLat * 180.0) / Math.PI]);
            }
            return {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: { color: '#10B981' },
                        geometry: {
                            type: 'Polygon',
                            coordinates: [ring],
                        },
                    },
                ],
            };
        }
        return null;
    }, [isDrawingMode, drawnPoints, drawShape]);

    // ── HANDLER KLIK PETA UNTUK DIGITASI ──
    const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
        if (!isDrawingMode) return;
        const newPt: [number, number] = [Number(latLng[0].toFixed(7)), Number(latLng[1].toFixed(7))];

        if (drawShape === 'circle') {
            if (drawnPoints.length === 0) {
                setDrawnPoints([newPt]);
                setGeofenceNotice(`Titik pusat: [${newPt[0]}, ${newPt[1]}]. Klik titik batas luar.`);
            } else {
                const rM = Math.round(calculateDistance(drawnPoints[0][0], drawnPoints[0][1], newPt[0], newPt[1]));
                setDrawnPoints([drawnPoints[0], newPt]);
                setGeofenceNotice(`Lingkaran terbentuk dengan radius ${rM}m. Klik 'Selesai & Simpan'.`);
            }
            return;
        }

        setDrawnPoints(prev => [...prev, newPt]);
        setGeofenceNotice(`Titik ke-${drawnPoints.length + 1} ditambahkan: [${newPt[0]}, ${newPt[1]}].`);
    };

    const handleResetDrawing = () => {
        setDrawnPoints([]);
        setGeofenceNotice('Semua titik gambar telah dihapus. Silakan klik pada peta satelit untuk menggambar ulang.');
    };

    const handleUndoPoint = () => {
        setDrawnPoints(prev => {
            const next = prev.slice(0, -1);
            if (next.length === 0) {
                setGeofenceNotice('Titik gambar di-reset.');
            } else {
                setGeofenceNotice(`Titik terakhir dihapus. Tersisa ${next.length} titik.`);
            }
            return next;
        });
    };

    const handleCancelDrawing = () => {
        setIsDrawingMode(false);
        setDrawnPoints([]);
        setGeofenceNotice('Mode Tarik Zona dibatalkan.');
        setTimeout(() => setGeofenceNotice(null), 3000);
    };

    const handleFinishDrawing = () => {
        if (drawnPoints.length === 0) {
            alert('Silakan tentukan minimal 1 titik di peta!');
            return;
        }

        let centerLat = drawnPoints[0][0];
        let centerLng = drawnPoints[0][1];
        if (drawnPoints.length > 1) {
            centerLat = Number(
                (drawnPoints.reduce((acc, p) => acc + p[0], 0) / drawnPoints.length).toFixed(7)
            );
            centerLng = Number(
                (drawnPoints.reduce((acc, p) => acc + p[1], 0) / drawnPoints.length).toFixed(7)
            );
        }

        const calculatedRadius =
            drawShape === 'circle' && drawnPoints.length >= 2
                ? Math.round(
                      calculateDistance(
                          drawnPoints[0][0],
                          drawnPoints[0][1],
                          drawnPoints[1][0],
                          drawnPoints[1][1]
                      )
                  )
                : drawShape === 'line'
                ? 50
                : 250;

        if (editingGeofenceId !== null) {
            setFormGeofence(prev => ({
                ...prev,
                latitude: centerLat,
                longitude: centerLng,
                radius: calculatedRadius,
                geometry_type: drawShape,
                coordinates_json: JSON.stringify(drawnPoints),
            }));
            setShowGeofenceModal(true);
            return;
        }

        const detectedSite =
            selectedSiteFilter !== 'ALL' ? selectedSiteFilter : centerLng < 116.0 ? 'BDA' : 'HPA';

        let defaultType: 'loading' | 'dumping' | 'parking' | 'road' | 'custom' = 'loading';
        let defaultName = `Area Tambang Baru (${detectedSite})`;
        if (drawShape === 'line') {
            defaultType = 'road';
            defaultName = `Jalur Hauling Baru (${detectedSite})`;
        } else if (drawShape === 'circle') {
            defaultType = 'loading';
            defaultName = `Pit Loading Buffer (${detectedSite})`;
        }

        setEditingGeofenceId(null);
        setFormGeofence({
            name: defaultName,
            site: detectedSite,
            type: defaultType,
            latitude: centerLat,
            longitude: centerLng,
            radius: calculatedRadius,
            color: drawShape === 'line' ? '#EA580C' : drawShape === 'circle' ? '#16A34A' : '#2563EB',
            address: `Area Konsesi Tambang PT HPU Site ${detectedSite}`,
            material: defaultType === 'road' ? 'OB' : 'COAL',
            geometry_type: drawShape,
            coordinates_json: JSON.stringify(drawnPoints),
        });

        setShowGeofenceModal(true);
    };

    // ── MODAL CREATE / UPDATE GEOFENCE (POIN 3) ──
    const handleOpenCreateModal = () => {
        setEditingGeofenceId(null);
        const centerLat = mapCenter[0];
        const centerLng = mapCenter[1];
        const detectedSite = selectedSiteFilter !== 'ALL' ? selectedSiteFilter : centerLng < 116.0 ? 'BDA' : 'HPA';

        setFormGeofence({
            name: '',
            site: detectedSite,
            type: 'loading',
            latitude: Number(centerLat.toFixed(7)),
            longitude: Number(centerLng.toFixed(7)),
            radius: 250,
            color: '#16A34A',
            address: `Area Konsesi Tambang PT HPU Site ${detectedSite}`,
            material: 'COAL',
            geometry_type: 'circle',
            coordinates_json: '',
        });
        setShowGeofenceModal(true);
    };

    const handleOpenEditModal = (gf: GeofenceItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingGeofenceId(gf.id);
        setFormGeofence({
            name: gf.name,
            site: gf.site || 'HPA',
            type: gf.type,
            latitude: Number(gf.latitude),
            longitude: Number(gf.longitude),
            radius: Number(gf.radius) || 150,
            color: gf.color || '#2563EB',
            address: gf.address || `Area Konsesi Tambang PT HPU Site ${gf.site || 'HPA'}`,
            material: gf.material || 'OB',
            geometry_type: (gf.geometry_type as any) || 'circle',
            coordinates_json: gf.coordinates_json || '',
        });
        setShowGeofenceModal(true);
    };

    const handleSaveGeofence = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formGeofence.name.trim()) {
            alert('Mohon isi nama geofence!');
            return;
        }

        const isEditing = editingGeofenceId !== null;
        const endpoint = isEditing ? `/api/dashcam/geofences/${editingGeofenceId}` : '/api/dashcam/geofences';
        const method = isEditing ? 'PUT' : 'POST';

        setIsSavingGeofence(true);
        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: formGeofence.name.trim(),
                    site: formGeofence.site || 'HPA',
                    type: formGeofence.type,
                    latitude: Number(formGeofence.latitude),
                    longitude: Number(formGeofence.longitude),
                    radius: Number(formGeofence.radius) || 150,
                    color: formGeofence.color,
                    address: formGeofence.address,
                    material: formGeofence.material,
                    geometry_type: formGeofence.geometry_type,
                    coordinates_json: formGeofence.coordinates_json || undefined,
                }),
            });

            const data = await res.json();
            if (data.status === 'ok') {
                await fetchGeofences();
                await fetchOperationalPolygons();

                setIsDrawingMode(false);
                setDrawnPoints([]);
                setShowGeofenceModal(false);

                setGeofenceNotice(
                    `✓ Geofence "${data.data?.name || formGeofence.name}" berhasil ${isEditing ? 'diperbarui' : 'disimpan'} ke database!`
                );
                setTimeout(() => setGeofenceNotice(null), 5000);
            } else {
                alert(data.message || 'Gagal menyimpan geofence');
            }
        } catch (err) {
            console.error('Save geofence error:', err);
            alert('Terjadi kesalahan koneksi saat menyimpan geofence.');
        } finally {
            setIsSavingGeofence(false);
        }
    };

    const handleDeleteGeofence = async (id: number, name: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm(`Hapus geofence "${name}" secara permanen dari database?`)) return;

        try {
            const res = await fetch(`/api/dashcam/geofences/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await res.json();
            if (data.status === 'ok') {
                await fetchGeofences();
                await fetchOperationalPolygons();
                if (focusedGeofenceId === id) setFocusedGeofenceId(null);
                setGeofenceNotice(`✓ Geofence "${name}" berhasil dihapus.`);
                setTimeout(() => setGeofenceNotice(null), 4000);
            } else {
                alert(data.message || 'Gagal menghapus geofence');
            }
        } catch (err) {
            console.error('Delete geofence error:', err);
            alert('Koneksi bermasalah saat menghapus geofence.');
        }
    };

    // ── FOCUS KE ZONA DI PETA ──
    const handleFocusGeofence = (gf: GeofenceItem) => {
        const lat = Number(gf.latitude);
        const lng = Number(gf.longitude);
        setMapCenter([lat, lng]);
        setMapZoom(16);
        setFocusedGeofenceId(gf.id);
        setGeofenceNotice(`🎯 Memusatkan peta ke: ${gf.name} (${gf.site})`);
        setTimeout(() => setGeofenceNotice(null), 4000);
    };

    // ── SITE FILTER SHORTCUTS ──
    const handleSiteSwitch = (site: 'ALL' | 'HPA' | 'BDA') => {
        setSelectedSiteFilter(site);
        if (site === 'BDA') {
            setMapCenter([-1.130544, 115.161056]); // Barito Selatan, Kalteng
            setMapZoom(12.5);
            setGeofenceNotice('🧭 Peta dipusatkan ke Koridor Hauling Site BDA Barito.');
        } else if (site === 'HPA') {
            setMapCenter([2.045000, 117.200000]); // Berau, Kaltim
            setMapZoom(13.5);
            setGeofenceNotice('🧭 Peta dipusatkan ke Area Konsesi Site HPA Berau.');
        } else {
            setMapCenter([0.450000, 116.200000]); // Panorama Seluruh Konsesi
            setMapZoom(8.5);
            setGeofenceNotice('🧭 Peta menampilkan seluruh konsesi tambang PT HPU.');
        }
        setTimeout(() => setGeofenceNotice(null), 4000);
    };

    return (
        <Layout
            containerClassName="w-full max-w-[98%] 2xl:max-w-[1920px]"
            className="!bg-slate-100/70 rounded-2xl shadow-xl border border-slate-200/80 p-3.5 md:p-5"
        >
            <Head title="Geofence & Pemetaan Spasial Tambang - PT Harmoni Panca Utama" />

            <div className="space-y-4">
                {/* ── TOP HEADER (BERSIH, PUTIH & SELARAS SISTEM SMART FLEET) ── */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                            <LandPlot className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                                    GEOFENCE & SPATIAL DISPATCH
                                </h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Enterprise Spasial
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                Monitoring perimeter konsesi, front loading, disposal timbunan, & rute hauling 94.5 KM PT Harmoni Panca Utama
                            </p>
                        </div>
                    </div>

                    {/* Quick Site Switcher Pills & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Poin 3: Daftar Site Ditampilkan Secara Vertikal (Ke Bawah), Jangan Horizontal */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Daftar Site Konsesi (Vertikal):
                            </span>
                            <div className="flex flex-col gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold min-w-[160px]">
                                <button
                                    type="button"
                                    onClick={() => handleSiteSwitch('ALL')}
                                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between ${
                                        selectedSiteFilter === 'ALL'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                    }`}
                                >
                                    <span>ALL HPU</span>
                                    <span className="text-[10px] text-slate-400 font-mono">Semua</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSiteSwitch('HPA')}
                                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between ${
                                        selectedSiteFilter === 'HPA'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                    }`}
                                >
                                    <span>Site HPA</span>
                                    <span className={`text-[10px] ${selectedSiteFilter === 'HPA' ? 'text-blue-100' : 'text-slate-400'} font-mono`}>Berau</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSiteSwitch('BDA')}
                                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer text-left flex items-center justify-between ${
                                        selectedSiteFilter === 'BDA'
                                            ? 'bg-amber-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                    }`}
                                >
                                    <span>Site BDA</span>
                                    <span className={`text-[10px] ${selectedSiteFilter === 'BDA' ? 'text-amber-100' : 'text-slate-400'} font-mono`}>Barito</span>
                                </button>
                            </div>
                        </div>

                        {/* Riwayat Overspeed pada Geofence (Poin 12) */}
                        <button
                            type="button"
                            onClick={() => setShowOverspeedModal(true)}
                            className="px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Riwayat Pelanggaran Batas Kecepatan Spasial Geofence"
                        >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Riwayat Overspeed ({overspeedLogs.length})</span>
                        </button>

                        {/* Tombol Buka Drawer Manajemen Zona (Poin 3, 4, 5) */}
                        <button
                            type="button"
                            onClick={() => setShowZonesDrawer(true)}
                            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Buka daftar & pengaturan visibilitas zona"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                            <span>Daftar & Kelola Zona ({operationalGeofences.length})</span>
                        </button>

                        {/* Tombol Tambah Geofence Baru */}
                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Tambah Geofence Baru"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Zona</span>
                        </button>
                    </div>
                </div>

                {/* NOTIFIKASI / TOAST INFORMASI SPASIAL */}
                {geofenceNotice && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-fade-in font-medium">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>{geofenceNotice}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setGeofenceNotice(null)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    PETA SPASIAL FULL-WIDTH EXPANSIVE CARD (TIDAK TERPISAH LIST BESAR)
                   ══════════════════════════════════════════════════════════════ */}
                <div
                    className={`bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs flex flex-col transition-all duration-300 ${
                        isMapExpanded ? 'fixed inset-4 z-50 shadow-2xl' : ''
                    }`}
                >
                    {/* Command Bar / Toolbar di atas Peta */}
                    <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
                        {/* Left: Site Switcher Vertikal (Poin 3) */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                Site:
                            </span>
                            <select
                                value={selectedSiteFilter}
                                onChange={(e) => handleSiteSwitch(e.target.value as any)}
                                className="bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                title="Pilih Site Konsesi Tambang"
                            >
                                <option value="ALL">ALL HPU (Konsesi Kalimantan)</option>
                                <option value="HPA">Site HPA (Berau - 49.3 KM)</option>
                                <option value="BDA">Site BDA (Barito - 45.2 KM)</option>
                            </select>
                        </div>

                        {/* Center: Pengkategorian Group Antar Zona (Poin 4) */}
                        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setZoneFilterTab('all')}
                                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                                    zoneFilterTab === 'all'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Semua ({operationalGeofences.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setZoneFilterTab('loading')}
                                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                                    zoneFilterTab === 'loading'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Pit Loading ({loadingGeofences.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setZoneFilterTab('dumping')}
                                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                                    zoneFilterTab === 'dumping'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Disposal ({dumpingGeofences.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setZoneFilterTab('facility')}
                                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                                    zoneFilterTab === 'facility'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Fasilitas ({facilityGeofences.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setZoneFilterTab('infrastructure')}
                                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                                    zoneFilterTab === 'infrastructure'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Infrastruktur ({infrastructureGeofences.length})
                            </button>
                        </div>

                        {/* Right: Layer Switcher & Tools */}
                        <div className="flex items-center gap-2">
                            {/* Layer Toggles (Poin 5) */}
                            <div className="hidden xl:flex items-center gap-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setShowHaulingRoutes(!showHaulingRoutes)}
                                    className={`px-2 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                                        showHaulingRoutes
                                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                                            : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                                    }`}
                                    title="Rute Hauling 94.5 KM"
                                >
                                    Rute Hauling
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPolygons(!showPolygons)}
                                    className={`px-2 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                                        showPolygons
                                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                                            : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                                    }`}
                                    title="Poligon Bentuk Fisik"
                                >
                                    Poligon
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLabels(!showLabels)}
                                    className={`px-2 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                                        showLabels
                                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                                            : 'bg-slate-50 text-slate-400 border-slate-200'
                                    }`}
                                    title="Papan Nama Fasilitas"
                                >
                                    Label Nama
                                </button>
                            </div>

                            {/* Google Earth vs OpenStreetMap */}
                            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg gap-0.5 text-xs font-medium">
                                <button
                                    type="button"
                                    onClick={() => setMapLayer('satellite')}
                                    className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                                        mapLayer === 'satellite'
                                            ? 'bg-white text-slate-900 shadow-xs font-bold'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                    title="Citra Satelit Resolusi Tinggi Google Earth"
                                >
                                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Google Earth</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMapLayer('street')}
                                    className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                                        mapLayer === 'street'
                                            ? 'bg-white text-slate-900 shadow-xs font-bold'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                    title="Peta Vektor Jalan"
                                >
                                    <MapIcon className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Peta Jalan</span>
                                </button>
                            </div>

                            {/* Tombol Mode Tarik Zona Manual */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (isDrawingMode) {
                                        handleCancelDrawing();
                                    } else {
                                        setIsDrawingMode(true);
                                        setMapLayer('satellite');
                                        setDrawnPoints([]);
                                        setGeofenceNotice(
                                            '🖱️ Mode Tarik Zona Aktif: Klik langsung pada peta satelit untuk menentukan batas sudut area.'
                                        );
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                    isDrawingMode
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                                title="Tarik perimeter geofence interaktif pada peta citra satelit"
                            >
                                <LandPlot className="w-3.5 h-3.5" />
                                <span>{isDrawingMode ? 'Keluar Tarik' : 'Tarik Zona'}</span>
                            </button>

                            {/* Maximize Toggle */}
                            <button
                                type="button"
                                onClick={() => setIsMapExpanded(!isMapExpanded)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-xs"
                                title={isMapExpanded ? 'Perkecil Peta' : 'Perbesar Peta Layar Penuh'}
                            >
                                {isMapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Relative Map Canvas Container */}
                    <div className={`relative w-full ${isMapExpanded ? 'flex-1 h-full' : 'h-[580px] sm:h-[640px]'}`}>
                        {/* PRECISION DRAWING HUD OVERLAY (HANYA MUNCUL SAAT MODE GAMBAR AKTIF) */}
                        {isDrawingMode && (
                            <div className="absolute top-3 left-3 z-30 bg-white/95 border border-slate-200 backdrop-blur-md rounded-xl p-3 shadow-xl text-slate-900 max-w-xs animate-scale-up">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                                    <span className="font-bold text-xs text-blue-700 flex items-center gap-1.5">
                                        <Compass className="w-3.5 h-3.5" />
                                        Digitasi Geodesi WGS84
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono font-bold">
                                        {drawnPoints.length} Titik
                                    </span>
                                </div>

                                {/* Shape Selector */}
                                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-bold mb-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDrawShape('polygon');
                                            setDrawnPoints([]);
                                        }}
                                        className={`py-1 rounded text-center transition cursor-pointer ${
                                            drawShape === 'polygon'
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Poligon
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDrawShape('line');
                                            setDrawnPoints([]);
                                        }}
                                        className={`py-1 rounded text-center transition cursor-pointer ${
                                            drawShape === 'line'
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Jalur
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDrawShape('circle');
                                            setDrawnPoints([]);
                                        }}
                                        className={`py-1 rounded text-center transition cursor-pointer ${
                                            drawShape === 'circle'
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Radius
                                    </button>
                                </div>

                                {/* Geodesic Real-Time Stats */}
                                {drawnStats && (
                                    <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg font-mono text-[11px] space-y-1 mb-2">
                                        {drawnStats.areaHa !== null && (
                                            <div className="flex justify-between text-slate-700">
                                                <span>Luas:</span>
                                                <span className="font-bold text-emerald-600">
                                                    {drawnStats.areaHa} Ha ({drawnStats.areaM2?.toLocaleString('id-ID')} m²)
                                                </span>
                                            </div>
                                        )}
                                        {drawnStats.perimeterM !== null && (
                                            <div className="flex justify-between text-slate-700">
                                                <span>Keliling:</span>
                                                <span className="font-bold text-blue-600">{drawnStats.perimeterM} m</span>
                                            </div>
                                        )}
                                        {drawnStats.lengthM !== null && (
                                            <div className="flex justify-between text-slate-700">
                                                <span>Panjang:</span>
                                                <span className="font-bold text-amber-600">{drawnStats.lengthM} m</span>
                                            </div>
                                        )}
                                        {drawnStats.radiusM !== null && (
                                            <div className="flex justify-between text-slate-700">
                                                <span>Radius:</span>
                                                <span className="font-bold text-emerald-600">{drawnStats.radiusM} m</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Drawing Actions */}
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={handleUndoPoint}
                                        disabled={drawnPoints.length === 0}
                                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                                        title="Undo titik terakhir"
                                    >
                                        <Undo2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResetDrawing}
                                        disabled={drawnPoints.length === 0}
                                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                                        title="Reset semua titik"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelDrawing}
                                        className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleFinishDrawing}
                                        disabled={drawnPoints.length === 0}
                                        className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1 shadow-xs"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Simpan</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MAP CONTROLS OVERLAY (POJOK KANAN ATAS) */}
                        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                            <button
                                type="button"
                                onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                                className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-gray-800 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer shadow-md"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setMapZoom(prev => Math.max(prev - 1, 5))}
                                className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-gray-800 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer shadow-md"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedSiteFilter === 'BDA') {
                                        setMapCenter([-1.130544, 115.161056]);
                                        setMapZoom(12.5);
                                    } else if (selectedSiteFilter === 'HPA') {
                                        setMapCenter([2.045000, 117.200000]);
                                        setMapZoom(13.5);
                                    } else {
                                        setMapCenter([0.450000, 116.200000]);
                                        setMapZoom(8.5);
                                    }
                                }}
                                className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-gray-800 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer shadow-md"
                                title="Pusatkan Peta"
                            >
                                <Crosshair className="w-4 h-4" />
                            </button>
                        </div>

                        {/* PIGEON MAPS CANVAS */}
                        <Map
                            center={mapCenter}
                            zoom={mapZoom}
                            onBoundsChanged={({ center, zoom }) => {
                                setMapCenter(center);
                                setMapZoom(zoom);
                            }}
                            provider={mapTileProvider}
                            onClick={handleMapClick}
                            attribution={false}
                        >
                            {/* 1. LAYER KORIDOR JALUR HAULING */}
                            {showHaulingRoutes && haulingRoutes && (
                                <GeoJson
                                    data={haulingRoutes}
                                    styleCallback={(feature: any) => {
                                        const featName = (feature.properties?.name || '').toUpperCase();
                                        const isSelectedSite =
                                            selectedSiteFilter === 'ALL' ||
                                            (selectedSiteFilter === 'BDA' && featName.includes('BDA')) ||
                                            (selectedSiteFilter === 'HPA' && (featName.includes('HPA') || featName.includes('TAMBANG')));

                                        if (!isSelectedSite) {
                                            return { stroke: 'transparent', strokeWidth: 0 };
                                        }

                                        let strokeColor = '#F59E0B';
                                        if (featName.includes('BDA')) strokeColor = '#EA580C';
                                        if (featName.includes('TAMBANG UTAMA')) strokeColor = '#3B82F6';

                                        return {
                                            stroke: strokeColor,
                                            strokeWidth: 4,
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round',
                                            strokeOpacity: 0.95,
                                        };
                                    }}
                                />
                            )}

                            {/* 2. LAYER POLIGON FISIK FASILITAS TAMBANG */}
                            {showPolygons && operationalPolygons && (
                                <GeoJson
                                    data={operationalPolygons}
                                    styleCallback={(feature: any) => {
                                        const featId = feature.properties?.id;
                                        // Sembunyikan jika dimatikan via Poin 5
                                        if (featId && hiddenZoneIds.has(featId)) {
                                            return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                        }

                                        const featSite = (feature.properties?.site || 'HPA').toUpperCase();
                                        if (selectedSiteFilter !== 'ALL' && featSite !== selectedSiteFilter) {
                                            return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                        }

                                        const featType = (feature.properties?.type || '').toLowerCase();
                                        if (zoneFilterTab !== 'all') {
                                            if (zoneFilterTab === 'loading' && featType !== 'loading') return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                            if (zoneFilterTab === 'dumping' && featType !== 'dumping') return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                            if (zoneFilterTab === 'facility' && featType !== 'parking') return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                            if (zoneFilterTab === 'infrastructure' && featType !== 'custom') return { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 };
                                        }

                                        const color = feature.properties?.color || '#2563EB';
                                        const isFocused = featId === focusedGeofenceId;

                                        return {
                                            fill: color,
                                            fillOpacity: isFocused ? 0.35 : 0.18,
                                            stroke: isFocused ? '#FFFFFF' : color,
                                            strokeWidth: isFocused ? 3 : 1.5,
                                            strokeDasharray: '4 3',
                                        };
                                    }}
                                />
                            )}

                            {/* 3. ACTIVE DRAWING GEOJSON (SAAT DIGITASI) */}
                            {activeDrawingGeoJson && (
                                <GeoJson
                                    data={activeDrawingGeoJson}
                                    styleCallback={(feature: any) => ({
                                        fill: feature.properties?.color || '#3B82F6',
                                        fillOpacity: 0.25,
                                        stroke: feature.properties?.color || '#3B82F6',
                                        strokeWidth: 2.5,
                                        strokeDasharray: '6 3',
                                    })}
                                />
                            )}

                            {/* 4. PIN & PAPAN NAMA FASILITAS (POIN 5: HANYA TAMPIL JIKA TIDAK DISEMBUNYIKAN) */}
                            {showLabels &&
                                operationalGeofences.map(gf => {
                                    if (hiddenZoneIds.has(gf.id)) return null;
                                    if (zoneFilterTab !== 'all') {
                                        if (zoneFilterTab === 'loading' && gf.type !== 'loading') return null;
                                        if (zoneFilterTab === 'dumping' && gf.type !== 'dumping') return null;
                                        if (zoneFilterTab === 'facility' && gf.type !== 'parking') return null;
                                        if (zoneFilterTab === 'infrastructure' && gf.type !== 'custom') return null;
                                    }

                                    const lat = Number(gf.latitude);
                                    const lng = Number(gf.longitude);
                                    if (isNaN(lat) || isNaN(lng)) return null;

                                    const isFocused = gf.id === focusedGeofenceId;

                                    return (
                                        <Overlay key={`lbl-${gf.id}`} anchor={[lat, lng]} offset={[0, 0]}>
                                            <div className="relative group -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                                                <div
                                                    className={`px-2 py-0.5 rounded-lg border backdrop-blur-md text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                                        isFocused
                                                            ? 'bg-blue-600 text-white border-white scale-110 ring-4 ring-blue-500/50'
                                                            : 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                    onClick={() => handleFocusGeofence(gf)}
                                                >
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{ backgroundColor: gf.color || '#2563EB' }}
                                                    ></span>
                                                    <span className="truncate max-w-[140px] sm:max-w-[200px]">
                                                        {gf.name}
                                                    </span>
                                                    {gf.material && (
                                                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                                                            {gf.material}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Hover Quick Card */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xl text-xs w-48 z-40 text-slate-800">
                                                    <p className="font-bold text-gray-900 mb-1 truncate">{gf.name}</p>
                                                    <div className="space-y-0.5 text-[10px] text-gray-500 mb-2 font-mono">
                                                        <p>Site: <strong className="text-gray-900">{gf.site}</strong> • Tipe: <strong className="text-gray-900">{gf.type}</strong></p>
                                                        <p>Radius: <strong>{gf.radius}m</strong></p>
                                                    </div>
                                                    <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                                                        <button
                                                            type="button"
                                                            onClick={e => handleOpenEditModal(gf, e)}
                                                            className="flex-1 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                            <span>Edit (Poin 3)</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={e => toggleZoneVisibility(gf.id, e)}
                                                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] cursor-pointer"
                                                            title="Sembunyikan dari peta"
                                                        >
                                                            <EyeOff className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Overlay>
                                    );
                                })}

                            {/* 5. CHECKPOINT STA MARKERS (Poin 5) */}
                            {showStaMarkers &&
                                roadGeofences.map(gf => {
                                    if (hiddenZoneIds.has(gf.id)) return null;
                                    const lat = Number(gf.latitude);
                                    const lng = Number(gf.longitude);
                                    if (isNaN(lat) || isNaN(lng)) return null;

                                    return (
                                        <Overlay key={`sta-${gf.id}`} anchor={[lat, lng]} offset={[0, 0]}>
                                            <div
                                                className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shadow-xs cursor-pointer hover:scale-150 transition -translate-x-1/2 -translate-y-1/2"
                                                onClick={() => handleFocusGeofence(gf)}
                                            >
                                                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-40">
                                                    {gf.name}
                                                </div>
                                            </div>
                                        </Overlay>
                                    );
                                })}

                            {/* 6. DRAWING VERTEX MARKERS */}
                            {isDrawingMode &&
                                drawnPoints.map((pt, idx) => (
                                    <Marker
                                        key={`draw-pt-${idx}`}
                                        anchor={pt}
                                        color="#EF4444"
                                        width={22}
                                    />
                                ))}
                        </Map>

                        {/* FLOATING ACTIVE ZONE ACTION CARD DI BAWAH PETA (POIN 3 & 5) */}
                        {focusedGeofence && !isDrawingMode && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 border border-slate-200/90 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-xl text-gray-800 flex items-center gap-3 animate-fade-in max-w-[94vw]">
                                <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                                    style={{ backgroundColor: focusedGeofence.color || '#2563EB' }}
                                ></span>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs truncate max-w-[160px] sm:max-w-[240px] text-gray-900">
                                            {focusedGeofence.name}
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                                            {focusedGeofence.site}
                                        </span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono uppercase">
                                            {focusedGeofence.type}
                                        </span>
                                        {overspeedLogs.some(o => o.geofence_id === focusedGeofence.id) && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                                <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                                {overspeedLogs.filter(o => o.geofence_id === focusedGeofence.id).length} Overspeed Tercatat
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-mono truncate">
                                        Radius: {focusedGeofence.radius}m • [{Number(focusedGeofence.latitude).toFixed(5)},{' '}
                                        {Number(focusedGeofence.longitude).toFixed(5)}]
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200">
                                    {/* Button Edit (Poin 3) */}
                                    <button
                                        type="button"
                                        onClick={e => handleOpenEditModal(focusedGeofence, e)}
                                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
                                        title="Edit parameter zona ini"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </button>

                                    {/* Button Visibility (Poin 5) */}
                                    <button
                                        type="button"
                                        onClick={e => toggleZoneVisibility(focusedGeofence.id, e)}
                                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                                        title={hiddenZoneIds.has(focusedGeofence.id) ? 'Tampilkan di peta' : 'Sembunyikan dari peta'}
                                    >
                                        {hiddenZoneIds.has(focusedGeofence.id) ? (
                                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                        ) : (
                                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                                        )}
                                    </button>

                                    {/* Close Bar */}
                                    <button
                                        type="button"
                                        onClick={() => setFocusedGeofenceId(null)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-slate-100 transition cursor-pointer"
                                        title="Tutup Panel Info"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CARD: STATISTIK SPASIAL KONSESI & FITUR PENDUKUNG (POIN 2 & POIN 7: MURNI SPASIAL TANPA DATA ARMADA) ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center p-2 rounded-xl bg-slate-50 border border-slate-200/90 shadow-xs">
                    {/* 1. Total Geofence Terdaftar */}
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Total Geofence</p>
                        <p className="font-black text-sm text-blue-700">
                            {operationalGeofences.length}{' '}
                            <span className="text-[10px] font-normal text-gray-500">Zona</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">Konsesi {selectedSiteFilter}</span>
                    </div>

                    {/* 2. Rute Hauling Konsesi */}
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Koridor Hauling</p>
                        <p className="font-black text-amber-600 text-sm">
                            {selectedSiteFilter === 'HPA' ? '49.3' : selectedSiteFilter === 'BDA' ? '45.2' : '94.5'}{' '}
                            <span className="text-[10px] font-normal text-gray-500">KM</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">Rute Jalan Tambang</span>
                    </div>

                    {/* 3. Pit Front Loading */}
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Pit Front Loading</p>
                        <p className="font-black text-indigo-700 text-sm">
                            {loadingGeofences.length}{' '}
                            <span className="text-[10px] font-normal text-gray-500">Area Pit</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">Pemuatan Material</span>
                    </div>

                    {/* 4. Disposal Timbunan */}
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Disposal Timbunan</p>
                        <p className="font-black text-emerald-700 text-sm">
                            {dumpingGeofences.length}{' '}
                            <span className="text-[10px] font-normal text-gray-500">Lokasi</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">Area Dumping Waste</span>
                    </div>

                    {/* 5. Cycle Time Standar Rute (Poin 2) */}
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Cycle Time Hauling</p>
                        <p className="font-black text-purple-700 text-sm">
                            24.5 <span className="text-[10px] font-normal text-gray-500">mnt</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-400">Standar Estimasi Rute</span>
                    </div>

                    {/* 6. Riwayat Overspeed Terdeteksi (Poin 12) */}
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80">
                        <p className="text-gray-400 font-bold uppercase text-[9px]">Riwayat Overspeed</p>
                        <p className="font-black text-rose-600 text-sm">
                            {overspeedLogs.length}{' '}
                            <span className="text-[10px] font-normal text-gray-500">Kejadian</span>
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">Pelanggaran Batas Zona</span>
                    </div>
                </div>
            </div>

            {/* ── SLIDE-OVER DRAWER: RIWAYAT PELANGGARAN OVERSPEED PADA GEOFENCE (POIN 12) ── */}
            {showOverspeedModal && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
                    <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-slide-left text-slate-900">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/70">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-rose-600 text-white rounded-xl shadow-xs">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900">
                                        Riwayat Overspeed Spasial Geofence
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        Catatan lokasi zona & durasi pelanggaran batas kecepatan konsesi
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowOverspeedModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search & Site Filter */}
                        <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={overspeedSearchQuery}
                                    onChange={e => setOverspeedSearchQuery(e.target.value)}
                                    placeholder="Cari unit nopol, zona, atau driver..."
                                    className="w-full bg-white border border-slate-200 text-xs text-slate-900 rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                />
                                {overspeedSearchQuery && (
                                    <button
                                        onClick={() => setOverspeedSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-0.5">
                                <span className="text-slate-500 font-medium">
                                    Total Kejadian:{' '}
                                    <strong className="text-rose-700">
                                        {overspeedLogs.filter(item => {
                                            if (!overspeedSearchQuery) return true;
                                            const q = overspeedSearchQuery.toLowerCase();
                                            return (
                                                item.unit_code.toLowerCase().includes(q) ||
                                                item.geofence_name.toLowerCase().includes(q) ||
                                                item.driver_name.toLowerCase().includes(q)
                                            );
                                        }).length}
                                    </strong>
                                </span>
                                <span className="text-[11px] font-bold text-slate-500">
                                    Site: {selectedSiteFilter}
                                </span>
                            </div>
                        </div>

                        {/* Overspeed Records List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y-0">
                            {overspeedLogs
                                .filter(item => {
                                    if (!overspeedSearchQuery) return true;
                                    const q = overspeedSearchQuery.toLowerCase();
                                    return (
                                        item.unit_code.toLowerCase().includes(q) ||
                                        item.geofence_name.toLowerCase().includes(q) ||
                                        item.driver_name.toLowerCase().includes(q)
                                    );
                                })
                                .map(log => (
                                    <div
                                        key={log.id}
                                        className="bg-white border border-slate-200/90 hover:border-rose-300 rounded-xl p-3 shadow-xs hover:shadow-md transition-all space-y-2"
                                    >
                                        {/* Row 1: Unit & Timestamp */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="font-extrabold text-xs text-slate-900">
                                                        {log.unit_code}
                                                    </span>
                                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                                        {log.driver_name}
                                                    </span>
                                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                                                        Site {log.site}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                    ID: {log.id} • {log.time_formatted}
                                                </p>
                                            </div>

                                            {/* Speed Badge */}
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-black text-rose-600">
                                                    {log.speed} <span className="text-[10px] font-normal text-slate-500">km/j</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                                    +{log.excess_speed} km/j di atas batas ({log.speed_limit})
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Location & Duration (POIN 12 INTI: LOKASI DI MANA & BERAPA LAMA) */}
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 text-xs grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                                    Lokasi Zona Geofence:
                                                </span>
                                                <span className="font-bold text-slate-800 text-[11px] truncate block flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                                                    <span className="truncate">{log.geofence_name}</span>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                                    Durasi Pelanggaran:
                                                </span>
                                                <span className="font-bold text-purple-700 text-[11px] flex items-center gap-1 mt-0.5 font-mono">
                                                    <Route className="w-3 h-3 text-purple-600 shrink-0" />
                                                    <span>{log.duration_formatted}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Row 3: Action Buttons */}
                                        <div className="flex items-center justify-between pt-1 text-xs">
                                            <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                                                <Check className="w-3 h-3" />
                                                {log.status}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMapCenter([log.latitude, log.longitude]);
                                                    setMapZoom(16);
                                                    setFocusedGeofenceId(log.geofence_id);
                                                    setShowOverspeedModal(false);
                                                    setGeofenceNotice(
                                                        `📍 Memusatkan peta ke lokasi pelanggaran: ${log.geofence_name} (${log.unit_code})`
                                                    );
                                                }}
                                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-xs"
                                                title="Fokuskan peta ke lokasi zona geofence ini"
                                            >
                                                <Crosshair className="w-3 h-3" />
                                                <span>Fokus ke Peta</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── SLIDE-OVER DRAWER BERSIH PUTIH: MANAJEMEN ZONA & VISIBILITAS (POIN 3, 4, 5) ── */}
            {showZonesDrawer && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
                    <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-slide-left text-slate-900">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2">
                                <LandPlot className="w-5 h-5 text-blue-600" />
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900">Manajemen Zona Spasial</h3>
                                    <p className="text-[11px] text-gray-500">
                                        {drawerZones.length} Fasilitas Tambang Terdaftar
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowZonesDrawer(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search & Site Filter */}
                        <div className="p-3 border-b border-slate-100 space-y-2">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={zoneSearchQuery}
                                    onChange={e => setZoneSearchQuery(e.target.value)}
                                    placeholder="Cari nama zona, tipe, material..."
                                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                {zoneSearchQuery && (
                                    <button
                                        onClick={() => setZoneSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Batch Visibility Actions (Poin 5) */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <span className="text-gray-500">
                                    Disembunyikan: <strong className="text-amber-600">{drawerZones.filter(z => hiddenZoneIds.has(z.id)).length}</strong>
                                </span>
                                <div className="flex items-center gap-2 font-bold text-xs">
                                    <button
                                        type="button"
                                        onClick={handleShowAllDrawerZones}
                                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                    >
                                        Tampilkan Semua
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    <button
                                        type="button"
                                        onClick={handleHideAllDrawerZones}
                                        className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                                    >
                                        Sembunyikan Semua
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Zone List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {drawerZones.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs">
                                    Tidak ada zona yang cocok dengan pencarian.
                                </div>
                            ) : (
                                drawerZones.map(gf => {
                                    const isHidden = hiddenZoneIds.has(gf.id);
                                    const isFocused = gf.id === focusedGeofenceId;

                                    return (
                                        <div
                                            key={`drawer-zone-${gf.id}`}
                                            onClick={() => {
                                                handleFocusGeofence(gf);
                                                setShowZonesDrawer(false);
                                            }}
                                            className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                                                isFocused
                                                    ? 'bg-blue-50 border-blue-300 shadow-xs ring-1 ring-blue-300'
                                                    : isHidden
                                                    ? 'bg-slate-50/50 border-slate-200 opacity-60'
                                                    : 'bg-white hover:bg-slate-50 border-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                                                    style={{ backgroundColor: gf.color || '#2563EB' }}
                                                ></span>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="text-xs font-bold text-gray-900 truncate">
                                                            {gf.name}
                                                        </h4>
                                                        <span className="text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-700">
                                                            {gf.site}
                                                        </span>
                                                        <span className="text-[9px] font-bold px-1 rounded uppercase bg-blue-50 text-blue-700">
                                                            {gf.type}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                        {gf.material && <span className="text-emerald-700 font-bold mr-1">[{gf.material}]</span>}
                                                        Radius: {gf.radius}m
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons (Poin 3, 5) */}
                                            <div
                                                className="flex items-center gap-1 shrink-0"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {/* Toggle Visibility (Poin 5) */}
                                                <button
                                                    type="button"
                                                    onClick={e => toggleZoneVisibility(gf.id, e)}
                                                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                                        isHidden
                                                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                                                            : 'bg-blue-50 text-blue-600 border-blue-200'
                                                    }`}
                                                    title={isHidden ? 'Tampilkan di peta' : 'Sembunyikan dari peta'}
                                                >
                                                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>

                                                {/* Edit (Poin 3) */}
                                                <button
                                                    type="button"
                                                    onClick={e => handleOpenEditModal(gf, e)}
                                                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-700 transition cursor-pointer"
                                                    title="Edit parameter zona"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                {/* Hapus */}
                                                <button
                                                    type="button"
                                                    onClick={e => handleDeleteGeofence(gf.id, gf.name, e)}
                                                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                                    title="Hapus geofence"
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
                </div>
            )}

            {/* ── MODAL: KONFIGURASI / EDIT GEOFENCE (POIN 3) ── */}
            {showGeofenceModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-up">
                        {/* Header Modal */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                    <LandPlot className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">
                                        {editingGeofenceId !== null ? 'Edit Parameter Geofence' : 'Konfigurasi Geofence Baru'}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Standar Penamaan & Klasifikasi Spasial PT Harmoni Panca Utama
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowGeofenceModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Modal */}
                        <form onSubmit={handleSaveGeofence} className="p-5 space-y-4 text-xs">
                            {/* Summary Banner jika dari Mode Tarik */}
                            {formGeofence.coordinates_json && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1 font-mono text-[11px]">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold uppercase tracking-wider text-blue-700">
                                            Hasil Digitasi: {formGeofence.geometry_type.toUpperCase()}
                                        </span>
                                        <span className="text-blue-600">
                                            [{formGeofence.latitude}, {formGeofence.longitude}]
                                        </span>
                                    </div>
                                    {drawnStats?.areaHa ? (
                                        <p>
                                            Luas: <strong>{drawnStats.areaHa} Ha</strong> • Keliling:{' '}
                                            <strong>{drawnStats.perimeterM} m</strong>
                                        </p>
                                    ) : drawnStats?.lengthM ? (
                                        <p>
                                            Panjang Jalur: <strong>{drawnStats.lengthM} m</strong>
                                        </p>
                                    ) : null}
                                </div>
                            )}

                            {/* 1. NAMA GEOFENCE & SELEKSI MASTER PIT LOCATION (REVISI 1.1 POIN 2) */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-slate-700 font-bold text-xs">
                                        Nama Geofence <span className="text-rose-500">*</span>
                                    </label>
                                    {pitLocations.length > 0 && (
                                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                            {pitLocations.length} Master Pit Terdaftar
                                        </span>
                                    )}
                                </div>

                                {/* Quick Selector: Master Pit Location Dropdown */}
                                <div className="mb-2">
                                    <select
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val) {
                                                const found = pitLocations.find(p => p.location_name === val);
                                                setFormGeofence(prev => ({
                                                    ...prev,
                                                    name: val,
                                                    site: (found?.site && ['HPA','BDA','KDA','KJA'].includes(found.site)) ? found.site : prev.site
                                                }));
                                            }
                                        }}
                                        defaultValue=""
                                        className="w-full bg-blue-50/80 border border-blue-200 rounded-xl px-3 py-1.5 text-blue-900 focus:outline-none focus:border-blue-500 text-xs font-semibold cursor-pointer mb-1"
                                    >
                                        <option value="">-- Pilih dari Master Pit Location (Poin 2) --</option>
                                        {pitLocations.map(p => (
                                            <option key={p.id} value={p.location_name}>
                                                [{p.site || 'SITE'}] {p.location_name} {p.parent_id ? `(Sub Pit #${p.parent_id})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        list="pit-locations-datalist"
                                        value={formGeofence.name}
                                        onChange={e => setFormGeofence({ ...formGeofence, name: e.target.value })}
                                        placeholder="Pilih dari Master Pit di atas atau ketik nama lokasi..."
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                                    />
                                    <datalist id="pit-locations-datalist">
                                        {pitLocations.map(p => (
                                            <option key={`dl-${p.id}`} value={p.location_name}>
                                                {p.site}
                                            </option>
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            {/* 2. SITE KONSESI & KATEGORI ZONA */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Site Konsesi Tambang</label>
                                    <select
                                        value={formGeofence.site}
                                        onChange={e => setFormGeofence({ ...formGeofence, site: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                                    >
                                        <option value="HPA">Site HPA (Berau, Kaltim)</option>
                                        <option value="BDA">Site BDA (Barito, Kalteng)</option>
                                        <option value="KDA">Site KDA (Kalimantan)</option>
                                        <option value="AMO">Site AMO</option>
                                        <option value="KJA">Site KJA</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Kategori / Fungsi Zona</label>
                                    <select
                                        value={formGeofence.type}
                                        onChange={e =>
                                            setFormGeofence({
                                                ...formGeofence,
                                                type: e.target.value as any,
                                            })
                                        }
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                                    >
                                        <option value="loading">Loading Area (Front Penambangan Pit)</option>
                                        <option value="dumping">Dumping Area (Disposal / Port Jetty)</option>
                                        <option value="parking">Fasilitas / Workshop / Office</option>
                                        <option value="road">Jalan Hauling / Checkpoint STA</option>
                                        <option value="custom">Infrastruktur & Zona Khusus (WMP/Pos/Tower)</option>
                                    </select>
                                </div>
                            </div>

                            {/* 3. JENIS GEOMETRI & MATERIAL */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Bentuk Geometri Geofence</label>
                                    <select
                                        value={formGeofence.geometry_type}
                                        onChange={e => {
                                            const gType = e.target.value as any;
                                            setFormGeofence({
                                                ...formGeofence,
                                                geometry_type: gType,
                                            });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                                    >
                                        <option value="circle">Circle (Radius Buffer Lingkaran)</option>
                                        <option value="polygon">Polygon (Area Tertutup Multi-Verteks)</option>
                                        <option value="line">Line (Jalur Garis Jalan Hauling)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Jenis Material Tambang</label>
                                    <select
                                        value={formGeofence.material}
                                        onChange={e => setFormGeofence({ ...formGeofence, material: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                                    >
                                        <option value="OB">Overburden (OB)</option>
                                        <option value="COAL">Coal (Batubara)</option>
                                        <option value="MUD">Lumpur / Mud</option>
                                        <option value="TOPSOIL">Top Soil</option>
                                        <option value="LIMONIT">Limonit</option>
                                        <option value="SAPROLIT">Saprolit</option>
                                    </select>
                                </div>
                            </div>

                            {/* 4. KOORDINAT TITIK PUSAT */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="0.0000001"
                                        required
                                        value={formGeofence.latitude}
                                        onChange={e =>
                                            setFormGeofence({
                                                ...formGeofence,
                                                latitude: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="0.0000001"
                                        required
                                        value={formGeofence.longitude}
                                        onChange={e =>
                                            setFormGeofence({
                                                ...formGeofence,
                                                longitude: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-mono"
                                    />
                                </div>
                            </div>

                            {/* 5. RADIUS KONDISIONAL (JIKA CIRCLE) */}
                            {formGeofence.geometry_type === 'circle' && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-slate-700 font-bold">Radius Lingkaran (meter)</label>
                                        <span className="font-mono text-blue-600 font-bold">{formGeofence.radius} m</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="10"
                                        max="5000"
                                        value={formGeofence.radius}
                                        onChange={e =>
                                            setFormGeofence({
                                                ...formGeofence,
                                                radius: Math.max(10, Number(e.target.value)),
                                            })
                                        }
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-mono mb-1.5"
                                    />
                                    <div className="flex flex-wrap gap-1">
                                        {[50, 100, 150, 250, 300, 500].map(r => (
                                            <button
                                                key={`rad-${r}`}
                                                type="button"
                                                onClick={() => setFormGeofence({ ...formGeofence, radius: r })}
                                                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border transition cursor-pointer ${
                                                    formGeofence.radius === r
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                                }`}
                                            >
                                                {r}m
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 6. PALET WARNA TEMATIK TAMBANG */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1.5">Warna Tampilan Peta</label>
                                <div className="grid grid-cols-4 gap-1.5 mb-2">
                                    {MINING_COLOR_PALETTE.map(c => (
                                        <button
                                            key={c.hex}
                                            type="button"
                                            onClick={() => setFormGeofence({ ...formGeofence, color: c.hex })}
                                            className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition cursor-pointer ${
                                                formGeofence.color === c.hex
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <span
                                                className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                                                style={{ backgroundColor: c.hex }}
                                            ></span>
                                            <span className="text-[10px] font-medium text-slate-700 truncate">
                                                {c.name.split(' ')[0]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 7. ALAMAT BLOK TAMBANG */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Keterangan / Blok Lokasi</label>
                                <input
                                    type="text"
                                    value={formGeofence.address}
                                    onChange={e => setFormGeofence({ ...formGeofence, address: e.target.value })}
                                    placeholder="Contoh: Pit Front Bravo KM 12 Sektor Utara"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                                />
                            </div>

                            {/* Tombol Gambar Ulang Bentuk di Peta jika Mode Edit (Poin 3) */}
                            {editingGeofenceId !== null && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-bold text-amber-900 text-xs">Sesuaikan Bentuk Spasial</p>
                                        <p className="text-[10px] text-amber-700">Tarik ulang titik sudut poligon / jalur di peta satelit Google Earth</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowGeofenceModal(false);
                                            setIsDrawingMode(true);
                                            setDrawShape(formGeofence.geometry_type);
                                            if (formGeofence.coordinates_json) {
                                                try {
                                                    const pts = JSON.parse(formGeofence.coordinates_json);
                                                    if (Array.isArray(pts) && pts.length > 0) {
                                                        setDrawnPoints(pts);
                                                    }
                                                } catch (e) {}
                                            } else {
                                                setDrawnPoints([[formGeofence.latitude, formGeofence.longitude]]);
                                            }
                                            setGeofenceNotice(`✏️ Mengedit bentuk untuk "${formGeofence.name}". Klik titik pada peta atau klik 'Selesai & Simpan'.`);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition cursor-pointer shadow-xs"
                                    >
                                        <LandPlot className="w-3.5 h-3.5" />
                                        <span>Gambar di Peta</span>
                                    </button>
                                </div>
                            )}

                            {/* Action Buttons Modal */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowGeofenceModal(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingGeofence}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {isSavingGeofence ? (
                                        <>
                                            <RotateCcw className="w-4 h-4 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>
                                                {editingGeofenceId !== null ? 'Perbarui Geofence' : 'Simpan Geofence'}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
