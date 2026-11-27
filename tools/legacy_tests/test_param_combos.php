<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];
$dev = '240078916116';

$testParams = [
    ['devIdnos' => $dev],
    ['devIdno' => $dev],
    ['DevIDNO' => $dev],
    ['devIdnos' => $dev, 'toMap' => 2],
    ['vehiIdno' => 'TrialUNS2'],
    ['vehiIdnos' => 'TrialUNS2'],
    ['armType' => 0],
    ['type' => 0],
];

foreach ($testParams as $p) {
    $p['jsession'] = $jsession;
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_vehicleAlarm.action', $p)->json();
    echo json_encode($p) . " => " . json_encode($res) . "\n";
}
