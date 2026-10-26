@echo off
title HPU x UNS - Presentation Server & Tunnel
echo ===================================================
echo   Menjalankan HPU x UNS untuk Presentasi
echo ===================================================

cd /d "%~dp0"

echo [1/3] Memastikan bundle frontend siap...
if exist "public\hot" del "public\hot"

echo [2/3] Menjalankan Cloudflare Tunnel ke http://127.0.0.1:8000 ...
echo Silakan salin URL *.trycloudflare.com di bawah ini untuk presentasi:
echo ===================================================
echo.

"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8000
pause
