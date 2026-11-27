<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$login = \Illuminate\Support\Facades\Http::get('http://182.253.27.12:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1')->json();
$jsession = $login['jsession'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://182.253.27.12:8080/808gps/user/realAlarm/unhandle/list');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'pageRecords' => 50,
    'currentPage' => 1,
    'jsession' => $jsession
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Cookie: JSESSIONID={$jsession}",
    "x-ui-request: true",
    "Accept: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
curl_close($ch);

echo "Response with Cookie:\n$res\n";
