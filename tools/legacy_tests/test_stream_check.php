<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action', [
    'account' => 'admin',
    'password' => 'Password.1'
])->json();

$j = $login['jsession'] ?? null;
echo "Login result: " . json_encode($login['result'] ?? -1) . " JSESSION: " . $j . PHP_EOL;

if (!$j) exit;

$statusAll = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAllDeviceStatus.action', [
    'jsession' => $j
])->json();

$onlineUnits = [];
if (isset($statusAll['status']) && is_array($statusAll['status'])) {
    foreach ($statusAll['status'] as $s) {
        if (($s['online'] ?? 0) == 1) {
            $onlineUnits[] = $s['devIdno'];
        }
    }
}
echo "Total devices: " . count($statusAll['status'] ?? []) . " Online devices: " . count($onlineUnits) . PHP_EOL;
echo "Online devices list: " . implode(', ', array_slice($onlineUnits, 0, 10)) . PHP_EOL;

$devicesToTest = !empty($onlineUnits) ? array_slice($onlineUnits, 0, 3) : ['240078734998', '240078916116'];

foreach ($devicesToTest as $d) {
    for ($c = 0; $c <= 1; $c++) {
        $url = "http://182.253.27.12:6604/3/3?AVType=1&jsession={$j}&DevIDNO={$d}&Channel={$c}&Stream=1";
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        $data = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_errno($ch);
        $len = strlen($data ?? '');
        $isFlv = (substr($data ?? '', 0, 3) === 'FLV');
        echo "Dev {$d} CH{$c}: HTTP={$code} Size={$len} FLV=" . ($isFlv ? 'YES' : 'NO') . " Err={$err}" . PHP_EOL;
        curl_close($ch);
    }
}
