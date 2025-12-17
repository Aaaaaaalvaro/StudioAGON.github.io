console.log('cursor.js: cargado'); // línea de comprobación
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded disparado');
    (function () {
        // Crear SVG del cursor con 3 círculos RGB puros y blend mode correcto
        const cursorHTML = `
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                <circle class="cursor-red" cx="32" cy="27" r="13" fill="#ff0000" style="mix-blend-mode: screen;" />
                <circle class="cursor-green" cx="38" cy="36" r="13" fill="#00ff00" style="mix-blend-mode: screen;" />
                <circle class="cursor-blue" cx="26" cy="36" r="13" fill="#0000ff" style="mix-blend-mode: screen;" />
            </svg>
        `;

        const cursorEl = document.querySelector('.cursor');
        console.log('Cursor element:', cursorEl);
        if (!cursorEl) {
            console.error('No se encontró el elemento .cursor');
            return;
        }

        // Insertar SVG en el cursor
        cursorEl.innerHTML = cursorHTML;
        cursorEl.style.width = '64px';
        cursorEl.style.height = '64px';
        cursorEl.style.pointerEvents = 'none';

        // No activar en dispositivos táctiles
        if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches) {
            cursorEl.style.display = 'none';
            return;
        }

        // Oculta cursor nativo
        document.documentElement.classList.add('custom-cursor-active');
        document.documentElement.style.cursor = 'none';

        // Posición del cursor
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = mouseX, cursorY = mouseY;
        const speed = 0.18;

        // Elementos SVG circle para animar
        const circles = cursorEl.querySelectorAll('circle');
        console.log('Círculos encontrados:', circles.length);
        const states = ['idle', 'focus', 'hover', 'defocus', 'active', 'disabled'];
        const clickableSelector = 'a, button, input, textarea, select, label, .button, .clickable, [role="button"], [role="link"], .menu-toggle, [tabindex]';
        const imageSelector = '.project-gallery img, .project-image img, .featured-image-large img';

        let transitionTimer = null;
        let currentState = 'idle';
        let currentInteractiveEl = null;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorEl.style.display = 'block';
        });

        function animate() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursorEl.style.left = (cursorX - 32) + 'px';
            cursorEl.style.top = (cursorY - 32) + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        // New simplified state manager relying on CSS transitions
        function applyState(s) {
            // Remove all possible state classes first (except 'cursor')
            cursorEl.classList.remove('idle', 'focus', 'hover', 'active', 'disabled', 'image-hover');

            // Add the new state
            cursorEl.classList.add(s);
            currentState = s;
        }

        function handleEnter(el) {
            currentInteractiveEl = el;
            if (el.disabled || el.getAttribute('aria-disabled') === 'true') {
                applyState('disabled');
                return;
            }
            // Instant hover state
            applyState('hover');
        }

        function handleLeave() {
            currentInteractiveEl = null;
            // Instant return to idle
            applyState('idle');
        }

        // Initial state
        applyState('idle');

        document.addEventListener('pointerover', (e) => {
            const img = e.target.closest(imageSelector);
            if (img) {
                applyState('image-hover');
                return;
            }

            const el = e.target.closest(clickableSelector);
            if (!el) return;

            if (currentInteractiveEl === el) return;
            handleEnter(el);
        });

        document.addEventListener('pointerout', (e) => {
            const img = e.target.closest(imageSelector);
            if (img) {
                const relImg = e.relatedTarget && e.relatedTarget.closest(imageSelector);
                if (relImg) return;

                if (!currentInteractiveEl) applyState('idle');
                return;
            }

            const el = e.target.closest(clickableSelector);
            if (!el) return;

            // If moving to another interactive element inside this one or related, ignore
            if (currentInteractiveEl && currentInteractiveEl.contains(e.relatedTarget)) return;

            if (currentInteractiveEl === el) handleLeave();
        });

        document.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return; // Only left click
            cursorEl.classList.add('active'); // Add active on top of current state
        });

        document.addEventListener('pointerup', () => {
            cursorEl.classList.remove('active');
            // Re-verify state under cursor in case we dragged out
            const under = document.elementFromPoint(mouseX, mouseY);
            if (under) {
                if (under.closest(imageSelector)) {
                    applyState('image-hover');
                } else if (under.closest(clickableSelector)) {
                    applyState('hover');
                } else {
                    applyState('idle');
                }
            }
        });

        window.addEventListener('blur', () => {
            cursorEl.style.display = 'none';
        });

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
