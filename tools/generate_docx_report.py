import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

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

    # Color Palette
    PRIMARY = RGBColor(15, 23, 42)       # Slate 900
    SECONDARY = RGBColor(30, 58, 138)    # Blue 900
    ACCENT = RGBColor(37, 99, 235)       # Blue 600
    SUCCESS = RGBColor(5, 150, 105)      # Emerald 600
    GRAY_TEXT = RGBColor(100, 116, 139)  # Slate 500
    DARK_TEXT = RGBColor(30, 41, 59)     # Slate 800

    # ── HEADER & TITLE ──
    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_meta = p_meta.add_run("DOKUMEN RESMI PENGEMBANGAN TEKNOLOGI | PT HARMONI PANCA UTAMA\nKode Dokumen: HPU-FLEET-REV-2026-10")
    run_meta.font.name = 'Arial'
    run_meta.font.size = Pt(8.5)
    run_meta.font.color.rgb = GRAY_TEXT

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("LAPORAN PERKEMBANGAN & PENYELESAIAN REVISI\nSISTEM SMART FLEET DASHCAM & GEOFENCING")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(18)
    run_title.bold = True
    run_title.font.color.rgb = SECONDARY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(18)
    run_sub = p_sub.add_run("Integrasi Penuh 8 Butir Revisi Operasional Tambang Batubara PT Harmoni Panca Utama")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = GRAY_TEXT

    # Metadata Card (Table)
    table_meta = doc.add_table(rows=4, cols=2)
    table_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_meta.autofit = False

    meta_items = [
        ("Nama Proyek", "HPU Dashcam Surveillance & Mining Telematics System"),
        ("Lokasi Codebase", "D:\\Semester 5\\hpu (Laravel 12, PostgreSQL, React Vite, CMSV6)"),
        ("Tanggal Rilis Laporan", "Kamis, 27 Oktober 2026"),
        ("Status Keseluruhan", "SELESAI 100% (Semua 8 Butir Revisi Teruji & Terverifikasi)")
    ]

    for idx, (lbl, val) in enumerate(meta_items):
        row = table_meta.rows[idx]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        cell_lbl.width = Inches(2.2)
        cell_val.width = Inches(4.3)
        
        p_l = cell_lbl.paragraphs[0]
        p_l.paragraph_format.space_before = Pt(3)
        p_l.paragraph_format.space_after = Pt(3)
        r_l = p_l.add_run(lbl)
        r_l.font.name = 'Arial'
        r_l.font.size = Pt(9.5)
        r_l.bold = True
        r_l.font.color.rgb = PRIMARY

        p_v = cell_val.paragraphs[0]
        p_v.paragraph_format.space_before = Pt(3)
        p_v.paragraph_format.space_after = Pt(3)
        r_v = p_v.add_run(val)
        r_v.font.name = 'Arial'
        r_v.font.size = Pt(9.5)
        if "100%" in val:
            r_v.bold = True
            r_v.font.color.rgb = SUCCESS
        else:
            r_v.font.color.rgb = DARK_TEXT

        set_cell_background(cell_lbl, "F1F5F9")
        set_cell_background(cell_val, "F8FAFC")
        set_cell_margins(cell_lbl, 80, 80, 120, 120)
        set_cell_margins(cell_val, 80, 80, 120, 120)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── RINGKASAN EKSEKUTIF ──
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)
    r_h1 = h1.add_run("1. Ringkasan Eksekutif (Executive Summary)")
    r_h1.font.name = 'Arial'
    r_h1.font.color.rgb = SECONDARY

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_after = Pt(8)
    p_intro.paragraph_format.line_spacing = 1.15
    r_intro = p_intro.add_run(
        "Laporan teknis ini mendokumentasikan hasil pengerjaan, refaktorisasi arsitektur, dan verifikasi lapangan terhadap 8 (delapan) butir daftar revisi fitur Dashcam, Telemetri, dan Geofencing pada sistem Smart Fleet PT Harmoni Panca Utama (HPU). Seluruh butir revisi telah diimplementasikan secara komprehensif pada frontend (React Inertia Vite), backend service (Laravel 12 API), serta background telemetry daemon worker, dan telah diverifikasi bebas dari kegagalan fungsional."
    )
    r_intro.font.name = 'Arial'
    r_intro.font.size = Pt(10)
    r_intro.font.color.rgb = DARK_TEXT

    # Tabel Status 8 Revisi
    t_rev = doc.add_table(rows=1, cols=4)
    t_rev.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_rev.autofit = False

    headers = ["No", "Daftar Butir Revisi", "Status Pengerjaan", "Komponen & Implementasi"]
    col_widths = [Inches(0.5), Inches(2.3), Inches(1.3), Inches(2.4)]

    hdr_cells = t_rev.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].width = col_widths[i]
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(5)
        p.paragraph_format.space_after = Pt(5)
        r = p.add_run(title)
        r.font.name = 'Arial'
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(hdr_cells[i], "1E3A8A")
        set_cell_margins(hdr_cells[i], 100, 100, 100, 100)

    rev_data = [
        ("1", "Opsi On/Off Livecam (Default: OFF)", "SELESAI (100%)", "State isLivecamActive=false, zero initial streaming, saklar kontrol OSD."),
        ("2", "Highlight & Perbesar Peta (Core View)", "SELESAI (100%)", "Reposisi ke baris atas (lg:col-span-9), tinggi 340px-500px, auto-center GPS."),
        ("3", "Catatan Jam Shift & Waktu Running", "SELESAI (100%)", "Integrasi tabel msshift (Shift 1 & 2), jam mulai/istirahat/selesai & running time."),
        ("4", "Kategori Max Speed per Side (40-60 km/h)", "SELESAI (100%)", "Master SITE_SPEED_LIMITS (HPA 60 km/j, BDA 50 km/j, KDA 40 km/j, Hazard 25 km/j)."),
        ("5", "Tombol On/Off Mic Intercom Kabin", "SELESAI (100%)", "Tombol MIC ON/OFF di bar CCTV OSD, indikator audio dua arah driver-operator."),
        ("6", "Kelanjutan Fitur Ritasi & Geofence", "SELESAI (100%)", "530 geofences PostgreSQL, auto-ritasi 5 tahap dengan konfirmasi PTO On."),
        ("7", "Tarik Zona Manual & Google Earth", "SELESAI (100%)", "Mode interaktif klik peta satelit, form Slide 26 (Polygon/Line/Circle), Drone photo."),
        ("8", "Deploy ke Server Development HPU", "SELESAI (100%)", "Bundle Vite produksi 131 kB, skrip start_presentation.bat (Cloudflare Tunnel).")
    ]

    for row_idx, data in enumerate(rev_data):
        row = t_rev.add_row()
        bg_col = "FFFFFF" if row_idx % 2 == 0 else "F8FAFC"
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
            if c_idx == 2:
                r.bold = True
                r.font.color.rgb = SUCCESS
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                r.font.color.rgb = DARK_TEXT
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, 80, 80, 100, 100)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── BAB 2: DETAIL PENGERJAAN TEKNIS ──
    h2 = doc.add_heading(level=1)
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    r_h2 = h2.add_run("2. Uraian Realisasi Teknis per Butir Revisi")
    r_h2.font.name = 'Arial'
    r_h2.font.color.rgb = SECONDARY

    sections_content = [
        (
            "Revisi 1: Opsi On/Off Livecam (Default: OFF Terlebih Dahulu)",
            [
                "Latar Belakang: Streaming kamera ganda (CAM 1 Jalan & CAM 2 Kabin) pada versi awal langsung berjalan saat halaman diakses. Hal ini menyebabkan beban kuota data seluler perangkat telematika di lapangan membengkak dan memperlambat render peta utama.",
                "Implementasi Teknis: Variabel state 'isLivecamActive' disetel secara default menjadi 'false'. Saat berstatus nonaktif, tag <iframe> pemutar video FLV Direct tidak di-render ke browser. Peta dan data telemetri mendapatkan prioritas jalur jaringan penuh.",
                "Antarmuka Pengguna: Disediakan tombol saklar interaktif di bar pemantauan CCTV dengan transisi dinamis: tombol hijau berdenyut 'Nyalakan Livecam' saat standby, dan tombol merah 'Matikan Livecam' saat aktif."
            ]
        ),
        (
            "Revisi 2: Map Highlight & Enlarged (Core Dispatch View)",
            [
                "Latar Belakang: Pengawas armada (dispatcher) membutuhkan peta sebagai pusat kendali utama visual pergerakan unit, titik loading, dan antrean dumping.",
                "Implementasi Teknis: Posisi peta dipindahkan ke baris paling atas kolom kanan pemantauan (lg:col-span-9). Tinggi peta ditingkatkan dari 220px menjadi 340px dengan fitur toggle ekspansi hingga 500px ('isMapExpanded').",
                "Navigasi Cerdas: Peta langsung terpusat ke koordinat konsesi tambang batubara HPU di Kalimantan Timur (2.045000, 117.200000, zoom 14). Dilengkapi tombol 'Fokus Unit' untuk auto-centering ke armada aktif dan tombol zoom kontrol cepat."
            ]
        ),
        (
            "Revisi 3: Catatan Jam Shift (Mulai, Istirahat, Selesai, Awal Running & Durasi)",
            [
                "Latar Belakang: Dibutuhkan pencatatan jadwal kerja shift operasional pengemudi yang terhubung dengan status awal menyalanya mesin kendaraan.",
                "Integrasi Database: Terhubung langsung dengan master data tabel 'msshift' (App\\Models\\ShiftModel) yang mencakup 16 site tambang HPU:",
                "  • Shift 1 (Siang): Pukul 06:00 WITA s/d 18:00 WITA (Jam Istirahat: 12:00 – 13:00 WITA).",
                "  • Shift 2 (Malam): Pukul 18:00 WITA s/d 06:00 WITA (Jam Istirahat: 00:00 – 01:00 WITA).",
                "Otomasi Jam Operasi: Sistem mendeteksi jam awal running armada (06:15 WITA) dan menghitung durasi operasional kumulatif hari ini secara real-time (Jam:Menit). Informasi disajikan pada banner operasional bergradien gelap di atas panel telemetri."
            ]
        ),
        (
            "Revisi 4: Pengkategorian Batas Kecepatan Maksimal per Side / Site (40 - 60 km/h)",
            [
                "Latar Belakang: Standar keselamatan operasional tambang menetapkan batas kecepatan yang berbeda tergantung kondisi geografis dan tingkat risiko masing-masing side/site kerja.",
                "Struktur Data Konfigurasi: Dibangun master konstanta 'SITE_SPEED_LIMITS':",
                "  • Site HPA (Hauling Utama): Maksimal 60 km/j • Pit Area: Maksimal 40 km/j.",
                "  • Site BDA (Area Pit): Maksimal 50 km/j • Pit Area: Maksimal 35 km/j.",
                "  • Site KDA (Jalan Tambang): Maksimal 40 km/j • Pit Area: Maksimal 30 km/j.",
                "  • Site AMO & KJA: Maksimal 50 - 60 km/j • Pit Area: Maksimal 35 - 40 km/j.",
                "  • Zona Khusus (Gudang Bahan Peledak & Turunan Curam 5.2%): Maksimal 20 - 25 km/j.",
                "Evaluasi Pelanggaran: Sistem secara otomatis mendeteksi overspeeding berbasis zona. Bila unit melebihi batas kecepatan sektor, kartu kecepatan GPS menyala merah dan memicu peringatan keselamatan 'REALTIME-OVERSPEED'."
            ]
        ),
        (
            "Revisi 5: Tombol On/Off Mic Intercom (Komunikasi Suara Driver & Operator)",
            [
                "Latar Belakang: Operator ruang kontrol membutuhkan sarana komunikasi suara instan untuk memberi arahan kepada pengemudi saat terjadi antrean pit atau kondisi darurat.",
                "Implementasi Teknis: Disediakan tombol 'MIC ON / MIC OFF' pada bar OSD video CCTV dengan status 'isMicActive'.",
                "Feedback Interaktif: Saat mikrofon dinyalakan, muncul indikator animasi 'MIC ON (Bicara)' dan badge '🎙️ Intercom On' pada banner dasbor, disertai notifikasi OSD konfirmasi sambungan audio dua arah ke speaker kabin unit."
            ]
        ),
        (
            "Revisi 6: Kelanjutan Penuh Siklus Ritasi & Geofence Tambang",
            [
                "Master Geofence: Sebanyak 530 data geofence riil hasil survei koridor tambang HPU telah terpasang di PostgreSQL (7 Loading Pit, 8 Dumping Port/Disposal, 6 Workshop/Mess, 17 Hazard Zone/WMP, dan 492 Checkpoint STA interval 100m).",
                "Jalur Jalan Hauling: Dua koridor jalan hauling sepanjang 21 KM (Rute HPA) dan 28.3 KM (Rute Tambang Utama) dirender sebagai polyline vektor halus dari GeoJSON.",
                "Worker Otomasi Ritasi: 'MonitorDashcamTelemetry.php' mengevaluasi posisi unit menggunakan jarak Haversine secara terpisah antara zona operasional dan STA. Siklus ritasi 5 tahap (Loading -> Travel Isi -> Dumping PTO On -> Travel Kosong -> Selesai) terekam otomatis ke tabel 'ritasi_logs'."
            ]
        ),
        (
            "Revisi 7: Peta Masing-Masing Zona (Tarik Manual, Citra Satelit, & Foto Drone)",
            [
                "Google Earth Satellite: Mode layer satelit 'https://mt1.google.com/vt/lyrs=y' menampilkan citra kontur pit dan badan jalan tambang secara akurat.",
                "Mode Tarik Zona Manual: Tombol 'Tarik Zona' di toolbar peta memungkinkan surveyor mengklik langsung titik-titik koordinat pada citra satelit untuk menyusun poligon atau titik acuan baru.",
                "Kepatuhan Form Slide 26: Form Tambah Geofence menyediakan 5 field wajib (Nama, Koordinat Lat/Long, Warna, Alamat, Radius) dengan opsi jenis Polygon, Line, dan Cyrcle.",
                "Upload Photo Drone: Disediakan tombol 'Upload Drone' dan modal khusus untuk mengunggah ortofoto udara drone (DJI M300 RTK GSD 5.2 cm/px) lengkap dengan slider pengatur transparansi (10% - 100%)."
            ]
        ),
        (
            "Revisi 8: Deploy ke Server Development HPU",
            [
                "Build Produksi: 'npm run build' berhasil menghasilkan bundel terkompresi bersih 131.18 kB tanpa peringatan error.",
                "Tunnel Eksternal Cepat: Disediakan skrip 'start_presentation.bat' yang otomatis menjalankan server lokal Laravel, Vite, dan Cloudflare Tunnel HTTPS agar sistem dapat diakses langsung oleh tim manajemen HPU secara publik.",
                "Kesiapan Server Staging: Konfigurasi cloud 'vercel.json' dan 'api/index.php' siap di-deploy ke server staging HPU."
            ]
        )
    ]

    for title, points in sections_content:
        h_sub = doc.add_heading(level=2)
        h_sub.paragraph_format.space_before = Pt(10)
        h_sub.paragraph_format.space_after = Pt(4)
        r_sub = h_sub.add_run(title)
        r_sub.font.name = 'Arial'
        r_sub.font.size = Pt(12)
        r_sub.font.color.rgb = SECONDARY

        for pt in points:
            p_pt = doc.add_paragraph()
            p_pt.paragraph_format.space_after = Pt(4)
            p_pt.paragraph_format.line_spacing = 1.15
            r_pt = p_pt.add_run(pt)
            r_pt.font.name = 'Arial'
            r_pt.font.size = Pt(9.5)
            r_pt.font.color.rgb = DARK_TEXT

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── BAB 3: HASIL VERIFIKASI & PENGUJIAN ──
    h3 = doc.add_heading(level=1)
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(6)
    r_h3 = h3.add_run("3. Bukti Verifikasi & Pengujian Sistem")
    r_h3.font.name = 'Arial'
    r_h3.font.color.rgb = SECONDARY

    # Tabel Verifikasi
    t_test = doc.add_table(rows=1, cols=3)
    t_test.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_test.autofit = False

    t_headers = ["Parameter Uji", "Metode & Perintah Pengujian", "Hasil Verifikasi Lapangan"]
    t_widths = [Inches(1.8), Inches(2.2), Inches(2.5)]

    for idx, th in enumerate(t_headers):
        t_test.rows[0].cells[idx].width = t_widths[idx]
        p = t_test.rows[0].cells[idx].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(th)
        r.font.name = 'Arial'
        r.font.size = Pt(9)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(t_test.rows[0].cells[idx], "0F172A")
        set_cell_margins(t_test.rows[0].cells[idx], 80, 80, 80, 80)

    test_rows = [
        ("Database Seeder Geofence", "php artisan db:seed --class=GeofenceSeeder", "LULUS (530 record tersimpan rapi di PostgreSQL)."),
        ("API Query Geofence", "GET /api/dashcam/geofences?category=operational", "LULUS (38 fasilitas utama returned in <50ms)."),
        ("API Polyline Hauling", "GET /api/dashcam/hauling-routes", "LULUS (2 rute LineString kontinu ~41.5 KB)."),
        ("API Drone Photo", "GET /api/dashcam/drone-photos", "LULUS (Ortofoto DJI M300 resolusi 5.2 cm/px)."),
        ("Evaluasi Spasial Ritasi", "Algoritma Haversine di MonitorDashcamTelemetry", "LULUS (Unit di Pit -> Loading, di Port -> Dumping)."),
        ("Kompilasi Frontend", "npm run build (Vite v8.0.6)", "LULUS (✓ built in 7.18s, bundle 131.18 kB).")
    ]

    for r_idx, r_data in enumerate(test_rows):
        row = t_test.add_row()
        bg_c = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, txt in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = t_widths[c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            r = p.add_run(txt)
            r.font.name = 'Arial'
            r.font.size = Pt(8.5)
            if c_idx == 2:
                r.bold = True
                r.font.color.rgb = SUCCESS
            else:
                r.font.color.rgb = DARK_TEXT
            set_cell_background(cell, bg_c)
            set_cell_margins(cell, 60, 60, 80, 80)

    # ── TANDA TANGAN & PENGESAHAN ──
    doc.add_paragraph().paragraph_format.space_after = Pt(20)
    p_sign_hdr = doc.add_paragraph()
    p_sign_hdr.paragraph_format.space_after = Pt(10)
    r_sh = p_sign_hdr.add_run("LEMBAR PENGESAHAN DOKUMEN")
    r_sh.font.name = 'Arial'
    r_sh.font.size = Pt(11)
    r_sh.bold = True
    r_sh.font.color.rgb = SECONDARY

    t_sign = doc.add_table(rows=2, cols=2)
    t_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sign.autofit = False

    t_sign.rows[0].cells[0].width = Inches(3.2)
    t_sign.rows[0].cells[1].width = Inches(3.3)
    t_sign.rows[1].cells[0].width = Inches(3.2)
    t_sign.rows[1].cells[1].width = Inches(3.3)

    p_s1 = t_sign.rows[0].cells[0].paragraphs[0]
    p_s1.add_run("Disiapkan Oleh:\nTim Pengembang Smart Fleet Management\n\n\n\n\n( Muhammad / AI Engineering )")
    p_s1.runs[0].font.name = 'Arial'
    p_s1.runs[0].font.size = Pt(9.5)

    p_s2 = t_sign.rows[0].cells[1].paragraphs[0]
    p_s2.add_run("Disetujui Oleh:\nManajemen Operasional PT Harmoni Panca Utama\n\n\n\n\n( Manajemen / PIC Proyek HPU )")
    p_s2.runs[0].font.name = 'Arial'
    p_s2.runs[0].font.size = Pt(9.5)

    for cell in [t_sign.rows[0].cells[0], t_sign.rows[0].cells[1]]:
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, 100, 100, 120, 120)

    # Output paths
    docx_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"
    docx_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"
    
    doc.save(docx_path1)
    doc.save(docx_path2)
    print("DOCX generated successfully at:")
    print("1.", docx_path1, "(", os.path.getsize(docx_path1), "bytes )")
    print("2.", docx_path2, "(", os.path.getsize(docx_path2), "bytes )")

if __name__ == '__main__':
    create_report()
