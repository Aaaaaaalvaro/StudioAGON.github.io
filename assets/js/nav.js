(function(){
  const html = document.documentElement;
  const btn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-menu');
  if (!btn || !nav) return;

  function openMenu(){
    html.classList.add('menu-open');
    btn.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    html.classList.remove('menu-open');
    btn.setAttribute('aria-expanded','false');
  }
  function toggle(){
    if (html.classList.contains('menu-open')) closeMenu(); else openMenu();
  }

  btn.addEventListener('click', toggle);

  // Cerrar al pulsar escape
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeMenu();
  });

  // Cerrar al tocar fuera del botón cuando no hay panel lateral
  document.addEventListener('click', (e)=>{
    if (!html.classList.contains('menu-open')) return;
    if (e.target === btn || btn.contains(e.target)) return;
    // En modo overlay, si se hace click en el fondo del nav (no en enlaces), cerrar
    if (e.target === nav) { closeMenu(); return; }
  });

  // Al hacer click en cualquier enlace del menú, cerrar
  nav.addEventListener('click', (e)=>{
    const link = e.target.closest('a');
    if (link) closeMenu();
  });

  // Ajuste fino de desplazamiento para anclas internas (#inicio, #proyectos, #contacto)
  const header = document.querySelector('.site-header');
  const internalLinks = nav.querySelectorAll('a[href^="#"]');
  const headerH = header ? header.offsetHeight : 0;

  function smoothScrollWithOffset(targetId){
    const target = document.getElementById(targetId);
    if (!target) return;
    // Posición absoluta del elemento
    const rect = target.getBoundingClientRect();
    const absoluteY = rect.top + window.pageYOffset;
    let finalY;
    if (targetId === 'inicio') {
      // Llevar realmente al top del documento
      finalY = 0; // header fijo cubre parte superior; hero tiene su propio gap
    } else {
      // Ajuste de 4px para que la parte superior del título quede justo bajo la cabecera
      finalY = absoluteY - headerH - 4;
      if (finalY < 0) finalY = 0;
    }
    window.scrollTo({ top: finalY, behavior: 'smooth' });
  }

  internalLinks.forEach(link => {
    link.addEventListener('click', (e)=>{
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const id = hash.slice(1);
      if (document.getElementById(id)) {
        e.preventDefault();
        smoothScrollWithOffset(id);
      }
    });
  });
})();