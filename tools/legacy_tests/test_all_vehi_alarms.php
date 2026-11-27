<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$vehis = ['TrialUNS2', 'TrialUNS1', '663065697201'];

foreach ($vehis as $v) {
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', [
        'jsession' => $jsession,
        'vehiIdno' => $v,
        'begintime' => '2026-09-20 00:00:00',
        'endtime' => '2026-09-25 23:59:59',
        'currentPage' => 1,
        'pageRecords' => 50,
        'toMap' => 2,
        'armType' => 0
    ])->json();
    echo "Vehicle $v: Result={$res['result']}, Total=" . ($res['pagination']['totalRecords'] ?? 0) . "\n";
    if (!empty($res['alarms'])) {
        echo "Found alarms for $v!\n";
        print_r($res['alarms'][0]);
    }
}
