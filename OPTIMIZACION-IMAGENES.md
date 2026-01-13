# Guía de Optimización de Imágenes - Studio AGON

## Problema Detectado
Varias imágenes del proyecto son demasiado pesadas y ralentizan la carga:

- **garrafa-para-salsa/image-3.png**: 341 KB ⚠️ URGENTE
- **espectroluz/image-2.png**: 8.561 MB ⚠️ CRÍTICO
- **espectroluz/image-4.png**: 6.445 MB ⚠️ CRÍTICO
- **alabo/image-1.png**: 4.455 MB
- **nack/image-4.png**: 37 KB

## Soluciones Implementadas

### 1. Lazy Loading ✓
Todas las imágenes ahora tienen `loading="lazy"` y `decoding="async"` para cargar solo cuando son visibles.

### 2. Script de Compresión Automática

#### Opción A: Ejecutar el script PowerShell (Recomendado)
```powershell
# Abrir PowerShell como ADMINISTRADOR y ejecutar:
cd c:\Users\GA503\Desktop\StudioAGON.github.io
Set-ExecutionPolicy Bypass -Scope Process -Force
.\compress-images.ps1
```

Este script:
- Instala ImageMagick automáticamente si no está presente
- Crea un backup de todas las imágenes
- Comprime PNGs y JPGs con calidad 85%
- Elimina metadatos innecesarios
- Solo procesa imágenes >500 KB

#### Opción B: Compresión online (Sin instalar nada)

**Para PNGs:**
1. Ir a https://tinypng.com/
2. Subir las imágenes problemáticas
3. Descargar y reemplazar

**Para JPGs:**
1. Ir a https://www.jpegmini.com/
2. Comprimir y descargar

**Lista de imágenes a comprimir manualmente:**
```
images/projects/espectroluz/image-2.png
images/projects/espectroluz/image-4.png
images/projects/alabo/image-1.png
images/projects/garrafa-para-salsa/image-3.png
images/projects/nack/image-4.png
images/projects/mute/notifications.png
```

## Mejoras Futuras (Opcional)

### Convertir a WebP
WebP ofrece mejor compresión que PNG/JPG:

```powershell
# Convertir todas las PNGs a WebP
Get-ChildItem -Path images/projects -Recurse -Filter *.png | ForEach-Object {
    $webp = $_.FullName -replace '\.png$', '.webp'
    magick $_.FullName -quality 90 $webp
}
```

Luego actualizar HTML:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="..." loading="lazy" decoding="async">
</picture>
```

### Responsive Images (srcset)
Para servir diferentes tamaños según dispositivo:

```html
<img 
  src="image-800w.png" 
  srcset="image-400w.png 400w, image-800w.png 800w, image-1200w.png 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="..." 
  loading="lazy" 
  decoding="async">
```

## Verificación

Después de comprimir, verifica los tamaños:
```powershell
Get-ChildItem -Path images/projects -Recurse -File | 
  Where-Object { $_.Length -gt 100KB } | 
  ForEach-Object { "{0:N0} KB - {1}" -f ($_.Length / 1024), $_.Name } | 
  Sort-Object -Descending
```

## Resultados Esperados

- **Carga inicial**: 60-80% más rápida
- **Ancho de banda**: Reducción de 2-5 MB por página
- **SEO**: Mejora en Google PageSpeed Insights
- **Experiencia móvil**: Carga suave incluso con 3G/4G

---

**Fecha**: 8 de enero de 2026  
**Mantenimiento**: Comprimir nuevas imágenes antes de subirlas al proyecto
