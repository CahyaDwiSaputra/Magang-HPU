<?php
$res = file_get_contents('http://localhost:8000/api/cmsv6/session');
echo "Session API: " . $res . "\n";
$data = json_decode($res, true);
$j = $data['jsession'] ?? '';

if ($j) {
    // Test direct to 6604
    $urlDirect = "http://10.10.0.53:6604/3/3?AVType=1&jsession={$j}&DevIDNO=240078916116&Channel=1&Stream=1";
    $ch = curl_init($urlDirect);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    $d = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo "Direct 6604 CH1: HTTP $code, len=" . strlen($d ?? '') . "\n";
    curl_close($ch);

    // Test stream-proxy
    $urlProxy = "http://localhost:8000/stream-proxy?jsession={$j}&dev=240078916116&ch=1&stream=1";
    $ch2 = curl_init($urlProxy);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_TIMEOUT, 3);
    $d2 = curl_exec($ch2);
    $code2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    echo "Local stream-proxy CH1: HTTP $code2, len=" . strlen($d2 ?? '') . "\n";
    curl_close($ch2);
}
exit(0);
