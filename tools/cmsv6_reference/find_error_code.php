<?php
$content = file_get_contents(__DIR__ . '/apiPage.js');
$pos = strpos($content, "loadPaneTable(items, 4);");
echo substr($content, $pos + 30, 2000);
