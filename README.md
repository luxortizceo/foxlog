# FoxLog — Landing Page

Landing page estática para FoxLog, empresa de logística multimodal (transporte
terrestre, aéreo, marítimo y ferroviario).

## Estructura

```
index.html            Marcado de toda la página (una sola página, secciones ancladas)
assets/css/style.css  Estilos (paleta naranja/negro de marca, responsive)
assets/js/script.js   Menú móvil, contador animado de estadísticas, scroll-scrub del hero,
                       autoplay del video del CTA, formulario de contacto
assets/img/           Imágenes de marca (camión, avión, barco, tren, equipo) y logo.svg
assets/img/hero-frames/  145 frames WebP del logo 3D (scroll-scrub del hero)
assets/video/         Video de fondo del CTA final (webm + mp4, sin audio)
```

No requiere build ni framework: es HTML/CSS/JS plano, listo para desplegar en
Vercel, Netlify, GitHub Pages o cualquier hosting estático.

## Desarrollo local

```bash
npm run dev
# o simplemente abre index.html en el navegador
```

## Pendientes / datos de ejemplo a reemplazar

- Correo y teléfono de contacto en el footer y sección de contacto son de ejemplo.
- El formulario de cotización es solo de demostración (no envía datos a ningún backend).
- Los testimonios son ficticios y deben reemplazarse por reseñas reales de clientes.
