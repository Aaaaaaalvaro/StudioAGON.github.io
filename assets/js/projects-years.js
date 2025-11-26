(function(){
  const display = document.querySelector('#proyectos .year-display');
  if(!display) return;
  const markers = Array.from(document.querySelectorAll('#proyectos .year-subtitle')); // hidden anchors
  if(!markers.length) return;
  // Precompute positions
  let positions = [];
  function compute(){
    positions = markers.map(m => ({year: m.getAttribute('data-year') || m.textContent.trim(), top: m.getBoundingClientRect().top + window.scrollY}));
    positions.sort((a,b)=>a.top-b.top);
  }
  compute();
  let lastYear = display.textContent.trim();
  function onScroll(){
    const scrollPos = window.scrollY + (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64) + 40; // threshold below header
    let current = lastYear;
    for(const p of positions){
      if(scrollPos >= p.top){ current = p.year; } else { break; }
    }
    if(current !== lastYear){
      display.textContent = current;
      lastYear = current;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', compute);
})();