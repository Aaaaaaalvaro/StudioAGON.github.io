console.log('cursor.js: cargado'); // línea de comprobación
document.addEventListener('DOMContentLoaded', function () {
    (function () {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        // No activar en dispositivos táctiles
        if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches) {
            cursor.style.display = 'none';
            return;
        }

        // Oculta cursor nativo vía JS (complementario a CSS)
        document.documentElement.classList.add('custom-cursor-active');
        document.documentElement.style.cursor = 'none';

        // Lerp suave
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = mouseX, cursorY = mouseY;
        const speed = 0.18;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.display = 'block';
        });

        function animate() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        const clickableSelector = 'a, button, input, textarea, select, label, .button, .clickable, [role="button"]';

        // Estados y temporizador para Focus / Defocus
        const states = ['idle', 'focus', 'hover', 'defocus', 'active', 'disabled'];
        const transitionDurationMs = 88; // 0.088s para coincidir con la duración de los GIFs Focus/Defocus
        let transitionTimer = null;
        let currentState = 'idle';
        let currentInteractiveEl = null;

        // Asegura clase inicial si no existe
        if (![...cursor.classList].some(c => states.includes(c))) cursor.classList.add('idle');

        function applyState(s) {
            // limpiar temporizador si se cambia a un estado que no sea la transición en curso
            if (transitionTimer && s !== 'focus' && s !== 'defocus') {
                clearTimeout(transitionTimer);
                transitionTimer = null;
            }
            cursor.classList.remove(...states.filter(st => st !== s));
            cursor.classList.add(s);
            currentState = s;
        }

        // Gestión robusta con Pointer Events y seguimiento del elemento interactivo actual
        function handleEnter(el) {
            currentInteractiveEl = el;
            if (el.disabled || el.getAttribute('aria-disabled') === 'true') {
                applyState('disabled');
                return;
            }

            if (currentState === 'idle') {
                applyState('focus');
                transitionTimer = setTimeout(() => {
                    transitionTimer = null;
                    const under = document.elementFromPoint(mouseX, mouseY);
                    if (under && under.closest(clickableSelector)) applyState('hover');
                    else applyState('idle');
                }, transitionDurationMs);
                return;
            }

            if (currentState === 'defocus' && transitionTimer) {
                clearTimeout(transitionTimer);
                transitionTimer = null;
                applyState('hover');
                return;
            }

            if (currentState !== 'hover' && currentState !== 'active') applyState('hover');
        }

        function handleLeave(e) {
            const leavingEl = currentInteractiveEl;
            const rel = e.relatedTarget;
            const relInteractive = rel && rel.nodeType === 1 ? rel.closest(clickableSelector) : null;

            // Si vamos a otro interactivo, mantener hover y no lanzar defocus
            if (relInteractive && relInteractive !== leavingEl) {
                currentInteractiveEl = relInteractive;
                if (currentState !== 'active') applyState('hover');
                return;
            }

            currentInteractiveEl = null;

            if (currentState === 'hover') {
                applyState('defocus');
                transitionTimer = setTimeout(() => {
                    transitionTimer = null;
                    const under = document.elementFromPoint(mouseX, mouseY);
                    if (!(under && under.closest(clickableSelector))) applyState('idle');
                    else applyState('hover');
                }, transitionDurationMs);
                return;
            }

            applyState('idle');
        }

        document.addEventListener('pointerover', (e) => {
            const el = e.target.closest(clickableSelector);
            if (!el) return;

            // Si ya estamos sobre el mismo interactivo, no repitas
            if (currentInteractiveEl === el) return;

            // Si había un defocus en curso, cancelarlo al entrar
            if (currentState === 'defocus' && transitionTimer) {
                clearTimeout(transitionTimer);
                transitionTimer = null;
            }
            handleEnter(el);
        });

        document.addEventListener('pointerout', (e) => {
            const el = e.target.closest(clickableSelector);
            if (!el) return;

            // Si seguimos dentro del mismo interactivo (salida de hijo a padre), ignorar
            if (currentInteractiveEl && currentInteractiveEl.contains(e.relatedTarget)) return;

            // Solo procesar si salimos del interactivo actual
            if (currentInteractiveEl === el) handleLeave(e);
        });

        document.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            applyState('active');
        });

        document.addEventListener('pointerup', () => {
            const under = document.elementFromPoint(mouseX, mouseY);
            if (under && under.closest(clickableSelector)) applyState('hover');
            else applyState('idle');
        });

        window.addEventListener('blur', () => {
            if (transitionTimer) { clearTimeout(transitionTimer); transitionTimer = null; }
            cursor.style.display = 'none';
        });
        window.addEventListener('focus', () => { /* se mostrará al mover el ratón */ });

        const observer = new MutationObserver(() => {
            const under = document.elementFromPoint(mouseX, mouseY);
            if (under && under.closest(clickableSelector) && (under.disabled || under.getAttribute('aria-disabled') === 'true')) {
                applyState('disabled');
            }
        });
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['disabled', 'aria-disabled'] });

        window.addEventListener('beforeunload', () => { observer.disconnect(); });
    })();
});