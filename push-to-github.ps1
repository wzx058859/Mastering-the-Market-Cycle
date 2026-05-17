# 一键创建 GitHub 仓库并推送（需在已登录 gh 的终端中运行）
# 用法：在 PowerShell 中 cd 到项目目录后执行：
#   powershell -ExecutionPolicy Bypass -File .\push-to-github.ps1

$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
    Write-Host "未找到 GitHub CLI：$gh" -ForegroundColor Red
    Write-Host "请从 https://cli.github.com/ 安装，或把 gh.exe 加入 PATH。" -ForegroundColor Yellow
    exit 1
}

Write-Host "检查 GitHub 登录状态..." -ForegroundColor Cyan
& $gh auth status 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "尚未登录。请先执行（可复制整行）：" -ForegroundColor Yellow
    Write-Host '  & "C:\Program Files\GitHub CLI\gh.exe" auth login --hostname github.com --git-protocol https --web' -ForegroundColor White
    Write-Host "按提示在浏览器完成设备码授权后，再重新运行本脚本。" -ForegroundColor Yellow
    exit 1
}

$repoName = "Mastering-the-Market-Cycle"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host ""
Write-Host "当前目录: $root" -ForegroundColor Cyan

# 若有未提交改动，一并提交
$dirty = git status --porcelain
if ($dirty) {
    Write-Host "检测到未提交文件，正在 add + commit..." -ForegroundColor Cyan
    git add -A
    git commit -m "chore: add GitHub helper scripts and sync files"
}

if (git remote get-url origin 2>$null) {
    Write-Host "已存在 remote origin，执行 git push..." -ForegroundColor Cyan
    git push -u origin main
} else {
    Write-Host "正在创建远程仓库并推送: $repoName ..." -ForegroundColor Cyan
    & $gh repo create $repoName --public --source=. --remote=origin --description "Mastering the Market Cycle - 霍华德·马克斯《周期》主题站点" --push
}

Write-Host ""
Write-Host "完成。在浏览器打开你的仓库：" -ForegroundColor Green
$user = (& $gh api user -q .login 2>$null)
if ($user) {
    Write-Host "  https://github.com/$user/$repoName" -ForegroundColor White
} else {
    Write-Host "  https://github.com/<你的用户名>/$repoName" -ForegroundColor White
}
