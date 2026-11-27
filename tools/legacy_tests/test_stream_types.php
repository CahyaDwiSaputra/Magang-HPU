<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$base = 'http://10.10.0.33:8088';
$login = \Illuminate\Support\Facades\Http::get("{$base}/808gps/StandardApiAction_login.action", [
    'account' => 'admin',
    'password' => 'Password.1'
])->json();
$jsession = $login['jsession'];

$dev = '240078921470';

// Check Stream=0 vs Stream=1 on port 6604
foreach ([0, 1] as $stream) {
    $fp = @fsockopen("10.10.0.33", 6604, $errno, $errstr, 2);
    if ($fp) {
        $req = "GET /3/3?AVType=1&jsession={$jsession}&DevIDNO={$dev}&Channel=0&Stream={$stream} HTTP/1.1\r\nHost: 10.10.0.33:6604\r\nConnection: close\r\n\r\n";
        fwrite($fp, $req);
        stream_set_timeout($fp, 2);
        $res = '';
        while (!feof($fp)) {
            $chunk = fread($fp, 2048);
            if (!$chunk) break;
            $res .= $chunk;
            if (strlen($res) > 2000) break;
        }
        fclose($fp);
        echo "Stream={$stream}: received " . strlen($res) . " bytes\n";
        if (strlen($res) > 50) {
            echo "   Snippet (hex): " . bin2hex(substr($res, 0, 50)) . "\n";
        }
    }
}
