<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action', [
    'account' => 'admin',
    'password' => 'Password.1'
])->json();

$j = $login['jsession'] ?? null;
echo "JSESSION: {$j}\n";

$devices = [
    '240078734998', '240078740672', '240078921470', '240078921678', '240078916025',
    '291073208720', '240078735201', '240078735110', '240078734980', '240079626307',
    '240079658477', '240079608836', '240079636952', '240078915951', '240078915952',
    '240078740557', '240078916116'
];

foreach ($devices as $d) {
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_getDeviceStatus.action', [
        'devIdno' => $d,
        'jsession' => $j
    ])->json();
    $r = $res['result'] ?? -1;
    $hasStatus = !empty($res['status']);
    $gt = $hasStatus ? ($res['status'][0]['gt'] ?? '') : '';
    $online = $hasStatus ? ($res['status'][0]['online'] ?? ($res['status'][0]['net'] ?? 'N/A')) : 'N/A';
    echo "Dev {$d}: res={$r} hasStatus=" . ($hasStatus ? 'YES' : 'NO') . " net={$online} time={$gt}\n";
}
