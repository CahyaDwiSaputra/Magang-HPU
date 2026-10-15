import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update camUrl function
old_cam_url = '''function camUrl(deviceId: string, channel: number, jsession: string | null, baseUrl: string = "http://10.10.0.33:8088") {
    if (jsession) {
        const mediaHost = (baseUrl && baseUrl.includes('://')) ? `${new URL(baseUrl).hostname}:6604` : '10.10.0.33:6604';
        return `/player.html?dev=${deviceId}&ch=${channel}&jsession=${jsession}&host=${mediaHost}`;
    }
    return null;
}'''

new_cam_url = '''function camUrl(deviceId: string, channel: number, jsession: string | null, baseUrl: string = "http://10.10.0.33:8088", engine: 'cmsv6' | 'flv' = 'cmsv6') {
    if (!jsession) return null;
    if (engine === 'cmsv6') {
        return `http://10.10.0.33:8088/808gps/open/player/video.html?lang=en&devIdno=${deviceId}&jsession=${jsession}&index=${channel + 1}&playerType=h5&hideVolumeBtn=1`;
    }
    const mediaHost = (baseUrl && baseUrl.includes('://')) ? `${new URL(baseUrl).hostname}:6604` : '10.10.0.33:6604';
    return `/player.html?dev=${deviceId}&ch=${channel}&jsession=${jsession}&host=${mediaHost}`;
}'''

assert old_cam_url in content, "old_cam_url not found"
content = content.replace(old_cam_url, new_cam_url)

# 2. Add streamEngine state
old_engine_point = "    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'ALL' | 'DT' | 'EXCA' | 'FT'>('ALL');"
new_engine_point = """    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'ALL' | 'DT' | 'EXCA' | 'FT'>('ALL');
    const [streamEngine, setStreamEngine] = useState<'cmsv6' | 'flv'>('cmsv6');"""

assert old_engine_point in content, "old_engine_point not found"
content = content.replace(old_engine_point, new_engine_point)

# 3. In return statement, replace LayoutNavbar and header
old_jsx_start = '''    return (
        <>
            <LayoutNavbar className="">
                <Head title="Dashcam Monitoring" />

                <div className="flex flex-col h-full bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-200 m-1">

                    <header className="flex min-h-[4.5rem] py-2 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-6 z-30 relative shadow-sm">
                        {/* ── SISI KIRI: BRANDING & DROPDOWN PEMILIH UNIT DASHCAM PT. HPU ── */}
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-base font-extrabold text-slate-800 leading-tight flex items-center gap-2">
                                        PT. HPU DASHCAM
                                        <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md tracking-wider">
                                            Live Fleet
                                        </span>
                                    </h1>
                                    <p className="text-xs text-slate-400 font-medium">Server CMSV6 • 10.10.0.33</p>
                                </div>
                            </div>

                            {/* Separator Line */}
                            <div className="hidden sm:block h-8 w-px bg-slate-200" />

                            {/* ── DROPDOWN UNIFIED DASHCAM (KIRI) ── */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                                    className="flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white pl-3.5 pr-3 py-2 rounded-xl shadow-md hover:from-slate-800 hover:to-slate-700 transition cursor-pointer border border-slate-700/70 group"
                                    title="Klik untuk memilih unit Dashcam PT. HPU"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-1.5 rounded-lg shrink-0 ${
                                            currentVehicle.type === 'EXCA' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                            currentVehicle.type === 'FT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                            {currentVehicle.type === 'EXCA' ? <LandPlot className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-black text-sm tracking-wide text-white">{currentVehicle.plateNo}</span>
                                                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                                    currentVehicle.type === 'EXCA' ? 'bg-amber-500/30 text-amber-300' :
                                                    currentVehicle.type === 'FT' ? 'bg-emerald-500/30 text-emerald-300' :
                                                    'bg-blue-500/30 text-blue-300'
                                                }`}>
                                                    {currentVehicle.type}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                Device: {currentVehicle.deviceNo} • {currentVehicle.site}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 ml-1 ${isVehicleDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                                </button>

                                {/* Dropdown Menu Panel Modal */}
                                {isVehicleDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsVehicleDropdownOpen(false)} />
                                        <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-3 flex flex-col gap-2.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                                            {/* Header Box Dropdown */}
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                                                        <Video className="w-3.5 h-3.5 text-blue-400" />
                                                        Pilih Unit Dashcam PT. HPU
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400">Total {fleet.length} Unit Terdaftar di Server</p>
                                                </div>
                                                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                                                    ● Live Ready
                                                </span>
                                            </div>

                                            {/* Search Input Box */}
                                            <div className="relative">
                                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    placeholder="Cari unit (misal: 44123, EXCA, DT, KDA)..."
                                                    value={vehicleSearchQuery}
                                                    onChange={(e) => setVehicleSearchQuery(e.target.value)}
                                                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Filter Tabs */}
                                            <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                                                {(['ALL', 'DT', 'EXCA', 'FT'] as const).map(tab => (
                                                    <button
                                                        key={tab}
                                                        type="button"
                                                        onClick={() => setVehicleTypeFilter(tab)}
                                                        className={`flex-1 py-1 rounded-lg text-center transition cursor-pointer ${
                                                            vehicleTypeFilter === tab 
                                                                ? 'bg-blue-600 text-white shadow-sm font-bold' 
                                                                : 'text-slate-400 hover:text-white'
                                                        }`}
                                                    >
                                                        {tab === 'ALL' ? 'Semua' : tab === 'DT' ? 'Truck' : tab === 'EXCA' ? 'Exca' : 'Fuel'}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Vehicle List */}
                                            <div className="max-h-72 overflow-y-auto flex flex-col gap-1 pr-1">
                                                {filteredVehicles.length === 0 ? (
                                                    <div className="p-4 text-center text-xs text-slate-500">
                                                        Tidak ada unit yang cocok dengan "{vehicleSearchQuery}"
                                                    </div>
                                                ) : (
                                                    filteredVehicles.map((v) => {
                                                        const isSelected = v.id === currentVehicle.id;
                                                        return (
                                                            <button
                                                                key={v.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedVehicleId(v.id);
                                                                    setIsVehicleDropdownOpen(false);
                                                                    setVehicleSearchQuery('');
                                                                }}
                                                                className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2.5 transition cursor-pointer border ${
                                                                    isSelected 
                                                                        ? 'bg-blue-600/25 border-blue-500/50 text-white' 
                                                                        : 'hover:bg-slate-800/80 border-transparent text-slate-300'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    <div className={`p-2 rounded-lg shrink-0 ${
                                                                        v.type === 'EXCA' ? 'bg-amber-500/20 text-amber-400' :
                                                                        v.type === 'FT' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                        'bg-blue-500/20 text-blue-400'
                                                                    }`}>
                                                                        {v.type === 'EXCA' ? <LandPlot className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="font-bold text-xs truncate text-white">{v.plateNo}</span>
                                                                            <span className={`text-[9px] font-black uppercase px-1 rounded ${
                                                                                v.type === 'EXCA' ? 'bg-amber-500/30 text-amber-300' :
                                                                                v.type === 'FT' ? 'bg-emerald-500/30 text-emerald-300' :
                                                                                'bg-blue-500/30 text-blue-300'
                                                                            }`}>
                                                                                {v.type}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-[10px] text-slate-400 truncate font-mono">
                                                                            Device: {v.deviceNo} • {v.site}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                                                                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                                                                </div>
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── SISI KANAN: STATUS PERANGKAT & KONEKSI API ── */}
                        <div className="flex items-center gap-2.5">
                            {/* Status Perangkat Hardware (Online / Offline) */}
                            <div className={`flex items-center gap-2 text-sm font-bold px-3.5 py-1.5 rounded-xl border ${telemetry.online ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                    'bg-rose-50 border-rose-200 text-rose-600'
                                }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${telemetry.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                    }`}></span>
                                {telemetry.online ? 'ONLINE' : 'OFFLINE'}
                            </div>

                            {/* Status API Connection */}
                            <div className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${apiStatus === 'live' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                    'bg-amber-50 border-amber-200 text-amber-600'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${apiStatus === 'live' ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                {apiStatus === 'live' ? 'CMSV6 10.10.0.33 Live' : 'Connecting CMSV6'}
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col p-5 md:p-6 overflow-y-auto gap-6">'''

new_jsx_start = '''    return (
        <>
            <LayoutNavbar fullWidth={true} className="p-0 border-0 bg-slate-950">
                <Head title="Dashcam Fleet Command Center" />

                <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-4.25rem)] bg-slate-950 text-slate-100 overflow-hidden">

                    {/* ══════════════════════════════════════════════════════════════
                        KOLOM KIRI (SIDEBAR): DROPDOWN & DAFTAR UNIT DASHCAM PT. HPU
                       ══════════════════════════════════════════════════════════════ */}
                    <aside className="w-full lg:w-80 xl:w-88 shrink-0 bg-slate-900/95 border-r border-slate-800/90 flex flex-col z-20 shadow-2xl h-full overflow-hidden">
                        {/* Header Panel Kiri */}
                        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
                                        PT. HPU DASHCAM
                                        <span className="text-[9px] uppercase font-black px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                                            LIVE
                                        </span>
                                    </h2>
                                    <p className="text-[11px] text-slate-400 font-mono">Server CMSV6 • 10.10.0.33</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {fleet.length} Unit
                            </span>
                        </div>

                        {/* ── DROPDOWN PEMILIH UNIT CEPAT ── */}
                        <div className="p-3 border-b border-slate-800/80 bg-slate-900 flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                <span>Pilih Unit Dashcam</span>
                                <span className="text-blue-400 font-mono lowercase">live switch</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedVehicleId}
                                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                                    className="w-full bg-slate-950 text-white border border-slate-700 hover:border-blue-500 rounded-xl px-3 py-2 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 pr-9 shadow-inner transition"
                                >
                                    {fleet.map((v) => (
                                        <option key={v.id} value={v.id} className="bg-slate-900 text-white py-1">
                                            {v.type === 'EXCA' ? '⛏️ EXCA' : v.type === 'FT' ? '⛽ FUEL' : '🚛 TRUCK'} • {v.plateNo}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Search & Filter Kategori */}
                        <div className="p-3 border-b border-slate-800/60 flex flex-col gap-2">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Cari plat / nomor lambung..."
                                    value={vehicleSearchQuery}
                                    onChange={(e) => setVehicleSearchQuery(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[10px] font-semibold">
                                {(['ALL', 'DT', 'EXCA', 'FT'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setVehicleTypeFilter(tab)}
                                        className={`flex-1 py-1 rounded-lg text-center transition cursor-pointer ${
                                            vehicleTypeFilter === tab 
                                                ? 'bg-blue-600 text-white shadow-sm font-bold' 
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {tab === 'ALL' ? 'Semua' : tab === 'DT' ? 'Truck' : tab === 'EXCA' ? 'Exca' : 'Fuel'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daftar Seluruh Armada (Vertical Scrollable List) */}
                        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
                            {filteredVehicles.map(v => {
                                const isSelected = v.id === currentVehicle.id;
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setSelectedVehicleId(v.id)}
                                        className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2.5 transition cursor-pointer border ${
                                            isSelected 
                                                ? 'bg-blue-600/25 border-blue-500/70 text-white shadow-lg shadow-blue-900/30' 
                                                : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800/60 text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={`p-2 rounded-lg shrink-0 ${
                                                v.type === 'EXCA' ? 'bg-amber-500/20 text-amber-400' :
                                                v.type === 'FT' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {v.type === 'EXCA' ? <LandPlot className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-xs truncate text-white">{v.plateNo}</span>
                                                    <span className={`text-[9px] font-black uppercase px-1 rounded ${
                                                        v.type === 'EXCA' ? 'bg-amber-500/30 text-amber-300' :
                                                        v.type === 'FT' ? 'bg-emerald-500/30 text-emerald-300' :
                                                        'bg-blue-500/30 text-blue-300'
                                                    }`}>
                                                        {v.type}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate font-mono">
                                                    ID: {v.deviceNo} • {v.site}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                                            {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer Ringkasan Unit Aktif di Panel Kiri */}
                        <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex flex-col gap-2 shrink-0">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                                <span className="flex items-center gap-1.5 truncate">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    {currentVehicle.plateNo}
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400 shrink-0">{telemetry.online ? 'ONLINE' : 'STANDBY'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                                    <span className="text-slate-500 block text-[8px]">SPEED</span>
                                    <span className="font-bold text-white">{telemetry.speed} km/j</span>
                                </div>
                                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                                    <span className="text-slate-500 block text-[8px]">GPS SAT</span>
                                    <span className="font-bold text-white">{telemetry.satellites} Sat</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ══════════════════════════════════════════════════════════════
                        KOLOM KANAN (MAIN): SURVEILLANCE & COMMAND DECK (FULL-WIDTH)
                       ══════════════════════════════════════════════════════════════ */}
                    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-950 p-4 md:p-6 gap-6 min-w-0">'''

assert old_jsx_start in content, "old_jsx_start not found"
content = content.replace(old_jsx_start, new_jsx_start)

# 4. In main CCTV Top Bar, update subtitle and add streamEngine switcher
old_cctv_topbar = '''                                    <span className="hidden md:inline-block text-xs text-slate-400 font-mono">
                                        {`Unit ${currentVehicle.plateNo} (Device: ${currentVehicle.deviceNo})`}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">'''

new_cctv_topbar = '''                                    <span className="hidden md:inline-block text-xs text-slate-400 font-mono">
                                        {`Unit ${currentVehicle.plateNo} (Device: ${currentVehicle.deviceNo})`}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Stream Engine Toggle (Official CMSV6 Player vs FLV) */}
                                    <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setStreamEngine('cmsv6')}
                                            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                                                streamEngine === 'cmsv6' 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Pemutar Resmi HTML5 CMSV6 dari Server HPU"
                                        >
                                            CMSV6 Official H5
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStreamEngine('flv')}
                                            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                                                streamEngine === 'flv' 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Pemutar Low-Latency FLV.js Direct"
                                        >
                                            FLV Direct
                                        </button>
                                    </div>'''

assert old_cctv_topbar in content, "old_cctv_topbar not found"
content = content.replace(old_cctv_topbar, new_cctv_topbar)

# 5. Update every camUrl call in index.tsx to pass streamEngine
content = content.replace(
    'src={camUrl(activeDeviceId, 0, jsession, cmsBaseUrl) || \'\'}',
    'src={camUrl(activeDeviceId, 0, jsession, cmsBaseUrl, streamEngine) || \'\'}'
)
content = content.replace(
    'src={camUrl(activeDeviceId, 1, jsession, cmsBaseUrl) || \'\'}',
    'src={camUrl(activeDeviceId, 1, jsession, cmsBaseUrl, streamEngine) || \'\'}'
)
content = content.replace(
    'src={camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl) || \'\'}',
    'src={camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl, streamEngine) || \'\'}'
)

# 6. Add allow="autoplay; fullscreen; camera; microphone; encrypted-media" to every iframe
content = content.replace(
    'allowFullScreen',
    'allowFullScreen allow="autoplay; fullscreen; camera; microphone; encrypted-media"'
)

# 7. Close </main> and </div> before modals at bottom
# Find modals: {showSimulator && ...
modal_anchor = '{showSimulator && ('
assert modal_anchor in content, "modal_anchor not found"

# In the original file, before showSimulator, there was:
# </div> (closing flex-1 flex flex-col p-5)
# </div> (closing flex flex-col h-full)
# Replace with </main> and </div>
# Let's inspect text before {showSimulator && (
pos = content.find(modal_anchor)
# Check 100 chars before pos
print("Before modal anchor:")
print(repr(content[pos-100:pos]))

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS!")
