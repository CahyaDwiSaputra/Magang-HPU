<?php
$ip = '182.253.27.12';
$ports = [80, 8080, 6608, 6605, 6604, 6602, 6609, 5022, 7708, 7709, 1078, 17891];

foreach ($ports as $port) {
    $fp = @fsockopen($ip, $port, $errno, $errstr, 1.5);
    if ($fp) {
        echo "Port $port: OPEN\n";
        fclose($fp);
    } else {
        echo "Port $port: CLOSED ($errstr)\n";
    }
}
