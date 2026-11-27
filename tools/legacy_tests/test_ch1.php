<?php
$login = json_decode(file_get_contents('http://10.10.0.53:8080/808gps/StandardApiAction_login.action?account=admin&password=Password.1'), true);
$j = $login['jsession'];
echo "jsession: {$j}\n";

for ($c = 0; $c <= 2; $c++) {
    $url = "http://10.10.0.53:6604/3/3?AVType=1&jsession={$j}&DevIDNO=240078916116&Channel={$c}&Stream=1";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    $data = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_errno($ch);
    $size = strlen($data ?? '');
    $isFlv = ($size >= 3 && substr($data, 0, 3) === 'FLV');
    $preview = addcslashes(substr($data, 0, 80), "\0\r\n");
    curl_close($ch);
    echo "CH{$c}: HTTP={$code} size={$size} FLV=" . ($isFlv ? 'YES' : 'NO') . " errno={$err} preview=[{$preview}]\n";
}
