<?php
$content = file_get_contents(__DIR__ . '/apiPage.js');
preg_match_all('/Standard[a-zA-Z0-9_]*\.action/i', $content, $m);
$actions = array_unique($m[0]);
sort($actions);
echo "Found " . count($actions) . " actions:\n";
print_r($actions);
