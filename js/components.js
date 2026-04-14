/* ============================================
   COMPONENTS - header / nav / footer / floating injector
   Structure matches mysmokewholesale.com reference
   ============================================ */
(function () {
    var inPages = /\/pages\//.test(window.location.pathname);
    var BASE = inPages ? '../' : '';

    function headerHTML() {
        return '' +
            /* Top warning bar */
            '<div class="top-bar">' +
                '<span class="icon">&#9888;</span> WARNING: This Product Contains Nicotine. Nicotine Is An Addictive Chemical.' +
            '</div>' +

            /* Main header */
            '<div class="site-header">' +
                '<div class="header-main">' +
                    '<div class="container">' +
                        '<div class="header-main__inner">' +
                            /* Hamburger (mobile only) */
                            '<button class="hamburger" id="hamburger-btn" type="button" aria-label="Open menu">' +
                                '<span></span><span></span><span></span>' +
                            '</button>' +

                            /* Logo */
                            '<a href="' + BASE + 'index.html" class="header-logo">' +
                                '<img src="' + BASE + 'assets/logos/empire-logo-removebg-preview.png" alt="Empire Distributors Group">' +
                            '</a>' +

                            /* Search */
                            '<div class="header-search" role="search">' +
                                '<div class="header-search__form">' +
                                    '<input id="search-input" type="text" class="header-search__input" placeholder="Search entire store here..." autocomplete="off" aria-label="Search">' +
                                    '<button class="header-search__btn" type="button" aria-label="Search">' +
                                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
                                    '</button>' +
                                '</div>' +
                                '<div id="search-results" class="header-search__results" role="listbox"></div>' +
                            '</div>' +

                            /* Mobile search icon - hidden on desktop, shown on mobile */
                            '<button class="header-mobile-search" id="header-mobile-search" type="button" aria-label="Search">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
                            '</button>' +

                            /* WhatsApp animated button */
                            '<a class="header-wa" data-wa="Hi, I\'d like to know more about Empire Distributors Group." aria-label="Chat on WhatsApp">' +
                                '<object class="header-wa__svg" type="image/svg+xml" data="' + BASE + 'assets/whatsapp-button-animated.svg" tabindex="-1" aria-hidden="true"></object>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                /* Navigation bar */
                '<div class="nav-bar" id="nav-bar">' +
                    '<div class="container">' +
                        '<div class="nav-bar__inner" id="nav-bar-list"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            /* Sticky header */
            '<div class="site-header-sticky" id="sticky-header">' +
                '<div class="container">' +
                    '<div class="sticky-inner">' +
                        '<button class="sticky-hamburger" id="sticky-hamburger-btn" type="button" aria-label="Open menu">' +
                            '<span></span><span></span><span></span>' +
                        '</button>' +
                        '<a href="' + BASE + 'index.html" class="sticky-brand">' +
                            '<span>EMPIRE</span> DISTRIBUTORS' +
                        '</a>' +
                        '<div class="sticky-nav" id="sticky-nav"></div>' +
                        '<div class="sticky-icons">' +
                            '<button class="sticky-icon" id="sticky-search-toggle" aria-label="Search">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
                            '</button>' +
                        '</div>' +
                        /* Search dropdown dialog */
                        '<div class="sticky-search-box" id="sticky-search-box">' +
                            '<div class="sticky-search-box__form">' +
                                '<input id="sticky-search-input" type="text" class="sticky-search-box__input" placeholder="Search products, brands..." autocomplete="off">' +
                                '<button class="sticky-search-box__btn" type="button">' +
                                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
                                '</button>' +
                            '</div>' +
                            '<div class="sticky-search-box__results" id="sticky-search-results"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            /* Mobile drawer */
            '<div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">' +
                '<div class="mobile-drawer__backdrop" data-close-drawer></div>' +
                '<div class="mobile-drawer__panel">' +
                    '<div class="mobile-drawer__head">' +
                        '<img src="' + BASE + 'assets/logos/empire-logo-removebg-preview.png" alt="Empire" class="mobile-drawer__logo">' +
                        '<button class="mobile-drawer__close" type="button" data-close-drawer>' +
                            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
                        '</button>' +
                    '</div>' +
                    '<div class="mobile-drawer__search">' +
                        '<div class="mobile-drawer__search-form">' +
                            '<input id="drawer-search-input" type="text" class="mobile-drawer__search-input" placeholder="Search products..." autocomplete="off">' +
                            '<button class="mobile-drawer__search-btn" type="button">' +
                                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
                            '</button>' +
                        '</div>' +
                        '<div class="mobile-drawer__search-results" id="drawer-search-results"></div>' +
                    '</div>' +
                    '<nav class="mobile-drawer__nav" id="mobile-drawer-nav"></nav>' +
                    '<div class="mobile-drawer__footer">' +
                        '<a class="btn btn-primary mobile-drawer__wa" data-wa="Hi, I\'d like to know more about Empire Distributors Group.">' +
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5z"/></svg>' +
                            ' Chat on WhatsApp' +
                        '</a>' +
                        '<p class="mobile-drawer__note">Must be 21+ to purchase.</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function footerHTML() {
        return '' +
            '<footer class="site-footer">' +
                '<div class="container">' +
                    '<div class="footer-grid">' +
                        '<div class="footer-brand">' +
                            '<div class="footer-brand__logo">' +
                                '<img src="' + BASE + 'assets/logos/empire-logo-removebg-preview.png" alt="Empire Distributors Group">' +
                            '</div>' +
                            '<p>Premium wholesale &amp; retail distribution for vape, wellness, and lifestyle products. Shipping nationwide from Tucker, GA.</p>' +
                            '<div class="footer-brand__social">' +
                                '<a data-wa="Hi Empire!" aria-label="WhatsApp"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5z"/></svg></a>' +
                                '<a href="mailto:empiredistributorsgroup@gmail.com" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>' +
                                '<a href="tel:+16783036054" aria-label="Phone"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg></a>' +
                                '<a href="https://www.instagram.com/empire_distributors/" target="_blank" rel="noopener" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="footer-col">' +
                            '<h4>Shop</h4>' +
                            '<a href="' + BASE + 'pages/category.html?id=vape">Vape</a>' +
                            '<a href="' + BASE + 'pages/category.html?id=kratom">Kratom</a>' +
                            '<a href="' + BASE + 'pages/category.html?id=delta">Delta</a>' +
                            '<a href="' + BASE + 'pages/category.html?id=mushroom">Mushroom</a>' +
                            '<a href="' + BASE + 'pages/category.html?id=supplements">Supplements</a>' +
                        '</div>' +
                        '<div class="footer-col">' +
                            '<h4>Company</h4>' +
                            '<a href="' + BASE + 'pages/about.html">About Us</a>' +
                            '<a href="' + BASE + 'pages/brands.html">Brands</a>' +
                            '<a href="' + BASE + 'pages/contact.html">Wholesale Inquiry</a>' +
                            '<a href="' + BASE + 'pages/contact.html">Contact</a>' +
                        '</div>' +
                        '<div class="footer-col footer-col--contact">' +
                            '<h4>Contact</h4>' +
                            '<ul class="footer-contacts">' +
                                '<li class="fc-item"><span class="fc-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></span><div class="fc-text"><div class="fc-label">Address</div><address class="fc-value">2725 Mountain Industrial Blvd, Suite A5, Tucker, GA 30084</address></div></li>' +
                                '<li class="fc-item"><span class="fc-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span><div class="fc-text"><div class="fc-label">Email</div><a href="mailto:empiredistributorsgroup@gmail.com" class="fc-value fc-link">empiredistributorsgroup@gmail.com</a></div></li>' +
                                '<li class="fc-item"><span class="fc-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg></span><div class="fc-text"><div class="fc-label">Phone</div><a href="tel:+16783036054" class="fc-value fc-link">+1 (678) 303-6054</a><a href="tel:+14706404502" class="fc-value fc-link">+1 (470) 640-4502</a><a href="tel:+14709533565" class="fc-value fc-link">+1 (470) 953-3565</a></div></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                    '<div class="footer-bot">' +
                        '<div>&copy; 2026 Empire Distributors Group. All rights reserved.</div>' +
                        '<div class="footer-bot__legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>' +
                        '<div class="footer-bot__warning">Must be 21+ to purchase</div>' +
                    '</div>' +
                '</div>' +
            '</footer>';
    }

    function floatingHTML() {
        return '' +
            '<div class="floating-actions" id="floating-actions">' +
                '<a class="float-btn float-btn--wa" data-wa="Hi Empire! I\'d like to chat about your products." aria-label="WhatsApp">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5zM12 18.5a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.9.8.8-2.9-.2-.3a6.6 6.6 0 1 1 5.9 3.4zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.4.1-.5.7-.6.8-.2.1-.4 0a5.4 5.4 0 0 1-2.7-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2-.1-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8 8 8 0 0 0 3.1 2.7c1.9.8 1.9.5 2.2.5s1.1-.4 1.2-.9.2-.8.1-.9-.2-.1-.4-.2z"/></svg>' +
                '</a>' +
                '<button class="float-btn float-btn--top" id="float-top" type="button" aria-label="Scroll to top">' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' +
                '</button>' +
            '</div>';
    }

    // Inject
    var headerSlot = document.getElementById('site-header');
    var footerSlot = document.getElementById('site-footer');
    if (headerSlot) headerSlot.outerHTML = headerHTML();
    if (footerSlot) footerSlot.outerHTML = footerHTML();

    // Floating actions
    if (!document.getElementById('floating-actions')) {
        document.body.insertAdjacentHTML('beforeend', floatingHTML());
        var floatEl = document.getElementById('floating-actions');
        var topBtn = document.getElementById('float-top');
        var SHOW_AT = 300;
        window.addEventListener('scroll', function () {
            if (window.scrollY > SHOW_AT) floatEl.classList.add('is-visible');
            else floatEl.classList.remove('is-visible');
        }, { passive: true });
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Sticky header logic
    (function stickyHeader() {
        var sticky = document.getElementById('sticky-header');
        if (!sticky) return;
        var lastY = 0;
        var threshold = 250;
        window.addEventListener('scroll', function () {
            var y = window.scrollY;
            if (y > threshold && y < lastY) {
                sticky.classList.add('visible');
            } else if (y <= threshold || y > lastY) {
                sticky.classList.remove('visible');
            }
            lastY = y;
        }, { passive: true });

        /* Sticky search toggle - opens dropdown search dialog */
        var searchToggle = document.getElementById('sticky-search-toggle');
        var searchBox = document.getElementById('sticky-search-box');
        var stickyInput = document.getElementById('sticky-search-input');
        var stickyResults = document.getElementById('sticky-search-results');

        if (searchToggle && searchBox && stickyInput) {
            searchToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                var isOpen = searchBox.classList.contains('open');
                searchBox.classList.toggle('open', !isOpen);
                if (!isOpen) {
                    setTimeout(function () { stickyInput.focus(); }, 50);
                }
            });

            /* Close on outside click */
            document.addEventListener('click', function (e) {
                if (!searchBox.contains(e.target) && e.target !== searchToggle) {
                    searchBox.classList.remove('open');
                }
            });

            /* Close on Escape */
            stickyInput.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    searchBox.classList.remove('open');
                    searchToggle.focus();
                }
            });

            /* Live search in sticky - reuse EDG search logic */
            var debounceTimer = null;
            stickyInput.addEventListener('input', function () {
                var query = stickyInput.value.trim();
                clearTimeout(debounceTimer);
                if (!query) { stickyResults.innerHTML = ''; return; }
                debounceTimer = setTimeout(function () {
                    if (!window.EDG || !window.EDG.loadData) return;
                    window.EDG.loadData().then(function (data) {
                        var q = query.toLowerCase();
                        var matches = data.products.filter(function (p) {
                            var name = (p.name || '').toLowerCase();
                            var company = data.companies.find(function (c) { return c.id === p.company; });
                            var brandName = company ? company.name.toLowerCase() : '';
                            return name.indexOf(q) !== -1 || brandName.indexOf(q) !== -1;
                        }).slice(0, 8);

                        if (!matches.length) {
                            stickyResults.innerHTML = '<div style="padding:12px;color:var(--text-mute);font-size:13px;text-align:center">No results for "' + window.EDG.escapeHtml(query) + '"</div>';
                            return;
                        }

                        var inPages = /\/pages\//.test(window.location.pathname);
                        var base = inPages ? '../' : '';
                        stickyResults.innerHTML = matches.map(function (p) {
                            var company = data.companies.find(function (c) { return c.id === p.company; });
                            return '<a class="search__item" href="' + base + 'pages/product.html?id=' + encodeURIComponent(p.id) + '">' +
                                '<img class="search__item-img" src="' + p.image + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
                                '<div class="search__item-text">' +
                                    '<div class="search__item-name">' + window.EDG.escapeHtml(p.name) + '</div>' +
                                    '<div class="search__item-meta">' + (company ? company.name : '') + '</div>' +
                                '</div>' +
                            '</a>';
                        }).join('');
                    });
                }, 200);
            });

            /* Navigate to product on click */
            stickyResults.addEventListener('click', function () {
                searchBox.classList.remove('open');
                stickyInput.value = '';
                stickyResults.innerHTML = '';
            });
        }
    })();

    // Mirror nav to sticky and mobile drawer
    (function mirrorNav() {
        var src = document.getElementById('nav-bar-list');
        var stickyNav = document.getElementById('sticky-nav');
        var drawerNav = document.getElementById('mobile-drawer-nav');
        if (!src) return;

        function rebuild() {
            var links = src.querySelectorAll('.nav-link');
            if (!links.length) return;
            if (stickyNav) {
                stickyNav.innerHTML = '';
                links.forEach(function (link) {
                    var clone = link.cloneNode(true);
                    stickyNav.appendChild(clone);
                });
            }
            if (drawerNav) {
                drawerNav.innerHTML = '';
                links.forEach(function (link) {
                    var a = document.createElement('a');
                    a.className = 'drawer-link';
                    a.href = link.getAttribute('href');
                    a.textContent = link.textContent;
                    drawerNav.appendChild(a);
                });
            }
        }

        var obs = new MutationObserver(function () {
            if (src.children.length) { rebuild(); obs.disconnect(); }
        });
        obs.observe(src, { childList: true });
        rebuild();
    })();

    // Mobile drawer
    (function wireDrawer() {
        var hamburger = document.getElementById('hamburger-btn');
        var drawer = document.getElementById('mobile-drawer');
        if (!hamburger || !drawer) return;

        function open() {
            drawer.classList.add('is-open');
            hamburger.classList.add('is-open');
            document.documentElement.style.overflow = 'hidden';
        }
        function close() {
            drawer.classList.remove('is-open');
            hamburger.classList.remove('is-open');
            document.documentElement.style.overflow = '';
        }
        hamburger.addEventListener('click', function () {
            drawer.classList.contains('is-open') ? close() : open();
        });
        /* Mobile search icon opens drawer and focuses search */
        var mobileSearch = document.getElementById('header-mobile-search');
        if (mobileSearch) {
            mobileSearch.addEventListener('click', function () {
                open();
                setTimeout(function () {
                    var drawerInput = document.getElementById('drawer-search-input');
                    if (drawerInput) drawerInput.focus();
                }, 350);
            });
        }
        /* Sticky hamburger also opens drawer */
        var stickyHamburger = document.getElementById('sticky-hamburger-btn');
        if (stickyHamburger) {
            stickyHamburger.addEventListener('click', function () {
                drawer.classList.contains('is-open') ? close() : open();
            });
        }
        drawer.addEventListener('click', function (e) {
            if (e.target.closest('[data-close-drawer]') || e.target.closest('a[href]')) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
        });
    })();

    // Drawer search - live results inside mobile drawer
    (function wireDrawerSearch() {
        var input = document.getElementById('drawer-search-input');
        var results = document.getElementById('drawer-search-results');
        if (!input || !results) return;

        var timer = null;
        input.addEventListener('input', function () {
            var query = input.value.trim();
            clearTimeout(timer);
            if (!query) { results.innerHTML = ''; return; }
            timer = setTimeout(function () {
                if (!window.EDG || !window.EDG.loadData) return;
                window.EDG.loadData().then(function (data) {
                    var q = query.toLowerCase();
                    var matches = data.products.filter(function (p) {
                        var name = (p.name || '').toLowerCase();
                        var co = data.companies.find(function (c) { return c.id === p.company; });
                        return name.indexOf(q) !== -1 || (co && co.name.toLowerCase().indexOf(q) !== -1);
                    }).slice(0, 6);

                    if (!matches.length) {
                        results.innerHTML = '<div style="padding:12px;color:var(--text-mute);font-size:13px;text-align:center">No results</div>';
                        return;
                    }
                    var base = /\/pages\//.test(window.location.pathname) ? '../' : '';
                    results.innerHTML = matches.map(function (p) {
                        var co = data.companies.find(function (c) { return c.id === p.company; });
                        return '<a class="search__item" href="' + base + 'pages/product.html?id=' + encodeURIComponent(p.id) + '">' +
                            '<img class="search__item-img" src="' + p.image + '" alt="" loading="lazy">' +
                            '<div class="search__item-text">' +
                                '<div class="search__item-name">' + window.EDG.escapeHtml(p.name) + '</div>' +
                                '<div class="search__item-meta">' + (co ? co.name : '') + '</div>' +
                            '</div>' +
                        '</a>';
                    }).join('');
                });
            }, 200);
        });
    })();
})();
