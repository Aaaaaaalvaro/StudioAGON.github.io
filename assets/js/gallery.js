// Gallery: ajuste para 9 items exactos + reciclado sin saltos
(() => {
  try {
    document.addEventListener('DOMContentLoaded', () => {
      const track = document.getElementById('marqueeTrack');
      if (!track) return;

      const sameSrc = 'images/identity/logo-white.png';
      const uniqueSrc = 'images/identity/logo.png';

      const totalItems = 9;
      const uniqueIndex = Math.floor(totalItems / 2);
      const maxCloneLoops = 12;
      const speed = 30; // px/s

      // Crear imágenes y promesas de carga
      const loadPromises = [];
      for (let i = 0; i < totalItems; i++) {
        const img = document.createElement('img');
        img.className = 'm-logo';
        img.src = (i === uniqueIndex) ? uniqueSrc : sameSrc;
        img.alt = '';
        const p = new Promise((resolve) => {
          let resolved = false;
          const done = () => { if (!resolved) { resolved = true; resolve(); } };
          img.onload = done;
          img.onerror = () => { img.style.background = '#222'; img.style.width = '160px'; img.style.height = '120px'; done(); };
          setTimeout(done, 3000);
        });
        loadPromises.push(p);
        track.appendChild(img);
      }

      function getGap() {
        const s = getComputedStyle(track);
        // prefer gap (modern), fallback a var CSS o 16px
        return parseFloat(s.gap || s.columnGap || s.getPropertyValue('--marquee-gap') || '16') || 16;
      }

      // Asegura contenido suficiente (clonar hasta cubrir 2x ancho)
      function ensureFill() {
        const containerWidth = track.parentElement ? track.parentElement.clientWidth : window.innerWidth;
        let contentWidth = Array.from(track.children)
          .reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
          + (Array.from(track.children).length - 1) * getGap();
        let loops = 0;
        while (contentWidth < containerWidth * 2 && loops < maxCloneLoops) {
          const children = Array.from(track.children);
          for (const child of children) {
            const clone = child.cloneNode(true);
            track.appendChild(clone);
          }
          contentWidth = Array.from(track.children)
            .reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
            + (Array.from(track.children).length - 1) * getGap();
          loops++;
        }
      }

      // Animación y reciclado sin salto
      let offset = 0;
      let last = performance.now();
      let running = true;

      function step(now) {
        if (!running) return;
        const dt = (now - last) / 1000;
        last = now;
        offset += speed * dt;

        const gap = getGap();
        const first = track.firstElementChild;
        if (first) {
          const firstWidth = first.getBoundingClientRect().width + gap;
          // usar tolerancia para evitar efectos por subpíxeles
          if (firstWidth > 0 && offset + 0.5 >= firstWidth) {
            offset -= firstWidth;
            // mover el primer elemento al final y aplicar transform con offset ajustado
            track.appendChild(first);
            // aplicar transform inmediatamente (sin transición) para evitar salto
            track.style.transition = 'none';
            track.style.transform = `translate3d(${-offset}px,0,0)`;
            // forzar reflow mínimo
            track.getBoundingClientRect();
          }
        }

        track.style.transform = `translate3d(${-offset}px,0,0)`;
        requestAnimationFrame(step);
      }

      // Iniciar cuando las primeras imágenes hayan cargado (o timeout)
      Promise.all(loadPromises).then(() => {
        ensureFill();
        last = performance.now();
        requestAnimationFrame(step);
      }).catch(() => {
        ensureFill();
        last = performance.now();
        requestAnimationFrame(step);
      });

      // Resize: recalcular sin bloquear
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          offset = 0;
          track.style.transition = 'none';
          track.style.transform = 'translate3d(0,0,0)';
          ensureFill();
        }, 120);
      });

      // Pausar en background
      document.addEventListener('visibilitychange', () => {
        running = document.visibilityState === 'visible';
        if (running) { last = performance.now(); requestAnimationFrame(step); }
      });
    });
  } catch (err) {
    console.error('gallery.js fallo seguro:', err);
  }
})();