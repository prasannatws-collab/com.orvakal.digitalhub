Add-Type -AssemblyName System.Drawing

$baseDir = $PSScriptRoot
$logoPath = "$baseDir\assets\logo.png"
$assetsDir = "$baseDir\assets"

# Check if logo.png exists
if (-not (Test-Path $logoPath)) {
    Write-Error "logo.png not found at $logoPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($logoPath)
$logoBmp = New-Object System.Drawing.Bitmap $srcImg

# Fuzzy transparency mask on (214, 216, 203) with threshold 15
for ($x = 0; $x -lt $logoBmp.Width; $x++) {
    for ($y = 0; $y -lt $logoBmp.Height; $y++) {
        $c = $logoBmp.GetPixel($x, $y)
        $diffR = [Math]::Abs($c.R - 214)
        $diffG = [Math]::Abs($c.G - 216)
        $diffB = [Math]::Abs($c.B - 203)
        if ($diffR -le 15 -and $diffG -le 15 -and $diffB -le 15) {
            $logoBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

Write-Output "Loaded logo.png and processed fuzzy transparency: Width=$($logoBmp.Width), Height=$($logoBmp.Height)"

# Helper function to create image
function New-ScaledImage {
    param (
        [string]$destName,
        [int]$targetSize,
        [string]$bgColorHtml, # pass empty string for transparent
        [bool]$makeMonochrome
    )

    $destPath = "$assetsDir\$destName"
    $bmp = New-Object System.Drawing.Bitmap 1024, 1024
    $g = [System.Drawing.Graphics]::FromImage($bmp)

    # High quality settings
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background
    if ($bgColorHtml -ne "") {
        $color = [System.Drawing.ColorTranslator]::FromHtml($bgColorHtml)
        $brush = New-Object System.Drawing.SolidBrush $color
        $g.FillRectangle($brush, 0, 0, 1024, 1024)
        $brush.Dispose()
    }

    # Prepare logo (either monochrome or original)
    $logoToDraw = $logoBmp
    $tempBmp = $null

    if ($makeMonochrome) {
        $tempBmp = New-Object System.Drawing.Bitmap $logoBmp
        for ($x = 0; $x -lt $tempBmp.Width; $x++) {
            for ($y = 0; $y -lt $tempBmp.Height; $y++) {
                $pixelColor = $tempBmp.GetPixel($x, $y)
                if ($pixelColor.A -gt 0) {
                    # Dark grey monochrome icon
                    $grayColor = [System.Drawing.Color]::FromArgb($pixelColor.A, 128, 128, 128)
                    $tempBmp.SetPixel($x, $y, $grayColor)
                }
            }
        }
        $logoToDraw = $tempBmp
    }

    # Draw logo scaled and centered
    $ratio = [Math]::Min($targetSize / $logoToDraw.Width, $targetSize / $logoToDraw.Height)
    $w = [int]($logoToDraw.Width * $ratio)
    $h = [int]($logoToDraw.Height * $ratio)
    $x = [int]((1024 - $w) / 2)
    $y = [int]((1024 - $h) / 2)

    $g.DrawImage($logoToDraw, $x, $y, $w, $h)

    # Save
    if (Test-Path $destPath) {
        [System.IO.File]::Delete($destPath)
    }
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Clean up
    if ($tempBmp -ne $null) {
        $tempBmp.Dispose()
    }
    $g.Dispose()
    $bmp.Dispose()

    Write-Output "Saved $destName successfully."
}

# 1. android-icon-background.png (solid light blue)
$bgBmp = New-Object System.Drawing.Bitmap 1024, 1024
$bgG = [System.Drawing.Graphics]::FromImage($bgBmp)
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#E6F4FE")
$bgBrush = New-Object System.Drawing.SolidBrush $bgColor
$bgG.FillRectangle($bgBrush, 0, 0, 1024, 1024)
$bgDest = "$assetsDir\android-icon-background.png"
if (Test-Path $bgDest) { [System.IO.File]::Delete($bgDest) }
$bgBmp.Save($bgDest, [System.Drawing.Imaging.ImageFormat]::Png)
$bgBrush.Dispose()
$bgG.Dispose()
$bgBmp.Dispose()
Write-Output "Saved android-icon-background.png successfully."

# 2. icon.png (solid light blue background + centered logo scaled to 665)
New-ScaledImage "icon.png" 665 "#E6F4FE" $false

# 3. android-icon-foreground.png (transparent background + centered logo scaled to 614)
New-ScaledImage "android-icon-foreground.png" 614 "" $false

# 4. android-icon-monochrome.png (transparent background + centered monochrome logo scaled to 614)
New-ScaledImage "android-icon-monochrome.png" 614 "" $true

# 5. splash-icon.png (transparent background + centered logo scaled to 460)
New-ScaledImage "splash-icon.png" 460 "" $false

# Dispose original logo
$logoBmp.Dispose()
$srcImg.Dispose()
Write-Output "All icons generated successfully!"
