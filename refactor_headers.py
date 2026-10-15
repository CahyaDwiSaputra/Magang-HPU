with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_header_unit = """<div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
                                <Truck className="w-4 h-4 text-blue-600" />
                                UNIT: EX-39103CT
                            </div>"""

new_header_unit = """<div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold px-2 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-slate-100 transition">
                                <Truck className="w-4 h-4 text-blue-600" />
                                <select 
                                    className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer text-sm focus:ring-0 p-0"
                                    value={selectedVehicle}
                                    onChange={(e) => setSelectedVehicle(e.target.value as 'DT' | 'EXCA')}
                                >
                                    <option value="DT">HD-78501 (Dump Truck)</option>
                                    <option value="EXCA">UNS-1 (Excavator)</option>
                                </select>
                            </div>"""

text = text.replace(old_header_unit, new_header_unit)

old_cctv_header = """<span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
                                        Unit EX-39103CT (ID: 240078916116)
                                    </span>"""
new_cctv_header = """<span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
                                        {selectedVehicle === 'DT' ? 'Unit HD-78501 (ID: 240078916116)' : 'Unit UNS-1 (ID: 240078915951)'}
                                    </span>"""
text = text.replace(old_cctv_header, new_cctv_header)

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated UI')
