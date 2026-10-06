<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$params = [
    'jsession' => $jsession,
    'armType' => 0,
    'handle' => 0,
    'currentPage' => 1,
    'pageRecords' => 50,
    'toMap' => 2
];

$res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', $params)->json();
echo "Without date range: Result={$res['result']}, Total=" . ($res['pagination']['totalRecords'] ?? 0) . "\n";
print_r($res);
