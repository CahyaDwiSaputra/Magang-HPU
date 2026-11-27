<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$params = [
    'jsession' => $jsession,
    'vehiIdno' => 'TrialUNS2',
    'begintime' => '2026-09-01 00:00:00',
    'endtime' => '2026-09-25 23:59:59',
    'toMap' => 2
];

$res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryIdentifyAlarm.action', $params)->json();
echo "queryIdentifyAlarm for TrialUNS2:\n";
print_r($res);
