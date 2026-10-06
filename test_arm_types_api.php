<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];
$dev = '240078916116';

$testArmTypes = [
    '',
    '0',
    '-1',
    '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30',
    '46,47,48,49,50,51,52,53,54,55',
    '101,102,103,104,105,106,107,108,109,110',
    '201,202,203,204,205,206,207,208,209,210',
    '601,602,603,604,605,606,607,608,609,610'
];

foreach ($testArmTypes as $arm) {
    $params = [
        'jsession' => $jsession,
        'devIdno' => $dev,
        'begintime' => '2026-09-01 00:00:00',
        'endtime' => '2026-09-25 23:59:59',
        'currentPage' => 1,
        'pageRecords' => 50,
        'toMap' => 2,
        'armType' => $arm
    ];
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', $params)->json();
    echo "armType [{$arm}] => ";
    if (isset($res['result'])) {
        echo "result = {$res['result']} ";
        if ($res['result'] === 0) {
            echo "SUCCESS! Count: " . count($res['alarms'] ?? []) . "\n";
            print_r($res);
            break;
        } else {
            echo "\n";
        }
    } else {
        echo "No result\n";
    }
}
