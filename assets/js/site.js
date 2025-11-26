(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // asegurar que header no cubra anchors
    const headerH = document.querySelector('.site-header')?.offsetHeight || 64;
    if (headerH){
      document.documentElement.style.setProperty('--header-height', headerH + 'px');
    }

    // fallback minimal: si nav no centrado, re-centrar
    const nav = document.querySelector('.nav-centered');
    if (nav){
      // keep as is (css handles it); placeholder for future behaviour
    }
  });
})();