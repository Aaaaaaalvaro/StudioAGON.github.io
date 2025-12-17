// Lightbox simple para ampliar imágenes de galerías con pie de foto
(function(){
  function ensureLightbox(){
    let lightbox = document.getElementById('imageLightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'imageLightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('hidden', '');
    lightbox.innerHTML = [
      '<div class="lightbox-backdrop" data-close="true"></div>',
      '<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Imagen ampliada">',
      '  <button class="lightbox-close" type="button" aria-label="Cerrar" data-close="true">×</button>',
      '  <figure>',
      '    <img alt="">',
      '    <figcaption></figcaption>',
      '  </figure>',
      '</div>'
    ].join('');

    document.body.appendChild(lightbox);
    return lightbox;
  }

  function init(){
    const candidates = document.querySelectorAll('.project-gallery img');
    if (!candidates.length) return;

    const lightbox = ensureLightbox();
    const modalImg = lightbox.querySelector('img');
    const modalCaption = lightbox.querySelector('figcaption');

    function open(img){
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      modalCaption.textContent = img.alt || '';
      lightbox.classList.add('open');
      lightbox.removeAttribute('hidden');
      document.body.classList.add('lightbox-open');
    }

    function close(){
      lightbox.classList.remove('open');
      document.body.classList.remove('lightbox-open');
      // esperar a la transición para ocultar
      setTimeout(() => { if (!lightbox.classList.contains('open')) { lightbox.setAttribute('hidden', ''); } }, 200);
    }

    lightbox.addEventListener('click', (ev) => {
      if (ev.target.dataset.close) {
        close();
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && lightbox.classList.contains('open')) {
        close();
      }
    });

    candidates.forEach((img) => {
      img.addEventListener('click', () => open(img));
      // Permitir activar con teclado si se navega con tab
      img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          open(img);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
