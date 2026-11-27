<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$res = \Illuminate\Support\Facades\Http::get('http://10.10.0.53:8080/808gps/login.action', ['account'=>'admin', 'password'=>'Password.1']);
$jsession = $res->json('jsession');

$status = \Illuminate\Support\Facades\Http::get('http://10.10.0.53:8080/808gps/StandardApiAction_getDeviceStatus.action', [
    'devIdno'=>'', // empty device ID might fetch all?
    'jsession'=>$jsession
])->json();

if(empty($status['status'])) {
    // try finding vehicle info
    $status = \Illuminate\Support\Facades\Http::get('http://10.10.0.53:8080/808gps/StandardApiAction_findVehicleInfoByDeviceId.action', [
        'jsession'=>$jsession
    ])->json();
}
print_r($status);
