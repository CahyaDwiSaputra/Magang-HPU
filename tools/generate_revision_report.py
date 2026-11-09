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
    "focus": "Fokus Utama : Penyelesaian dan Penyesuaian 8 Butir Revisi Fitur Dashcam, Telemetri, dan Geofencing Smart Fleet HPU",
    "progress_header": "Progress Minggu Ini",
    "items": [
        {
            "num": "1. Ada Opsi untuk On/Off Livecam dengan Default Awal OFF (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menambahkan opsi saklar kontrol siaran langsung kamera dashcam (livecam) pada dashboard pengawasan, di mana status awal saat halaman pertama kali dibuka disetel secara default tidak aktif (OFF). Pengaturan ini saya terapkan untuk mengatasi kendala tingginya penggunaan kuota data internet pada kartu seluler perangkat telematika di lapangan, serta memastikan performa pemuatan awal antarmuka berjalan cepat dan ringan pada jaringan telekomunikasi area tambang yang fluktuatif.",
                "Pada antarmuka sistem, kontrol tombol saya tempatkan secara ergonomis pada bilah navigasi pemantauan CCTV. Selama livecam berada dalam status nonaktif, pemutar video tidak membebani memori peramban, sehingga alokasi bandwidth sepenuhnya diprioritaskan untuk pembaruan data telemetri GPS dan peta secara real-time. Operator ruang kontrol (dispatcher) dapat mengaktifkan streaming video kamera jalan (CAM 1) maupun kamera kabin (CAM 2) secara fleksibel sewaktu-waktu dengan menekan tombol saklar yang disediakan begitu pemantauan visual dibutuhkan."
            ]
        },
        {
            "num": "2. Peta Lebih Di-Highlight dan Diperbesar sebagai Pusat Kendali (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menata ulang tata letak antarmuka pemantauan dengan menempatkan peta geospasial pada posisi paling atas kolom utama sebagai pusat kendali pengawasan operasional (core dispatch view). Ketinggian dasar kontainer peta saya tingkatkan menjadi 340 piksel, serta saya lengkapi dengan tombol ekspansi tampilan layar penuh hingga 500 piksel agar pengawas armada dapat memantau sebaran kendaraan, antrean front loading pit, dan titik pembuangan disposal secara lebih luas dan leluasa.",
                "Pusat koordinat awal peta saya arahkan secara langsung ke wilayah konsesi tambang batubara PT Harmoni Panca Utama di Kalimantan Timur. Sistem peta juga telah saya lengkapi dengan fitur pemusatan otomatis (auto-recenter) dan tombol Fokus Unit yang secara seketika mengarahkan kamera peta ke titik koordinat GPS terkini begitu operator memilih unit armada yang berbeda pada daftar kendaraan."
            ]
        },
        {
            "num": "3. Catatan Jam Shift dan Penyesuaian Data Running Mesin Armada (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menghubungkan sistem dashboard dengan master data shift operasional tambang PT Harmoni Panca Utama pada tabel msshift (Shift 1 pukul 06:00 – 18:00 WITA dengan jam istirahat pukul 12:00 – 13:00 WITA, serta Shift 2 pukul 18:00 – 06:00 WITA dengan jam istirahat pukul 00:00 – 01:00 WITA).",
                "Terkait catatan waktu running mesin armada, pada awalnya saya sempat menerapkan kalkulasi estimasi durasi running berdasarkan selisih jam laptop lokal pengguna. Namun, setelah dilakukan penelaahan mendalam bahwa angka tersebut belum mencerminkan data aktual dari sensor starter kontak mesin (engine ignition) armada di lapangan, seluruh keterangan estimasi durasi running dan banner jadwal tersebut telah resmi saya bersihkan dan hapus dari antarmuka. Dengan langkah ini, tata letak peta kini langsung terhubung secara bersih dengan strip kartu telemetri riil (kecepatan GPS aktual, odometer GPS, status kontak mesin ON/Running, dan satelit GPS terkunci)."
            ]
        },
        {
            "num": "4. Pengkategorian Batas Kecepatan Maksimal Berdasarkan Site / Side Tambang (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menerapkan konfigurasi data pengkategorian batas kecepatan maksimal (speed limit) yang berbeda-beda sesuai dengan kondisi geografis dan tingkat risiko operasional masing-masing side atau site penambangan. Parameter batas kecepatan yang saya tetapkan ke dalam sistem meliputi:",
                "Site HPA : Batas kecepatan maksimal 60 km/jam untuk jalur hauling utama dan 40 km/jam untuk area front pit.\nSite BDA : Batas kecepatan maksimal 50 km/jam untuk jalur operasional dan 35 km/jam untuk area pit.\nSite KDA : Batas kecepatan maksimal 40 km/jam untuk jalan tambang dan 30 km/jam untuk area pit.\nSite AMO : Batas kecepatan maksimal 50 km/jam untuk jalur operasional dan 35 km/jam untuk area pit.\nSite KJA : Batas kecepatan maksimal 60 km/jam untuk jalur hauling dan 40 km/jam untuk area pit.\nZona Bahaya Khusus : Area Gudang Bahan Peledak dan segmen turunan curam grade 5.2% dibatasi ketat maksimal 20 hingga 25 km/jam.",
                "Sistem telemetri secara berkelanjutan mengevaluasi kecepatan aktual kendaraan terhadap batas kecepatan lokasi site yang sedang dilintasi. Apabila unit armada melaju melebihi batas yang ditentukan, sistem secara otomatis memicu notifikasi peringatan keselamatan operasional dan mencatat riwayat pelanggaran overspeed pada log keselamatan armada."
            ]
        },
        {
            "num": "5. Pemasangan Tombol On/Off Mikrofon Interkom Kabin Pengemudi dan Operator (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menambahkan tombol kontrol mikrofon (intercom Push-to-Talk) pada bilah navigasi kontrol pemantauan CCTV kamera kabin. Fitur ini dirancang untuk memfasilitasi komunikasi suara dua arah secara langsung antara operator ruang kendali (dispatcher) dan pengemudi di dalam kabin kendaraan.",
                "Ketika tombol mikrofon diaktifkan oleh operator, sistem menampilkan indikator visual bahwa transmisi suara sedang aktif dan membuka kanal audio langsung ke pengeras suara di kabin unit armada yang bersangkutan. Fitur ini memungkinkan dispatcher memberikan arahan operasional pit, pemberitahuan antrean pemuatan batubara, maupun peringatan bahaya keselamatan secara seketika tanpa harus bergantung pada komunikasi radio konvensional."
            ]
        },
        {
            "num": "6. Integrasi Penuh Siklus Ritasi dan Geofencing Tambang Bebas Data Dummy (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menuntaskan integrasi seluruh data spasial operasional penambangan ke dalam basis data PostgreSQL dan background worker telemetri otomatis. Sebanyak 530 titik dan zona geofence telah terdaftar rapi di sistem, mencakup 38 zona fasilitas operasional (seperti Pit Selatan, Port HPA, IPD HPA, OPD Low Wall, kolam pengendapan air tambang WMP 4 dan WMP 5, kantor, mess, dan bengkel) serta 492 titik checkpoint stationing (STA) tiap interval 100 meter di sepanjang koridor jalan pengangkutan.",
                "Dua koridor rute hauling utama sepanjang 21 KM (Rute HPA) dan 28.3 KM (Rute Tambang) telah saya render dalam bentuk garis polyline kontinu pada peta satelit. Seluruh fitur simulasi trip buatan ('Simulasi 5 Siklus') pada kartu ritasi telah saya hapus total. Pencatatan ritasi saat ini murni mengandalkan pergerakan GPS armada melintasi zona pit dan disposal serta verifikasi sensor hidrolik PTO (Power Take-Off) aktif secara mandiri dan akurat ke dalam log ritasi."
            ]
        },
        {
            "num": "7. Pembuatan Peta Zona Manual, Citra Satelit Google Earth, dan Optimalisasi Skala Geofence (Sudah Dikerjakan)",
            "paras": [
                "Saya telah melengkapi peta dengan layer citra satelit Google Earth beresolusi tinggi yang menampilkan kontur bukaan tambang dan badan jalan secara tajam, serta fitur tombol 'Tarik Zona' dan formulir konfigurasi manual yang memungkinkan pengguna mengeklik titik koordinat langsung di atas peta digital. Formulir geofence mendukung field Nama Zona, Koordinat Lat/Long, Pilihan Warna, Alamat Blok, dan Nilai Radius, dengan tipe geometri Polygon, Line, dan Circle.",
                "Selain itu, saya telah memperbaiki kendala penumpukan lingkaran geofence yang sebelumnya terjadi saat peta diperkecil (zoom out). Kendala tersebut disebabkan oleh rumus radius piksel statis; kini saya telah memperbaruinya dengan menerapkan kalkulasi skala resolusi Web Mercator dinamis (r / metersPerPx). Dengan perbaikan ini, lingkaran geofence otomatis mengecil secara proporsional saat peta di-zoom out sehingga tidak saling menumpuk dan tidak menutupi jalur jalan hauling.",
                "Foto Bukti:\n\n\n(Tampilan panel peta citra satelit Google Earth, polyline rute hauling tambang HPU, dan tombol kontrol penarikan zona)"
            ]
        },
        {
            "num": "8. Kesiapan Deployment ke Server Development Milik PT HPU (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menuntaskan seluruh proses optimasi bundel kode frontend dan layanan backend untuk memastikan kesiapan penuh implementasi pada server development milik PT Harmoni Panca Utama. Kendala fatal ReferenceError yang sempat memicu tampilan layar blank hitam telah berhasil saya selesaikan secara tuntas, pengecekan tipe data TypeScript telah lolos bersih (0 error), dan kompilasi produksi Vite (npm run build) berhasil dibangun secara efisien dengan ukuran bundel bersih 113.4 kB.",
                "Sistem juga telah saya lengkapi dengan skrip otomatisasi terowongan publik HTTPS (Cloudflare Tunnel via start_presentation.bat) serta konfigurasi cloud staging, sehingga aplikasi dapat didemonstrasikan, diuji coba, dan dievaluasi secara langsung melalui jaringan publik oleh tim manajemen HPU tanpa hambatan konfigurasi port."
            ]
        }
    ]
}

def generate_pdf():
    pdf_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU_Final.pdf"
    pdf_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU_Final.pdf"
    pdf_std = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.pdf"
    pdf_obs_std = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.pdf"

    doc = SimpleDocTemplate(
        pdf_path1,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

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
        fontName='Times-Bold',
        fontSize=12.5,
        leading=17,
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

    # Items 1 to 8
    for item in REPORT_CONTENT["items"]:
        story.append(Paragraph(item["num"], item_num_style))
        for p in item["paras"]:
            if p.startswith("Foto Bukti:"):
                story.append(Paragraph("<b>Foto Bukti:</b>", body_style))
                story.append(Spacer(1, 8))
            elif p.startswith("(Tampilan") or p.startswith("(Screenshot"):
                story.append(Paragraph(p, caption_style))
            elif "\n" in p:
                for line in p.split("\n"):
                    if line.strip():
                        story.append(Paragraph(line.strip(), body_style))
            else:
                story.append(Paragraph(p, body_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    
    # Copy to destinations
    for target in [pdf_path2, pdf_std, pdf_obs_std]:
        try:
            shutil.copy(pdf_path1, target)
        except Exception as e:
            pass

    print("Revision-matched PDF generated at:")
    print("1.", pdf_path1)
    print("2.", pdf_path2)

def generate_docx():
    docx_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU_Final.docx"
    docx_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU_Final.docx"
    docx_std = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"
    docx_obs_std = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"

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

    # Items 1 to 8
    for item in REPORT_CONTENT["items"]:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(10)
        p_item.paragraph_format.space_after = Pt(5)
        p_item.paragraph_format.line_spacing = 1.15
        r_item = p_item.add_run(item["num"])
        r_item.font.name = 'Times New Roman'
        r_item.font.size = Pt(12.5)
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

    # Save to path1 and path2
    try:
        doc.save(docx_path1)
        print("1.", docx_path1)
    except Exception as e:
        print("Failed saving docx_path1:", e)

    try:
        doc.save(docx_path2)
        print("2.", docx_path2)
    except Exception as e:
        print("Failed saving docx_path2:", e)

    # Try saving to standard path if unlocked
    try:
        doc.save(docx_std)
        print("3. (std):", docx_std)
    except Exception:
        pass

    try:
        doc.save(docx_obs_std)
        print("4. (obs std):", docx_obs_std)
    except Exception:
        pass

if __name__ == '__main__':
    generate_pdf()
    generate_docx()
