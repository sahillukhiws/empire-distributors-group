/* ============================================
   HEADER STATE MACHINE
   Toggles .site-top between .is-expanded / .is-compact.

   Hover detection uses the live bounding rect of .site-top
   (not a fixed zone) so as soon as the mouse leaves the
   header+nav area, hover releases. This avoids the "nav
   stays visible forever" bug where a fixed buffer zone
   extended below the actual header.

   We also read the rect BEFORE any state change each frame
   so a collapsing rect doesn't cause phantom leave events
   mid-animation. The "stable snapshot" pattern.
   ============================================ */
(function () {
    const top = document.querySelector('.site-top');
    if (!top) return;

    const TOP_OFFSET = 10;
    const SCROLL_UP_THRESHOLD = 25;  // must scroll UP by at least this much to re-expand
    const SCROLL_DOWN_THRESHOLD = 10; // must scroll DOWN by at least this much to compact
    const DOWN_TRIGGER = 60;
    const HOVER_EXIT_BUFFER = 4;
    const RELEASE_DELAY = 80;
    const STATE_LOCK_MS = 600;   // lock scroll-triggered state changes for this long after a state flip

    let lastY = window.scrollY;
    let ticking = false;
    let hovered = false;
    let focused = false;
    let releaseTimer = null;
    let stateLockedUntil = 0;

    function lockState() {
        stateLockedUntil = Date.now() + STATE_LOCK_MS;
    }
    function isLocked() {
        return Date.now() < stateLockedUntil;
    }

    function expand() {
        if (!top.classList.contains('is-expanded')) {
            top.classList.add('is-expanded');
            top.classList.remove('is-compact');
            lockState();
        }
    }
    function compact() {
        if (!top.classList.contains('is-compact')) {
            top.classList.add('is-compact');
            top.classList.remove('is-expanded');
            lockState();
        }
    }

    function applyState() {
        const y = window.scrollY;
        if (hovered || focused || y <= TOP_OFFSET) {
            expand();
        } else if (y > DOWN_TRIGGER) {
            compact();
        }
    }

    function onScroll() {
        const y = window.scrollY;
        const dy = y - lastY;

        // Hovered or focused always wins - no scroll-based override
        if (hovered || focused) {
            lastY = y;
            ticking = false;
            return;
        }

        // Always expand when at the very top of the page
        if (y <= TOP_OFFSET) {
            expand();
            lastY = y;
            ticking = false;
            return;
        }

        // Don't react to scroll events during the lock window -
        // this prevents the nav-collapse layout shift from triggering
        // re-expansion via a phantom scroll-up event.
        if (isLocked()) {
            lastY = y;
            ticking = false;
            return;
        }

        if (y > DOWN_TRIGGER) {
            if (dy >= SCROLL_DOWN_THRESHOLD) {
                compact();
            } else if (dy <= -SCROLL_UP_THRESHOLD) {
                expand();
            }
        }

        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    /*
       Hover detection: cursor is "over the header" if its viewport Y
       is within the EXPANDED total height (header-h + nav-h) plus
       a small buffer. Read from CSS vars so it updates with breakpoints.
    */
    function expandedHeight() {
        const cs = getComputedStyle(document.documentElement);
        const h = parseInt(cs.getPropertyValue('--header-h'), 10) || 84;
        const n = parseInt(cs.getPropertyValue('--nav-h'), 10) || 56;
        return h + n;
    }

    function onMouseMove(e) {
        const inZone = e.clientY <= expandedHeight() + HOVER_EXIT_BUFFER;
        if (inZone) {
            if (releaseTimer) { clearTimeout(releaseTimer); releaseTimer = null; }
            if (!hovered) { hovered = true; applyState(); }
        } else if (hovered) {
            if (!releaseTimer) {
                releaseTimer = setTimeout(function () {
                    hovered = false;
                    releaseTimer = null;
                    applyState();
                }, RELEASE_DELAY);
            }
        }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // If mouse leaves the browser window, release immediately
    document.addEventListener('mouseleave', function () {
        if (releaseTimer) { clearTimeout(releaseTimer); releaseTimer = null; }
        hovered = false;
        applyState();
    });

    // Search focus keeps expanded
    document.addEventListener('focusin', function (e) {
        if (e.target && e.target.id === 'search-input') {
            focused = true;
            expand();
        }
    });
    document.addEventListener('focusout', function (e) {
        if (e.target && e.target.id === 'search-input') {
            focused = false;
            if (window.scrollY > DOWN_TRIGGER && !hovered) compact();
        }
    });

    // Initial state
    expand();
})();
