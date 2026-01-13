// Carrusel de trabajos destacados
(function() {
  const carousel = document.querySelector('.featured-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.featured-slide');
  const indicators = carousel.querySelectorAll('.indicator');
  let currentIndex = 0;
  let autoplayInterval;
  let isPlaying = true;
  let lastSlideTime = Date.now();
  const slideDuration = 5000; // 5 segundos

  function showSlide(index) {
    // Remover active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Activar el seleccionado
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentIndex = index;
    lastSlideTime = Date.now(); // Reiniciar el temporizador cuando se cambia de slide
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function checkAutoplay() {
    if (!isPlaying) return;
    
    const timeSinceLastSlide = Date.now() - lastSlideTime;
    if (timeSinceLastSlide >= slideDuration) {
      nextSlide();
    }
  }

  function startAutoplay() {
    if (!isPlaying) return;
    // Usar requestAnimationFrame para verificar continuamente
    autoplayInterval = setInterval(checkAutoplay, 100);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Configurar indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      stopAutoplay();
      startAutoplay(); // Reiniciar el autoplay después de click manual
    });
  });

  // Pausar autoplay completamente al hacer hover
  carousel.addEventListener('mouseenter', () => {
    isPlaying = false;
    stopAutoplay();
  });

  // Reanudar autoplay cuando se va el mouse
  carousel.addEventListener('mouseleave', () => {
    isPlaying = true;
    lastSlideTime = Date.now(); // Reiniciar contador cuando se reanuda
    startAutoplay();
  });

  // Iniciar autoplay
  startAutoplay();
})();
