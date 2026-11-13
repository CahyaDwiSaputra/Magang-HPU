import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_dense_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Palet Warna Modern & Industrial Tambang
    C_NAVY_DARK   = RGBColor(15, 23, 42)      # #0F172A
    C_NAVY_CARD   = RGBColor(30, 41, 59)      # #1E293B
    C_BLUE_MAIN   = RGBColor(37, 99, 235)     # #2563EB
    C_BLUE_LIGHT  = RGBColor(239, 246, 255)   # #EFF6FF
    C_BLUE_BORDER = RGBColor(191, 219, 254)   # #BFDBFE
    C_AMBER       = RGBColor(217, 119, 6)     # #D97706
    C_AMBER_LIGHT = RGBColor(254, 243, 199)   # #FEF3C7
    C_ORANGE_MINE = RGBColor(234, 88, 12)     # #EA580C
    C_GREEN_OK    = RGBColor(16, 185, 129)    # #10B981
    C_GREEN_LIGHT = RGBColor(236, 253, 245)   # #ECFDF5
    C_TEXT_DARK   = RGBColor(15, 23, 42)      # #0F172A
    C_TEXT_SLATE  = RGBColor(51, 65, 85)      # #334155
    C_TEXT_MUTED  = RGBColor(100, 116, 139)   # #64748B
    C_BORDER      = RGBColor(226, 232, 240)   # #E2E8F0
    C_BG_CARD     = RGBColor(248, 250, 252)   # #F8FAFC
    C_WHITE       = RGBColor(255, 255, 255)

    def add_top_bar(slide, title_text, category_text, page_num):
        # Header banner
        header_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(12.133), Inches(0.85))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)

        p0 = tf.paragraphs[0]
        p0.text = f"PT HARMONI PANCA UTAMA • SMART FLEET TELEMATICS | {category_text.upper()}"
        p0.font.name = "Arial"
        p0.font.size = Pt(8.5)
        p0.font.bold = True
        p0.font.color.rgb = C_BLUE_MAIN
        p0.space_after = Pt(2)

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.name = "Arial"
        p1.font.size = Pt(18)
        p1.font.bold = True
        p1.font.color.rgb = C_NAVY_DARK

        # Page badge di kanan atas
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.3), Inches(0.4), Inches(1.4), Inches(0.32))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_BLUE_LIGHT
        badge.line.color.rgb = C_BLUE_BORDER
        badge.line.width = Pt(1)
        tf_b = badge.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.text = f"SLIDE {page_num} / 5"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(8.5)
        p_b.font.bold = True
        p_b.font.color.rgb = C_BLUE_MAIN
        p_b.alignment = PP_ALIGN.CENTER

        # Separator line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.25), Inches(12.133), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.color.rgb = C_BORDER

    def add_card(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # ==========================================================
    # SLIDE 1: JUDUL & RINGKASAN EKSEKUTIF PROYEK (DENSE HERO)
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY_DARK
    bg1.line.fill.background()

    # Top Brand Pill
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(3.6), Inches(0.35))
    pill.fill.solid()
    pill.fill.fore_color.rgb = C_NAVY_CARD
    pill.line.color.rgb = C_BLUE_MAIN
    tf_p = pill.text_frame
    tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_p = tf_p.paragraphs[0]
    p_p.text = "SMART FLEET MANAGEMENT SYSTEM • PT HPU"
    p_p.font.name = "Arial"
    p_p.font.size = Pt(8.5)
    p_p.font.bold = True
    p_p.font.color.rgb = RGBColor(147, 197, 253)
    p_p.alignment = PP_ALIGN.CENTER

    # Main Hero Title
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.05), Inches(11.733), Inches(1.5))
    tf_hero = t_box.text_frame
    tf_hero.word_wrap = True
    tf_hero.margin_left = tf_hero.margin_top = tf_hero.margin_right = tf_hero.margin_bottom = Inches(0)
    
    p = tf_hero.paragraphs[0]
    p.text = "Laporan Perkembangan Teknis: Realisasi 8 Butir Revisi Dashcam & Geofencing"
    p.font.name = "Arial"
    p.font.size = Pt(23)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(4)

    p = tf_hero.add_paragraph()
    p.text = "Implementasi Arsitektur Multi-Site (HPA Berau & BDA Barito 45.2 KM), Otomasi Siklus Ritasi Sensor PTO, Ray-Casting Spasial, dan Deployment Server 10.10.0.54"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(203, 213, 225)

    # 4 Key Stat Cards
    stats = [
        ("1.445", "Total Master Geofence", "530 HPA + 915 BDA di PostgreSQL 16"),
        ("45.2 KM", "Koridor Hauling BDA", "1.081 Koordinat Kontinu + 905 Patok STA"),
        ("100% LIVE", "Server Development", "Host 10.10.0.54 Ubuntu Docker & Nginx"),
        ("8 DARI 8", "Status Butir Revisi", "Semua Poin Selesai, Teruji & Terverifikasi")
    ]
    for idx, (val, lbl, sub) in enumerate(stats):
        x = 0.8 + idx * (2.8 + 0.177)
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.7), Inches(2.8), Inches(1.15))
        c.fill.solid()
        c.fill.fore_color.rgb = C_NAVY_CARD
        c.line.color.rgb = RGBColor(51, 65, 85)
        tf_c = c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.15)
        tf_c.margin_top = Inches(0.12)
        
        p = tf_c.paragraphs[0]
        p.text = val
        p.font.name = "Arial"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = C_AMBER if idx == 1 else (C_GREEN_OK if idx >= 2 else C_BLUE_MAIN)
        
        p = tf_c.add_paragraph()
        p.text = lbl
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        
        p = tf_c.add_paragraph()
        p.text = sub
        p.font.name = "Arial"
        p.font.size = Pt(8)
        p.font.color.rgb = RGBColor(148, 163, 184)

    # Executive Overview Table / Matrix on Bottom Half
    add_card(s1, 0.8, 4.05, 11.733, 3.0, C_NAVY_CARD, RGBColor(51, 65, 85))
    t_mat = s1.shapes.add_textbox(Inches(1.0), Inches(4.2), Inches(11.333), Inches(2.7))
    tf_mat = t_mat.text_frame
    tf_mat.word_wrap = True
    tf_mat.margin_left = tf_mat.margin_top = tf_mat.margin_right = tf_mat.margin_bottom = Inches(0)

    p = tf_mat.paragraphs[0]
    p.text = "RINGKASAN STATUS EKSEKUSI 8 BUTIR REVISI OPERASIONAL:"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(6)

    revisi_rows = [
        ("Poin 1 & 2: Kontrol Livecam & Layout Peta", "Livecam default OFF hemat kuota 4G; Layout kanvas satelit Google Earth lebar penuh 100% di posisi paling atas."),
        ("Poin 3 & 4: Jadwal Shift & Batas Kecepatan", "Integrasi tabel msshift (Shift 1 & 2), sinkronisasi kontak ACC GPS riil, konfigurasi SITE_SPEED_LIMITS (40 s.d. 60 km/j)."),
        ("Poin 5 & 6: Intercom Audio & Siklus Ritasi", "Tombol On/Off Mic kabin driver, otomasi 5 tahap ritasi via konfirmasi sensor hidrolik PTO, algoritma Ray-Casting spasial."),
        ("Poin 7 & 8: Digitasi Zona & Deploy Server", "HUD Tarik Zona Google Earth hitung Luas Ha & Keliling meter instan, tuntas beroperasi di server 10.10.0.54 Nginx proxy.")
    ]
    for title, desc in revisi_rows:
        p = tf_mat.add_paragraph()
        p.text = f"• {title} -> {desc}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(4)

    p = tf_mat.add_paragraph()
    p.text = "Verifikasi: Tim Magang HPU x UNS (Cahya Dwi Saputra) | Database: PostgreSQL 16 'hpuxuns' | Tanggal: November 2026"
    p.font.name = "Arial"
    p.font.size = Pt(8.5)
    p.font.italic = True
    p.font.color.rgb = RGBColor(148, 163, 184)

    # ==========================================================
    # SLIDE 2: REVISI 1 & 2 (LIVECAM ON/OFF & MAP HIGHLIGHT FULL-WIDTH)
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_top_bar(s2, "Revisi 1 & 2: Optimalisasi Kontrol Livecam & Peta Utama Lebar Penuh", "CCTV & DISPATCH MAPPING", 2)

    # Kolom Kiri: Poin 1 (Livecam On/Off)
    add_card(s2, 0.6, 1.45, 5.9, 5.6, C_WHITE, C_BORDER)
    t_c1 = s2.shapes.add_textbox(Inches(0.85), Inches(1.65), Inches(5.4), Inches(5.2))
    tf_c1 = t_c1.text_frame
    tf_c1.word_wrap = True
    tf_c1.margin_left = tf_c1.margin_top = tf_c1.margin_right = tf_c1.margin_bottom = Inches(0)

    p = tf_c1.paragraphs[0]
    p.text = "POIN 1: KONTROL SELEKTIF ON/OFF LIVECAM"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(6)

    bullets_p1 = [
        ("Latar Belakang Operasional:", "Koneksi 4G seluler di area tambang memiliki keterbatasan bandwidth. Memutar belasan video CCTV secara otomatis dan bersamaan menyebabkan pemborosan kuota dan kemacetan gateway transmisi data."),
        ("Solusi State Default OFF:", "Variabel `isLivecamActive` diset default `false`. Iframe video FLV dan koneksi WebSocket CMSV6 tidak aktif sebelum dispatcher menekan tombol pengaktifan."),
        ("Tombol Kontrol Ergonomis:", "Disediakan tombol toggle 'Nyalakan Livecam' hijau dengan indikator status jelas: 'LIVECAM STANDBY (OFF)'. Dispatcher bebas memilih unit yang perlu diinspeksi."),
        ("Penanganan Unit Standby:", "Jika mesin unit mati di pit, sistem menampilkan notifikasi ramah 'Engine Standby di Pit' tanpa memicu crash atau loop error pada library flv.js."),
        ("Hasil Terukur:", "Mereduksi konsumsi kuota data kartu SIM MDVR armada hingga 80% pada operasional pemantauan normal.")
    ]
    for h, b in bullets_p1:
        p = tf_c1.add_paragraph()
        p.text = f"• {h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # Kolom Kanan: Poin 2 (Map Full-Width & Satelit)
    add_card(s2, 6.833, 1.45, 5.9, 5.6, C_WHITE, C_BORDER)
    t_c2 = s2.shapes.add_textbox(Inches(7.083), Inches(1.65), Inches(5.4), Inches(5.2))
    tf_c2 = t_c2.text_frame
    tf_c2.word_wrap = True
    tf_c2.margin_left = tf_c2.margin_top = tf_c2.margin_right = tf_c2.margin_bottom = Inches(0)

    p = tf_c2.paragraphs[0]
    p.text = "POIN 2: HIGHLIGHT PETA UTAMA LEBAR PENUH (CORE DISPATCH)"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(6)

    bullets_p2 = [
        ("Reposisi Tata Letak Utama:", "Kanvas peta satelit dijadikan pusat kendali dispatcher (Core Dispatch View), ditarik membentang 100% horizontal di bagian atas layar dengan tinggi dasar 400px (expandable ke 580px)."),
        ("Modul CCTV di Bawah Peta:", "Pemutar video dipindahkan ke baris bawahnya sehingga pandangan operator fokus pada pergerakan rute armada dan perimeter geofence."),
        ("Citra Satelit Google Earth:", "Mengintegrasikan tile satelit Google Earth Hybrid resolusi tinggi, menampilkan visual kontur pit, jalan hauling berdebu, kolam pengendapan limbah WMP, dan stockpile."),
        ("Navigasi Auto-Pan Cerdas:", "Kamera peta otomatis meluncur ke lokasi armada terpilih: unit BDA langsung terbang ke Barito (Kalteng/Kalsel), unit HPA langsung mengunci ke Berau (Kaltim)."),
        ("Toolbar Pengalih Site:", "Tombol navigasi cepat satu klik: [Semua Site], [HPA (Berau)], dan [BDA (Barito)] untuk efisiensi navigasi dispatcher.")
    ]
    for h, b in bullets_p2:
        p = tf_c2.add_paragraph()
        p.text = f"• {h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # ==========================================================
    # SLIDE 3: REVISI 3, 4 & 5 (SHIFT, SPEED LIMITS & INTERCOM)
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_top_bar(s3, "Revisi 3, 4 & 5: Manajemen Shift, Batas Kecepatan Site & Intercom Kabin", "OPERATIONAL SAFETY & DISPATCH", 3)

    # 3 Kolom
    col_w = 3.8
    gap = 0.366

    # Kolom 1: Poin 3 (Shift)
    add_card(s3, 0.6, 1.45, col_w, 5.6)
    t = s3.shapes.add_textbox(Inches(0.8), Inches(1.65), Inches(3.4), Inches(5.2))
    tf = t.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)
    
    p = tf.paragraphs[0]
    p.text = "POIN 3: JADWAL SHIFT & WAKTU RUNNING"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(6)

    p3_content = [
        ("Master Shift Tambang (msshift):", "Terhubung dengan tabel database PostgreSQL `msshift` (`ShiftModel`):"),
        ("Shift 1 (Siang):", "06:00 - 18:00 WITA\nIstirahat: 12:00 - 13:00 WITA (Jumat: 11:30 - 13:00 WITA)"),
        ("Shift 2 (Malam):", "18:00 - 06:00 WITA\nIstirahat: 00:00 - 01:00 WITA"),
        ("Sterilisasi Data Dummy:", "Menghapus perhitungan durasi kerja tiruan berbasis jam laptop lokal pengguna."),
        ("Sensor Kontak Riil:", "Kondisi 'ON (Running)' vs 'Standby (Idle)' dan durasi perjalanan kini murni dievaluasi dari sinyal ACC telemetri GPS armada.")
    ]
    for h, b in p3_content:
        p = tf.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # Kolom 2: Poin 4 (Speed Limits)
    add_card(s3, 0.6 + col_w + gap, 1.45, col_w, 5.6)
    t = s3.shapes.add_textbox(Inches(0.8 + col_w + gap), Inches(1.65), Inches(3.4), Inches(5.2))
    tf = t.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)
    
    p = tf.paragraphs[0]
    p.text = "POIN 4: PENGKATEGORIAN MAX SPEED"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_ORANGE_MINE
    p.space_after = Pt(6)

    p4_content = [
        ("Konfigurasi SITE_SPEED_LIMITS:", "Batas kecepatan maksimal dipetakan per konsesi sesuai kondisi jalan tambang:"),
        ("Site HPA (Berau):", "Hauling Road: 60 km/j\nPit Front: 40 km/j\nTurunan Curam: 25 km/j"),
        ("Site BDA (Barito):", "Hauling Road: 50 km/j\nPit Front: 35 km/j\nPort KM 0: 20 km/j (koridor 45.2 km)"),
        ("Site KDA & KJA:", "Hauling: 40 km/j\nPit Front: 30 km/j"),
        ("Zona Bahaya (Hazard):", "Otomatis mengunci batas 20 - 25 km/j saat armada melintasi area Handak, WMP, atau jembatan timbang.")
    ]
    for h, b in p4_content:
        p = tf.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # Kolom 3: Poin 5 (Intercom Mic)
    add_card(s3, 0.6 + (col_w + gap)*2, 1.45, col_w, 5.6)
    t = s3.shapes.add_textbox(Inches(0.8 + (col_w + gap)*2), Inches(1.65), Inches(3.4), Inches(5.2))
    tf = t.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)
    
    p = tf.paragraphs[0]
    p.text = "POIN 5: INTERCOM AUDIO DUA ARAH"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(6)

    p5_content = [
        ("Tujuan Keselamatan Kerja:", "Memfasilitasi panggilan suara dua arah seketika antara operator dispatch dan pengemudi di kabin unit."),
        ("Intervensi Darurat Real-Time:", "Dispatcher dapat langsung berbicara saat AI DMS mendeteksi sopir mengantuk (Micro-sleep) atau bermain ponsel."),
        ("Kontrol Tombol Mikrofon:", "Tombol MIC ON / MIC OFF dilengkapi visual status audio wave di panel kamera."),
        ("Privasi & Keamanan Suara:", "Default mic dalam posisi OFF (Mute) untuk melindungi percakapan pribadi kabin."),
        ("Protokol Audio MDVR:", "Terhubung langsung dengan kanal audio stream hardware CMSV6 secara full-duplex.")
    ]
    for h, b in p5_content:
        p = tf.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # ==========================================================
    # SLIDE 4: REVISI 6 & 7 (RITASI PTO & DIGITASI ZONA GOOGLE EARTH)
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_top_bar(s4, "Revisi 6 & 7: Otomasi Ritasi PTO & Presisi Spasial Tarik Zona Satelit", "GEOFENCING & CYCLE LOGIC", 4)

    # Kolom Kiri: Poin 6 (Ritasi & Ray-Casting)
    add_card(s4, 0.6, 1.45, 5.9, 5.6)
    t_r6 = s4.shapes.add_textbox(Inches(0.85), Inches(1.65), Inches(5.4), Inches(5.2))
    tf_r6 = t_r6.text_frame
    tf_r6.word_wrap = True
    tf_r6.margin_left = tf_r6.margin_top = tf_r6.margin_right = tf_r6.margin_bottom = Inches(0)

    p = tf_r6.paragraphs[0]
    p.text = "POIN 6: SIKLUS RITASI PTO & ALGORITMA RAY-CASTING"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(6)

    bullets_p6 = [
        ("Siklus 5 Tahap Standar HPU:", "1. Loading di Pit -> 2. Travel Isi -> 3. Dumping di Disposal (Verifikasi Hidrolik PTO ON) -> 4. Travel Kosong -> 5. Kembali Antre."),
        ("Validasi Mutlak Sensor PTO:", "Ritasi baru dianggap SAH jika sensor hidrolik mencatat vessel dump truck terangkat saat armada berada di dalam geofence dumping."),
        ("Algoritma Ray-Casting Spasial:", "Evaluasi batas tambang tidak lagi menggunakan lingkaran radius sederhana. Sistem menjalankan kalkulasi Point-in-Polygon Ray-Casting pada `MonitorDashcamTelemetry.php` dan frontend untuk mengevaluasi posisi truk di poligon fisik aktual."),
        ("Database 1.445 Geofences:", "Menampung 48 poligon fisik operasional tambang dan 1.397 titik patok kilometer STA checkpoint di tabel PostgreSQL `geofences`."),
        ("Penyimpanan Log Siklus:", "Tercatat otomatis di tabel `ritasi_logs` lengkap dengan durasi siklus menit, estimasi jarak KM, dan volume produksi BCM.")
    ]
    for h, b in bullets_p6:
        p = tf_r6.add_paragraph()
        p.text = f"• {h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # Kolom Kanan: Poin 7 (Digitasi Zona Google Earth)
    add_card(s4, 6.833, 1.45, 5.9, 5.6)
    t_r7 = s4.shapes.add_textbox(Inches(7.083), Inches(1.65), Inches(5.4), Inches(5.2))
    tf_r7 = t_r7.text_frame
    tf_r7.word_wrap = True
    tf_r7.margin_left = tf_r7.margin_top = tf_r7.margin_right = tf_r7.margin_bottom = Inches(0)

    p = tf_r7.paragraphs[0]
    p.text = "POIN 7: DIGITASI PERIMETER ZONA MANUAL SATELIT"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(6)

    bullets_p7 = [
        ("Precision Industrial GIS HUD:", "Floating toolbar ringkas slate-900/95 di atas peta satelit Google Earth dengan segmented control geometri (Poligon, Jalur, dan Radius)."),
        ("Kalkulasi Geodesi WGS84 Real-Time:", "Menampilkan kalkulasi instan saat titik ditarik:\n  - Poligon: Luas Hektar (Ha) dan keliling perimeter meter (m).\n  - Jalur: Panjang koridor rute dalam meter (m).\n  - Radius: Jangkauan buffer radial meter (m)."),
        ("Eliminasi Halusinasi Data:", "Membersihkan input radius anomali 293 km; kini radius dibatasi proporsional (max 5.000m) dan hanya aktif jika geometri lingkaran dipilih."),
        ("Formulir Operasional Bersih:", "Menghapus bocoran prompt teks presentasi, menghapus tombol prototipe 'Isi Sampel Koordinat', dan textarea JSON mentah digantikan ringkasan verteks."),
        ("Palet Warna K3 Tambang:", "Hijau PIT (Loading), Ungu Disposal (Dumping), Hitam ROM Stockpile, Biru Fasilitas/Office, Oranye Jalur Jalan, Merah Hazard.")
    ]
    for h, b in bullets_p7:
        p = tf_r7.add_paragraph()
        p.text = f"• {h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(5)

    # ==========================================================
    # SLIDE 5: REVISI 8 & MATRIKS MULTI-SITE (DEPLOYMENT & KOMPARASI)
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_top_bar(s5, "Revisi 8 & Matriks Multi-Site: Deployment Server HPU (10.10.0.54) & Komparasi", "DEPLOYMENT & MULTI-SITE CONCESSION", 5)

    # Bagian Atas: Poin 8 Deployment Server 10.10.0.54
    add_card(s5, 0.6, 1.45, 12.133, 2.5)
    t_d8 = s5.shapes.add_textbox(Inches(0.85), Inches(1.6), Inches(11.6), Inches(2.2))
    tf_d8 = t_d8.text_frame
    tf_d8.word_wrap = True
    tf_d8.margin_left = tf_d8.margin_top = tf_d8.margin_right = tf_d8.margin_bottom = Inches(0)

    p = tf_d8.paragraphs[0]
    p.text = "POIN 8: HASIL IMPLEMENTASI DEPLOYMENT DI SERVER DEVELOPMENT HPU (10.10.0.54)"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(4)

    dep_bullets = [
        "Lingkungan Server: Ubuntu 24.04 LTS, Docker Container `laravel-app` & `laravel-nginx`, PostgreSQL 16 database `hpuxuns` port 5432.",
        "Prosedur Keamanan (Backup First): Telah dicadangkan file `src_backup_*.tar.gz` (1.2 MB) dan dump database `hpuxuns_backup_*.sql` (121 KB).",
        "Migrasi & Seeding Basis Data: Eksekusi `php artisan migrate --force` (8 tabel baru) dan `GeofenceSeeder` (1.445 geofence aktif: 530 HPA & 915 BDA).",
        "Reverse-Proxy Streaming Nginx: Mengaktifkan blok proxy `/cmsv6-media/` pada Nginx server ke gateway video `10.10.0.33:6604` sehingga aliran FLV H.264 berjalan cepat lewat LAN server (latensi ~1 ms).",
        "Verifikasi Live: Dashboard operasional aktif dan dapat diakses tim HPU pada URL: http://10.10.0.54/dashboard/dashcam."
    ]
    for b in dep_bullets:
        p = tf_d8.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(2.5)

    # Bagian Bawah: Tabel Matriks Perbandingan Multi-Site (HPA vs BDA)
    table_shape = s5.shapes.add_table(5, 3, Inches(0.6), Inches(4.15), Inches(12.133), Inches(2.9))
    table = table_shape.table

    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(4.466)
    table.columns[2].width = Inches(4.466)

    headers = ["Parameter Operasional Tambang", "Site HPA (Berau, Kalimantan Timur)", "Site BDA (Barito, Kalsel / Kalteng)"]
    matrix_data = [
        ["Panjang Jalur Jalan Hauling", "21.0 KM (Jalur HPA) & 28.3 KM (Jalur Tambang)", "45.2 KM (Jalur Tunggal Kontinu)"],
        ["Inventaris STA Checkpoints", "492 Titik Patok Kilometer (STA 00 s.d. 21)", "905 Titik Patok Kilometer (STA 00 s.d. 45.2)"],
        ["Poligon Fasilitas Tambang", "38 Poligon (Pit Selatan, Sindoro, WMP)", "10 Poligon (ROM Jetty Sungai Barito, Pit BDA, Disposal)"],
        ["Batas Kecepatan & Koordinat", "Hauling 60 km/j • Pit 40 km/j | Lat 2.045, Lng 117.200", "Hauling 50 km/j • Pit 35 km/j | Lat -1.119, Lng 115.020"]
    ]

    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

    for row_idx, row_data in enumerate(matrix_data):
        for col_idx, cell_value in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_BG_CARD if row_idx % 2 == 0 else C_WHITE
            p = cell.text_frame.paragraphs[0]
            p.text = cell_value
            p.font.name = "Arial"
            p.font.size = Pt(9)
            p.font.color.rgb = C_TEXT_DARK if col_idx == 0 else C_TEXT_SLATE
            if col_idx == 0:
                p.font.bold = True
            else:
                p.alignment = PP_ALIGN.CENTER

    # Save to disk
    out_path = r"D:\Semester 5\hpu\documents\Laporan_Progress_Revisi_Dashcam_HPU.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully: {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")

    # Sync to Obsidian Vault
    obsidian_dir = r"C:\Users\muham\OneDrive\Documents\Obsidian Vault\01 Projects\HPU Dashcam & Fleet Management"
    if os.path.exists(obsidian_dir):
        obsidian_out = os.path.join(obsidian_dir, "Laporan_Progress_Revisi_Dashcam_HPU.pptx")
        shutil.copyfile(out_path, obsidian_out)
        print(f"Synced to Obsidian: {obsidian_out}")

if __name__ == "__main__":
    create_dense_deck()
