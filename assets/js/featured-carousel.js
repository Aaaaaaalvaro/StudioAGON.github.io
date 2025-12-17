// Carrusel de trabajos destacados
(function() {
  const carousel = document.querySelector('.featured-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.featured-slide');
  const indicators = carousel.querySelectorAll('.indicator');
  let currentIndex = 0;
  let autoplayInterval;

  function showSlide(index) {
    // Remover active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Activar el seleccionado
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
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

  // Pausar autoplay al hacer hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Iniciar autoplay
  startAutoplay();
})();
