# Orvakal Digital Hub – Beta Deployment Script
# Run this from the project root in your own PowerShell window

$NodePath = "C:\Program Files\nodejs"
$NpmGlobal = "$env:APPDATA\npm"

# Add Node.js to PATH for this session
$env:PATH = "$NodePath;$NpmGlobal;" + $env:PATH

# Copy generated hero image to assets to prevent Metro bundler resolution crash
$SourceImg = "C:\Users\mlpkr\.gemini\antigravity-ide\brain\d705e47a-2444-4065-ad45-51f3ab1b2d15\orvakal_hero_bg_1781902081112.png"
$DestImg = ".\assets\orvakal_hero_bg.png"
if (Test-Path $SourceImg) {
    Copy-Item -Path $SourceImg -Destination $DestImg -Force
    Write-Host "Copied hero background image to assets." -ForegroundColor Green
} else {
    Write-Host "Warning: Generated hero image not found at expected path. Ensure orvakal_hero_bg.png exists in assets folder." -ForegroundColor Yellow
}

Write-Host "`n=== Environment ===" -ForegroundColor Cyan
node --version
npm --version

# Step 1: Install / update EAS CLI
Write-Host "`n=== Installing EAS CLI ===" -ForegroundColor Cyan
npm install -g eas-cli
eas --version

# Step 2: Login (interactive – will open browser or prompt for credentials)
Write-Host "`n=== Expo Login ===" -ForegroundColor Cyan
eas whoami 2>&1
Write-Host "If not logged in, run:  eas login" -ForegroundColor Yellow

# Step 3: Link project (fills in projectId in app.json)
Write-Host "`n=== Linking Expo Project ===" -ForegroundColor Cyan
eas init --non-interactive 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "eas init failed or project already linked. Check app.json projectId." -ForegroundColor Yellow
}

# Step 4: Git commit & push
Write-Host "`n=== Git Commit & Push ===" -ForegroundColor Cyan
git add app.json eas.json
git status
git commit -m "chore: configure EAS beta build profile for Play Store internal testing"
git push origin main

Write-Host "`n=== All prep done! ===" -ForegroundColor Green
Write-Host "Next steps (run manually):" -ForegroundColor Yellow
Write-Host "  eas build --platform android --profile beta" -ForegroundColor White
Write-Host "  eas submit --platform android --profile beta --latest" -ForegroundColor White
