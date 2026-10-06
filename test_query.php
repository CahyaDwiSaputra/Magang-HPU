<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$statusTrial = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_getDeviceStatus.action', [
    'devIdno' => 'TrialUNS2',
    'jsession' => $jsession
])->json();

echo "STATUS TrialUNS2:\n";
print_r($statusTrial);

$statusDev = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_getDeviceStatus.action', [
    'devIdno' => '240078916116',
    'jsession' => $jsession
])->json();

echo "STATUS 240078916116:\n";
print_r($statusDev);
