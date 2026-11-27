<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

$res = Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action', [
    'account' => 'admin',
    'password' => 'Password.1'
]);
$jsession = $res->json('jsession');
echo "Session: " . $jsession . "\n";

$devs = Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_queryUserVehicle.action', [
    'jsession' => $jsession
]);
echo "Vehicles:\n";
print_r($devs->json());
