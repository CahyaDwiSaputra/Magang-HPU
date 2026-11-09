import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

REPORT_CONTENT = {
    "title": "Laporan Perkembangan",
    "focus": "Fokus Utama : Penyelesaian 8 Butir Revisi Fitur Dashcam, Telemetri, dan Geofencing",
    "progress_header": "Progress Minggu Ini",
    "items": [
        {
            "num": "1. Opsi On/Off Livecam (Default: OFF Terlebih Dahulu)",
            "paras": [
                "Menambahkan opsi saklar kontrol siaran langsung (livecam) pada dashboard pengawasan dashcam, di mana status awal saat halaman pertama kali dibuka diatur secara default tidak aktif (OFF). Fitur ini dirancang untuk mengatasi kendala tingginya penggunaan kuota data internet pada perangkat telematika di lapangan serta mengoptimalkan performa pemuatan awal antarmuka, terutama pada jaringan telekomunikasi area tambang yang fluktuatif.",
                "Pada sisi dashboard, kontrol ditempatkan secara ergonomis pada bilah navigasi pemantauan CCTV. Selama livecam berada dalam status nonaktif, elemen pemutar video FLV Direct tidak dimuat ke dalam memori peramban, sehingga alokasi bandwidth sepenuhnya diprioritaskan untuk pembaruan data telemetri GPS dan peta secara real-time. Operator ruang kontrol dapat mengaktifkan streaming video kamera jalan (CAM 1) maupun kamera kabin (CAM 2) secara fleksibel dengan menekan tombol saklar interaktif yang disediakan begitu pemantauan visual dibutuhkan."
            ]
        },
        {
            "num": "2. Peta Lebih Di-Highlight dan Diperbesar (Core Dispatch View)",
            "paras": [
                "Menata ulang tata letak antarmuka pemantauan dengan menempatkan peta geospasial pada posisi paling atas kolom utama sebagai pusat kendali pengawasan operasional (core dispatch view). Ketinggian dasar peta ditingkatkan dari ukuran awal menjadi 340 piksel, serta dilengkapi dengan fitur tombol ekspansi tampilan layar penuh hingga 500 piksel agar pengawas armada dapat memantau sebaran kendaraan, antrean front loading, dan titik pembuangan secara lebih luas dan leluasa.",
                "Pusat koordinat awal peta diarahkan secara default langsung ke wilayah konsesi tambang batubara PT Harmoni Panca Utama di Kalimantan Timur. Sistem juga dilengkapi dengan fitur pemusatan otomatis (auto-recenter) dan tombol Fokus Unit yang secara seketika mengarahkan kamera peta ke koordinat GPS terkini begitu operator memilih unit armada yang berbeda pada daftar kendaraan."
            ]
        },
        {
            "num": "3. Integrasi Jam Shift Operasional dan Jadwal Kerja Lapangan",
            "paras": [
                "Membangun modul jadwal kerja shift pengemudi yang terhubung secara sistematis dengan master data shift operasional tambang PT Harmoni Panca Utama (Shift 1 dan Shift 2). Fitur ini menyajikan transparansi jadwal jam kerja aktif serta waktu istirahat terencana bagi seluruh pengemudi armada di lapangan.",
                "Pada antarmuka dashboard, informasi disajikan melalui panel operasional yang memuat jadwal shift berjalan (Shift 1 pukul 06:00 – 18:00 WITA dengan jam istirahat pukul 12:00 – 13:00 WITA, atau Shift 2 pukul 18:00 – 06:00 WITA dengan jam istirahat pukul 00:00 – 01:00 WITA). Seluruh informasi jam kerja disinkronkan secara konsisten dengan konfigurasi pergantian shift operasional di site tambang."
            ]
        },
        {
            "num": "4. Pengkategorian Batas Kecepatan Maksimal per Sektor / Site",
            "paras": [
                "Menerapkan konfigurasi pengkategorian batas kecepatan maksimal (speed limit) yang berbeda-beda disesuaikan dengan kondisi geografis dan tingkat risiko masing-masing side atau site penambangan. Batas kecepatan ditetapkan secara terstruktur ke dalam sistem, antara lain:",
                "Site HPA : Batas kecepatan maksimal 60 km/jam untuk jalur hauling utama dan 40 km/jam untuk area front pit.\nSite BDA : Batas kecepatan maksimal 50 km/jam untuk jalur operasional dan 35 km/jam untuk area pit.\nSite KDA : Batas kecepatan maksimal 40 km/jam untuk jalan tambang dan 30 km/jam untuk area pit.\nZona Bahaya Khusus : Area Gudang Bahan Peledak dan segmen turunan curam grade 5.2% dibatasi ketat maksimal 20 hingga 25 km/jam.",
                "Sistem telemetri secara berkelanjutan mengevaluasi kecepatan aktual kendaraan terhadap batas kecepatan lokasi yang sedang dilintasi. Apabila unit melaju melebihi batas yang ditentukan, sistem secara otomatis memicu notifikasi peringatan keselamatan operasional dan mencatat riwayat pelanggaran overspeed pada log keselamatan armada."
            ]
        },
        {
            "num": "5. Pemasangan Tombol On/Off Mikrofon Interkom Kabin",
            "paras": [
                "Menambahkan tombol kontrol mikrofon (intercom) pada bilah navigasi pemantauan CCTV kamera kabin guna memfasilitasi komunikasi suara dua arah secara langsung antara operator ruang kendali (dispatcher) dan sopir di dalam kabin kendaraan.",
                "Ketika tombol mikrofon diaktifkan oleh operator, sistem menampilkan indikator visual bahwa transmisi suara sedang aktif dan membuka kanal audio langsung ke pengeras suara kabin unit yang bersangkutan. Fitur ini memungkinkan dispatcher memberikan arahan operasional, pemberitahuan antrean pit, maupun peringatan bahaya secara seketika tanpa harus bergantung pada komunikasi radio konvensional."
            ]
        },
        {
            "num": "6. Implementasi Penuh Siklus Ritasi dan Geofencing Tambang",
            "paras": [
                "Menuntaskan integrasi seluruh data spasial operasional penambangan ke dalam basis data PostgreSQL dan background worker telemetri otomatis. Sebanyak 530 titik dan zona geofence telah terdaftar rapi di sistem, mencakup area front loading batubara dan overburden di pit aktif, titik dumping disposal dan pelabuhan (port), area fasilitas workshop dan mess karyawan, zona pengawasan kolam pengendap air tambang (WMP), serta 492 titik checkpoint stationing (STA) tiap interval 100 meter di sepanjang rute pengangkutan.",
                "Dua koridor rute hauling utama sepanjang 21 KM (Rute HPA) dan 28.3 KM (Rute Tambang) dirender dalam bentuk garis polyline kontinu pada peta. Layanan background worker memproses koordinat unit secara cerdas melalui formula Haversine, memisahkan deteksi checkpoint jalan dari zona pemuatan, sehingga siklus ritasi otomatis lima tahapan (Loading di Pit, Travel Isi membawa muatan, Dumping di Disposal dengan verifikasi saklar hidrolik PTO On, Travel Kosong, hingga kembali ke Pit) terekam secara mandiri dan akurat ke dalam log ritasi."
            ]
        },
        {
            "num": "7. Pemetaan Masing-Masing Zona (Tarik Manual, Citra Satelit, & Foto Drone)",
            "paras": [
                "Menghadirkan fitur pembuatan dan pengelolaan zona geofence secara interaktif langsung di atas peta digital. Peta dilengkapi dengan layer citra satelit resolusi tinggi yang memperlihatkan kontur bukaan tambang dan badan jalan secara tajam, serta fitur 'Tarik Zona' yang memungkinkan surveyor atau perencana tambang mengeklik titik-titik koordinat secara manual pada peta untuk menyusun batas poligon area baru.",
                "Formulir pembuatan geofence telah disesuaikan secara penuh dengan format standar kebutuhan operasional tambang, memuat field Nama Zona, Koordinat Lintang dan Bujur (Lat, Long) dengan tombol pembantu GPS Unit dan Pusat Peta, Pilihan Warna batas, Alamat atau Blok Tambang, serta Nilai Radius perimeter, dengan dukungan jenis geometri Polygon (area fasilitas/pit), Line (jalur jalan), dan Circle (luas area pit melingkar). Di samping itu, sistem juga menyediakan fitur layer dan pengunggahan foto udara ortofoto drone beresolusi tinggi (GSD 5.2 cm/px) dilengkapi pengatur tingkat transparansi (10% – 100%) untuk memantau kemajuan fisik penambangan terkini.",
                "Foto Bukti:\n\n\n(Tampilan panel konfigurasi geofence, layer citra satelit Google Earth, dan polyline rute hauling tambang HPU)"
            ]
        },
        {
            "num": "8. Kesiapan Deployment ke Server Development HPU",
            "paras": [
                "Menuntaskan optimasi bundel kode antarmuka frontend dan layanan backend untuk memastikan kesiapan penuh implementasi pada server development milik PT Harmoni Panca Utama. Proses kompilasi produksi Vite berhasil dibangun secara efisien dengan ukuran bundel bersih 131 kB yang bebas dari kendala kompatibilitas.",
                "Sistem telah dilengkapi dengan skrip otomatisasi terowongan publik HTTPS (Cloudflare Tunnel) yang memungkinkan aplikasi diuji coba dan didemonstrasikan secara langsung melalui jaringan publik oleh tim manajemen HPU tanpa hambatan konfigurasi port. Seluruh konfigurasi cloud staging juga telah disiapkan secara terstruktur agar setiap pembaruan dapat ditinjau dan dievaluasi secara berkelanjutan."
            ]
        }
    ]
}

def generate_pdf():
    pdf_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Dashcam_HPU.pdf"
    pdf_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Dashcam_HPU.pdf"

    # Margins matching standard document (~1 inch / 72pt, or slightly tighter 54pt)
    doc = SimpleDocTemplate(
        pdf_path1,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Exact Times New Roman styles matching the sample PDF
    title_style = ParagraphStyle(
        'SampleTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=16,
        leading=22,
        textColor=colors.black,
        spaceAfter=12
    )

    focus_style = ParagraphStyle(
        'SampleFocus',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        leading=16,
        textColor=colors.black,
        spaceAfter=16
    )

    progress_hdr_style = ParagraphStyle(
        'SampleProgressHdr',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=16,
        leading=22,
        textColor=colors.black,
        spaceAfter=14
    )

    item_num_style = ParagraphStyle(
        'SampleItemNum',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=13.5,
        leading=18,
        textColor=colors.black,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'SampleBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11.5,
        leading=16.5,
        alignment=TA_LEFT,
        textColor=colors.black,
        spaceAfter=8
    )

    caption_style = ParagraphStyle(
        'SampleCaption',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=14,
        textColor=colors.black,
        alignment=TA_LEFT,
        spaceAfter=10
    )

    story = []

    # Title
    story.append(Paragraph(REPORT_CONTENT["title"], title_style))
    story.append(Spacer(1, 2))

    # Focus
    story.append(Paragraph(REPORT_CONTENT["focus"], focus_style))
    story.append(Spacer(1, 4))

    # Progress Header
    story.append(Paragraph(REPORT_CONTENT["progress_header"], progress_hdr_style))
    story.append(Spacer(1, 4))

    # Items
    for item in REPORT_CONTENT["items"]:
        story.append(Paragraph(item["num"], item_num_style))
        for p in item["paras"]:
            if p.startswith("Foto Bukti:"):
                story.append(Paragraph("<b>Foto Bukti:</b>", body_style))
                story.append(Spacer(1, 10))
            elif p.startswith("(Tampilan") or p.startswith("(Screenshot"):
                story.append(Paragraph(p, caption_style))
            elif "\n" in p:
                for line in p.split("\n"):
                    if line.strip():
                        story.append(Paragraph(line.strip(), body_style))
            else:
                story.append(Paragraph(p, body_style))
        story.append(Spacer(1, 6))

    doc.build(story)
    shutil.copy(pdf_path1, pdf_path2)
    print("Sample-formatted PDF generated at:")
    print("1.", pdf_path1)
    print("2.", pdf_path2)

def generate_docx():
    docx_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Dashcam_HPU.docx"
    docx_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Dashcam_HPU.docx"

    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    BLACK = RGBColor(0, 0, 0)

    # Title: Times New Roman Bold 16pt
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(12)
    p_title.paragraph_format.line_spacing = 1.15
    r_title = p_title.add_run(REPORT_CONTENT["title"])
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(16)
    r_title.bold = True
    r_title.font.color.rgb = BLACK

    # Focus: Times New Roman Regular 12pt
    p_focus = doc.add_paragraph()
    p_focus.paragraph_format.space_before = Pt(0)
    p_focus.paragraph_format.space_after = Pt(16)
    p_focus.paragraph_format.line_spacing = 1.15
    r_focus = p_focus.add_run(REPORT_CONTENT["focus"])
    r_focus.font.name = 'Times New Roman'
    r_focus.font.size = Pt(12)
    r_focus.font.color.rgb = BLACK

    # Progress Header: Times New Roman Bold 16pt
    p_prog = doc.add_paragraph()
    p_prog.paragraph_format.space_before = Pt(0)
    p_prog.paragraph_format.space_after = Pt(14)
    p_prog.paragraph_format.line_spacing = 1.15
    r_prog = p_prog.add_run(REPORT_CONTENT["progress_header"])
    r_prog.font.name = 'Times New Roman'
    r_prog.font.size = Pt(16)
    r_prog.bold = True
    r_prog.font.color.rgb = BLACK

    # Items
    for item in REPORT_CONTENT["items"]:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(10)
        p_item.paragraph_format.space_after = Pt(5)
        p_item.paragraph_format.line_spacing = 1.15
        r_item = p_item.add_run(item["num"])
        r_item.font.name = 'Times New Roman'
        r_item.font.size = Pt(13.5)
        r_item.bold = True
        r_item.font.color.rgb = BLACK

        for p_text in item["paras"]:
            if p_text.startswith("Foto Bukti:"):
                p_fb = doc.add_paragraph()
                p_fb.paragraph_format.space_before = Pt(4)
                p_fb.paragraph_format.space_after = Pt(6)
                r_fb = p_fb.add_run("Foto Bukti:")
                r_fb.font.name = 'Times New Roman'
                r_fb.font.size = Pt(11.5)
                r_fb.bold = True
                r_fb.font.color.rgb = BLACK
            elif p_text.startswith("(Tampilan") or p_text.startswith("(Screenshot"):
                p_cap = doc.add_paragraph()
                p_cap.paragraph_format.space_before = Pt(4)
                p_cap.paragraph_format.space_after = Pt(8)
                r_cap = p_cap.add_run(p_text)
                r_cap.font.name = 'Times New Roman'
                r_cap.font.size = Pt(10)
                r_cap.font.italic = True
                r_cap.font.color.rgb = BLACK
            elif "\n" in p_text:
                for line in p_text.split("\n"):
                    if line.strip():
                        p_sub = doc.add_paragraph()
                        p_sub.paragraph_format.space_before = Pt(2)
                        p_sub.paragraph_format.space_after = Pt(3)
                        p_sub.paragraph_format.line_spacing = 1.15
                        r_sub = p_sub.add_run(line.strip())
                        r_sub.font.name = 'Times New Roman'
                        r_sub.font.size = Pt(11.5)
                        r_sub.font.color.rgb = BLACK
            else:
                p_body = doc.add_paragraph()
                p_body.paragraph_format.space_before = Pt(2)
                p_body.paragraph_format.space_after = Pt(6)
                p_body.paragraph_format.line_spacing = 1.15
                r_body = p_body.add_run(p_text)
                r_body.font.name = 'Times New Roman'
                r_body.font.size = Pt(11.5)
                r_body.font.color.rgb = BLACK

    try:
        doc.save(docx_path1)
        print("1.", docx_path1)
    except PermissionError:
        alt_path = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Dashcam_HPU_Update.docx"
        doc.save(alt_path)
        print("1. (Alt - locked):", alt_path)
    try:
        doc.save(docx_path2)
        print("2.", docx_path2)
    except PermissionError:
        pass

if __name__ == '__main__':
    generate_pdf()
    generate_docx()
