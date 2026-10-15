import sys

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

exca_start = text.find('{/* EXCAVATOR CARD 1:')
if exca_start == -1:
    print("Cannot find exca_start")
    sys.exit(1)

exca_end_marker = text.find('</>', exca_start)
if exca_end_marker == -1:
    print("Cannot find exca_end_marker")
    sys.exit(1)

placeholder = """{/* EXCAVATOR PLACEHOLDER */}
                                <div className="bg-slate-100 rounded-3xl border border-slate-300 border-dashed p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                                    <div className="w-20 h-20 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                                        <Activity className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black tracking-wider uppercase text-slate-500">
                                            SPESIFIKASI TELEMETRI BELUM TERSEDIA
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                                            Modul analitik produktivitas dan metrik sensor untuk unit tipe Excavator sementara ini disembunyikan. Modul akan diaktifkan setelah dokumen instruksi resmi atau SOP operasional dari manajemen diterima.
                                        </p>
                                    </div>
                                </div>
                                    """

new_text = text[:exca_start] + placeholder + text[exca_end_marker:]

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Replaced Excavator cards with placeholder")
