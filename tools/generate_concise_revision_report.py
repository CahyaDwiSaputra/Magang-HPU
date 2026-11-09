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
    "focus": "Fokus Utama : Penyelesaian 8 Butir Revisi Fitur Dashcam, Geofencing, dan Telemetri Smart Fleet HPU",
    "progress_header": "Progress Minggu Ini",
    "items": [
        {
            "num": "1. Opsi On/Off Livecam dengan Default Awal OFF (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menambahkan saklar kontrol On/Off Livecam pada panel navigasi CCTV dengan status awal default nonaktif (OFF). Hal ini berhasil menghemat penggunaan kuota internet kartu seluler armada di lapangan tambang dan mempercepat waktu pemuatan halaman. Operator dapat mengaktifkan streaming video kamera jalan (CAM 1) maupun kamera kabin (CAM 2) secara fleksibel sewaktu-waktu saat pemantauan visual dibutuhkan."
            ]
        },
        {
            "num": "2. Peta Lebih Di-Highlight dan Diperbesar sebagai Pusat Kendali (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menata ulang tata letak dashboard dengan menempatkan peta geospasial pada posisi paling atas kolom utama sebagai pusat kendali operasional (core dispatch view). Ketinggian dasar peta ditingkatkan ke 340 piksel dengan opsi ekspansi satu klik hingga 500 piksel, serta dilengkapi fitur auto-recenter dan tombol Fokus Unit untuk mengarahkan kamera peta langsung ke koordinat GPS armada aktif."
            ]
        },
        {
            "num": "3. Catatan Jam Shift dan Penyesuaian Data Operasional Riil (Sudah Dikerjakan)",
            "paras": [
                "Saya telah mengintegrasikan jadwal kerja shift operasional (Shift 1 pukul 06:00 – 18:00 WITA dan Shift 2 pukul 18:00 – 06:00 WITA) yang terhubung ke master data tambang pada tabel msshift. Untuk menjaga validitas sistem, keterangan durasi running berbasis estimasi jam laptop lokal telah saya bersihkan dari antarmuka, sehingga tampilan peta kini langsung menyatu dengan strip telemetri operasional aktual."
            ]
        },
        {
            "num": "4. Pengkategorian Batas Kecepatan Maksimal per Site / Side Tambang (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menyusun konfigurasi batas kecepatan per lokasi penambangan (Site HPA Max 60 km/jam, Site BDA Max 50 km/jam, Site KDA Max 40 km/jam, area front pit 30–40 km/jam, dan area hazard 20–25 km/jam). Sistem telemetri mengevaluasi kecepatan armada secara real-time dan memicu peringatan keselamatan operasional otomatis jika unit melaju melebihi batas yang ditentukan (overspeed)."
            ]
        },
        {
            "num": "5. Pemasangan Tombol On/Off Mic Intercom Kabin Pengemudi (Sudah Dikerjakan)",
            "paras": [
                "Saya telah memasang tombol kontrol mikrofon (intercom Push-to-Talk) pada bilah kontrol CCTV kamera kabin. Fitur ini memungkinkan dispatcher ruang kendali membuka komunikasi suara dua arah secara langsung ke pengeras suara di dalam kabin pengemudi untuk menyampaikan instruksi operasional antrean pit maupun peringatan bahaya keselamatan secara seketika."
            ]
        },
        {
            "num": "6. Integrasi Penuh Siklus Ritasi dan Geofencing Bebas Data Dummy (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menuntaskan integrasi 530 geofences aktif ke PostgreSQL (38 fasilitas tambang dan 492 titik STA) serta me-render 2 rute polyline hauling (21 KM Jalur HPA & 28.3 KM Jalur Tambang). Seluruh fitur simulasi trip tiruan telah dihapus total; pencatatan ritasi kini murni mengandalkan pergerakan GPS armada melintasi zona operasional dan verifikasi sensor hidrolik PTO (Power Take-Off) aktif secara otomatis."
            ]
        },
        {
            "num": "7. Pemetaan Zona Manual, Citra Satelit, dan Optimalisasi Skala Geofence (Sudah Dikerjakan)",
            "paras": [
                "Saya telah melengkapi peta dengan citra satelit Google Earth beresolusi tinggi, fitur Tarik Zona manual, serta formulir pembuatan geofence. Selain itu, saya telah memperbaiki kendala penumpukan lingkaran geofence dengan menerapkan kalkulasi skala zoom matematis berbasis Web Mercator (r / metersPerPx), sehingga lingkaran mengecil proporsional saat peta di-zoom out dan jalur jalan hauling tetap terlihat jelas."
            ]
        },
        {
            "num": "8. Kesiapan Deployment ke Server Development PT HPU (Sudah Dikerjakan)",
            "paras": [
                "Saya telah menyelesaikan kendala teknis layar blank hitam, memastikan pemeriksaan tipe data TypeScript tuntas tanpa error (0 error), dan mengompilasi bundel produksi Vite secara bersih (113.4 kB). Skrip otomatisasi terowongan publik HTTPS (Cloudflare Tunnel via start_presentation.bat) dan konfigurasi cloud staging telah siap digunakan untuk peninjauan langsung oleh manajemen HPU."
            ]
        }
    ]
}

def generate_pdf():
    pdf_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU_Final.pdf"
    pdf_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU_Final.pdf"
    pdf_std = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.pdf"
    pdf_obs_std = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.pdf"

    # Letter size with 45pt margins (~0.62 in) to cleanly fit 2 pages
    doc = SimpleDocTemplate(
        pdf_path1,
        pagesize=letter,
        leftMargin=48,
        rightMargin=48,
        topMargin=48,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'SampleTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=15,
        leading=20,
        textColor=colors.black,
        spaceAfter=8
    )

    focus_style = ParagraphStyle(
        'SampleFocus',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11.5,
        leading=15,
        textColor=colors.black,
        spaceAfter=12
    )

    progress_hdr_style = ParagraphStyle(
        'SampleProgressHdr',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=14.5,
        leading=19,
        textColor=colors.black,
        spaceAfter=10
    )

    item_num_style = ParagraphStyle(
        'SampleItemNum',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.black,
        spaceBefore=8,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'SampleBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10.5,
        leading=14.5,
        alignment=TA_LEFT,
        textColor=colors.black,
        spaceAfter=4
    )

    story = []

    # Title
    story.append(Paragraph(REPORT_CONTENT["title"], title_style))
    story.append(Spacer(1, 2))

    # Focus
    story.append(Paragraph(REPORT_CONTENT["focus"], focus_style))
    story.append(Spacer(1, 2))

    # Progress Header
    story.append(Paragraph(REPORT_CONTENT["progress_header"], progress_hdr_style))
    story.append(Spacer(1, 2))

    # Items 1 to 8
    for item in REPORT_CONTENT["items"]:
        story.append(Paragraph(item["num"], item_num_style))
        for p in item["paras"]:
            story.append(Paragraph(p, body_style))
        story.append(Spacer(1, 2))

    doc.build(story)
    
    # Copy to destinations
    for target in [pdf_path2, pdf_std, pdf_obs_std]:
        try:
            shutil.copy(pdf_path1, target)
        except Exception:
            pass

    print("Concise PDF generated at:")
    print("1.", pdf_path1)
    print("2.", pdf_path2)

def generate_docx():
    docx_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU_Ringkas.docx"
    docx_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU_Ringkas.docx"
    docx_std = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"
    docx_obs_std = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Revisi_Dashcam_HPU.docx"

    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    BLACK = RGBColor(0, 0, 0)

    # Title: Times New Roman Bold 15pt
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(8)
    p_title.paragraph_format.line_spacing = 1.15
    r_title = p_title.add_run(REPORT_CONTENT["title"])
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(15)
    r_title.bold = True
    r_title.font.color.rgb = BLACK

    # Focus: Times New Roman Regular 11.5pt
    p_focus = doc.add_paragraph()
    p_focus.paragraph_format.space_before = Pt(0)
    p_focus.paragraph_format.space_after = Pt(12)
    p_focus.paragraph_format.line_spacing = 1.15
    r_focus = p_focus.add_run(REPORT_CONTENT["focus"])
    r_focus.font.name = 'Times New Roman'
    r_focus.font.size = Pt(11.5)
    r_focus.font.color.rgb = BLACK

    # Progress Header: Times New Roman Bold 14.5pt
    p_prog = doc.add_paragraph()
    p_prog.paragraph_format.space_before = Pt(0)
    p_prog.paragraph_format.space_after = Pt(10)
    p_prog.paragraph_format.line_spacing = 1.15
    r_prog = p_prog.add_run(REPORT_CONTENT["progress_header"])
    r_prog.font.name = 'Times New Roman'
    r_prog.font.size = Pt(14.5)
    r_prog.bold = True
    r_prog.font.color.rgb = BLACK

    # Items 1 to 8
    for item in REPORT_CONTENT["items"]:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(7)
        p_item.paragraph_format.space_after = Pt(2)
        p_item.paragraph_format.line_spacing = 1.15
        r_item = p_item.add_run(item["num"])
        r_item.font.name = 'Times New Roman'
        r_item.font.size = Pt(11.5)
        r_item.bold = True
        r_item.font.color.rgb = BLACK

        for p_text in item["paras"]:
            p_body = doc.add_paragraph()
            p_body.paragraph_format.space_before = Pt(1)
            p_body.paragraph_format.space_after = Pt(4)
            p_body.paragraph_format.line_spacing = 1.15
            r_body = p_body.add_run(p_text)
            r_body.font.name = 'Times New Roman'
            r_body.font.size = Pt(10.5)
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
