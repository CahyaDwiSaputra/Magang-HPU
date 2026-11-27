# CMSV6 Vendor Reference SDK & Parser Scripts

Direktori ini berisi berkas SDK JavaScript dan skrip parser referensi yang diunduh langsung dari server gateway CMSV6 (`http://10.10.0.33:8088/808gps/open/...`) selama proses pemetaan endpoint API.

## Berkas Vendor:
- `apiPage.js`: Dokumentasi & mapping seluruh action endpoint API 808GPS.
- `webApi.js`: SDK client JavaScript CMSV6.
- `videoH5.html`: Player HTML5 bawaan vendor untuk streaming CCTV.

## Skrip Parser Referensi:
- `find_actions.php`: Ekstraksi daftar nama action API.
- `find_alarm_detail.php`: Analisis struktur respons alarm detail.
- `find_alarm_params.php`: Ekstraksi parameter query alarm.
- `find_arm_types.php`: Ekstraksi dictionary tipe alarm.
- `find_error_code.php`: Mapping daftar error code CMSV6.
- `find_identify_alarm.php`: Pola pengenalan alarm AI.
