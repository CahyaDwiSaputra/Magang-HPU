<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action', ['account'=>'admin', 'password'=>'Password.1']);
$jsession = $res->json('jsession');

$endpoints = [
    'StandardApiAction_getAllVehicle.action',
    'StandardApiAction_queryAllVehicle.action',
    'StandardApiAction_getVehicleList.action',
    'StandardApiAction_vehicleList.action',
    'StandardApiAction_queryVehicleStatus.action',
];

foreach ($endpoints as $ep) {
    $res = \Illuminate\Support\Facades\Http::get("http://182.253.27.12:8080/808gps/{$ep}", ['jsession'=>$jsession]);
    echo "--- {$ep} ---\n";
    $json = $res->json();
    if($json && isset($json['result']) && $json['result'] === 0) {
        echo "SUCCESS! Keys: " . implode(', ', array_keys($json)) . "\n";
        print_r($json);
        break;
    } else {
        echo "Failed or no result.\n";
    }
}
