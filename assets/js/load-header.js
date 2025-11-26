(function () {
    const placeholder = document.getElementById('site-header-placeholder');
    if (!placeholder) return;

    function insertFallback() {
        const html = '<header id="site-header" role="banner"><a href="./" class="site-logo" aria-label="Ir a inicio">Studio AGON</a></header>';
        placeholder.insertAdjacentHTML('afterend', html);
    }

    fetch('includes/header.html', { cache: 'no-store' }).then(resp => {
        if (!resp.ok) throw new Error('no header include');
        return resp.text();
    }).then(text => {
        placeholder.insertAdjacentHTML('afterend', text);
    }).catch(insertFallback);
})();