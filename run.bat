@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title Game Ban Bong Bong Meo Cung - Cute Cat Bubble Shooter Console
cd /d "%~dp0"
cls

echo ==============================================================
echo     GAME BAN BONG BONG MEO CUNG - CUTE CAT BUBBLE SHOOTER
echo ==============================================================
echo.

echo [1/3] Kiem tra moi truong va Chay kiem thu...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo   - Tim thay Node.js. Tien hanh chay 34 bai kiem thu...
    node tests\cli-runner.js
) else (
    echo   - Khong tim thay Node.js - Bo qua unit test.
)

echo.
echo [2/3] Khoi dong Web Server...
set PORT=8088

rem Kiem tra neu port 8088 dang bi chiem, chuyen sang 8089
netstat -ano | findstr :%PORT% | findstr LISTENING >nul 2>nul
if %errorlevel% equ 0 (
    echo   - Cong %PORT% dang ban, tu dong chuyen sang cong 8089...
    set PORT=8089
)

rem Uu tien dung py launcher (chuan Python tren Windows)
where py >nul 2>nul
if %errorlevel% equ 0 (
    set "RUNNER=py"
    goto RUN_PYTHON
)

rem Neu khong co py, dung python
where python >nul 2>nul
if %errorlevel% equ 0 (
    set "RUNNER=python"
    goto RUN_PYTHON
)

rem Neu khong co python, dung python3
where python3 >nul 2>nul
if %errorlevel% equ 0 (
    set "RUNNER=python3"
    goto RUN_PYTHON
)

rem Neu khong co Python, thu dung npx serve
where npx >nul 2>nul
if %errorlevel% equ 0 (
    goto RUN_NPX
)

rem Neu khong co ca Python lan Node, mo truc tiep index.html
goto RUN_DIRECT

:RUN_PYTHON
echo   - Dang su dung %RUNNER% de chay HTTP Server tren cong %PORT% (IP 127.0.0.1)...
echo.
echo [3/3] Tu dong mo trinh duyet toi: http://127.0.0.1:%PORT%/index.html
echo.
echo ==============================================================
echo   * GAME DANG CHAY TAI: http://127.0.0.1:%PORT%/index.html
echo   * LINK DU PHONG:      http://localhost:%PORT%/index.html
echo   * TRANG KIEM THU:     http://127.0.0.1:%PORT%/test-runner.html
echo.
echo   * CUA SO NAY DANG HIEN THI CONSOLE LOG TRUC TIEP TU SERVER!
echo   * DE DUNG SERVER: Nhap to hop phim [Ctrl + C]
echo ==============================================================
echo.

rem Mo trinh duyet sau 1 giay tren tien trinh rieng
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://127.0.0.1:%PORT%/index.html"

rem Chay HTTP server o foreground voi bind 127.0.0.1 de tranh loi ERR_EMPTY_RESPONSE cua IPv6
%RUNNER% -m http.server %PORT% --bind 127.0.0.1
goto FINISH

:RUN_NPX
echo   - Dang su dung npx serve tren cong %PORT%...
echo.
echo [3/3] Tu dong mo trinh duyet toi: http://127.0.0.1:%PORT%/index.html
echo.
echo ==============================================================
echo   * GAME DANG CHAY TAI: http://127.0.0.1:%PORT%/index.html
echo   * LINK DU PHONG:      http://localhost:%PORT%/index.html
echo   * TRANG KIEM THU:     http://127.0.0.1:%PORT%/test-runner.html
echo.
echo   * CUA SO NAY DANG HIEN THI CONSOLE LOG TRUC TIEP TU SERVER!
echo   * DE DUNG SERVER: Nhap to hop phim [Ctrl + C]
echo ==============================================================
echo.

start "" cmd /c "timeout /t 1 /nobreak >nul & start http://127.0.0.1:%PORT%/index.html"
npx serve -l %PORT% .
goto FINISH

:RUN_DIRECT
echo   - Khong tim thay Python hoac Node.js tren may tinh.
echo   - Chuyen sang che do chay truc tiep file index.html qua trinh duyet...
echo.
echo [3/3] Dang mo trinh duyet...
start "" "%~dp0index.html"
echo.
echo Da mo game thanh cong tren trinh duyet!
goto FINISH

:FINISH
echo.
echo ==============================================================
echo   May chu da dung hoac tien trinh ket thuc.
echo ==============================================================
pause
