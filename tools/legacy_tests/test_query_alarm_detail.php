<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];
$dev = '240078916116';

$params = [
    'jsession' => $jsession,
    'devIdno' => $dev,
    'begintime' => '2026-09-01 00:00:00',
    'endtime' => '2026-09-25 23:59:59',
    'currentPage' => 1,
    'pageRecords' => 50,
    'toMap' => 2
];

$res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', $params)->json();
print_r($res);
