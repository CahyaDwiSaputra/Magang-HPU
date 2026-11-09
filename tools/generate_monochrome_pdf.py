import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.units import inch

def generate_pdf():
    pdf_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.pdf"
    pdf_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.pdf"

    doc = SimpleDocTemplate(
        pdf_path1,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Monochrome styles (Black, Grays, White — No Blue/Colors)
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.black,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#555555'),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.black,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.black,
        spaceBefore=8,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#222222'),
        spaceAfter=4
    )

    meta_lbl_style = ParagraphStyle(
        'MetaLbl',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.black
    )

    meta_val_style = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#333333')
    )

    table_th_style = ParagraphStyle(
        'TableTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0 # Left
    )

    table_th_center = ParagraphStyle(
        'TableTHCenter',
        parent=table_th_style,
        alignment=1 # Center
    )

    table_td_style = ParagraphStyle(
        'TableTD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#222222')
    )

    table_td_center = ParagraphStyle(
        'TableTDCenter',
        parent=table_td_style,
        alignment=1
    )

    story = []

    # Header / Meta Top
    story.append(Paragraph("<b>DOKUMEN PENGEMBANGAN TEKNOLOGI | PT HARMONI PANCA UTAMA</b>", ParagraphStyle('TopHeader', fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor('#777777'), alignment=2)))
    story.append(Spacer(1, 4))
    story.append(Paragraph("LAPORAN PERKEMBANGAN REVISI<br/>SISTEM SMART FLEET DASHCAM & GEOFENCING", title_style))
    story.append(Paragraph("Implementasi 8 Butir Revisi Operasional Tambang Batubara PT Harmoni Panca Utama", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceAfter=10))

    # Meta Table (Tanpa Status)
    meta_data = [
        [Paragraph("Nama Proyek", meta_lbl_style), Paragraph("HPU Dashcam Surveillance & Mining Telematics System", meta_val_style)],
        [Paragraph("Lokasi Codebase", meta_lbl_style), Paragraph("D:\\Semester 5\\hpu (Laravel 12, PostgreSQL, React Vite, CMSV6)", meta_val_style)],
        [Paragraph("Tanggal Dokumen", meta_lbl_style), Paragraph("Kamis, 27 Oktober 2026", meta_val_style)]
    ]
    t_meta = Table(meta_data, colWidths=[1.8*inch, 5.5*inch])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#E5E5E5')),
        ('BACKGROUND', (1,0), (1,-1), colors.HexColor('#F8F8F8')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E0E0E0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # 1. Ringkasan
    story.append(Paragraph("1. Ringkasan Butir Revisi", h1_style))
    story.append(Paragraph(
        "Laporan teknis ini mendokumentasikan hasil pengerjaan, refaktorisasi arsitektur, dan implementasi terhadap 8 (delapan) butir daftar revisi fitur Dashcam, Telemetri, dan Geofencing pada sistem Smart Fleet PT Harmoni Panca Utama (HPU). Seluruh butir revisi diterapkan pada antarmuka frontend (React Inertia Vite), layanan backend (Laravel 12 API), serta daemon worker pemantauan telemetri.",
        body_style
    ))
    story.append(Spacer(1, 4))

    # Tabel 8 Revisi (Tanpa Kolom Status, Monochrome)
    rev_table_data = [
        [Paragraph("No", table_th_center), Paragraph("Daftar Butir Revisi", table_th_style), Paragraph("Komponen & Implementasi Teknis", table_th_style)],
        [Paragraph("1", table_td_center), Paragraph("Opsi On/Off Livecam (Default: OFF Terlebih Dahulu)", table_td_style), Paragraph("Inisialisasi variabel state isLivecamActive=false pada index.tsx. Selama livecam mati, iframe video tidak dimuat sehingga menghemat kuota jaringan dan mempercepat pemuatan peta. Dilengkapi tombol saklar kontrol pada bar CCTV.", table_td_style)],
        [Paragraph("2", table_td_center), Paragraph("Highlight & Perbesar Peta (Core Dispatch View)", table_td_style), Paragraph("Reposisi kontainer peta ke urutan teratas kolom pemantauan utama (lg:col-span-9). Ketinggian dasar dinaikkan menjadi 340px dengan fitur pembesaran hingga 500px, koordinat default Kalimantan Timur, tombol Fokus Unit, dan auto-recenter.", table_td_style)],
        [Paragraph("3", table_td_center), Paragraph("Catatan Jam Shift & Waktu Running", table_td_style), Paragraph("Integrasi tabel msshift (ShiftModel) yang menghubungkan jadwal Shift 1 (06:00 - 18:00 WITA, Istirahat: 12:00 - 13:00 WITA) dan Shift 2 (18:00 - 06:00 WITA, Istirahat: 00:00 - 01:00 WITA), jam awal running armada, dan durasi running kumulatif.", table_td_style)],
        [Paragraph("4", table_td_center), Paragraph("Pengkategorian Maksimal Speed per Side / Site", table_td_style), Paragraph("Master konfigurasi SITE_SPEED_LIMITS dengan batas kecepatan berbeda per side/site: Site HPA (Hauling 60 km/j • Pit 40 km/j), Site BDA (Hauling 50 km/j • Pit 35 km/j), Site KDA (Hauling 40 km/j • Pit 30 km/j), dan Hazard Zone (20-25 km/j).", table_td_style)],
        [Paragraph("5", table_td_center), Paragraph("Tombol On/Off Mic Intercom Kabin", table_td_style), Paragraph("Penyediaan tombol MIC ON / MIC OFF pada bilah kontrol OSD CCTV kamera kabin. Dilengkapi indikator status mikrofon aktif pada banner pemantauan untuk memfasilitasi komunikasi audio dua arah antara operator ruang kontrol dan pengemudi.", table_td_style)],
        [Paragraph("6", table_td_center), Paragraph("Kelanjutan Fitur Ritasi & Geofence Tambang", table_td_style), Paragraph("Penyimpanan 530 data geofence (Pit, Port, Disposal, Workshop, Hazard, dan STA checkpoint per 100m) ke basis data PostgreSQL. Rute hauling sepanjang 21 KM dan 28.3 KM dirender melalui GeoJSON, dengan evaluasi siklus ritasi otomatis 5 tahap berdasar sensor PTO.", table_td_style)],
        [Paragraph("7", table_td_center), Paragraph("Peta Masing-Masing Zona (Tarik Manual & Google Earth)", table_td_style), Paragraph("Peta satelit Google Earth Hybrid resolusi tinggi, tombol Tarik Zona untuk input koordinat langsung melalui klik pada peta, form sesuai ketentuan Slide 26 (Polygon, Line, Circle), serta dukungan layer dan unggah ortofoto drone (GSD 5.2 cm/px).", table_td_style)],
        [Paragraph("8", table_td_center), Paragraph("Deploy ke Server Development HPU", table_td_style), Paragraph("Optimasi kompilasi produksi Vite frontend (131 kB), penyediaan skrip start_presentation.bat berbasis Cloudflare Tunnel untuk peninjauan langsung via jaringan publik HTTPS, serta kesiapan konfigurasi cloud vercel.json.", table_td_style)]
    ]
    t_rev = Table(rev_table_data, colWidths=[0.35*inch, 2.55*inch, 4.4*inch])
    t_rev.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.black),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E5E5')),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8F8F8')])
    ]))
    story.append(t_rev)
    story.append(Spacer(1, 10))

    # 2. Uraian Teknis
    story.append(Paragraph("2. Uraian Teknis Implementasi", h1_style))
    
    sections = [
        ("Revisi 1: Opsi On/Off Livecam (Default: OFF Terlebih Dahulu)",
         "Variabel state 'isLivecamActive' disetel secara default bernilai false. Selama kamera berada dalam kondisi nonaktif, elemen iframe pemutar video FLV Direct tidak di-render ke DOM, memberikan alokasi jaringan penuh bagi modul telemetri dan peta. Disediakan tombol saklar pada bilah kontrol pemantauan: tombol 'Nyalakan Livecam' saat posisi standby, dan tombol 'Matikan Livecam' saat posisi aktif."),
        ("Revisi 2: Highlight & Perbesar Peta (Core Dispatch View)",
         "Posisi peta dipindahkan ke baris paling atas kolom kanan pemantauan (lg:col-span-9). Ketinggian dasar peta diatur sebesar 340px dengan tombol ekspansi layar luas hingga 500px ('isMapExpanded'). Peta langsung dipusatkan pada wilayah konsesi tambang batubara HPU di Kalimantan Timur (2.045000, 117.200000, zoom 14) dilengkapi tombol 'Fokus Unit' untuk auto-centering ke armada aktif."),
        ("Revisi 3: Catatan Jam Shift (Mulai, Istirahat, Selesai, Awal Running & Durasi)",
         "Terhubung langsung dengan master data tabel 'msshift' (App\\Models\\ShiftModel) yang mencakup jadwal kerja site HPU: Shift 1 (Pukul 06:00 - 18:00 WITA, Istirahat: 12:00 - 13:00 WITA) dan Shift 2 (Pukul 18:00 - 06:00 WITA, Istirahat: 00:00 - 01:00 WITA). Sistem mengaitkan waktu awal running unit (06:15 WITA) dan menghitung durasi operasional berjalan (Jam:Menit) pada panel pemantauan."),
        ("Revisi 4: Pengkategorian Batas Kecepatan Maksimal per Side / Site",
         "Master data 'SITE_SPEED_LIMITS' menetapkan parameter kecepatan per sektor: Site HPA (Hauling 60 km/j • Pit 40 km/j), Site BDA (Hauling 50 km/j • Pit 35 km/j), Site KDA (Hauling 40 km/j • Pit 30 km/j), Site AMO & KJA (Hauling 50-60 km/j • Pit 35-40 km/j), dan Zona Khusus Hazard (20-25 km/j). Evaluasi real-time mendeteksi dan memicu peringatan keselamatan operasional bila kendaraan overspeed."),
        ("Revisi 5: Tombol On/Off Mic Intercom (Komunikasi Driver & Operator)",
         "Disediakan tombol 'MIC ON / MIC OFF' pada bilah kontrol CCTV dengan variabel kontrol 'isMicActive'. Saat mikrofon aktif, sistem menampilkan label 'MIC ON (Bicara)' dan penanda interkom pada panel operasional, disertai konfirmasi keterhubungan audio ke kabin kendaraan pengemudi."),
        ("Revisi 6: Kelanjutan Fitur Ritasi & Geofence Tambang",
         "Sebanyak 530 geofence riil hasil survei koridor penambangan batubara HPU tersimpan pada PostgreSQL (7 Loading Pit, 8 Dumping Port/Disposal, 6 Workshop/Mess, 17 Hazard Zone/WMP, dan 492 Checkpoint STA interval 100 meter). Polyline 2 rute jalan hauling (21 KM & 28.3 KM) dirender via GeoJSON. Background worker mengevaluasi siklus ritasi otomatis 5 tahap berdasar sensor PTO On."),
        ("Revisi 7: Peta Masing-Masing Zona (Tarik Manual, Citra Satelit, & Foto Drone)",
         "Mengintegrasikan layer citra satelit Google Earth Hybrid untuk menampilkan kontur pit galian dan badan jalan hauling secara terperinci. Tombol 'Tarik Zona' pada peta memungkinkan pengguna mengeklik titik-titik koordinat pada peta satelit. Form geofence memuat atribut wajib Slide 26 (Nama, Koordinat Lat/Long, Warna, Alamat, Radius) dengan opsi Polygon, Line, Cyrcle, serta layer ortofoto drone."),
        ("Revisi 8: Deploy ke Server Development HPU",
         "Proses 'npm run build' menghasilkan bundel aset produksi berukuran 131 kB yang teroptimasi tanpa kendala kompilasi. Disediakan file 'start_presentation.bat' yang menjalankan backend Laravel, Vite, dan Cloudflare Tunnel HTTPS sehingga sistem dapat ditinjau langsung melalui peramban web eksternal.")
    ]

    for title, desc in sections:
        story.append(Paragraph(title, h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 6))

    # 3. Pengujian Sistem
    story.append(Paragraph("3. Rincian Pengujian Sistem", h1_style))
    test_data = [
        [Paragraph("Parameter Pengujian", table_th_style), Paragraph("Metode / Perintah Pengujian", table_th_style), Paragraph("Hasil Implementasi Teknis", table_th_style)],
        [Paragraph("Database Seeder Geofence", table_td_style), Paragraph("php artisan db:seed --class=GeofenceSeeder", table_td_style), Paragraph("530 entri spasial terdaftar dan terindeks pada tabel geofences PostgreSQL.", table_td_style)],
        [Paragraph("Endpoint API Geofence", table_td_style), Paragraph("GET /api/dashcam/geofences?category=operational", table_td_style), Paragraph("38 zona operasional utama dikembalikan dengan waktu respon <50ms.", table_td_style)],
        [Paragraph("Endpoint Rute Hauling", table_td_style), Paragraph("GET /api/dashcam/hauling-routes", table_td_style), Paragraph("2 fitur LineString kontinu (~41.5 KB) terintegrasi pada GeoJSON.", table_td_style)],
        [Paragraph("Endpoint Foto Drone", table_td_style), Paragraph("GET /api/dashcam/drone-photos", table_td_style), Paragraph("Katalog ortofoto fotogrametri udara (GSD 5.2 cm/px) terhubung ke peta.", table_td_style)],
        [Paragraph("Evaluasi Spasial Ritasi", table_td_style), Paragraph("Algoritma Haversine di MonitorDashcamTelemetry", table_td_style), Paragraph("Deteksi masuk Pit (Loading), melintas STA, dan masuk Port (Dumping PTO On).", table_td_style)],
        [Paragraph("Kompilasi Antarmuka", table_td_style), Paragraph("npm run build (Vite v8.0.6)", table_td_style), Paragraph("Kompilasi frontend berhasil dengan ukuran bundel produksi 131.18 kB.", table_td_style)]
    ]
    t_test = Table(test_data, colWidths=[1.8*inch, 2.5*inch, 3.0*inch])
    t_test.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.black),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E5E5')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8F8F8')])
    ]))
    story.append(t_test)
    story.append(Spacer(1, 14))

    # Tanda Tangan
    sign_data = [
        [
            Paragraph("<b>Disiapkan Oleh:</b><br/>Tim Pengembang Smart Fleet Management<br/><br/><br/><br/><b>( Muhammad / AI Engineering )</b>", ParagraphStyle('Sign1', fontName='Helvetica', fontSize=8, leading=11, textColor=colors.black)),
            Paragraph("<b>Disetujui Oleh:</b><br/>Manajemen Operasional PT Harmoni Panca Utama<br/><br/><br/><br/><b>( Manajemen / PIC Proyek HPU )</b>", ParagraphStyle('Sign2', fontName='Helvetica', fontSize=8, leading=11, textColor=colors.black))
        ]
    ]
    t_sign = Table(sign_data, colWidths=[3.6*inch, 3.7*inch])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F5F5F5')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_sign)

    doc.build(story)
    
    shutil.copy(pdf_path1, pdf_path2)
    print("Monochrome PDF generated successfully at:")
    print("1.", pdf_path1)
    print("2.", pdf_path2)

if __name__ == '__main__':
    generate_pdf()
