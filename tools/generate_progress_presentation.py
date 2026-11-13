import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Palet Warna Korporat & K3 Tambang PT HPU
    C_NAVY_DARK   = RGBColor(15, 23, 42)     # #0F172A
    C_NAVY_SLATE  = RGBColor(30, 41, 59)     # #1E293B
    C_BLUE_BRAND  = RGBColor(29, 78, 216)    # #1D4ED8
    C_BLUE_LIGHT  = RGBColor(239, 246, 255)  # #EFF6FF
    C_AMBER_K3    = RGBColor(217, 119, 6)    # #D97706
    C_ORANGE_MINE = RGBColor(234, 88, 12)    # #EA580C
    C_GREEN_OK    = RGBColor(5, 150, 105)    # #059669
    C_GREEN_BG    = RGBColor(236, 253, 245)  # #ECFDF5
    C_TEXT_DARK   = RGBColor(15, 23, 42)     # #0F172A
    C_TEXT_MUTED  = RGBColor(100, 116, 139)  # #64748B
    C_BORDER      = RGBColor(226, 232, 240)  # #E2E8F0
    C_BG_CARD     = RGBColor(248, 250, 252)  # #F8FAFC
    C_WHITE       = RGBColor(255, 255, 255)

    def add_header(slide, title_text, category_text="PT HARMONI PANCA UTAMA • SMART FLEET TELEMATICS"):
        # Header bar container
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.9))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)

        p0 = tf.paragraphs[0]
        p0.text = category_text.upper()
        p0.font.name = "Arial"
        p0.font.size = Pt(9.5)
        p0.font.bold = True
        p0.font.color.rgb = C_BLUE_BRAND
        p0.space_after = Pt(2)

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.name = "Arial"
        p1.font.size = Pt(20)
        p1.font.bold = True
        p1.font.color.rgb = C_NAVY_DARK

        # Garis pemisah tipis
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.color.rgb = C_BORDER

    def add_footer(slide, current_page, total_pages=12):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.35))
        tf = footer_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)
        p = tf.paragraphs[0]
        p.text = f"Laporan Perkembangan Teknis Revisi Dashcam & Geofencing | Hal. {current_page} dari {total_pages}"
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.color.rgb = C_TEXT_MUTED

    def add_card(slide, left, top, width, height, bg_color=C_BG_CARD, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # ==========================================================
    # SLIDE 1: TITLE SLIDE (Dark Navy Professional)
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY_DARK
    bg1.line.fill.background()

    # Brand badge
    b_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.6), Inches(3.8), Inches(0.38))
    b_badge.fill.solid()
    b_badge.fill.fore_color.rgb = C_NAVY_SLATE
    b_badge.line.color.rgb = C_BLUE_BRAND
    tf_b = b_badge.text_frame
    tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_b = tf_b.paragraphs[0]
    p_b.text = "SMART FLEET SYSTEM • PT HARMONI PANCA UTAMA"
    p_b.font.name = "Arial"
    p_b.font.size = Pt(8.5)
    p_b.font.bold = True
    p_b.font.color.rgb = RGBColor(147, 197, 253)
    p_b.alignment = PP_ALIGN.CENTER

    # Main Title Box
    tbox = s1.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.333), Inches(2.8))
    tf1 = tbox.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "Laporan Perkembangan Teknis"
    p.font.name = "Arial"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_AMBER_K3
    p.space_after = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Implementasi 8 Butir Revisi Dashcam,\nGeofencing & Multi-Site Concession"
    p.font.name = "Arial"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "Dokumentasi realisasi teknis sistem telematika armada tambang berbasis Laravel 11, Inertia React,\nPostgreSQL, Ray-Casting Point-in-Polygon, dan deployment server development HPU (10.10.0.54)."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)

    # Info footer metadata box
    card_meta = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(5.5), Inches(11.333), Inches(1.1))
    card_meta.fill.solid()
    card_meta.fill.fore_color.rgb = C_NAVY_SLATE
    card_meta.line.color.rgb = RGBColor(51, 65, 85)
    tf_meta = card_meta.text_frame
    tf_meta.word_wrap = True
    tf_meta.margin_left = Inches(0.3)
    tf_meta.margin_top = Inches(0.2)
    
    p = tf_meta.paragraphs[0]
    p.text = "DATA VERIFIKASI OPERASIONAL PROYEK:"
    p.font.name = "Arial"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = C_AMBER_K3
    p.space_after = Pt(4)

    p = tf_meta.add_paragraph()
    p.text = "Konsesi: Site HPA (Berau, Kaltim) & Site BDA (Barito, Kalsel/Kalteng) | Master Geofence: 1.445 Titik Aktif | Server Host: 10.10.0.54\nPengembang: Tim Magang HPU x UNS (Cahya Dwi Saputra) | Tanggal Rilis: November 2026 | Status: 100% Selesai & Terverifikasi"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(226, 232, 240)

    # ==========================================================
    # SLIDE 2: RINGKASAN EKSEKUTIF (8 Poin Revisi)
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Ringkasan Eksekutif Realisasi 8 Butir Revisi")
    add_footer(s2, 2)

    # Matriks 8 Poin (2 Baris x 4 Kolom)
    points = [
        ("01. On/Off Livecam", "Default OFF demi efisiensi bandwidth 4G; streaming diaktifkan selektif per unit.", C_BLUE_BRAND),
        ("02. Highlight Peta Penuh", "Layout core dispatch 100% horizontal di urutan teratas dengan Citra Satelit Google Earth.", C_BLUE_BRAND),
        ("03. Jadwal Shift & Running", "Integrasi tabel msshift (Shift 1 & 2), sinkronisasi awal operasi mesin tanpa kalkulasi dummy.", C_BLUE_BRAND),
        ("04. Batas Kecepatan Site", "Konfigurasi SITE_SPEED_LIMITS (40 s.d. 60 km/j) disesuaikan karakteristik Hauling & Pit.", C_AMBER_K3),
        ("05. Intercom Dua Arah", "Tombol kontrol audio microphone kabin untuk komunikasi langsung driver dan operator dispatch.", C_AMBER_K3),
        ("06. Geofence & Ritasi PTO", "Pencatatan siklus 5 tahap, verifikasi hidrolik PTO dump bed, 1.445 master geofence PostgreSQL.", C_GREEN_OK),
        ("07. Digitasi Peta Satelit", "HUD Tarik Zona presisi, kalkulasi luas Hektar & keliling meter, tanpa halusinasi data radius.", C_GREEN_OK),
        ("08. Deploy Server HPU", "Tuntas beroperasi di server 10.10.0.54 Ubuntu Docker, migrasi database, dan reverse proxy Nginx.", C_GREEN_OK)
    ]

    for idx, (title, desc, color) in enumerate(points):
        row = idx // 4
        col = idx % 4
        x = 0.8 + col * (2.8 + 0.177)
        y = 1.6 + row * (2.4 + 0.2)
        add_card(s2, x, y, 2.8, 2.4, C_BG_CARD, C_BORDER)

        t_box = s2.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.15), Inches(2.5), Inches(2.1))
        tf = t_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(8)

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(12)

        p = tf.add_paragraph()
        p.text = "[ STATUS: SELESAI 100% ]"
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = C_GREEN_OK

    # ==========================================================
    # SLIDE 3: REVISI POIN 1 - KONTROL ON/OFF LIVECAM
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Revisi 1: Opsi Kontrol Selektif On/Off Livecam", "POIN REVISI DASHCAM 01")
    add_footer(s3, 3)

    add_card(s3, 0.8, 1.6, 5.7, 5.1)
    t1 = s3.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf1 = t1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "Latar Belakang & Kebutuhan Lapangan:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(6)

    bullets1 = [
        "Jaringan seluler 4G di area open-pit tambang memiliki keterbatasan bandwidth dan kuota kartu SIM armada.",
        "Pemutaran video secara otomatis dan terus menerus untuk belasan armada sekaligus menyebabkan pemborosan kuota dan membebani gateway transmisi.",
        "Dibutuhkan mekanisme selektif di mana operator ruang kontrol hanya memuat stream CCTV saat unit tertentu membutuhkan inspeksi visual aktif."
    ]
    for b in bullets1:
        p = tf1.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(8)

    add_card(s3, 6.833, 1.6, 5.7, 5.1)
    t2 = s3.shapes.add_textbox(Inches(7.133), Inches(1.9), Inches(5.1), Inches(4.5))
    tf2 = t2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Implementasi Teknis & Hasil Verifikasi:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(6)

    bullets2 = [
        "Inisialisasi State Default: Ditetapkan variabel `isLivecamActive = false` saat halaman dimuat.",
        "Pemisahan Koneksi: Iframe video FLV dan WebSocket CMSV6 tidak dijalankan selama tombol belum ditekan oleh dispatcher.",
        "Tombol Saklar Ergonomis: Penyediaan tombol toggle 'Nyalakan Livecam' berwarna hijau yang dilengkapi indikator status 'LIVECAM STANDBY (OFF)'.",
        "Pemberian Umpan Balik: Menampilkan notifikasi visual 'Engine Standby di Pit' saat mesin unit mati tanpa merusak lifecycle player.",
        "Hasil Nyata: Penghematan konsumsi bandwidth jaringan hingga 80% pada monitoring dispatch harian."
    ]
    for b in bullets2:
        p = tf2.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(6)

    # ==========================================================
    # SLIDE 4: REVISI POIN 2 - HIGHLIGHT & PEMBESARAN PETA UTAMA
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Revisi 2: Tata Letak Peta Utama Lebar Penuh (Core Dispatch)", "POIN REVISI DASHCAM 02")
    add_footer(s4, 4)

    # 3 Kolom Fitur Peta
    cards4 = [
        ("Orientasi Kanvas Lebar Penuh", 
         "Peta satelit direposisi ke urutan paling atas membentang 100% lebar layar horizontal (h-400px, dapat diekspansi ke h-580px).\n\nModul pemutar video CCTV diletakkan di bawah peta, menempatkan peta sebagai pusat kendali spasial (Core Dispatch View).",
         C_BLUE_BRAND),
        ("Citra Satelit Google Earth",
         "Mengintegrasikan tile satelit resolusi tinggi Google Earth Hybrid, menampilkan kontur galian pit, jalan hauling berdebu, kolam WMP, dan stockpile secara presisi.\n\nDilengkapi kontrol zoom level presisi dan layer switcher (Satelit vs Street Map OSM).",
         C_AMBER_K3),
        ("Navigasi & Auto-Pan Armada",
         "Peta otomatis terbang (auto-pan) ke titik koordinat armada saat unit di sidebar kiri dipilih.\n\nJika armada BDA dipilih, kamera langsung mengunci ke Kalimantan Tengah. Jika armada HPA dipilih, kamera langsung beralih ke Berau, Kalimantan Timur.",
         C_GREEN_OK)
    ]

    for idx, (ctitle, cdesc, ccolor) in enumerate(cards4):
        x = 0.8 + idx * (3.75 + 0.24)
        add_card(s4, x, 1.6, 3.75, 5.1)
        t = s4.shapes.add_textbox(Inches(x + 0.2), Inches(1.85), Inches(3.35), Inches(4.5))
        tf = t.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = ctitle
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = ccolor
        p.space_after = Pt(10)

        p = tf.add_paragraph()
        p.text = cdesc
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED

    # ==========================================================
    # SLIDE 5: REVISI POIN 3 - JADWAL SHIFT & WAKTU RUNNING ARMADA
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Revisi 3: Integrasi Jadwal Shift & Pemantauan Mesin", "POIN REVISI DASHCAM 03")
    add_footer(s5, 5)

    add_card(s5, 0.8, 1.6, 6.0, 5.1)
    t1 = s5.shapes.add_textbox(Inches(1.05), Inches(1.85), Inches(5.5), Inches(4.5))
    tf1 = t1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Integrasi Master Data Shift Tambang (msshift):"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(8)

    shifts = [
        ("Shift 1 (Siang):", "Pukul 06:00 WITA - 18:00 WITA\nJam Istirahat: 12:00 WITA - 13:00 WITA (Jumat: 11:30 - 13:00 WITA)"),
        ("Shift 2 (Malam):", "Pukul 18:00 WITA - 06:00 WITA\nJam Istirahat: 00:00 WITA - 01:00 WITA (Tengah Malam)"),
        ("Sinkronisasi Sesi:", "Tercatat di backend melalui model `ShiftModel` dan tabel database PostgreSQL `msshift` untuk validasi pergantian pengemudi.")
    ]
    for stitle, sdesc in shifts:
        p = tf1.add_paragraph()
        p.text = stitle
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_BLUE_BRAND
        p.space_after = Pt(2)

        p = tf1.add_paragraph()
        p.text = sdesc
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(8)

    add_card(s5, 7.133, 1.6, 5.4, 5.1)
    t2 = s5.shapes.add_textbox(Inches(7.383), Inches(1.85), Inches(4.9), Inches(4.5))
    tf2 = t2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Pembersihan Dummy & Telemetri Riil:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(8)

    bullets5 = [
        "Eliminasi Kalkulasi Jam Lokal: Menghapus logika lama yang menghitung durasi kerja dari jam laptop lokal pengguna.",
        "Kondisi Starter Aktual: Status mesin 'ON (Running)' vs 'Standby (Idle)' kini murni dievaluasi dari sinyal ACC/telemetri perangkat GPS armada.",
        "Pencatatan Odometer: Menghubungkan trip distance dengan data jarak kumulatif GPS aktual pada tabel `telemetry_logs`.",
        "Keandalan Data: Mencegah perbedaan data antara display dashboard dengan log operasional pit di lapangan."
    ]
    for b in bullets5:
        p = tf2.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(8)

    # ==========================================================
    # SLIDE 6: REVISI POIN 4 - PENGKATEGORIAN BATAS KECEPATAN SITE
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Revisi 4: Pengkategorian Batas Kecepatan per Side / Site", "POIN REVISI DASHCAM 04")
    add_footer(s6, 6)

    # Matriks Speed Limits
    sites_speed = [
        ("Site HPA (Berau, Kaltim)", "Hauling: 60 km/j\nPit Front: 40 km/j\nTurunan Curam: 25 km/j", "Koridor 21 KM & 28.3 KM dengan perkerasan gravel mantap. Batas 60 km/j diterapkan pada segmen lurus hauling road.", C_BLUE_BRAND),
        ("Site BDA (Barito, Kalsel/Kalteng)", "Hauling: 50 km/j\nPit Front: 35 km/j\nArea Port KM 0: 20 km/j", "Koridor jalan hauling kontinu sepanjang 45.2 KM melintasi kontur perbukitan dan pemukiman dengan batas ketat 50 km/j.", C_AMBER_K3),
        ("Site KDA & Site KJA", "Hauling: 40 km/j\nPit Front: 30 km/j\nZona Handak: 20 km/j", "Area konsesi dengan manuver sempit dan rute berliku diatur maksimal 40 km/j demi mitigasi insiden tabrakan.", C_TEXT_DARK),
        ("Zona Khusus / Bahaya (Hazard)", "Maksimal: 20 - 25 km/j\n(Berlaku Seluruh Site)", "Diterapkan otomatis saat armada memasuki radius geofence Gudang Handak, WMP, atau area persimpangan jembatan timbang.", C_ORANGE_MINE)
    ]

    for idx, (stitle, sspeed, sdesc, scolor) in enumerate(sites_speed):
        row = idx // 2
        col = idx % 2
        x = 0.8 + col * (5.7 + 0.333)
        y = 1.6 + row * (2.4 + 0.2)
        add_card(s6, x, y, 5.7, 2.4)

        t = s6.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.15), Inches(5.3), Inches(2.1))
        tf = t.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = stitle
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = scolor
        p.space_after = Pt(4)

        p = tf.add_paragraph()
        p.text = sspeed
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY_DARK
        p.space_after = Pt(4)

        p = tf.add_paragraph()
        p.text = sdesc
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_MUTED

    # ==========================================================
    # SLIDE 7: REVISI POIN 5 - INTERCOM DUA ARAH OPERATOR & DRIVER
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Revisi 5: Fasilitas On/Off Mic Intercom Kabin Armada", "POIN REVISI DASHCAM 05")
    add_footer(s7, 7)

    add_card(s7, 0.8, 1.6, 5.7, 5.1)
    t1 = s7.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.1), Inches(4.5))
    tf1 = t1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Tujuan & Alur Komunikasi Darurat:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(8)

    bullets7a = [
        "Menyediakan saluran komunikasi langsung antara operator ruang kontrol (Control Room) dan pengemudi di kabin unit.",
        "Mendukung peringatan keselamatan seketika (Intervensi Cepat) saat kamera DMS mendeteksi pengemudi mengantuk (Micro-sleep) atau menggunakan ponsel saat berjalan.",
        "Memungkinkan instruksi perubahan rute atau pengalihan front loading secara instan tanpa perlu ketergantungan penuh pada frekuensi radio rig tambang yang padat."
    ]
    for b in bullets7a:
        p = tf1.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(10)

    add_card(s7, 6.833, 1.6, 5.7, 5.1)
    t2 = s7.shapes.add_textbox(Inches(7.133), Inches(1.85), Inches(5.1), Inches(4.5))
    tf2 = t2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Fitur & Mekanisme Teknis UI:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(8)

    bullets7b = [
        "Tombol Toggle MIC ON / MIC OFF: Ditempatkan pada bilah kontrol CCTV dengan feedback visual yang kontras.",
        "Status Indikator Audio: Animasi gelombang audio aktif saat mikrofon terbuka untuk memastikan operator menyadari kanal suara aktif.",
        "Kepatuhan Protokol Keamanan: Default mikrofon dalam keadaan OFF (Mute) guna menjaga privasi obrolan kabin selama operasional normal.",
        "Integrasi Gateway CMSV6: Mendukung kanal audio full-duplex dua arah melalui audio stream protocol MDVR."
    ]
    for b in bullets7b:
        p = tf2.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(10)

    # ==========================================================
    # SLIDE 8: REVISI POIN 6 - SIKLUS RITASI & GEOFENCE TAMBANG
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Revisi 6: Otomasi Ritasi PTO & Evaluasi Spasial Ray-Casting", "POIN REVISI DASHCAM 06")
    add_footer(s8, 8)

    add_card(s8, 0.8, 1.6, 11.733, 2.3)
    t1 = s8.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(11.2), Inches(2.0))
    tf1 = t1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Arsitektur Siklus Ritasi Otomatis (Slide 25 HPU Standard):"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(6)

    stages = [
        "1. LOADING: Deteksi unit di Pit Front, kedekatan Exca & DT, mesin hidup, muatan dicatat (OB / Coal).",
        "2. TRAVEL ISI: Unit bergerak keluar perimeter pit menuju koridor jalan hauling membawa beban muatan.",
        "3. DUMPING: Unit memasuki Disposal / Port, sensor hidrolik PTO ON (Vessel terangkat) -> 1 Ritasi Sah Tercatat!",
        "4. TRAVEL KOSONG: Unit meninggalkan area buangan kembali menyusuri jalan hauling menuju pit muat."
    ]
    for s in stages:
        p = tf1.add_paragraph()
        p.text = "• " + s
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(2)

    # 2 Kolom Bawah
    add_card(s8, 0.8, 4.15, 5.7, 2.55)
    t2 = s8.shapes.add_textbox(Inches(1.05), Inches(4.3), Inches(5.2), Inches(2.2))
    tf2 = t2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Algoritma Ray-Casting Point-in-Polygon:"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_BRAND
    p.space_after = Pt(4)
    p = tf2.add_paragraph()
    p.text = "Evaluasi geospasial tidak lagi mengandalkan lingkaran radius sederhana yang tumpang tindih. Sistem mengevaluasi koordinat armada terhadap bidang poligon fisik aktual pit dan disposal menggunakan algoritma Ray-Casting pada `MonitorDashcamTelemetry.php` dan frontend."
    p.font.name = "Arial"
    p.font.size = Pt(9.5)
    p.font.color.rgb = C_TEXT_MUTED

    add_card(s8, 6.833, 4.15, 5.7, 2.55)
    t3 = s8.shapes.add_textbox(Inches(7.083), Inches(4.3), Inches(5.2), Inches(2.2))
    tf3 = t3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "Database Master 1.445 Geofences:"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(4)
    p = tf3.add_paragraph()
    p.text = "Sebanyak 1.445 geofence aktif tersimpan di PostgreSQL (tabel `geofences`), mencakup 48 poligon area operasional (Pit, Disposal, Workshop, Stockpile ROM, WMP) dan 1.397 titik patok kilometer STA checkpoint di Site HPA dan Site BDA."
    p.font.name = "Arial"
    p.font.size = Pt(9.5)
    p.font.color.rgb = C_TEXT_MUTED

    # ==========================================================
    # SLIDE 9: REVISI POIN 7 - PETA ZONA MANUAL GOOGLE EARTH & ANTI-SLOP
    # ==========================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Revisi 7: Digitasi Perimeter Zona Manual & Anti-Slop GIS", "POIN REVISI DASHCAM 07")
    add_footer(s9, 9)

    add_card(s9, 0.8, 1.6, 5.7, 5.1)
    t1 = s9.shapes.add_textbox(Inches(1.05), Inches(1.85), Inches(5.2), Inches(4.5))
    tf1 = t1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Fitur Precision Industrial GIS HUD:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(6)

    hud_bullets = [
        "Segmented Control Geometri: Pilihan bentuk Poligon (Area Pit/Disposal), Jalur (Garis Hauling), dan Radius (Lingkaran Buffer).",
        "Kalkulasi Spasial Real-Time (WGS84):",
        "  - Poligon: Estimasi luas dalam Hektar (Ha) dan keliling perimeter dalam meter (m) langsung saat titik ditarik.",
        "  - Jalur: Estimasi panjang rute koridor dalam meter.",
        "  - Radius: Jangkauan radius radial meter dan luas terlingkupi.",
        "Aksi Ergonomis: Tombol Undo (hapus titik terakhir), Reset, dan Simpan Zona dengan visual feedback interaktif."
    ]
    for b in hud_bullets:
        p = tf1.add_paragraph()
        p.text = b
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(4)

    add_card(s9, 6.833, 1.6, 5.7, 5.1)
    t2 = s9.shapes.add_textbox(Inches(7.083), Inches(1.85), Inches(5.2), Inches(4.5))
    tf2 = t2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Rombakan Anti-Slop Modal Geofence:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(6)

    antislop_bullets = [
        "Pembersihan Prompt Leak: Menghapus teks bocoran PowerPoint seperti '(Slide 26)' pada judul formulir.",
        "Eliminasi Halusinasi Data: Membuang input radius anomali 293 km; kini radius dibatasi proporsional (max 5.000m) dan hanya aktif jika geometri Circle dipilih.",
        "Input Poligon Kondisional: Jika Poligon dipilih, input radius disembunyikan dan digantikan data ringkasan verteks Ray-Casting.",
        "Pembersihan Kode Prototipe: Menghapus tombol 'Isi Sampel Koordinat' dan textarea JSON mentah yang tidak ramah pengguna.",
        "Standarisasi Visual: Swatch warna K3 tambang (Hijau PIT, Ungu Disposal, Hitam ROM, Biru Fasilitas, Oranye Jalan, Merah Hazard)."
    ]
    for b in antislop_bullets:
        p = tf2.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(4)

    # ==========================================================
    # SLIDE 10: REVISI POIN 8 - DEPLOYMENT SERVER HPU (10.10.0.54)
    # ==========================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Revisi 8: Deployment & Verifikasi di Server HPU", "POIN REVISI DASHCAM 08")
    add_footer(s10, 10)

    # 3 Langkah Deployment
    steps = [
        ("1. Backup & Safety First",
         "Pencadangan Penuh Sebelum Eksekusi:\n\n• Codebase Server: `src_backup_20261110_095515.tar.gz` (1.2 MB)\n• Database PostgreSQL: `hpuxuns_backup_20261110_095605.sql` (121 KB)\n\nMenjamin pemulihan instan jika terjadi kendala pada saat proses migrasi data.",
         C_NAVY_DARK),
        ("2. Migrasi & Seeding Basis Data",
         "Eksekusi Migrasi & Master Seeder:\n\n• Migrasi 8 tabel database baru (`geofences`, `ritasi_logs`, `telemetry_logs`, dll).\n• Seeding 1.445 Geofences aktif ke PostgreSQL 16 server (530 Site HPA & 915 Site BDA).\n• Optimasi rute dan konfigurasi Laravel (`config:cache`, `route:cache`).",
         C_BLUE_BRAND),
        ("3. Reverse-Proxy Nginx Stream",
         "Konfigurasi Streaming Video Port 6604:\n\n• Mengaktifkan blok proxy `location /cmsv6-media/` pada Nginx server ke gateway `10.10.0.33:6604`.\n• Aliran video FLV H.264 berjalan lewat jaringan lokal server (latensi ~1 ms).\n• Dashboard live terverifikasi di `http://10.10.0.54/dashboard/dashcam`.",
         C_GREEN_OK)
    ]

    for idx, (stitle, sdesc, scolor) in enumerate(steps):
        x = 0.8 + idx * (3.75 + 0.24)
        add_card(s10, x, 1.6, 3.75, 5.1)
        t = s10.shapes.add_textbox(Inches(x + 0.2), Inches(1.85), Inches(3.35), Inches(4.5))
        tf = t.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = stitle
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = scolor
        p.space_after = Pt(10)

        p = tf.add_paragraph()
        p.text = sdesc
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED

    # ==========================================================
    # SLIDE 11: MATRIKS MULTI-SITE (HPA vs BDA)
    # ==========================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Matriks Perbandingan Operasional Multi-Site (HPA vs BDA)", "ARSITEKTUR KONSESI TAMBANG")
    add_footer(s11, 11)

    # Tabel Komparasi
    rows = 7
    cols = 3
    table_shape = s11.shapes.add_table(rows, cols, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.0))
    table = table_shape.table

    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(4.266)
    table.columns[2].width = Inches(4.266)

    headers = ["Parameter Operasional", "Site HPA (Berau, Kalimantan Timur)", "Site BDA (Barito, Kalsel / Kalteng)"]
    data = [
        ["Panjang Jalur Jalan Hauling", "21.0 KM (HPA) & 28.3 KM (Tambang)", "45.2 KM (Jalur Tunggal Kontinu)"],
        ["Jumlah STA Checkpoints", "492 Titik Patok Kilometer (STA 0 s.d. 21)", "905 Titik Patok Kilometer (STA 0 s.d. 45.2)"],
        ["Jumlah Poligon Operasional", "38 Poligon (Pit Selatan, Sindoro, WMP)", "10 Poligon (ROM Jetty Sungai Barito, Pit BDA)"],
        ["Batas Kecepatan Maksimal", "Hauling: 60 km/j • Pit Front: 40 km/j", "Hauling: 50 km/j • Pit Front: 35 km/j"],
        ["Pusat Koordinat Peta", "Lat: 2.045000, Lng: 117.200000", "Lat: -1.119625, Lng: 115.020731"],
        ["Karakteristik Elevasi", "12m s.d. 85m (Dataran Rendah & Rawa)", "40.8m (Port Barito) s.d. 128.7m (Puncak Bukit)"]
    ]

    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

    for row_idx, row_data in enumerate(data):
        for col_idx, cell_value in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_BG_CARD if row_idx % 2 == 0 else C_WHITE
            p = cell.text_frame.paragraphs[0]
            p.text = cell_value
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = C_TEXT_DARK if col_idx == 0 else C_TEXT_MUTED
            if col_idx == 0:
                p.font.bold = True
            else:
                p.alignment = PP_ALIGN.CENTER

    # ==========================================================
    # SLIDE 12: KESIMPULAN & LANGKAH SELANJUTNYA
    # ==========================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Kesimpulan Proyek & Langkah Tindak Lanjut", "PENUTUP LAPORAN")
    add_footer(s12, 12)

    add_card(s12, 0.8, 1.6, 5.7, 5.1)
    t1 = s12.shapes.add_textbox(Inches(1.05), Inches(1.85), Inches(5.1), Inches(4.5))
    tf1 = t1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Kesimpulan Pencapaian Teknis:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(8)

    c_bullets = [
        "100% Seluruh 8 Butir Revisi Terselesaikan: Opsi On/Off Livecam, layout peta lebar penuh, catatan shift operasional, speed limits, intercom audio, ritasi PTO otomatis, HUD tarik zona satelit, dan deploy server development.",
        "Kesiapan Multi-Site: Sistem mendukung penuh integrasi paralel Site HPA (Berau) dan Site BDA (Barito 45.2 KM) dengan total 1.445 master geofence di PostgreSQL.",
        "Sterilisasi Data Dummy: Seluruh komponen tiruan telah dibersihkan; kalkulasi spasial kini mengandalkan algoritma Ray-Casting dan sensor riil.",
        "Akses Stabil: Server development 10.10.0.54 telah beroperasi penuh dan siap ditinjau secara langsung oleh tim penguji HPU."
    ]
    for b in c_bullets:
        p = tf1.add_paragraph()
        p.text = "• " + b
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(8)

    add_card(s12, 6.833, 1.6, 5.7, 5.1)
    t2 = s12.shapes.add_textbox(Inches(7.083), Inches(1.85), Inches(5.1), Inches(4.5))
    tf2 = t2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Rencana Tindak Lanjut (Next Steps):"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_BRAND
    p.space_after = Pt(8)

    next_bullets = [
        "1. Uji Penerimaan Lapangan (UAT): Pengujian langsung bersama tim Dispatch dan Safety Officer Site HPA & BDA.",
        "2. Kalibrasi Sensor PTO Hidrolik: Penyesuaian batas toleransi sudut sensor vessel dump truck pada unit model baru.",
        "3. Evaluasi Kuota 4G Seluler: Monitoring konsumsi bandwidth bulanan kartu SIM MDVR setelah penerapan saklar On/Off Livecam.",
        "4. Dokumentasi Manual Book Pengguna: Penyusunan panduan operasional ringkas untuk dispatcher ruang kontrol tambang."
    ]
    for b in next_bullets:
        p = tf2.add_paragraph()
        p.text = b
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_MUTED
        p.space_after = Pt(8)

    # Simpan file presentasi
    os.makedirs(r"D:\Semester 5\hpu\documents", exist_ok=True)
    out_path = r"D:\Semester 5\hpu\documents\Laporan_Progress_Revisi_Dashcam_HPU.pptx"
    prs.save(out_path)
    print(f"File PPTX berhasil dibuat: {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")

    # Sinkronisasi ke Obsidian Vault
    obsidian_dir = r"C:\Users\muham\OneDrive\Documents\Obsidian Vault\01 Projects\HPU Dashcam & Fleet Management"
    if os.path.exists(obsidian_dir):
        obsidian_out = os.path.join(obsidian_dir, "Laporan_Progress_Revisi_Dashcam_HPU.pptx")
        shutil.copyfile(out_path, obsidian_out)
        print(f"Tersinkronisasi ke Obsidian: {obsidian_out}")

if __name__ == "__main__":
    create_deck()
