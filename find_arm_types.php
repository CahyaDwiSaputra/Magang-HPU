<?php
$content = file_get_contents(__DIR__ . '/apiPage.js');
$pos = strpos($content, "armType");
while ($pos !== false) {
    echo substr($content, $pos - 50, 200) . "\n---\n";
    $pos = strpos($content, "armType", $pos + 100);
    if ($pos > 20000) break;
}
