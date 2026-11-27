<?php
$content = file_get_contents(__DIR__ . '/apiPage.js');
$pos = strpos($content, "StandardApiAction_queryAlarmDetail.action");
// Look further down for the parameter table
echo substr($content, $pos, 4000);
