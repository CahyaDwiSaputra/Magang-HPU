<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$tests = [
    ['vehiIdno' => 'TrialUNS2', 'armType' => 0],
    ['devIdno' => '240078916116', 'armType' => 0],
    ['vehiIdno' => 'TrialUNS2', 'armType' => '201,202,203,204,205,206,207,208,209,210'],
    ['vehiIdno' => 'TrialUNS2', 'armType' => '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20'],
    ['vehiIdno' => 'TrialUNS2', 'armType' => '46,47,48,49,50'],
    ['vehiIdno' => 'TrialUNS2', 'armType' => '113,114,115,116,117,118,119,120'],
];

foreach ($tests as $t) {
    $t['jsession'] = $jsession;
    $t['begintime'] = '2026-09-24 00:00:00';
    $t['endtime'] = '2026-09-25 23:59:59';
    $t['currentPage'] = 1;
    $t['pageRecords'] = 50;
    $t['toMap'] = 2;
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', $t)->json();
    echo "Test " . json_encode(array_diff_key($t, ['jsession'=>'', 'begintime'=>'', 'endtime'=>''])) . "\n";
    echo "Result: {$res['result']}, Total: " . ($res['pagination']['totalRecords'] ?? 0) . "\n";
    if (!empty($res['alarms'])) {
        echo "Found " . count($res['alarms']) . " alarms!\n";
        print_r($res['alarms'][0]);
        break;
    }
}
