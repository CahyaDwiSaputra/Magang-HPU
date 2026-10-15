import sys

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Locate the placeholder
placeholder_start = text.find('{/* EXCAVATOR PLACEHOLDER */}')
if placeholder_start == -1:
    print("Cannot find placeholder_start")
    sys.exit(1)

placeholder_end_marker = text.find('</>', placeholder_start)
if placeholder_end_marker == -1:
    print("Cannot find placeholder_end_marker")
    sys.exit(1)

new_cards = """{/* EXCAVATOR CARD 1: AI TRUCK DETECTION */}
                                <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 flex flex-col gap-5">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100 relative overflow-hidden">
                                                <Scan className="w-6 h-6 relative z-10" />
                                                <div className="absolute inset-0 bg-blue-200/50 animate-ping rounded-xl"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black tracking-wider uppercase text-slate-800">
                                                    AI TRUCK DETECTION
                                                </h3>
                                                <p className="text-xs text-slate-400">Deteksi Truk via Kamera AI & RFID</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                                            <Truck className="w-4 h-4" />
                                            TRUK TERDETEKSI
                                        </span>
                                    </div>

                                    {/* Truck Info Box */}
                                    <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 text-slate-100 opacity-50 pointer-events-none">
                                            <Truck className="w-32 h-32" />
                                        </div>
                                        
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit DT Terkunci (Loading Zone)</span>
                                            <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Jarak: 3.2m</span>
                                        </div>
                                        <div className="flex items-end gap-3 relative z-10">
                                            <h4 className="text-2xl font-black text-blue-700 tracking-tight">HD-78501</h4>
                                            <span className="text-sm font-bold text-slate-500 mb-1">ID: 240078916116</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mt-2 relative z-10">
                                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Operator DT</p>
                                                    <p className="text-xs font-bold text-slate-700 truncate">Sandi Setiawan</p>
                                                </div>
                                            </div>
                                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-slate-400" />
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Kapasitas Vessel</p>
                                                    <p className="text-xs font-bold text-slate-700">~20 BCM (30 Ton)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EXCAVATOR CARD 2: LOADING PROGRESS */}
                                <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black tracking-wider uppercase text-slate-800">
                                                STATUS PEMUATAN (LOADING)
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Real-time Load Bar */}
                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Muatan Masuk</p>
                                                <p className="text-xl font-black text-amber-600">14.5 <span className="text-xs text-slate-500 font-bold">BCM</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target</p>
                                                <p className="text-xl font-black text-slate-800">20.0 <span className="text-xs text-slate-500 font-bold">BCM</span></p>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full bg-slate-100 rounded-full h-4 border border-slate-200 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-slate-100"></div>
                                            {/* Progress Fill */}
                                            <div className="absolute top-0 left-0 bottom-0 bg-amber-500 transition-all duration-1000" style={{ width: '72%' }}>
                                                {/* Diagonal stripes for construction look */}
                                                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between text-[11px] font-bold mt-1">
                                            <span className="text-slate-500">Pass 3 dari 4 (Estimasi)</span>
                                            <span className="text-amber-600">72% Terisi</span>
                                        </div>
                                    </div>

                                    {/* Blind Spot Safety Toggle (Prep for feature) */}
                                    <div className="mt-2 p-3 bg-slate-900 rounded-xl flex items-center justify-between border border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">Proximity & Blind Spot</p>
                                                <p className="text-[10px] text-slate-400">360° Radar Area Excavator</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/50">AKTIF</span>
                                    </div>
                                </div>
                                """

new_text = text[:placeholder_start] + new_cards + text[placeholder_end_marker:]

# Make sure `Scan` is imported in `index.tsx`
if 'Scan,' not in new_text and 'Scan ' not in new_text:
    new_text = new_text.replace('import {', 'import {\n    Scan,', 1)

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Injected AI Truck Detection and Loading Progress cards")
