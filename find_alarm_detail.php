<?php
$content = file_get_contents(__DIR__ . '/apiPage.js');
$pos = strpos($content, "StandardApiAction_queryAlarmDetail.action");
if ($pos !== false) {
    echo substr($content, $pos - 100, 2000);
} else {
    echo "Not found";
}
