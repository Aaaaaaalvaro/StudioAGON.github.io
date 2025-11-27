// Image focus utility: allows per-image focal point control via data attributes
// Usage examples:
// <img data-focus="top">            // keyword
// <img data-focus="30% 40%">        // percentages
// <img data-focus-x="30" data-focus-y="40"> // numeric percentages

(function(){
  const keywordMap = {
    center: '50% 50%',
    top: '50% 0%',
    bottom: '50% 100%',
    left: '0% 50%',
    right: '100% 50%',
    tl: '0% 0%',
    tr: '100% 0%',
    bl: '0% 100%',
    br: '100% 100%'
  };

  function applyFocus(img){
    const fx = img.getAttribute('data-focus-x');
    const fy = img.getAttribute('data-focus-y');
    const df = img.getAttribute('data-focus');

    let pos = null;

    if (fx != null && fy != null) {
      const x = String(fx).trim();
      const y = String(fy).trim();
      if (x !== '' && y !== '' && !isNaN(x) && !isNaN(y)) {
        pos = `${x}% ${y}%`;
      }
    }

    if (!pos && df) {
      const val = df.trim().toLowerCase();
      if (keywordMap[val]) {
        pos = keywordMap[val];
      } else if (/^\d+%\s+\d+%$/.test(val)) {
        pos = val;
      } else if (/^\d+\s*,\s*\d+$/.test(val)) {
        const parts = val.split(',').map(s => s.trim());
        pos = `${parts[0]}% ${parts[1]}%`;
      }
    }

    if (pos) {
      img.style.objectPosition = pos;
    }
  }

  function init(){
    const imgs = document.querySelectorAll('img[data-focus], img[data-focus-x][data-focus-y]');
    imgs.forEach(applyFocus);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
