# Legacy Exploratory & Testing Scripts (CMSV6 Integration)

Direktori ini berisi skrip uji coba mandiri (*scratchpad / spike scripts*) yang digunakan selama fase riset dan debugging awal integrasi gateway telematika tambang **CMSV6 (Active Security Cloud Platform)** di PT Harmoni Panca Utama.

## 📌 Status
**ARSIP / REFERENSI DOKUMENTASI**:
Skrip-skrip di bawah ini **tidak digunakan oleh aplikasi produksi**. Seluruh fungsi integrasi telah diimplementasikan secara resmi ke dalam arsitektur Laravel:
- **Proxy Gateway & Cache**: `app/Http/Controllers/Api/CmsV6ProxyController.php`
- **Dashcam & Geofence Controller**: `app/Http/Controllers/Api/DashcamController.php`
- **Background Telemetry Worker**: `app/Console/Commands/MonitorDashcamTelemetry.php`

## 🗂️ Daftar Skrip Berdasarkan Kategori

### 1. Konektivitas & Port Gateway
- `test_cmsv6.php`: Pengujian koneksi HTTP dasar & login akun CMSV6.
- `test_ports.php`: Scanning ketersediaan port CMSV6 (8080 vs 8088).
- `test_proxy.php`: Validasi proxy lokal reverse-proxy Nginx.

### 2. Status & Penemuan Armada (Fleet Discovery)
- `test_status.php`: Pengecekan status tunggal perangkat MDVR.
- `test_status_all.php`: Batch query status perangkat.
- `test_status_now.php`: Status real-time perangkat aktif saat ini.
- `test_vehicles.php`: Pengecekan daftar armada tambang.
- `test_all_vehicles.php`: Query total seluruh unit kendaraan.
- `test_query_devices.php`: Validasi API `StandardApiAction_getDeviceStatus.action`.
- `test_all_devs_status.php`: Chunk query status 137 unit armada tambang.

### 3. Alarm Keselamatan Tambang (Safety Alarms DMS/ADAS)
- `test_alarms.php`: Pengambilan alarm keselamatan aktif.
- `test_alarm_history.php`: Riwayat alarm historis berdasarkan rentang tanggal.
- `test_alarm_endpoints.php`: Pengujian variasi endpoint alarm CMSV6.
- `test_alarm_queries.php`: Filter alarm berdasarkan jenis pelanggaran.
- `test_alarm_handle.php`: Pengujian penanganan (*handle / acknowledge*) alarm dari web.
- `test_all_vehi_alarms.php`: Pengambilan alarm terdistribusi per unit armada.
- `test_arm_types_api.php`: Peta kode tipe alarm (*alarm type dictionary*).
- `test_exact_alarm_date.php`: Verifikasi format timestamp & zona waktu alarm.
- `test_query_alarm_detail.php`: Pengambilan metadata detail satu event alarm.
- `test_query_identify_alarm.php`: Identifikasi jenis alarm berbasis AI DMS/ADAS.
- `test_scan_alarm_days.php`: Scanning log alarm multi-hari.
- `test_unhandle_list.php`: Daftar alarm keselamatan yang belum ditindaklanjuti.
- `test_param_combos.php`: Validasi kombinasi parameter query CMSV6.

### 4. Video Streaming Livecam MDVR
- `test_ch1.php`: Streaming kamera depan jalan (Channel 0 / CAM 1).
- `test_stream_check.php`: Validasi URL media streaming livecam.
- `test_stream_now.php`: Pemeriksaan ketersediaan stream aktif saat ini.
- `test_stream_types.php`: Perbandingan tipe stream (HLS, FLV, WebRTC, RTMP).
- `test_query.php`: Query umum API 808GPS.
