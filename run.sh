#!/usr/bin/env bash

# Cute Cat Bubble Shooter - One-Click Bootstrap Launcher
# Antigravity TP AIDLC Project

cd "$(dirname "$0")" || exit 1

echo "=============================================================="
echo "  🫧  GAME BẮN BONG BÓNG MÈO CƯNG (CUTE CAT BUBBLE SHOOTER) 🐱"
echo "=============================================================="
echo ""

PORT=8088

# 1. Environment & Test check
echo "[1/3] Kiểm tra môi trường & Chạy kiểm thử..."
if command -v node >/dev/null 2>&1; then
    echo "  [OK] Đã tìm thấy Node.js. Tiến hành chạy 31 bài test..."
    node tests/cli-runner.js
else
    echo "  [INFO] Không tìm thấy Node.js (Game thuần Vanilla ES6 không bắt buộc Node.js)."
fi

echo ""
echo "[2/3] Khởi động máy chủ Web Server trên cổng ${PORT}..."

# Check if port is already in use, fallback to 8089
if command -v lsof >/dev/null 2>&1; then
    if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null ; then
        echo "  [INFO] Cổng ${PORT} đang bận, tự động chuyển sang 8089..."
        PORT=8089
    fi
fi

# Function to open browser across platforms
open_browser() {
    local url="$1"
    sleep 1.2
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$url" >/dev/null 2>&1 &
    elif command -v open >/dev/null 2>&1; then
        open "$url" >/dev/null 2>&1 &
    elif command -v python3 >/dev/null 2>&1; then
        python3 -m webbrowser "$url" >/dev/null 2>&1 &
    fi
}

TARGET_URL="http://127.0.0.1:${PORT}/index.html"

# Detect Python 3 / Python / Node serve
if command -v python3 >/dev/null 2>&1; then
    echo "  [OK] Sử dụng Python 3 để chạy HTTP Server trên cổng ${PORT} (IP 127.0.0.1)..."
    echo ""
    echo "[3/3] Đang tự động mở trình duyệt: ${TARGET_URL}"
    echo ""
    echo "=============================================================="
    echo "  🎮 Game đang chạy tại: ${TARGET_URL}"
    echo "  🔗 Link dự phòng:      http://localhost:${PORT}/index.html"
    echo "  🧪 Trang kiểm thử:    http://127.0.0.1:${PORT}/test-runner.html"
    echo ""
    echo "  👉 Nhấn [Ctrl + C] để dừng máy chủ Web!"
    echo "=============================================================="
    echo ""
    open_browser "$TARGET_URL" &
    python3 -m http.server "$PORT" --bind 127.0.0.1
elif command -v python >/dev/null 2>&1; then
    echo "  [OK] Sử dụng Python để chạy HTTP Server trên cổng ${PORT} (IP 127.0.0.1)..."
    echo ""
    echo "[3/3] Đang tự động mở trình duyệt: ${TARGET_URL}"
    echo ""
    echo "=============================================================="
    echo "  🎮 Game đang chạy tại: ${TARGET_URL}"
    echo "  🔗 Link dự phòng:      http://localhost:${PORT}/index.html"
    echo "  🧪 Trang kiểm thử:    http://127.0.0.1:${PORT}/test-runner.html"
    echo ""
    echo "  👉 Nhấn [Ctrl + C] để dừng máy chủ Web!"
    echo "=============================================================="
    echo ""
    open_browser "$TARGET_URL" &
    python -m http.server "$PORT" --bind 127.0.0.1
elif command -v npx >/dev/null 2>&1; then
    echo "  [OK] Sử dụng npx serve để chạy HTTP Server trên cổng ${PORT}..."
    echo ""
    echo "[3/3] Đang tự động mở trình duyệt: ${TARGET_URL}"
    echo ""
    echo "=============================================================="
    echo "  🎮 Game đang chạy tại: ${TARGET_URL}"
    echo "  🔗 Link dự phòng:      http://localhost:${PORT}/index.html"
    echo "  🧪 Trang kiểm thử:    http://127.0.0.1:${PORT}/test-runner.html"
    echo ""
    echo "  👉 Nhấn [Ctrl + C] để dừng máy chủ Web!"
    echo "=============================================================="
    echo ""
    open_browser "$TARGET_URL" &
    npx serve -l "$PORT" .
else
    echo "  [INFO] Không tìm thấy Python hoặc Node.js."
    echo "  [OK] Đang mở trực tiếp file index.html..."
    open_browser "index.html" &
fi

echo ""
read -p "Nhấn [Enter] để đóng cửa sổ terminal..."
