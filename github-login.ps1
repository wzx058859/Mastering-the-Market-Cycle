# GitHub CLI 登录脚本（解决终端找不到 gh 的问题）
$gh = "C:\Program Files\GitHub CLI\gh.exe"

if (-not (Test-Path $gh)) {
    Write-Host "未找到 GitHub CLI，请先安装：https://cli.github.com/" -ForegroundColor Red
    exit 1
}

Write-Host "正在启动 GitHub 设备码登录..." -ForegroundColor Cyan
Write-Host "请留意下方出现的 8 位验证码（格式如 XXXX-XXXX）" -ForegroundColor Yellow
Write-Host ""

& $gh auth login --hostname github.com --git-protocol https --web

Write-Host ""
Write-Host "登录状态：" -ForegroundColor Cyan
& $gh auth status
