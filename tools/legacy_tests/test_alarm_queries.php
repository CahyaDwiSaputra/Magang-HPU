<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$queries = [
    ['devIdno' => '240078916116', 'armType' => 0],
    ['vehiIdno' => 'TrialUNS2', 'armType' => 0],
    ['armType' => 0],
];

foreach ($queries as $q) {
    $q['jsession'] = $jsession;
    $q['begintime'] = '2026-09-23 00:00:00';
    $q['endtime'] = '2026-09-25 23:59:59';
    $q['currentPage'] = 1;
    $q['pageRecords'] = 20;
    $q['toMap'] = 2;
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', $q)->json();
    echo "Query: " . json_encode(array_diff_key($q, ['jsession'=>''])) . "\n";
    echo "Result: {$res['result']}, Total: " . ($res['pagination']['totalRecords'] ?? 0) . "\n";
    if (!empty($res['alarms'])) {
        echo "Found " . count($res['alarms']) . " alarms!\n";
        print_r($res['alarms'][0]);
    }
}
