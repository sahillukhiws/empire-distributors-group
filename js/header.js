/* ============================================
   HEADER - Sticky behavior & nav highlight
   Simple: sticky header appears on scroll-up
   (handled by components.js stickyHeader logic)
   This file handles nav pill highlighting only.
   ============================================ */
(function () {
    // Highlight active nav link on category pages
    function highlightActiveNav() {
        var catId = new URLSearchParams(window.location.search).get('id');
        var path = window.location.pathname;
        if (!(/category\.html/.test(path) && catId)) return;

        function tryHighlight(container) {
            if (!container) return;
            var links = container.querySelectorAll('.nav-link');
            links.forEach(function (link) {
                var href = link.getAttribute('href') || '';
                if (href.indexOf('id=' + catId) !== -1) {
                    link.classList.add('active');
                }
            });
        }

        // Try immediately and also observe for dynamic content
        var navBar = document.getElementById('nav-bar-list');
        var stickyNav = document.getElementById('sticky-nav');

        function attempt() {
            tryHighlight(navBar);
            tryHighlight(stickyNav);
        }

        attempt();

        if (navBar) {
            var obs = new MutationObserver(function () {
                attempt();
                obs.disconnect();
            });
            obs.observe(navBar, { childList: true });
        }
    }

    highlightActiveNav();
})();
