<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$endpoints = [
    'StandardApiAction_vehicleAlarm.action' => ['DevIDNO' => '240078916116', 'toMap' => 2],
    'StandardApiAction_queryAlarmDetail.action' => [
        'devIdno' => '240078916116',
        'begintime' => date('Y-m-d 00:00:00', strtotime('-7 days')),
        'endtime' => date('Y-m-d 23:59:59'),
        'currentPage' => 1,
        'pageRecords' => 10
    ],
    'StandardApiAction_queryVehicleAlarm.action' => ['devIdno' => '240078916116']
];

foreach ($endpoints as $ep => $params) {
    $params['jsession'] = $jsession;
    $res = \Illuminate\Support\Facades\Http::get("http://182.253.27.12:8080/808gps/{$ep}", $params)->json();
    echo "--- $ep ---\n";
    print_r($res);
}
