<?php

// Buat direktori sementara di /tmp untuk penyimpanan cache, sessions, logs, dan views
$directories = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Teruskan eksekusi ke public/index.php Laravel
require __DIR__ . '/../public/index.php';
