/* ============================================
   HEADER — auto-hide on scroll down, show on scroll up
   Also reveals on hover near top of viewport
   ============================================ */
(function () {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const REVEAL_ZONE = 80;     // px from top — mouse here reveals header
    const SCROLL_THRESHOLD = 8; // ignore tiny scroll jitters
    const TOP_OFFSET = 10;      // always show when within this many px from top

    let lastY = window.scrollY;
    let ticking = false;
    let mouseLocked = false;

    function update() {
        const y = window.scrollY;
        const dy = y - lastY;

        // Always visible near top of page
        if (y <= TOP_OFFSET) {
            header.classList.remove('is-hidden');
            header.classList.remove('is-scrolled');
        } else {
            header.classList.add('is-scrolled');

            // Don't auto-hide if mouse is in the reveal zone
            if (!mouseLocked && Math.abs(dy) > SCROLL_THRESHOLD) {
                if (dy > 0) {
                    // Scrolling down
                    header.classList.add('is-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('is-hidden');
                }
            }
        }

        lastY = y;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    function onMouseMove(e) {
        if (e.clientY <= REVEAL_ZONE) {
            mouseLocked = true;
            header.classList.remove('is-hidden');
        } else {
            mouseLocked = false;
        }
    }

    // Keep header visible while user is interacting with it (e.g. typing in search)
    header.addEventListener('mouseenter', () => {
        mouseLocked = true;
        header.classList.remove('is-hidden');
    });
    header.addEventListener('mouseleave', () => {
        mouseLocked = false;
    });
    header.addEventListener('focusin', () => {
        mouseLocked = true;
        header.classList.remove('is-hidden');
    });
    header.addEventListener('focusout', () => {
        mouseLocked = false;
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
})();
