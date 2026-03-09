# Script de compresión de imágenes para Studio AGON
# Ejecutar como administrador

Write-Host "=== Compresión de imágenes Studio AGON ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si ImageMagick está instalado
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "ImageMagick no está instalado." -ForegroundColor Yellow
    Write-Host "Instalando ImageMagick via Chocolatey..." -ForegroundColor Yellow
    
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install imagemagick -y
        refreshenv
    } else {
        Write-Host "ERROR: Chocolatey no está instalado." -ForegroundColor Red
        Write-Host "Alternativa: Descarga ImageMagick desde https://imagemagick.org/script/download.php" -ForegroundColor Yellow
        exit 1
    }
}

# Directorio de imágenes
$imagesDir = "c:\Users\GA503\Desktop\StudioAGON.github.io\images\projects"
$backupDir = "c:\Users\GA503\Desktop\StudioAGON.github.io\images\projects_backup"

# Crear backup
if (-not (Test-Path $backupDir)) {
    Write-Host "Creando backup de imágenes..." -ForegroundColor Green
    Copy-Item -Path $imagesDir -Destination $backupDir -Recurse
}

# Obtener todas las imágenes PNG y JPG
$images = Get-ChildItem -Path $imagesDir -Recurse -Include *.png,*.jpg,*.jpeg

Write-Host "Encontradas $($images.Count) imágenes para optimizar" -ForegroundColor Green
Write-Host ""

$totalSaved = 0

foreach ($image in $images) {
    $originalSize = $image.Length
    
    # Solo comprimir si la imagen es mayor a 500 KB
    if ($originalSize -gt 500KB) {
        Write-Host "Comprimiendo: $($image.Name) ($([math]::Round($originalSize/1KB, 2)) KB)" -ForegroundColor Yellow
        
        $tempFile = "$($image.FullName).tmp"
        
        # Comprimir con ImageMagick (calidad 85%, strip metadata)
        magick $image.FullName -strip -quality 85 $tempFile
        
        if (Test-Path $tempFile) {
            $newSize = (Get-Item $tempFile).Length
            
            # Solo reemplazar si la compresión reduce el tamaño
            if ($newSize -lt $originalSize) {
                Move-Item -Path $tempFile -Destination $image.FullName -Force
                $saved = $originalSize - $newSize
                $totalSaved += $saved
                Write-Host "  ✓ Reducida a $([math]::Round($newSize/1KB, 2)) KB (ahorrado: $([math]::Round($saved/1KB, 2)) KB)" -ForegroundColor Green
            } else {
                Remove-Item $tempFile
                Write-Host "  • La compresión no mejoró el tamaño" -ForegroundColor Gray
            }
        }
    }
}

Write-Host ""
Write-Host "=== Resumen ===" -ForegroundColor Cyan
Write-Host "Total ahorrado: $([math]::Round($totalSaved/1KB, 2)) KB" -ForegroundColor Green
Write-Host "Backup guardado en: $backupDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Listo! Las imágenes han sido optimizadas." -ForegroundColor Green
