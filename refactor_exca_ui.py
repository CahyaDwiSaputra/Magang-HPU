import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# We want to replace the contents of the left column with a conditional.
# Left column starts at {/* CARD 1:
# Left column ends before {/* ── KOLOM KANAN
card1_start = text.find('{/* CARD 1:')
kolom_kanan = text.find('{/* ── KOLOM KANAN')

if card1_start != -1 and kolom_kanan != -1:
    left_col_content = text[card1_start:kolom_kanan]
    
    # Let's remove the closing `</div>` of the left column from `left_col_content`
    # because it should be outside the condition, or wait, it's easier if we just wrap the inner cards.
    # The left_col_content ends with `</div>\n                            ` (the closing div of CARD 2).
    # Then there is `</div>` (the closing div of the column wrapper).
    # Actually, let's just use regex to replace everything inside the left column.
    pass

# A safer approach: Use regex to find CARD 1 and CARD 2 together.
# Let's write the EXCAVATOR cards.
exca_cards = """
                                {/* EXCAVATOR CARD 1: OPERASIONAL LOADING & PRODUKTIVITAS */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black tracking-wider uppercase text-slate-800">
                                                    PRODUKTIVITAS EXCAVATOR
                                                </h3>
                                                <p className="text-xs text-slate-400">Loading OB / Coal ke Dump Truck & Stripping</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            <Activity className="w-4 h-4" />
                                            ⛏️ LOADING (AKTIF)
                                        </span>
                                    </div>

                                    {/* Excavator Cycle */}
                                    <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
                                        <div className="p-3 rounded-xl border transition bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-sm">
                                            ⛏️ Digging
                                        </div>
                                        <div className="p-3 rounded-xl border transition bg-slate-50 border-slate-200 text-slate-400">
                                            🔄 Swing Isi
                                        </div>
                                        <div className="p-3 rounded-xl border transition bg-slate-50 border-slate-200 text-slate-400">
                                            ⚡ Dumping
                                        </div>
                                        <div className="p-3 rounded-xl border transition bg-slate-50 border-slate-200 text-slate-400">
                                            🔄 Swing Kosong
                                        </div>
                                    </div>

                                    {/* Productivity Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50/70 p-5 rounded-xl border border-slate-200/80">
                                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-blue-200 shadow-sm text-center gap-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payload</p>
                                            <p className="text-3xl font-black text-blue-700 tracking-tight leading-none">
                                                4,250 <span className="text-sm font-bold text-slate-500 uppercase">TON</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-amber-200 shadow-sm text-center gap-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bucket Passes</p>
                                            <p className="text-3xl font-black text-amber-700 tracking-tight leading-none">
                                                845 <span className="text-sm font-bold text-slate-500 uppercase">PASSES</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* EXCAVATOR CARD 2: HARDWARE SENSORS & TELEMETRY */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-200">
                                                <Gauge className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black tracking-wider uppercase text-slate-800">
                                                    ENGINE SENSORS
                                                </h3>
                                                <p className="text-xs text-slate-400">Parameter Mesin & Hidrolik Excavator</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Sensors Normal
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                                            <Gauge className="w-6 h-6 text-blue-500 mb-1" />
                                            <p className="text-xl font-black text-slate-800">1,850</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engine RPM</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                                            <Clock className="w-6 h-6 text-purple-500 mb-1" />
                                            <p className="text-xl font-black text-slate-800">12,450</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hour Meter</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                                            <Activity className="w-6 h-6 text-rose-500 mb-1" />
                                            <p className="text-xl font-black text-slate-800">82°C</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hydraulic Temp</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                                            <Fuel className="w-6 h-6 text-amber-500 mb-1" />
                                            <p className="text-xl font-black text-slate-800">320 L</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fuel Level</p>
                                        </div>
                                    </div>
                                </div>
"""

# Now we replace the left column content
# Wrap the existing Card 1 and 2 in `{selectedVehicle === 'DT' ? (<> ... </>) : (<> ... </>)}`

left_col_start = text.find('                            <div className="flex flex-col gap-6">')
if left_col_start != -1:
    inner_start = left_col_start + len('                            <div className="flex flex-col gap-6">\n')
    kolom_kanan = text.find('                            {/* ── KOLOM KANAN (xl:col-span-6): GPS MAP, CREW HUB & AI SAFETY ── */}')
    
    # The end of inner content is the `</div>` before `kolom_kanan`.
    # Let's find that `</div>`
    end_div = text.rfind('</div>', inner_start, kolom_kanan)
    
    if end_div != -1:
        dt_cards = text[inner_start:end_div]
        
        # Build the new content
        new_content = f"""                                {{selectedVehicle === 'DT' ? (
                                    <>
{dt_cards}                                    </>
                                ) : (
                                    <>
{exca_cards}                                    </>
                                )}}
"""
        
        # Replace
        new_text = text[:inner_start] + new_content + text[end_div:]
        
        with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("Updated Excavator UI successfully!")
    else:
        print("end_div not found")
else:
    print("left_col_start not found")
