import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def create_report():
    doc = docx.Document()

    # Page Margins: 1 inch (72 pt / 1440 dxa)
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Monochrome Palette (Pure Black, Grays, White — No Color/Blue)
    BLACK = RGBColor(0, 0, 0)
    DARK_GRAY = RGBColor(40, 40, 40)
    MID_GRAY = RGBColor(90, 90, 90)
    WHITE = RGBColor(255, 255, 255)

    # ── HEADER & TITLE ──
    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_meta = p_meta.add_run("DOKUMEN PENGEMBANGAN TEKNOLOGI | PT HARMONI PANCA UTAMA\nKode Dokumen: HPU-FLEET-REV-2026-10")
    run_meta.font.name = 'Arial'
    run_meta.font.size = Pt(8.5)
    run_meta.font.color.rgb = MID_GRAY

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("LAPORAN PERKEMBANGAN REVISI\nSISTEM SMART FLEET DASHCAM & GEOFENCING")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(18)
    run_title.bold = True
    run_title.font.color.rgb = BLACK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(16)
    run_sub = p_sub.add_run("Implementasi 8 Butir Revisi Operasional Tambang Batubara PT Harmoni Panca Utama")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = MID_GRAY

    # Metadata Table (Tanpa Status)
    table_meta = doc.add_table(rows=3, cols=2)
    table_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_meta.autofit = False

    meta_items = [
        ("Nama Proyek", "HPU Dashcam Surveillance & Mining Telematics System"),
        ("Lokasi Codebase", "D:\\Semester 5\\hpu (Laravel 12, PostgreSQL, React Vite, CMSV6)"),
        ("Tanggal Dokumen", "Kamis, 27 Oktober 2026"),
    ]

    for idx, (lbl, val) in enumerate(meta_items):
        row = table_meta.rows[idx]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        cell_lbl.width = Inches(2.0)
        cell_val.width = Inches(4.5)
        
        p_l = cell_lbl.paragraphs[0]
        p_l.paragraph_format.space_before = Pt(3)
        p_l.paragraph_format.space_after = Pt(3)
        r_l = p_l.add_run(lbl)
        r_l.font.name = 'Arial'
        r_l.font.size = Pt(9.5)
        r_l.bold = True
        r_l.font.color.rgb = BLACK

        p_v = cell_val.paragraphs[0]
        p_v.paragraph_format.space_before = Pt(3)
        p_v.paragraph_format.space_after = Pt(3)
        r_v = p_v.add_run(val)
        r_v.font.name = 'Arial'
        r_v.font.size = Pt(9.5)
        r_v.font.color.rgb = DARK_GRAY

        set_cell_background(cell_lbl, "E5E5E5")
        set_cell_background(cell_val, "FAFAFA")
        set_cell_margins(cell_lbl, 80, 80, 120, 120)
        set_cell_margins(cell_val, 80, 80, 120, 120)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── BAB 1: RINGKASAN REVISI ──
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)
    r_h1 = h1.add_run("1. Ringkasan Butir Revisi")
    r_h1.font.name = 'Arial'
    r_h1.font.color.rgb = BLACK

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_after = Pt(8)
    p_intro.paragraph_format.line_spacing = 1.15
    r_intro = p_intro.add_run(
        "Laporan teknis ini mendokumentasikan hasil pengerjaan, refaktorisasi arsitektur, dan implementasi terhadap 8 (delapan) butir daftar revisi fitur Dashcam, Telemetri, dan Geofencing pada sistem Smart Fleet PT Harmoni Panca Utama (HPU). Seluruh butir revisi diterapkan pada antarmuka frontend (React Inertia Vite), layanan backend (Laravel 12 API), serta daemon worker pemantauan telemetri."
    )
    r_intro.font.name = 'Arial'
    r_intro.font.size = Pt(10)
    r_intro.font.color.rgb = DARK_GRAY

    # Tabel 8 Revisi (Tanpa Kolom Status, Hitam Putih)
    t_rev = doc.add_table(rows=1, cols=3)
    t_rev.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_rev.autofit = False

    headers = ["No", "Daftar Butir Revisi", "Komponen & Implementasi Teknis"]
    col_widths = [Inches(0.6), Inches(2.6), Inches(3.3)]

    hdr_cells = t_rev.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].width = col_widths[i]
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i == 0 else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(5)
        p.paragraph_format.space_after = Pt(5)
        r = p.add_run(title)
        r.font.name = 'Arial'
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = WHITE
        set_cell_background(hdr_cells[i], "000000")
        set_cell_margins(hdr_cells[i], 100, 100, 100, 100)

    rev_data = [
        ("1", "Opsi On/Off Livecam (Default: OFF Terlebih Dahulu)", "Inisialisasi variabel state isLivecamActive=false pada index.tsx. Selama livecam mati, iframe video tidak dimuat sehingga menghemat kuota jaringan dan mempercepat pemuatan peta. Dilengkapi tombol saklar kontrol pada bar CCTV."),
        ("2", "Highlight & Perbesar Peta (Core Dispatch View)", "Reposisi kontainer peta ke urutan teratas kolom pemantauan utama (lg:col-span-9). Ketinggian dasar dinaikkan menjadi 340px dengan fitur pembesaran hingga 500px, koordinat default Kalimantan Timur, tombol Fokus Unit, dan auto-recenter."),
        ("3", "Catatan Jam Shift & Waktu Running", "Integrasi tabel msshift (ShiftModel) yang menghubungkan jadwal Shift 1 (06:00 - 18:00 WITA, Istirahat: 12:00 - 13:00 WITA) dan Shift 2 (18:00 - 06:00 WITA, Istirahat: 00:00 - 01:00 WITA), jam awal running armada, dan durasi running kumulatif."),
        ("4", "Pengkategorian Maksimal Speed per Side / Site", "Master konfigurasi SITE_SPEED_LIMITS dengan batas kecepatan berbeda per side/site: Site HPA (Hauling 60 km/j • Pit 40 km/j), Site BDA (Hauling 50 km/j • Pit 35 km/j), Site KDA (Hauling 40 km/j • Pit 30 km/j), dan Hazard Zone (20-25 km/j)."),
        ("5", "Tombol On/Off Mic Intercom Kabin", "Penyediaan tombol MIC ON / MIC OFF pada bilah kontrol OSD CCTV kamera kabin. Dilengkapi indikator status mikrofon aktif pada banner pemantauan untuk memfasilitasi komunikasi audio dua arah antara operator ruang kontrol dan pengemudi."),
        ("6", "Kelanjutan Fitur Ritasi & Geofence Tambang", "Penyimpanan 530 data geofence (Pit, Port, Disposal, Workshop, Hazard, dan STA checkpoint per 100m) ke basis data PostgreSQL. Rute hauling sepanjang 21 KM dan 28.3 KM dirender melalui GeoJSON, dengan evaluasi siklus ritasi otomatis 5 tahap berdasar sensor PTO."),
        ("7", "Peta Masing-Masing Zona (Tarik Manual & Google Earth)", "Peta satelit Google Earth Hybrid resolusi tinggi, tombol Tarik Zona untuk input koordinat langsung melalui klik pada peta, form sesuai ketentuan Slide 26 (Polygon, Line, Circle), serta dukungan layer dan unggah ortofoto drone (GSD 5.2 cm/px)."),
        ("8", "Deploy ke Server Development HPU", "Optimasi kompilasi produksi Vite frontend (131 kB), penyediaan skrip start_presentation.bat berbasis Cloudflare Tunnel untuk peninjauan langsung via jaringan publik HTTPS, serta kesiapan konfigurasi cloud vercel.json.")
    ]

    for row_idx, data in enumerate(rev_data):
        row = t_rev.add_row()
        bg_col = "FFFFFF" if row_idx % 2 == 0 else "F7F7F7"
        for c_idx, text in enumerate(data):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            r.font.name = 'Arial'
            r.font.size = Pt(9)
            r.font.color.rgb = DARK_GRAY
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, 80, 80, 100, 100)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── BAB 2: URAIAN TEKNIS IMPLEMENTASI ──
    h2 = doc.add_heading(level=1)
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    r_h2 = h2.add_run("2. Uraian Teknis Implementasi")
    r_h2.font.name = 'Arial'
    r_h2.font.color.rgb = BLACK

    sections_content = [
        (
            "Revisi 1: Opsi On/Off Livecam (Default: OFF Terlebih Dahulu)",
            [
                "Latar Belakang: Streaming kamera video ganda (kamera depan jalan dan kamera kabin pengemudi) pada implementasi awal otomatis berjalan saat antarmuka pertama kali dibuka. Hal ini membebani penggunaan data perangkat telematika lapangan dan memperlambat render peta.",
                "Implementasi Teknis: Variabel state 'isLivecamActive' disetel secara default bernilai false. Selama kamera berada dalam kondisi nonaktif, elemen iframe pemutar video FLV Direct tidak di-render ke DOM, memberikan alokasi jaringan penuh bagi modul telemetri dan peta.",
                "Antarmuka Pengguna: Disediakan tombol saklar pada bilah kontrol pemantauan: tombol 'Nyalakan Livecam' saat posisi standby, dan tombol 'Matikan Livecam' saat posisi aktif."
            ]
        ),
        (
            "Revisi 2: Highlight & Perbesar Peta (Core Dispatch View)",
            [
                "Latar Belakang: Peta geospasial merupakan instrumen operasional utama bagi operator pengawas (dispatcher) untuk memantau pergerakan armada, antrean loading pit, dan titik pembuangan dumping.",
                "Implementasi Teknis: Posisi peta dipindahkan ke baris paling atas kolom kanan pemantauan (lg:col-span-9). Ketinggian dasar peta diatur sebesar 340px dengan tombol ekspansi layar luas hingga 500px ('isMapExpanded').",
                "Navigasi Cerdas: Peta langsung dipusatkan pada wilayah konsesi tambang batubara HPU di Kalimantan Timur (2.045000, 117.200000, zoom 14). Dilengkapi tombol 'Fokus Unit' untuk mengarahkan kamera peta ke koordinat armada aktif secara seketika."
            ]
        ),
        (
            "Revisi 3: Catatan Jam Shift (Mulai, Istirahat, Selesai, Awal Running & Durasi)",
            [
                "Latar Belakang: Diperlukan visibilitas jadwal kerja giliran pengemudi yang terhubung secara sistematis dengan waktu pengoperasian armada kendaraan.",
                "Integrasi Database: Terhubung langsung dengan master data tabel 'msshift' (App\\Models\\ShiftModel) yang mencakup jadwal kerja site HPU:",
                "  • Shift 1 (Siang): Pukul 06:00 WITA s/d 18:00 WITA (Jam Istirahat: 12:00 – 13:00 WITA).",
                "  • Shift 2 (Malam): Pukul 18:00 WITA s/d 06:00 WITA (Jam Istirahat: 00:00 – 01:00 WITA).",
                "Perhitungan Otomatis: Sistem mengaitkan waktu awal running unit (06:15 WITA) dan menghitung durasi operasional berjalan (Jam:Menit) pada panel pemantauan di atas bilah telemetri."
            ]
        ),
        (
            "Revisi 4: Pengkategorian Batas Kecepatan Maksimal per Side / Site",
            [
                "Latar Belakang: Standar operasional keselamatan armada tambang menetapkan batas kecepatan yang bervariasi bergantung pada site penambangan dan kondisi lereng jalan.",
                "Struktur Konfigurasi: Master data 'SITE_SPEED_LIMITS' menetapkan parameter kecepatan per sektor:",
                "  • Site HPA (Jalur Hauling Utama): Maksimal 60 km/j • Area Pit: Maksimal 40 km/j.",
                "  • Site BDA (Area Pit Operasional): Maksimal 50 km/j • Area Pit: Maksimal 35 km/j.",
                "  • Site KDA (Jalan Tambang): Maksimal 40 km/j • Area Pit: Maksimal 30 km/j.",
                "  • Site AMO & KJA: Maksimal 50 - 60 km/j • Area Pit: Maksimal 35 - 40 km/j.",
                "  • Zona Khusus (Gudang Peledak & Segmen Turunan Curam 5.2%): Maksimal 20 - 25 km/j.",
                "Pencegahan Pelanggaran: Evaluasi sistem secara real-time membandingkan kecepatan kendaraan dengan batas lokasi. Apabila terjadi overspeed, indikator kecepatan menampilkan peringatan keselamatan operasional."
            ]
        ),
        (
            "Revisi 5: Tombol On/Off Mic Intercom (Komunikasi Driver & Operator)",
            [
                "Latar Belakang: Pengawas ruang kontrol memerlukan akses interkom suara langsung untuk memberikan instruksi kepada pengemudi di kabin unit.",
                "Implementasi Teknis: Disediakan tombol 'MIC ON / MIC OFF' pada bilah kontrol CCTV dengan variabel kontrol 'isMicActive'.",
                "Indikator Operasional: Saat mikrofon aktif, sistem menampilkan label 'MIC ON (Bicara)' dan penanda interkom pada panel operasional, disertai konfirmasi keterhubungan audio ke kabin kendaraan."
            ]
        ),
        (
            "Revisi 6: Kelanjutan Fitur Ritasi & Geofence Tambang",
            [
                "Master Data Spasial: Sebanyak 530 geofence riil hasil survei koridor penambangan batubara HPU tersimpan pada PostgreSQL (7 Loading Pit, 8 Dumping Port/Disposal, 6 Workshop/Mess, 17 Hazard Zone/WMP, dan 492 Checkpoint STA interval 100 meter).",
                "Jalur Jalan Hauling: Dua lintasan jalan hauling sepanjang 21 KM (Rute HPA) dan 28.3 KM (Rute Tambang) dirender sebagai polyline vektor dari file GeoJSON terstandarisasi.",
                "Daemon Worker Ritasi: Background worker 'MonitorDashcamTelemetry.php' mengevaluasi koordinat kendaraan dengan formula Haversine. Siklus ritasi (Loading -> Travel Isi -> Dumping PTO On -> Travel Kosong) tercatat otomatis ke tabel 'ritasi_logs'."
            ]
        ),
        (
            "Revisi 7: Peta Masing-Masing Zona (Tarik Manual, Citra Satelit, & Foto Drone)",
            [
                "Google Earth Satellite: Mengintegrasikan layer citra satelit Google Earth Hybrid untuk menampilkan kontur pit galian dan badan jalan hauling secara terperinci.",
                "Mode Tarik Zona Manual: Tombol 'Tarik Zona' pada peta memungkinkan pengguna mengeklik titik-titik koordinat pada peta satelit untuk membentuk poligon batas area atau titik acuan baru.",
                "Kesesuaian Form Slide 26: Form geofence memuat atribut wajib: Nama, Koordinat (Lat, Long) dengan tombol pembantu GPS Unit dan Pusat Peta, Warna, Alamat, serta Radius jangkauan (tipe Polygon, Line, dan Cyrcle).",
                "Upload Photo Drone: Menyediakan tombol dan modal unggah ortofoto drone survei tambang (GSD 5.2 cm/px) dilengkapi pengatur transparansi (10% - 100%) di atas peta satelit."
            ]
        ),
        (
            "Revisi 8: Deploy ke Server Development HPU",
            [
                "Kompilasi Frontend: Proses 'npm run build' menghasilkan bundel aset produksi berukuran 131 kB yang teroptimasi tanpa kendala kompilasi.",
                "Skrip Pengujian Publik: Disediakan file 'start_presentation.bat' yang menjalankan backend Laravel, Vite, dan Cloudflare Tunnel HTTPS sehingga sistem dapat ditinjau langsung melalui peramban web eksternal.",
                "Kesiapan Server Staging: Konfigurasi serverless dan cloud 'vercel.json' serta 'api/index.php' siap diimplementasikan ke infrastruktur development milik HPU."
            ]
        )
    ]

    for title, points in sections_content:
        h_sub = doc.add_heading(level=2)
        h_sub.paragraph_format.space_before = Pt(10)
        h_sub.paragraph_format.space_after = Pt(4)
        r_sub = h_sub.add_run(title)
        r_sub.font.name = 'Arial'
        r_sub.font.size = Pt(11.5)
        r_sub.font.color.rgb = BLACK

        for pt in points:
            p_pt = doc.add_paragraph()
            p_pt.paragraph_format.space_after = Pt(4)
            p_pt.paragraph_format.line_spacing = 1.15
            r_pt = p_pt.add_run(pt)
            r_pt.font.name = 'Arial'
            r_pt.font.size = Pt(9.5)
            r_pt.font.color.rgb = DARK_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── BAB 3: VERIFIKASI PENGUJIAN SISTEM ──
    h3 = doc.add_heading(level=1)
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(6)
    r_h3 = h3.add_run("3. Rincian Pengujian Sistem")
    r_h3.font.name = 'Arial'
    r_h3.font.color.rgb = BLACK

    t_test = doc.add_table(rows=1, cols=3)
    t_test.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_test.autofit = False

    t_headers = ["Parameter Pengujian", "Metode / Perintah Pengujian", "Hasil Implementasi Teknis"]
    t_widths = [Inches(1.8), Inches(2.2), Inches(2.5)]

    for idx, th in enumerate(t_headers):
        t_test.rows[0].cells[idx].width = t_widths[idx]
        p = t_test.rows[0].cells[idx].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(th)
        r.font.name = 'Arial'
        r.font.size = Pt(9)
        r.bold = True
        r.font.color.rgb = WHITE
        set_cell_background(t_test.rows[0].cells[idx], "000000")
        set_cell_margins(t_test.rows[0].cells[idx], 80, 80, 80, 80)

    test_rows = [
        ("Database Seeder Geofence", "php artisan db:seed --class=GeofenceSeeder", "530 entri spasial terdaftar dan terindeks pada tabel geofences PostgreSQL."),
        ("Endpoint API Geofence", "GET /api/dashcam/geofences?category=operational", "38 zona operasional utama dikembalikan dengan waktu respon <50ms."),
        ("Endpoint Rute Hauling", "GET /api/dashcam/hauling-routes", "2 fitur LineString kontinu (~41.5 KB) terintegrasi pada GeoJSON."),
        ("Endpoint Foto Drone", "GET /api/dashcam/drone-photos", "Katalog ortofoto fotogrametri udara (GSD 5.2 cm/px) terhubung ke peta."),
        ("Evaluasi Spasial Ritasi", "Algoritma Haversine di MonitorDashcamTelemetry", "Deteksi masuk Pit (Loading), melintas STA, dan masuk Port (Dumping PTO On)."),
        ("Kompilasi Antarmuka", "npm run build (Vite v8.0.6)", "Kompilasi frontend berhasil dengan ukuran bundel produksi 131.18 kB.")
    ]

    for r_idx, r_data in enumerate(test_rows):
        row = t_test.add_row()
        bg_c = "FFFFFF" if r_idx % 2 == 0 else "F7F7F7"
        for c_idx, txt in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = t_widths[c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            r = p.add_run(txt)
            r.font.name = 'Arial'
            r.font.size = Pt(8.5)
            r.font.color.rgb = DARK_GRAY
            set_cell_background(cell, bg_c)
            set_cell_margins(cell, 60, 60, 80, 80)

    # ── TANDA TANGAN / PENGESAHAN ──
    doc.add_paragraph().paragraph_format.space_after = Pt(24)
    p_sign_hdr = doc.add_paragraph()
    p_sign_hdr.paragraph_format.space_after = Pt(8)
    r_sh = p_sign_hdr.add_run("LEMBAR PENGESAHAN DOKUMEN")
    r_sh.font.name = 'Arial'
    r_sh.font.size = Pt(10.5)
    r_sh.bold = True
    r_sh.font.color.rgb = BLACK

    t_sign = doc.add_table(rows=1, cols=2)
    t_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sign.autofit = False

    t_sign.rows[0].cells[0].width = Inches(3.2)
    t_sign.rows[0].cells[1].width = Inches(3.3)

    p_s1 = t_sign.rows[0].cells[0].paragraphs[0]
    p_s1.add_run("Disiapkan Oleh:\nTim Pengembang Smart Fleet Management\n\n\n\n\n( Muhammad / AI Engineering )")
    p_s1.runs[0].font.name = 'Arial'
    p_s1.runs[0].font.size = Pt(9.5)
    p_s1.runs[0].font.color.rgb = BLACK

    p_s2 = t_sign.rows[0].cells[1].paragraphs[0]
    p_s2.add_run("Disetujui Oleh:\nManajemen Operasional PT Harmoni Panca Utama\n\n\n\n\n( Manajemen / PIC Proyek HPU )")
    p_s2.runs[0].font.name = 'Arial'
    p_s2.runs[0].font.size = Pt(9.5)
    p_s2.runs[0].font.color.rgb = BLACK

    for cell in [t_sign.rows[0].cells[0], t_sign.rows[0].cells[1]]:
        set_cell_background(cell, "F5F5F5")
        set_cell_margins(cell, 100, 100, 120, 120)

    # Simpan File DOCX
    docx_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"
    docx_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"
    
    doc.save(docx_path1)
    doc.save(docx_path2)
    print("Monochrome DOCX generated successfully at:")
    print("1.", docx_path1)
    print("2.", docx_path2)

if __name__ == '__main__':
    create_report()
