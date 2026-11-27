<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$res = \Illuminate\Support\Facades\Http::get('http://10.10.0.53:8080/808gps/login.action', ['account'=>'admin', 'password'=>'Password.1']);
$jsession = $res->json('jsession');

$proxy = \Illuminate\Support\Facades\Http::timeout(5)->get('http://10.10.0.53:8080/808gps/open/video/realVideo.action', [
    'jsession' => $jsession, 
    'devIdno' => '240078916116', 
    'channel' => 1, 
    'stream' => 1
]);

echo 'Status: ' . $proxy->status() . "\n";
echo 'Size: ' . strlen($proxy->body()) . "\n";
$body = $proxy->body();
echo 'Preview: ' . substr($body, 0, 100) . "\n";
