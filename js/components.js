/* ============================================
   COMPONENTS - shared header / nav / footer injector
   Runs BEFORE catalog.js so DOM is ready for catalog rendering.
   ============================================ */
(function () {
    const inPages = /\/pages\//.test(window.location.pathname);
    const BASE = inPages ? '../' : '';

    function headerHTML() {
        return `
            <div class="site-top is-expanded" id="site-top">
                <header class="site-header">
                    <div class="container header-inner">
                        <button class="hamburger" id="hamburger-btn" type="button" aria-label="Open menu" aria-expanded="false">
                            <span></span><span></span><span></span>
                        </button>

                        <a href="${BASE}index.html" class="brand" aria-label="Empire Distributors Group">
                            <img class="brand__logo" src="${BASE}assets/logos/empire-logo-removebg-preview.png" alt="Empire Distributors Group">
                        </a>

                        <div class="search" role="search">
                            <svg class="search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                            <input id="search-input" type="text" class="search__input" placeholder="Search products, brands, categories..." autocomplete="off" aria-label="Search">
                            <button id="search-clear" class="search__clear" aria-label="Clear search">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                            <div id="search-results" class="search__results" role="listbox"></div>
                        </div>

                        <a class="wa-btn" data-wa="Hi, I'd like to know more about Empire Distributors Group." aria-label="Chat on WhatsApp">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5zM12 18.5a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.9.8.8-2.9-.2-.3a6.6 6.6 0 1 1 5.9 3.4zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.4.1-.5.7-.6.8-.2.1-.4 0a5.4 5.4 0 0 1-2.7-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2-.1-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8 8 8 0 0 0 3.1 2.7c1.9.8 1.9.5 2.2.5s1.1-.4 1.2-.9.2-.8.1-.9-.2-.1-.4-.2z"/></svg>
                        </a>
                    </div>
                </header>

                <nav class="cat-nav" aria-label="Product categories">
                    <div class="container cat-nav__container">
                        <div id="cat-nav-list" class="cat-nav__list"></div>
                    </div>
                </nav>

                <!-- Big logo overlay - spans header + nav rows when expanded -->
                <div class="brand-big-wrap" aria-hidden="true">
                    <div class="brand-big">
                        <a href="${BASE}index.html" aria-label="Empire Distributors Group">
                            <img class="brand-big__img" src="${BASE}assets/logos/empire-logo-removebg-preview.png" alt="Empire Distributors Group">
                        </a>
                    </div>
                </div>
            </div>

            <!-- Mobile drawer menu (only shown on mobile via CSS) -->
            <div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
                <div class="mobile-drawer__backdrop" data-close-drawer></div>
                <aside class="mobile-drawer__panel" role="dialog" aria-label="Menu">
                    <div class="mobile-drawer__head">
                        <img src="${BASE}assets/logos/empire-logo-removebg-preview.png" alt="Empire" class="mobile-drawer__logo">
                        <button class="mobile-drawer__close" type="button" aria-label="Close menu" data-close-drawer>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <nav class="mobile-drawer__nav" id="mobile-drawer-nav"></nav>
                    <div class="mobile-drawer__footer">
                        <a class="btn btn-primary mobile-drawer__wa" data-wa="Hi, I'd like to know more about Empire Distributors Group." aria-label="Chat on WhatsApp">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5z"/></svg>
                            Chat on WhatsApp
                        </a>
                        <p class="mobile-drawer__note">Must be 21+ to use this site.</p>
                    </div>
                </aside>
            </div>
        `;
    }

    function footerHTML() {
        return `
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <div class="footer-brand__logo">
                                <img src="${BASE}assets/logos/empire-logo-removebg-preview.png" alt="Empire Distributors Group" style="
    background-color: white; padding: 4px;">
                            </div>
                            <p>Premium wholesale &amp; retail distribution for vape, wellness, and lifestyle products. Quality you can trust, service you can count on - shipping nationwide from Tucker, GA.</p>
                            <div class="footer-brand__social">
                                <a data-wa="Hi Empire! I'd like to get in touch." aria-label="WhatsApp">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5z"/></svg>
                                </a>
                                <a href="mailto:empiredistributorsgroup@gmail.com" aria-label="Email">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                                </a>
                                <a href="tel:+14703753936" aria-label="Phone">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>
                                </a>
                                <a href="#" aria-label="Instagram">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                                </a>
                            </div>
                        </div>
                        <div class="footer-col">
                            <h4>Shop</h4>
                            <a href="${BASE}pages/category.html?id=vape">Vape</a>
                            <a href="${BASE}pages/category.html?id=kratom">Kratom</a>
                            <a href="${BASE}pages/category.html?id=delta">Delta</a>
                            <a href="${BASE}pages/category.html?id=mushroom">Mushroom</a>
                            <a href="${BASE}pages/category.html?id=supplements">Supplements</a>
                        </div>
                        <div class="footer-col">
                            <h4>Company</h4>
                            <a href="${BASE}pages/about.html">About Us</a>
                            <a href="${BASE}pages/brands.html">Brands</a>
                            <a href="${BASE}pages/contact.html">Wholesale Inquiry</a>
                            <a href="${BASE}pages/contact.html">Contact</a>
                        </div>
                        <div class="footer-col footer-col--contact">
                            <h4>Visit / Contact</h4>
                            <ul class="footer-contacts">
                                <li class="fc-item">
                                    <span class="fc-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    </span>
                                    <div class="fc-text">
                                        <div class="fc-label">Address</div>
                                        <address class="fc-value">2725 Mountain Industrial Blvd, Suite A5, Tucker, GA 30084</address>
                                    </div>
                                </li>
                                <li class="fc-item">
                                    <span class="fc-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                                    </span>
                                    <div class="fc-text">
                                        <div class="fc-label">Email</div>
                                        <a href="mailto:empiredistributorsgroup@gmail.com" class="fc-value fc-link">empiredistributorsgroup@gmail.com</a>
                                    </div>
                                </li>
                                <li class="fc-item">
                                    <span class="fc-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>
                                    </span>
                                    <div class="fc-text">
                                        <div class="fc-label">Phone</div>
                                        <a href="tel:+14703753936" class="fc-value fc-link">470-375-3936</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bot">
                        <div>© 2026 Empire Distributors Group. All rights reserved.</div>
                        <div class="footer-bot__legal">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                        <div class="footer-bot__warning">Must be 21+ to purchase</div>
                    </div>
                </div>
            </footer>
        `;
    }

    function floatingHTML() {
        return `
            <div class="floating-actions" id="floating-actions">
                <a class="float-btn float-btn--wa" data-wa="Hi Empire! I'd like to chat about your products." aria-label="Chat on WhatsApp">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5zM12 18.5a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.9.8.8-2.9-.2-.3a6.6 6.6 0 1 1 5.9 3.4zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.4.1-.5.7-.6.8-.2.1-.4 0a5.4 5.4 0 0 1-2.7-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2-.1-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8 8 8 0 0 0 3.1 2.7c1.9.8 1.9.5 2.2.5s1.1-.4 1.2-.9.2-.8.1-.9-.2-.1-.4-.2z"/></svg>
                </a>
                <button class="float-btn float-btn--top" id="float-top" type="button" aria-label="Scroll to top">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </button>
            </div>
        `;
    }

    // Inject into placeholders
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');
    if (headerSlot) headerSlot.outerHTML = headerHTML();
    if (footerSlot) footerSlot.outerHTML = footerHTML();

    // ---------- Mirror cat-nav into the mobile drawer ----------
    // We wait for the main nav to be populated (by main.js or the page script),
    // then rebuild the drawer nav with the same links styled for the drawer.
    (function mirrorNavToDrawer() {
        const sourceNav = document.getElementById('cat-nav-list');
        const drawerNav = document.getElementById('mobile-drawer-nav');
        if (!sourceNav || !drawerNav) return;

        function rebuild() {
            const items = sourceNav.querySelectorAll('.cat-nav__item');
            if (!items.length) return;
            drawerNav.innerHTML = '';
            items.forEach(item => {
                const clone = document.createElement('a');
                clone.className = 'drawer-link';
                clone.href = item.getAttribute('href');
                // Preserve per-category color
                const styleAttr = item.getAttribute('style');
                if (styleAttr) clone.setAttribute('style', styleAttr);
                clone.textContent = item.textContent;
                drawerNav.appendChild(clone);
            });
        }

        const obs = new MutationObserver(() => {
            if (sourceNav.children.length) {
                rebuild();
                obs.disconnect();
            }
        });
        obs.observe(sourceNav, { childList: true });
        // Also try immediately in case it's already populated
        rebuild();
    })();

    // ---------- Mobile drawer menu ----------
    (function wireDrawer() {
        const hamburger = document.getElementById('hamburger-btn');
        const drawer = document.getElementById('mobile-drawer');
        if (!hamburger || !drawer) return;

        function openDrawer() {
            drawer.classList.add('is-open');
            drawer.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.classList.add('is-open');
            document.documentElement.style.overflow = 'hidden';
        }
        function closeDrawer() {
            drawer.classList.remove('is-open');
            drawer.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('is-open');
            document.documentElement.style.overflow = '';
        }
        hamburger.addEventListener('click', function () {
            if (drawer.classList.contains('is-open')) closeDrawer();
            else openDrawer();
        });
        drawer.addEventListener('click', function (e) {
            if (e.target.closest('[data-close-drawer]')) closeDrawer();
            if (e.target.closest('a[href]')) closeDrawer();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
        });
    })();

    // Always inject floating actions (auto-appended to body)
    if (!document.getElementById('floating-actions')) {
        document.body.insertAdjacentHTML('beforeend', floatingHTML());

        // Show both buttons once the user scrolls past the threshold.
        // Hidden at the top of the page, visible together when scrolled.
        const float = document.getElementById('floating-actions');
        const topBtn = document.getElementById('float-top');
        const SHOW_AT = 400;
        function onScroll() {
            if (window.scrollY > SHOW_AT) float.classList.add('is-visible');
            else float.classList.remove('is-visible');
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Highlight active nav pill based on URL.
    // Category pages highlight the matching category pill.
    // Home / other pages: nothing active (home isn't a category).
    function highlightActiveNav() {
        const catId = new URLSearchParams(window.location.search).get('id');
        const path = window.location.pathname;
        const navEl = document.getElementById('cat-nav-list');
        if (!navEl) return;
        const isCategoryPage = /category\.html/.test(path) && catId;
        if (!isCategoryPage) return; // home, brands, about, contact, product - no auto-highlight here
        const obs = new MutationObserver(() => {
            const items = navEl.querySelectorAll('.cat-nav__item');
            if (!items.length) return;
            items.forEach(item => item.classList.remove('active'));
            let matched = false;
            items.forEach(item => {
                if (item.getAttribute('href')?.includes('id=' + catId)) {
                    item.classList.add('active');
                    matched = true;
                }
            });
            if (matched) obs.disconnect();
        });
        obs.observe(navEl, { childList: true, subtree: true });
    }
    highlightActiveNav();
})();
