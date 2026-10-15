with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Split KPI Summary Badges into its own card for DT
kpi_target = '{/* 4 KPI Summary Badges (Slide 19) */}'
kpi_replacement = """</div>
                                
                                {/* CARD 2: KPI & TELEMETRY */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                                    {/* 4 KPI Summary Badges (Slide 19) */}"""
text = text.replace(kpi_target, kpi_replacement)

# 2. Split BCM Production into its own card for DT
bcm_target = '{/* BCM Production & Riwayat Button */}'
bcm_replacement = """</div>
                                
                                {/* CARD 3: PRODUKSI BCM */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-2">
                                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black tracking-wider uppercase text-slate-800">
                                                TOTAL PRODUKSI BCM
                                            </h3>
                                        </div>
                                    </div>
                                    {/* BCM Production & Riwayat Button */}"""
text = text.replace(bcm_target, bcm_replacement)

# 3. Increase padding and margins for breathing room in the Material section
mat_target = '<div className="pt-2 border-t border-slate-100">'
mat_replacement = '<div className="pt-4 mt-2 border-t border-slate-100">'
text = text.replace(mat_target, mat_replacement)

# 4. Remove the `border-t border-slate-100` from KPI since it's now a fresh card
kpi_div_target = '<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2 border-t border-slate-100">'
kpi_div_replacement = '<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">'
text = text.replace(kpi_div_target, kpi_div_replacement)

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Added explicit separators (sekat) to the DT view")
