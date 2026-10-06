<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$dev = '240078916116';

$endpoints = [
    // 1. queryAlarm
    "StandardApiAction_queryAlarm.action?jsession={$jsession}&devIdno={$dev}",
    // 2. vehicleAlarm with DevIDNO
    "StandardApiAction_vehicleAlarm.action?jsession={$jsession}&DevIDNO={$dev}&toMap=2",
    // 3. vehicleAlarm with devIdno
    "StandardApiAction_vehicleAlarm.action?jsession={$jsession}&devIdno={$dev}&toMap=2",
    // 4. queryAlarmDetail with DevIDNO
    "StandardApiAction_queryAlarmDetail.action?jsession={$jsession}&DevIDNO={$dev}&begintime=2026-09-24%2000:00:00&endtime=2026-09-24%2023:59:59&currentPage=1&pageRecords=10",
    // 5. queryAlarmMotion
    "StandardApiAction_queryAlarmMotion.action?jsession={$jsession}&devIdno={$dev}",
];

foreach ($endpoints as $url) {
    $res = \Illuminate\Support\Facades\Http::get("http://182.253.27.12:8080/808gps/{$url}")->json();
    $name = explode('?', $url)[0];
    echo "Endpoint: $name\n";
    print_r($res);
    echo "\n";
}
