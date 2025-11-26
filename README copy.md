# Studio AGON Website

Sitio publicado en: https://aaaaaaalvaro.github.io/StudioAGON.github.io/

## Estructura

```
index.html                            # Página principal
assets/
  css/
    main.css                          # Estilos unificados
  js/
    cursor.js                         # Cursor personalizado
    nav.js                            # Menú móvil
    contact.js                        # Lógica formulario contacto
    site.js                           # Inicialización general
  html/
    project/                          # Páginas detalle de proyectos
      proyecto1.html ...
    legal/                            # Páginas legales
      aviso-legal.html, privacidad.html, cookies.html, terminos.html
images/
  identity/                           # Logos
  projects/                           # Imágenes de proyectos
includes/
  header.html                         # Fragmento de cabecera (si se usa)
robots.txt
sitemap.xml
```

## Publicación en GitHub Pages

1. Crea repositorio y sube todo el contenido al branch `main`.
2. Activa GitHub Pages en Settings → Pages → Source: `main` / root.
3. URL de publicación: https://aaaaaaalvaro.github.io/StudioAGON.github.io/

## Desarrollo

Abrir `index.html` en un navegador o usar una extensión de Live Server.

## Convenciones

- CSS centralizado en `assets/css/main.css`.
- No se usa la antigua marquee (el archivo y estilos se eliminaron).
- Scripts siempre referenciados desde `assets/js/`.
- Las páginas legales y de proyecto comparten cabecera y footer consistentes.

## Próximos ajustes sugeridos

- Minificar CSS/JS para producción.
- Evaluar eliminación de `nav.js` si se descarta el menú móvil.
- Optimizar imágenes (compresión, formatos modernos).

## Archivos clave

- `.gitignore`: lista de archivos/carpetas que Git no debe versionar (por ejemplo, archivos temporales, cachés, builds). Evita subir artefactos o secretos.
- `.nojekyll`: desactiva Jekyll en GitHub Pages para servir archivos/carpetas que empiezan por guion bajo o no seguir el pipeline de Jekyll. Útil para sitios estáticos puros.
- `robots.txt`: instrucciones para crawlers (motores de búsqueda) sobre qué pueden rastrear. Incluye la URL de tu `sitemap.xml`.
- `LICENSE`: la licencia del proyecto (por ejemplo MIT). Define permisos y limitaciones para quien use el código.
