import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Palet Warna Korporat & K3 Tambang PT HPU
    C_NAVY_DARK   = RGBColor(15, 23, 42)      # #0F172A
    C_NAVY_CARD   = RGBColor(24, 34, 53)      # #182235
    C_NAVY_LIGHT  = RGBColor(30, 41, 59)      # #1E293B
    C_BLUE_MAIN   = RGBColor(29, 78, 216)     # #1D4ED8
    C_BLUE_LIGHT  = RGBColor(239, 246, 255)   # #EFF6FF
    C_BLUE_BORDER = RGBColor(147, 197, 253)   # #93C5FD
    C_AMBER       = RGBColor(217, 119, 6)     # #D97706
    C_AMBER_LIGHT = RGBColor(254, 243, 199)   # #FEF3C7
    C_ORANGE_MINE = RGBColor(234, 88, 12)     # #EA580C
    C_GREEN_OK    = RGBColor(5, 150, 105)     # #059669
    C_GREEN_LIGHT = RGBColor(209, 250, 229)   # #D1FAE5
    C_PURPLE      = RGBColor(147, 51, 234)    # #9333EA
    C_PURPLE_BG   = RGBColor(243, 232, 255)   # #F3E8FF
    C_TEXT_DARK   = RGBColor(15, 23, 42)      # #0F172A
    C_TEXT_SLATE  = RGBColor(51, 65, 85)      # #334155
    C_TEXT_MUTED  = RGBColor(100, 116, 139)   # #64748B
    C_BORDER      = RGBColor(203, 213, 225)   # #CBD5E1
    C_BG_CARD     = RGBColor(248, 250, 252)   # #F8FAFC
    C_WHITE       = RGBColor(255, 255, 255)

    def add_slide_header(slide, title_text, category_text, page_num):
        h_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.32), Inches(10.5), Inches(0.92))
        tf = h_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)

        p0 = tf.paragraphs[0]
        p0.text = f"PT HARMONI PANCA UTAMA • SMART FLEET TELEMATICS | {category_text.upper()}"
        p0.font.name = "Arial"
        p0.font.size = Pt(10.5)
        p0.font.bold = True
        p0.font.color.rgb = C_BLUE_MAIN
        p0.space_after = Pt(2)

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.name = "Arial"
        p1.font.size = Pt(22)
        p1.font.bold = True
        p1.font.color.rgb = C_NAVY_DARK

        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.3), Inches(0.40), Inches(1.4), Inches(0.42))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_BLUE_LIGHT
        badge.line.color.rgb = C_BLUE_BORDER
        badge.line.width = Pt(1.5)
        tf_b = badge.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.text = f"SLIDE {page_num} / 5"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = C_BLUE_MAIN
        p_b.alignment = PP_ALIGN.CENTER

        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.3), Inches(12.133), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.color.rgb = C_BORDER

    def add_card_shape(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_BORDER, border_width=1.5):
        c = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        c.fill.solid()
        c.fill.fore_color.rgb = bg_color
        c.line.color.rgb = border_color
        c.line.width = Pt(border_width)
        return c

    # ==========================================================
    # SLIDE 1: HERO & DASHBOARD MILESTONES (EXECUTIVE BALANCED)
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY_DARK
    bg1.line.fill.background()

    # Left Pill
    p_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.55), Inches(4.5), Inches(0.42))
    p_badge.fill.solid()
    p_badge.fill.fore_color.rgb = C_NAVY_LIGHT
    p_badge.line.color.rgb = C_BLUE_MAIN
    p_badge.line.width = Pt(1.5)
    tf_pb = p_badge.text_frame
    tf_pb.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_pb.paragraphs[0]
    p.text = "SMART FLEET SYSTEM • PT HARMONI PANCA UTAMA"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)
    p.alignment = PP_ALIGN.CENTER

    # Right Executive Status Box
    r_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.8), Inches(0.55), Inches(4.733), Inches(0.42))
    r_badge.fill.solid()
    r_badge.fill.fore_color.rgb = C_NAVY_LIGHT
    r_badge.line.color.rgb = C_GREEN_OK
    r_badge.line.width = Pt(1.5)
    tf_rb = r_badge.text_frame
    tf_rb.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_rb.paragraphs[0]
    p.text = "STATUS: DEPLOYED & TESTED • HOST 10.10.0.54"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = RGBColor(110, 231, 183)
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle Box
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.733), Inches(1.3))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = Inches(0)
    
    p = tf_t.paragraphs[0]
    p.text = "Laporan Perkembangan Teknis: Realisasi 8 Butir Revisi Dashcam & Geofencing"
    p.font.name = "Arial"
    p.font.size = Pt(25)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(4)

    p = tf_t.add_paragraph()
    p.text = "Implementasi Sistem Telematika Multi-Site (HPA Berau & BDA Barito 45.2 KM), Otomasi Siklus Ritasi PTO, dan Deployment Server 10.10.0.54"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(203, 213, 225)

    # 4 Large Stat Cards
    metrics = [
        ("1.445", "Master Geofence", "530 Site HPA Berau + 915 Site BDA Barito aktif di database PostgreSQL 16.", C_BLUE_MAIN),
        ("45.2 KM", "Koridor Rute BDA", "1.081 titik koordinat hauling kontinu + 905 patok STA checkpoint tiap 50 meter.", C_AMBER),
        ("100% LIVE", "Server Development", "Host 10.10.0.54 beroperasi penuh via Docker, Nginx Proxy, dan database internal.", C_GREEN_OK),
        ("8 DARI 8", "Status Revisi Tuntas", "Seluruh 8 butir revisi selesai dikerjakan, diuji coba, dan terverifikasi di lapangan.", C_PURPLE)
    ]
    for idx, (val, label, desc, col) in enumerate(metrics):
        x = 0.8 + idx * (2.8 + 0.177)
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.55), Inches(2.8), Inches(1.7))
        c.fill.solid()
        c.fill.fore_color.rgb = C_NAVY_CARD
        c.line.color.rgb = RGBColor(71, 85, 105)
        c.line.width = Pt(1.5)
        tf_c = c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_right = Inches(0.18)
        tf_c.margin_top = Inches(0.16)

        p = tf_c.paragraphs[0]
        p.text = val
        p.font.name = "Arial"
        p.font.size = Pt(30)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(2)

        p = tf_c.add_paragraph()
        p.text = label
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.space_after = Pt(4)

        p = tf_c.add_paragraph()
        p.text = desc
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(148, 163, 184)

    # Bottom Milestone Card
    add_card_shape(s1, 0.8, 4.45, 11.733, 2.55, C_NAVY_CARD, RGBColor(71, 85, 105), 1.5)
    t_sum = s1.shapes.add_textbox(Inches(1.05), Inches(4.6), Inches(11.233), Inches(2.25))
    tf_s = t_sum.text_frame
    tf_s.word_wrap = True
    tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = Inches(0)

    p = tf_s.paragraphs[0]
    p.text = "CAKUPAN REALISASI 8 BUTIR REVISI OPERASIONAL TAMBANG:"
    p.font.name = "Arial"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(7)

    milestones = [
        ("Poin 1 & 2 (Visual & Navigasi):", "Kontrol Livecam selektif hemat kuota 4G (Default OFF) dan layout peta satelit Google Earth lebar penuh 100% Core Dispatch."),
        ("Poin 3 & 4 (Jadwal & Batasan):", "Integrasi jadwal shift (Shift 1 & 2), evaluasi starter mesin murni dari kontak ACC GPS, serta speed limits site (40 - 60 km/j)."),
        ("Poin 5 & 6 (Safety & Siklus Ritasi):", "Intercom audio dua arah kabin pengemudi, validasi sah ritasi via sensor hidrolik PTO, dan algoritma Ray-Casting spasial."),
        ("Poin 7 & 8 (Digitasi & Kesiapan Rilis):", "HUD Tarik Zona Google Earth hitung Luas Ha & Keliling meter instan, tuntas beroperasi live di server development 10.10.0.54.")
    ]
    for tag, d in milestones:
        p = tf_s.add_paragraph()
        p.text = f"{tag} {d}"
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(6)

    # ==========================================================
    # SLIDE 2: REVISI 1 & 2 (LIVECAM ON/OFF & MAP FULL-WIDTH)
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_header(s2, "Revisi 1 & 2: Kontrol Selektif Livecam & Peta Utama Lebar Penuh", "CCTV & DISPATCH MAPPING", 2)

    # Left Card: Revisi 1
    add_card_shape(s2, 0.6, 1.45, 5.9, 5.65, C_WHITE, C_BORDER, 2)
    acc1 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.45), Inches(5.9), Inches(0.55))
    acc1.fill.solid()
    acc1.fill.fore_color.rgb = C_BLUE_MAIN
    acc1.line.fill.background()
    p = acc1.text_frame.paragraphs[0]
    p.text = "REVISI 1: KONTROL SELEKTIF ON/OFF LIVECAM"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc1.text_frame.margin_left = Inches(0.25)
    acc1.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t1 = s2.shapes.add_textbox(Inches(0.85), Inches(2.15), Inches(5.4), Inches(2.95))
    tf1 = t1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = Inches(0)

    r1_points = [
        ("Kebutuhan Operasional:", "Koneksi 4G seluler di cekungan tambang terbatas. Streaming serentak puluhan armada memboroskan kuota data seluler."),
        ("Solusi Default OFF:", "Variabel livecam diset default `OFF`. Stream video FLV & WebSocket CMSV6 tidak aktif sebelum tombol diklik dispatcher."),
        ("Tombol Saklar Hijau:", "Disediakan tombol 'Nyalakan Livecam' dengan indikator 'LIVECAM STANDBY (OFF)' untuk inspeksi unit selektif."),
        ("Proteksi Mesin Standby:", "Jika mesin unit mati di pit, player menampilkan kartu 'Engine Standby di Pit' tanpa memicu error crash berulang."),
        ("Optimalisasi Gateway:", "Mencegah spam re-login otomatis dan mengamankan stream video saat koneksi sinyal tambang berfluktuasi.")
    ]
    for idx, (head, body) in enumerate(r1_points):
        p = tf1.paragraphs[0] if idx == 0 else tf1.add_paragraph()
        p.text = f"{head} {body}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(7)

    # Highlight Feature Box at the bottom of Card 1 (top 5.25 to 6.85)
    box1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.85), Inches(5.25), Inches(5.4), Inches(1.6))
    box1.fill.solid()
    box1.fill.fore_color.rgb = C_GREEN_LIGHT
    box1.line.color.rgb = C_GREEN_OK
    box1.line.width = Pt(1.5)
    tf_b1 = box1.text_frame
    tf_b1.margin_left = tf_b1.margin_right = Inches(0.2)
    tf_b1.margin_top = Inches(0.15)
    p = tf_b1.paragraphs[0]
    p.text = "HASIL TERUKUR & EFISIENSI BANDWIDTH"
    p.font.name = "Arial"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(5)

    p = tf_b1.add_paragraph()
    p.text = "• Hemat Kuota 80%: Trafik data kartu SIM MDVR hanya aktif saat unit dibuka oleh operator."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(4)

    p = tf_b1.add_paragraph()
    p.text = "• Zero Crash Error: Penanganan lifecycle player aman, tanpa kegagalan rendering FLV."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK

    # Right Card: Revisi 2
    add_card_shape(s2, 6.833, 1.45, 5.9, 5.65, C_WHITE, C_BORDER, 2)
    acc2 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(1.45), Inches(5.9), Inches(0.55))
    acc2.fill.solid()
    acc2.fill.fore_color.rgb = C_AMBER
    acc2.line.fill.background()
    p = acc2.text_frame.paragraphs[0]
    p.text = "REVISI 2: PETA UTAMA LEBAR PENUH (CORE DISPATCH)"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc2.text_frame.margin_left = Inches(0.25)
    acc2.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t2 = s2.shapes.add_textbox(Inches(7.083), Inches(2.15), Inches(5.4), Inches(2.95))
    tf2 = t2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_top = tf2.margin_right = tf2.margin_bottom = Inches(0)

    r2_points = [
        ("Layout Lebar Penuh 100%:", "Peta satelit dijadikan pusat kendali utama (Core Dispatch View), membentang 100% horizontal di urutan paling atas."),
        ("Modul CCTV di Bawah Peta:", "Pemutar video diletakkan di bawah peta agar perhatian dispatcher terfokus pada pergerakan rute hauling dan batas zona."),
        ("Citra Satelit Google Earth:", "Tile satelit resolusi tinggi menampilkan galian pit, jalan hauling, stockpile batubara, dan kolam pengendapan lumpur (WMP)."),
        ("Navigasi Auto-Pan Cerdas:", "Kamera peta otomatis meluncur ke lokasi armada: armada BDA langsung ke Barito, armada HPA langsung ke Berau."),
        ("Visualisasi Rute Tambang:", "Menampilkan polyline rute hauling kontinu Site HPA (21 & 28.3 KM) dan Site BDA (45.2 KM) dengan penanda STA.")
    ]
    for idx, (head, body) in enumerate(r2_points):
        p = tf2.paragraphs[0] if idx == 0 else tf2.add_paragraph()
        p.text = f"{head} {body}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(7)

    # Highlight Feature Box at the bottom of Card 2 (top 5.25 to 6.85)
    box2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.083), Inches(5.25), Inches(5.4), Inches(1.6))
    box2.fill.solid()
    box2.fill.fore_color.rgb = C_BLUE_LIGHT
    box2.line.color.rgb = C_BLUE_MAIN
    box2.line.width = Pt(1.5)
    tf_b2 = box2.text_frame
    tf_b2.margin_left = tf_b2.margin_right = Inches(0.2)
    tf_b2.margin_top = Inches(0.15)
    p = tf_b2.paragraphs[0]
    p.text = "NAVIGASI CEPAT & INTERAKTIVITAS PETA"
    p.font.name = "Arial"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(5)

    p = tf_b2.add_paragraph()
    p.text = "• Toolbar Multi-Site: Tombol cepat satu klik [Semua Site], [HPA Berau], dan [BDA Barito]."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(4)

    p = tf_b2.add_paragraph()
    p.text = "• Kanvas Adaptif: Tinggi default 400px dapat diperlebar ke 580px untuk pemantauan rute luas."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK

    # ==========================================================
    # SLIDE 3: REVISI 3, 4 & 5 (SHIFT, SPEED LIMITS & INTERCOM)
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_header(s3, "Revisi 3, 4 & 5: Manajemen Shift, Batas Kecepatan Site & Intercom Kabin", "OPERATIONAL SAFETY & DISPATCH", 3)

    col_w = 3.8
    gap = 0.366

    # Kolom 1: Poin 3
    x1 = 0.6
    add_card_shape(s3, x1, 1.45, col_w, 5.65, C_WHITE, C_BORDER, 2)
    acc = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x1), Inches(1.45), Inches(col_w), Inches(0.55))
    acc.fill.solid()
    acc.fill.fore_color.rgb = C_BLUE_MAIN
    acc.line.fill.background()
    p = acc.text_frame.paragraphs[0]
    p.text = "REVISI 3: JADWAL SHIFT & RUNNING"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc.text_frame.margin_left = Inches(0.15)
    acc.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t = s3.shapes.add_textbox(Inches(x1 + 0.18), Inches(2.15), Inches(col_w - 0.36), Inches(2.95))
    tf = t.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)
    
    p3_items = [
        ("Master Shift Tambang:", "Terhubung dengan tabel database PostgreSQL `msshift` (`ShiftModel`)."),
        ("Shift 1 (Siang):", "Pukul 06:00 - 18:00 WITA (Istirahat 12:00 - 13:00 / Jumat 11:30 - 13:00)."),
        ("Shift 2 (Malam):", "Pukul 18:00 - 06:00 WITA (Istirahat 00:00 - 01:00 WITA)."),
        ("Pembersihan Dummy:", "Menghapus perhitungan durasi kerja tiruan berbasis jam laptop lokal pengguna."),
        ("Sensor Kontak Riil:", "Status starter mesin ON/Idle dievaluasi murni dari sinyal ACC telemetri GPS.")
    ]
    for idx, (h, b) in enumerate(p3_items):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(6)

    # Box Footer Kolom 1
    bf1 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x1 + 0.18), Inches(5.25), Inches(col_w - 0.36), Inches(1.6))
    bf1.fill.solid()
    bf1.fill.fore_color.rgb = C_BLUE_LIGHT
    bf1.line.color.rgb = C_BLUE_MAIN
    tf_bf1 = bf1.text_frame
    tf_bf1.margin_left = tf_bf1.margin_right = Inches(0.15)
    tf_bf1.margin_top = Inches(0.15)
    p = tf_bf1.paragraphs[0]
    p.text = "SINKRONISASI AKTUAL"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(4)
    p = tf_bf1.add_paragraph()
    p.text = "• Starter Mesin: ACC ON terdeteksi langsung saat kunci kontak armada diputar di tambang."
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(3)
    p = tf_bf1.add_paragraph()
    p.text = "• Nol Manipulasi: Durasi kerja shift akurat sesuai jam kerja tambang Kalimantan."
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_TEXT_DARK

    # Kolom 2: Poin 4
    x2 = x1 + col_w + gap
    add_card_shape(s3, x2, 1.45, col_w, 5.65, C_WHITE, C_BORDER, 2)
    acc = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x2), Inches(1.45), Inches(col_w), Inches(0.55))
    acc.fill.solid()
    acc.fill.fore_color.rgb = C_ORANGE_MINE
    acc.line.fill.background()
    p = acc.text_frame.paragraphs[0]
    p.text = "REVISI 4: BATAS KECEPATAN SITE"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc.text_frame.margin_left = Inches(0.15)
    acc.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t = s3.shapes.add_textbox(Inches(x2 + 0.18), Inches(2.15), Inches(col_w - 0.36), Inches(2.95))
    tf = t.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)

    p4_items = [
        ("Konfigurasi SITE_SPEED_LIMITS:", "Batas kecepatan maksimal dipetakan sesuai profil medan jalan:"),
        ("Site HPA (Berau):", "Jalan Hauling: 60 km/j • Pit Front: 40 km/j • Turunan Curam: 25 km/j."),
        ("Site BDA (Barito):", "Jalan Hauling: 50 km/j • Pit Front: 35 km/j • Port KM 0: 20 km/j."),
        ("Site KDA & KJA:", "Kecepatan Hauling: 40 km/j • Area Pit: 30 km/j."),
        ("Zona Bahaya (Hazard):", "Mengunci otomatis batas 20 - 25 km/j saat armada melintasi area Handak dan WMP.")
    ]
    for idx, (h, b) in enumerate(p4_items):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(6)

    # Box Footer Kolom 2
    bf2 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x2 + 0.18), Inches(5.25), Inches(col_w - 0.36), Inches(1.6))
    bf2.fill.solid()
    bf2.fill.fore_color.rgb = C_AMBER_LIGHT
    bf2.line.color.rgb = C_AMBER
    tf_bf2 = bf2.text_frame
    tf_bf2.margin_left = tf_bf2.margin_right = Inches(0.15)
    tf_bf2.margin_top = Inches(0.15)
    p = tf_bf2.paragraphs[0]
    p.text = "SAFETY OVERSPEED LIMITS"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(4)
    p = tf_bf2.add_paragraph()
    p.text = "• Alarm Real-Time: Deteksi overspeeding dinamis langsung memicu notifikasi peringatan."
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(3)
    p = tf_bf2.add_paragraph()
    p.text = "• Zonasi Adaptif: Batas kecepatan menyesuaikan saat truk berpindah dari pit ke jalan hauling."
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_TEXT_DARK

    # Kolom 3: Poin 5
    x3 = x2 + col_w + gap
    add_card_shape(s3, x3, 1.45, col_w, 5.65, C_WHITE, C_BORDER, 2)
    acc = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x3), Inches(1.45), Inches(col_w), Inches(0.55))
    acc.fill.solid()
    acc.fill.fore_color.rgb = C_GREEN_OK
    acc.line.fill.background()
    p = acc.text_frame.paragraphs[0]
    p.text = "REVISI 5: INTERCOM AUDIO DUA ARAH"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc.text_frame.margin_left = Inches(0.15)
    acc.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t = s3.shapes.add_textbox(Inches(x3 + 0.18), Inches(2.15), Inches(col_w - 0.36), Inches(2.95))
    tf = t.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0)

    p5_items = [
        ("Tujuan Keselamatan Kerja:", "Saluran komunikasi suara instan operator ruang kontrol ke driver di kabin armada."),
        ("Intervensi Darurat Real-Time:", "Dispatcher langsung berbicara saat kamera AI DMS mendeteksi driver mengantuk."),
        ("Kontrol Tombol Mikrofon:", "Tombol toggle MIC ON / MIC OFF dilengkapi animasi audio wave interaktif di panel video."),
        ("Privasi Kabin Terjaga:", "Default mikrofon diset Mute (OFF) untuk menjaga kenyamanan pengemudi saat bekerja."),
        ("Protokol Hardware MDVR:", "Terhubung langsung dengan protokol audio stream hardware CMSV6 full-duplex.")
    ]
    for idx, (h, b) in enumerate(p5_items):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.text = f"{h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(6)

    # Box Footer Kolom 3
    bf3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x3 + 0.18), Inches(5.25), Inches(col_w - 0.36), Inches(1.6))
    bf3.fill.solid()
    bf3.fill.fore_color.rgb = C_GREEN_LIGHT
    bf3.line.color.rgb = C_GREEN_OK
    tf_bf3 = bf3.text_frame
    tf_bf3.margin_left = tf_bf3.margin_right = Inches(0.15)
    tf_bf3.margin_top = Inches(0.15)
    p = tf_bf3.paragraphs[0]
    p.text = "INTERVENSI KESELAMATAN KABIN"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(4)
    p = tf_bf3.add_paragraph()
    p.text = "• Respon Micro-Sleep: Intervensi suara seketika mencegah insiden tabrakan di jalur hauling."
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(3)
    p = tf_bf3.add_paragraph()
    p.text = "• Dua Arah: Driver dapat membalas instruksi dispatcher tanpa melepas kemudi."
    p.font.name = "Arial"
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_TEXT_DARK

    # ==========================================================
    # SLIDE 4: REVISI 6 & 7 (RITASI PTO & DIGITASI ZONA GOOGLE EARTH)
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_header(s4, "Revisi 6 & 7: Otomasi Ritasi PTO & Presisi Spasial Tarik Zona Satelit", "GEOFENCING & CYCLE LOGIC", 4)

    # Left Card: Revisi 6
    add_card_shape(s4, 0.6, 1.45, 5.9, 5.65, C_WHITE, C_BORDER, 2)
    acc1 = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.45), Inches(5.9), Inches(0.55))
    acc1.fill.solid()
    acc1.fill.fore_color.rgb = C_BLUE_MAIN
    acc1.line.fill.background()
    p = acc1.text_frame.paragraphs[0]
    p.text = "REVISI 6: SIKLUS RITASI PTO & ALGORITMA RAY-CASTING"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc1.text_frame.margin_left = Inches(0.25)
    acc1.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t1 = s4.shapes.add_textbox(Inches(0.85), Inches(2.15), Inches(5.4), Inches(2.95))
    tf1 = t1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = Inches(0)

    r6_points = [
        ("Siklus 5 Tahap Standar HPU:", "1. Loading di Pit -> 2. Travel Isi -> 3. Dumping di Disposal (Verifikasi PTO ON) -> 4. Travel Kosong -> 5. Kembali Antre."),
        ("Validasi Mutlak Sensor PTO:", "Ritasi SAH tercatat hanya jika sensor hidrolik mendeteksi vessel dump truck terangkat saat armada berada di dalam geofence dumping."),
        ("Algoritma Ray-Casting Spasial:", "Evaluasi batas fisik bukaan tambang aktual menggunakan kalkulasi Point-in-Polygon Ray-Casting pada `MonitorDashcamTelemetry.php` dan frontend."),
        ("Database 1.445 Geofences:", "Menampung 48 poligon fisik operasional tambang dan 1.397 titik patok kilometer STA checkpoint di tabel PostgreSQL `geofences`."),
        ("Integritas Produksi:", "Mencegah klaim ritasi palsu dan memastikan keakuratan rekonsiliasi volume batubara / overburden (OB).")
    ]
    for idx, (head, body) in enumerate(r6_points):
        p = tf1.paragraphs[0] if idx == 0 else tf1.add_paragraph()
        p.text = f"{head} {body}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(7)

    # Box Footer Card 1
    box4_1 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.85), Inches(5.25), Inches(5.4), Inches(1.6))
    box4_1.fill.solid()
    box4_1.fill.fore_color.rgb = C_BLUE_LIGHT
    box4_1.line.color.rgb = C_BLUE_MAIN
    tf_b4_1 = box4_1.text_frame
    tf_b4_1.margin_left = tf_b4_1.margin_right = Inches(0.2)
    tf_b4_1.margin_top = Inches(0.15)
    p = tf_b4_1.paragraphs[0]
    p.text = "LOG RITASI OTOMATIS & AKURASI SPASIAL"
    p.font.name = "Arial"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_MAIN
    p.space_after = Pt(5)

    p = tf_b4_1.add_paragraph()
    p.text = "• Tabel ritasi_logs: Durasi trip (menit), jarak tempuh KM, dan akumulasi estimasi BCM tercatat otomatis."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(4)

    p = tf_b4_1.add_paragraph()
    p.text = "• Ray-Casting Real-Time: Deteksi presisi batas fisik pit tanpa lag transmisi GPS."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK

    # Right Card: Revisi 7
    add_card_shape(s4, 6.833, 1.45, 5.9, 5.65, C_WHITE, C_BORDER, 2)
    acc2 = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(1.45), Inches(5.9), Inches(0.55))
    acc2.fill.solid()
    acc2.fill.fore_color.rgb = C_GREEN_OK
    acc2.line.fill.background()
    p = acc2.text_frame.paragraphs[0]
    p.text = "REVISI 7: DIGITASI PERIMETER ZONA MANUAL SATELIT"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc2.text_frame.margin_left = Inches(0.25)
    acc2.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t2 = s4.shapes.add_textbox(Inches(7.083), Inches(2.15), Inches(5.4), Inches(2.95))
    tf2 = t2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_top = tf2.margin_right = tf2.margin_bottom = Inches(0)

    r7_points = [
        ("Precision Industrial GIS HUD:", "Toolbar mengambang di atas peta satelit Google Earth dengan segmented control: Poligon, Jalur, dan Radius."),
        ("Kalkulasi Geodesi WGS84 Real-Time:", "Menampilkan kalkulasi instan saat titik ditarik:\n  • Poligon: Estimasi Luas Hektar (Ha) dan Keliling meter (m).\n  • Jalur: Panjang koridor rute dalam meter (m).\n  • Radius: Jangkauan buffer radial meter (m)."),
        ("Eliminasi Halusinasi Data:", "Membersihkan input radius anomali 293 km; kini radius dibatasi proporsional (max 5.000m) dan hanya aktif untuk lingkaran."),
        ("Formulir Operasional Bersih:", "Bebas dari teks bocoran prompt presentasi, tombol sampel uji coba dihapus, dan textarea koordinat digantikan ringkasan verteks.")
    ]
    for idx, (head, body) in enumerate(r7_points):
        p = tf2.paragraphs[0] if idx == 0 else tf2.add_paragraph()
        p.text = f"{head} {body}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = C_TEXT_SLATE
        p.space_after = Pt(7)

    # Box Footer Card 2
    box4_2 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.083), Inches(5.25), Inches(5.4), Inches(1.6))
    box4_2.fill.solid()
    box4_2.fill.fore_color.rgb = C_GREEN_LIGHT
    box4_2.line.color.rgb = C_GREEN_OK
    tf_b4_2 = box4_2.text_frame
    tf_b4_2.margin_left = tf_b4_2.margin_right = Inches(0.2)
    tf_b4_2.margin_top = Inches(0.15)
    p = tf_b4_2.paragraphs[0]
    p.text = "STANDARISASI K3 & GIS TAMBANG"
    p.font.name = "Arial"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = C_GREEN_OK
    p.space_after = Pt(5)

    p = tf_b4_2.add_paragraph()
    p.text = "• Palet K3 Resmi: Hijau Pit (Loading), Ungu Disposal (Dumping), Hitam ROM, Biru Fasilitas, Merah Hazard."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK
    p.space_after = Pt(4)

    p = tf_b4_2.add_paragraph()
    p.text = "• Penyimpanan Dinamis: Poligon tersimpan langsung ke PostgreSQL dan diekspor ke GeoJSON FeatureCollection."
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.color.rgb = C_TEXT_DARK

    # ==========================================================
    # SLIDE 5: REVISI 8 & MATRIKS MULTI-SITE (DEPLOYMENT & KOMPARASI)
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_header(s5, "Revisi 8: Deployment Server HPU (10.10.0.54) & Matriks Multi-Site", "DEPLOYMENT & MULTI-SITE CONCESSION", 5)

    # Top Section: Poin 8 Server Deployment
    add_card_shape(s5, 0.6, 1.45, 12.133, 2.55, C_WHITE, C_BORDER, 2)
    acc = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.45), Inches(12.133), Inches(0.48))
    acc.fill.solid()
    acc.fill.fore_color.rgb = C_BLUE_MAIN
    acc.line.fill.background()
    p = acc.text_frame.paragraphs[0]
    p.text = "POIN 8: HASIL DEPLOYMENT & INTEGRASI SERVER DEVELOPMENT HPU (10.10.0.54)"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    acc.text_frame.margin_left = Inches(0.2)
    acc.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    t_dep = s5.shapes.add_textbox(Inches(0.85), Inches(2.05), Inches(11.6), Inches(1.85))
    tf_dep = t_dep.text_frame
    tf_dep.word_wrap = True
    tf_dep.margin_left = tf_dep.margin_top = tf_dep.margin_right = tf_dep.margin_bottom = Inches(0)

    dep_bullets = [
        ("Lingkungan Server:", "Ubuntu 24.04 LTS, Docker Container `laravel-app` & `laravel-nginx`, PostgreSQL 16 database `hpuxuns` port 5432."),
        ("Prosedur Keamanan (Backup First):", "Telah dicadangkan codebase `src_backup_*.tar.gz` (1.2 MB) dan dump database `hpuxuns_backup_*.sql` (121 KB)."),
        ("Migrasi & Seeding Basis Data:", "Eksekusi `php artisan migrate --force` (8 tabel baru) dan `GeofenceSeeder` (1.445 geofence aktif: 530 HPA & 915 BDA)."),
        ("Reverse-Proxy Nginx Stream:", "Blok proxy `/cmsv6-media/` pada Nginx server ke gateway video `10.10.0.33:6604` mempercepat stream FLV via LAN (latensi ~1 ms)."),
        ("Akses Langsung Sistem:", "Sistem aktif dan beroperasi live di URL: http://10.10.0.54/dashboard/dashcam (User: `admin_test` / Pass: `admin`).")
    ]
    for idx, (h, b) in enumerate(dep_bullets):
        p = tf_dep.paragraphs[0] if idx == 0 else tf_dep.add_paragraph()
        p.text = f"• {h} {b}"
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.color.rgb = C_TEXT_DARK if idx == len(dep_bullets)-1 else C_TEXT_SLATE
        if idx == len(dep_bullets)-1:
            p.font.bold = True
        p.space_after = Pt(3)

    # Bottom Section: Tabel Komparasi Multi-Site (HPA vs BDA)
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
        p.font.size = Pt(12)
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
            p.font.size = Pt(11.5)
            p.font.color.rgb = C_TEXT_DARK if col_idx == 0 else C_TEXT_SLATE
            if col_idx == 0:
                p.font.bold = True
            else:
                p.alignment = PP_ALIGN.CENTER

    # Save presentation
    out_path = r"D:\Semester 5\hpu\documents\Laporan_Progress_Revisi_Dashcam_HPU.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully: {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")

    # Sync to Obsidian
    obsidian_dir = r"C:\Users\muham\OneDrive\Documents\Obsidian Vault\01 Projects\HPU Dashcam & Fleet Management"
    if os.path.exists(obsidian_dir):
        obsidian_out = os.path.join(obsidian_dir, "Laporan_Progress_Revisi_Dashcam_HPU.pptx")
        shutil.copyfile(out_path, obsidian_out)
        print(f"Synced to Obsidian: {obsidian_out}")

if __name__ == "__main__":
    build_presentation()
