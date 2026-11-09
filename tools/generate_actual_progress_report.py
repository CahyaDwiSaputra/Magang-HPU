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
    "focus": "Fokus Utama : Pembersihan Data Tiruan, Penyesuaian Geofence Tambang, dan Pemantauan Telemetri Riil Smart Fleet HPU",
    "progress_header": "Progress Minggu Ini",
    "items": [
        {
            "num": "1. Pembersihan Menyeluruh Seluruh Fitur Simulasi dan Data Tiruan (Zero Mock Data)",
            "paras": [
                "Pada tahap pengembangan minggu ini, saya melakukan pembersihan dan sterilisasi secara menyeluruh terhadap seluruh komponen simulasi buatan maupun data tiruan (dummy) yang sebelumnya digunakan selama tahap uji coba antarmuka. Langkah ini saya ambil untuk memastikan bahwa sistem Smart Fleet HPU kini hanya menyajikan fitur dan data operasional yang benar-benar riil serta siap digunakan secara langsung di lapangan.",
                "Saya telah menghapus tombol 'Simulasi 5 Siklus' beserta fungsi pergerakan otomatisnya pada kartu ritasi, dan menggantikannya dengan modul 'Riwayat Ritasi' yang terhubung langsung ke basis data PostgreSQL (tabel ritasi_logs). Selain itu, saya juga menghapus laci pemicu alarm tiruan ('Tes Simulasi') pada Alarm Center, sehingga seluruh peringatan keselamatan pengemudi saat ini murni ditarik secara langsung dari sensor G-Sensor dan kamera kecerdasan buatan (DMS) perangkat CMSV6 di armada.",
                "Seluruh data statis pada antarmuka juga telah saya hilangkan, seperti teks hardcoded identitas unit dump truck pada kartu excavator serta angka tetap Hour Meter 98,765 HM. Metrik tersebut kini membaca langsung data aktual dari perangkat GPS, seperti kecepatan riil, odometer akumulatif, dan status kontak mesin aktif (ON/Running)."
            ]
        },
        {
            "num": "2. Penyelesaian Masalah Broken Overlay (Error 404) dan Sterilisasi Layer Peta",
            "paras": [
                "Saya berhasil menelusuri dan menyelesaikan kendala munculnya kotak putih bertuliskan '404' yang sebelumnya menutupi armada di tengah peta. Setelah dilakukan investigasi mendalam, kendala tersebut bersumber dari link sampel foto drone eksternal pada backend yang telah kedaluwarsa serta kondisi logika tampilan layer yang otomatis aktif meskipun pengguna sedang berada pada mode peta satelit.",
                "Untuk mengatasinya, saya telah mencabut seluruh link eksternal yang rusak dari pengendali backend (DashcamController.php), serta menghapus tab 'Foto Drone' dan tombol unggah foto drone dari toolbar peta karena infrastruktur server fotogrametri drone belum terpasang. Dengan perbaikan ini, antarmuka peta kembali steril dan stabil, murni mengandalkan dua penyedia peta utama yang terbukti andal, yaitu Citra Satelit Google Earth dan Peta Jalan OpenStreetMap."
            ]
        },
        {
            "num": "3. Evaluasi Objektif dan Optimalisasi Skala Geofence Konsesi Tambang",
            "paras": [
                "Terkait akurasi zona-zona geofence pada peta pemantauan, saya memastikan bahwa titik koordinat lintang dan bujur (latitude dan longitude) dari 38 zona fasilitas operasional (seperti Pit Selatan, Port HPA, IPD HPA, Office HPU, Mess Karyawan, dan Kolam WMP) serta 492 titik STA jalan hauling telah sesuai dengan data survei resmi konsesi tambang batubara PT Harmoni Panca Utama di Berau, Kalimantan Timur.",
                "Namun, saya mengidentifikasi adanya kelemahan visual di mana geofence sebelumnya digambar dengan radius piksel statis tanpa memperhitungkan tingkat perbesaran (zoom) peta. Hal ini menyebabkan fasilitas yang berdekatan (seperti kantor, mess, dan bengkel) tampak saling menumpuk menjadi gumpalan besar saat peta diperkecil (zoom out). Untuk mengatasi hal tersebut, saya telah memperbarui algoritma visualisasi peta dengan menerapkan perhitungan skala resolusi Web Mercator secara dinamis (r / metersPerPx), sehingga ukuran lingkaran otomatis mengecil secara proporsional saat peta di-zoom out dan label nama tidak lagi saling menutupi jalur jalan hauling.",
                "Sebagai catatan teknis untuk pengembangan lanjutan, bentuk area bukaan tambang (pit) dan penimbunan (disposal) yang sebenarnya di lapangan adalah poligon berliku mengikuti dinding tebing galian, sehingga ke depan representasi visual geofence disarankan ditingkatkan dari lingkaran radial menjadi bentuk poligon fisik tambang."
            ]
        },
        {
            "num": "4. Penataan Antarmuka Pemantauan dan Penghapusan Data Estimasi Waktu",
            "paras": [
                "Sesuai arahan mengenai keharusan penyajian data yang valid, saya telah menghapus kontainer bar biru gelap di bawah peta yang sebelumnya memuat informasi jadwal shift dan perkiraan durasi running. Hal ini dikarenakan angka durasi running tersebut sebelumnya dihitung berdasarkan selisih jam laptop lokal pengguna, bukan berasal dari rekaman sensor starter kontak mesin (engine ignition) armada secara aktual.",
                "Dengan ditiadakannya kolom estimasi tersebut, tata letak antarmuka pemantauan kini tersambung secara langsung dan lebih rapi antara kontainer peta satelit utama dengan panel kartu telemetri riil di bawahnya. Pengawas operasional dapat langsung memantau parameter kecepatan GPS aktual, jarak tempuh odometer GPS harian, status keberadaan zona geofence, jumlah ritasi riil, jumlah satelit GPS terkunci (rata-rata 79 hingga 87 satelit), serta kondisi kontak mesin (ON/Running vs Standby)."
            ]
        },
        {
            "num": "5. Pengendalian Siaran Langsung Kamera (Livecam) dan Komunikasi Interkom Kabin",
            "paras": [
                "Saya telah mengimplementasikan tombol kontrol siaran langsung kamera dashcam (livecam) dengan setelan awal nonaktif (default: OFF). Pengaturan ini sengaja saya terapkan untuk menghemat konsumsi kuota data internet kartu seluler armada di lapangan tambang serta memastikan pemuatan awal halaman dashboard berjalan sangat cepat tanpa terbebani pemutaran video secara simultan. Operator ruang kendali dapat mengaktifkan pemantauan visual kamera jalan (CAM 1) maupun kamera kabin (CAM 2) secara fleksibel begitu pengawasan visual diperlukan.",
                "Selain itu, saya juga telah memasang tombol kontrol mikrofon (intercom) pada bilah navigasi pemantauan CCTV. Fitur ini memungkinkan dispatcher ruang kendali membuka kanal suara dua arah langsung ke pengeras suara di dalam kabin kendaraan untuk memberikan arahan operasional mendesak, informasi antrean pengisian muatan di pit, maupun peringatan keselamatan secara seketika."
            ]
        },
        {
            "num": "6. Penyelesaian Kendala Layar Blank Hitam dan Kesiapan Kompilasi Produksi",
            "paras": [
                "Saya berhasil menyelesaikan kendala layar blank hitam yang sempat terjadi pada peramban saat mengakses rute pemantauan dashcam. Kendala tersebut teridentifikasi sebagai dampak dari sisa variabel yang belum terhapus sempurna saat sterilisasi fitur simulasi, yang memicu terjadinya unhandled reference error pada framework React sehingga antarmuka gagal dimuat dan menampilkan warna dasar gelap dari tema peramban.",
                "Setelah seluruh variabel dibersihkan dan fungsi pembaruan alarm ditempatkan pada cakupan yang tepat, pengecekan sistem menggunakan pemeriksa tipe TypeScript (tsc) telah tuntas dengan status bersih (0 error). Bundel aset produksi frontend juga telah saya kompilasi ulang menggunakan Vite (npm run build) menghasilkan ukuran berkas yang teroptimasi secara efisien (113.4 kB), bebas dari kendala kompatibilitas, dan sepenuhnya siap dioperasikan pada server development milik PT Harmoni Panca Utama."
            ]
        }
    ]
}

def generate_pdf():
    pdf_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Smart_Fleet_HPU.pdf"
    pdf_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Smart_Fleet_HPU.pdf"

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
        fontSize=13,
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
            story.append(Paragraph(p, body_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    try:
        shutil.copy(pdf_path1, pdf_path2)
    except Exception as e:
        print("Copy PDF to obsidian failed:", e)

    print("Actual-formatted PDF generated at:")
    print("1.", pdf_path1)
    print("2.", pdf_path2)

def generate_docx():
    docx_path1 = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Smart_Fleet_HPU.docx"
    docx_path2 = "C:/Users/muham/OneDrive/Documents/Obsidian Vault/01 Projects/HPU Dashcam & Fleet Management/Laporan_Perkembangan_Smart_Fleet_HPU.docx"

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
        r_item.font.size = Pt(13)
        r_item.bold = True
        r_item.font.color.rgb = BLACK

        for p_text in item["paras"]:
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
        alt_path = "D:/Semester 5/hpu/documents/Laporan_Perkembangan_Smart_Fleet_HPU_v2.docx"
        doc.save(alt_path)
        print("1. (Alt - locked):", alt_path)

    try:
        doc.save(docx_path2)
        print("2.", docx_path2)
    except Exception as e:
        print("Copy DOCX to obsidian failed:", e)

if __name__ == '__main__':
    generate_pdf()
    generate_docx()
