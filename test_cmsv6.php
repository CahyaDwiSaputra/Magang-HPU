<?php

// Script untuk test koneksi ke server CMSV6 HPU
// Jalankan: php test_cmsv6.php

$base = 'http://10.10.0.53:8080';
$url  = $base . '/808gps/StandardApiAction_login.action?account=admin&password=Password.1';

echo "Testing koneksi ke CMSV6 server...\n";
echo "URL: {$url}\n\n";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

$body  = curl_exec($ch);
$error = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($error) {
    echo "❌ GAGAL: {$error}\n";
    echo "   => VPN belum aktif atau server tidak bisa dijangkau.\n";
} else {
    echo "✅ BERHASIL! HTTP {$httpCode}\n";
    echo "Response: {$body}\n";
}
