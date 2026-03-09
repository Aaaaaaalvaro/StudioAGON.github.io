// Lightbox mejorado para ampliar imágenes de galerías con pie de foto dinámico
(function(){
  function ensureLightbox(){
    let lightbox = document.getElementById('imageLightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'imageLightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('hidden', '');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visor de imágenes ampliadas');
    lightbox.innerHTML = [
      '<div class="lightbox-backdrop" data-close="true"></div>',
      '<div class="lightbox-dialog">',
      '  <button class="lightbox-close" type="button" aria-label="Cerrar" data-close="true">×</button>',
      '  <figure>',
      '    <img alt="">',
      '    <figcaption id="lightbox-caption"></figcaption>',
      '  </figure>',
      '  <div class="lightbox-nav">',
      '    <button class="lightbox-prev" type="button" aria-label="Imagen anterior" title="Anterior">←</button>',
      '    <button class="lightbox-next" type="button" aria-label="Siguiente imagen" title="Siguiente">→</button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(lightbox);
    return lightbox;
  }

  function init(){
    const candidates = document.querySelectorAll('.project-gallery img, .project-gallery figure img');
    if (!candidates.length) return;

    const lightbox = ensureLightbox();
    const modalImg = lightbox.querySelector('img');
    const modalCaption = lightbox.querySelector('figcaption');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    const images = Array.from(candidates);

    function open(index){
      currentIndex = index;
      const img = images[currentIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      
      // Obtener descripción del atributo data-description o usar el alt
      const description = img.getAttribute('data-description') || img.alt || '';
      modalCaption.textContent = description;
      
      lightbox.classList.add('open');
      lightbox.removeAttribute('hidden');
      document.body.classList.add('lightbox-open');
      modalImg.focus();
    }

    function close(){
      lightbox.classList.remove('open');
      document.body.classList.remove('lightbox-open');
      setTimeout(() => { 
        if (!lightbox.classList.contains('open')) { 
          lightbox.setAttribute('hidden', ''); 
        } 
      }, 200);
    }

    function nextImage(){
      currentIndex = (currentIndex + 1) % images.length;
      const img = images[currentIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      const description = img.getAttribute('data-description') || img.alt || '';
      modalCaption.textContent = description;
    }

    function prevImage(){
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      const img = images[currentIndex];
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      const description = img.getAttribute('data-description') || img.alt || '';
      modalCaption.textContent = description;
    }

    lightbox.addEventListener('click', (ev) => {
      if (ev.target.dataset.close) {
        close();
      }
    });

    prevBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      prevImage();
    });

    nextBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      nextImage();
    });

    document.addEventListener('keydown', (ev) => {
      if (lightbox.classList.contains('open')) {
        if (ev.key === 'Escape') close();
        if (ev.key === 'ArrowRight') nextImage();
        if (ev.key === 'ArrowLeft') prevImage();
      }
    });

    images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => open(index));
      img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          open(index);
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
