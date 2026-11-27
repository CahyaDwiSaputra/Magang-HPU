<?php
$content = file_get_contents(__DIR__ . '/apiPage.js');
$pos = strpos($content, "StandardApiAction_queryIdentifyAlarm.action");
if ($pos !== false) {
    echo substr($content, $pos - 50, 1000);
} else {
    echo "queryIdentifyAlarm not found";
}
