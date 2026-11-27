<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

for ($i = 0; $i < 5; $i++) {
    $beg = date('Y-m-d 00:00:00', strtotime("-$i days"));
    $end = date('Y-m-d 23:59:59', strtotime("-$i days"));
    
    $res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAlarmDetail.action', [
        'jsession' => $jsession,
        'vehiIdno' => 'TrialUNS2',
        'begintime' => $beg,
        'endtime' => $end,
        'currentPage' => 1,
        'pageRecords' => 50,
        'toMap' => 2,
        'armType' => 0
    ])->json();
    
    $count = count($res['alarms'] ?? []);
    echo "Date $beg: result={$res['result']}, alarms=$count\n";
    if ($count > 0) {
        print_r($res['alarms'][0]);
        break;
    }
}
