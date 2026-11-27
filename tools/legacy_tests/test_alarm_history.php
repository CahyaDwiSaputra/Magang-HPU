<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];
$dev = '240078916116';

$ranges = [
    ['2026-09-15 00:00:00', '2026-09-18 23:59:59'],
    ['2026-09-10 00:00:00', '2026-09-15 23:59:59'],
    ['2026-06-11 00:00:00', '2026-06-16 23:59:59'],
    ['2026-07-01 00:00:00', '2026-07-05 23:59:59'],
];

foreach ($ranges as [$beg, $end]) {
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', [
        'jsession' => $jsession,
        'devIdno' => $dev,
        'begintime' => $beg,
        'endtime' => $end,
        'currentPage' => 1,
        'pageRecords' => 50,
        'toMap' => 2,
        'armType' => 0
    ])->json();
    echo "Range $beg - $end: Result={$res['result']}, Total=" . ($res['pagination']['totalRecords'] ?? 0) . "\n";
    if (!empty($res['alarms'])) {
        echo "Found " . count($res['alarms']) . " alarms!\n";
        print_r($res['alarms'][0]);
        break;
    }
}
