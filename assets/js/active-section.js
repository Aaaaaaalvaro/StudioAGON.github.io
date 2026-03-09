/**
 * Active Section Highlighter
 * Detecta la sección visible en el viewport y resalta el enlace correspondiente en la navegación
 */

document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#primary-menu a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;

  // Configuración del Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Ajusta cuándo se considera "visible" una sección
    threshold: 0
  };

  // Función para actualizar el enlace activo
  function updateActiveLink(sectionId) {
    // Remover clase activa de todos los enlaces
    navLinks.forEach(link => {
      link.removeAttribute('aria-current');
    });

    // Añadir clase activa al enlace correspondiente
    const activeLink = document.querySelector(`#primary-menu a[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  // Crear el observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  // Observar todas las secciones
  sections.forEach(section => {
    observer.observe(section);
  });

  // Detectar sección activa al cargar (por si hay hash en la URL)
  const hash = window.location.hash.slice(1);
  if (hash) {
    updateActiveLink(hash);
  } else {
    // Por defecto, activar la primera sección
    const firstSection = sections[0];
    if (firstSection) {
      updateActiveLink(firstSection.id);
    }
  }
});
