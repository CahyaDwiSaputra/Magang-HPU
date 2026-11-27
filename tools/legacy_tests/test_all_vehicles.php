<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$res = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action', ['account'=>'admin', 'password'=>'Password.1']);
print_r("Login Response:\n");
print_r($res->json());

$jsession = $res->json('jsession');

// Let's get ALL vehicles for this account
$status = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryAllDeviceStatus.action', [
    'jsession'=>$jsession
])->json();

print_r("\nStatus Response:\n");
print_r($status);
