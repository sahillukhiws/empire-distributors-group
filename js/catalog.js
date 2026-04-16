/* ============================================
   CATALOG - shared data loader + rendering
   ============================================ */
(function () {
    var inPages = /\/pages\//.test(window.location.pathname);
    var BASE = inPages ? '../' : '';
    var WA_NUMBER = '16783036054';

    var ICONS = {
        vape:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h10v-2H4a2 2 0 0 0 0 4h12l4-3v8l-4-3H4a2 2 0 0 1 0-4z"/><path d="M18 8v2"/><path d="M14 6v4"/></svg>',
        kratom:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 7-10s7 5 7 10a7 7 0 0 1-7 7z"/><path d="M11 3v17"/></svg>',
        delta:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L21 20 L3 20 Z"/></svg>',
        mushroom:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 16 0c0 1-.5 2-2 2H6c-1.5 0-2-1-2-2z"/><path d="M9 14v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6"/></svg>',
        pseudo:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        bluelotus:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c2 3 2 6 0 9-2-3-2-6 0-9z"/><path d="M6 9c3 1 5 3 6 6-3-1-5-3-6-6z"/><path d="M18 9c-3 1-5 3-6 6 3-1 5-3 6-6z"/><path d="M4 17h16"/></svg>',
        supplements: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="10" rx="5"/><path d="M12 8v10"/></svg>',
        novelties:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13"/><path d="M19 12H5"/></svg>',
    };

    var CAT_COPY = {
        vape: { tagline: 'Next-level clouds. Premium devices.', description: 'Industry-leading vape devices, disposables, and accessories from the brands your customers demand.', bullets: ['Top-tier disposable brands', 'Flavor variety across every line', 'Fast wholesale fulfillment'] },
        kratom: { tagline: 'Premium kratom. Trusted sources.', description: 'High-quality kratom shots, powders, capsules, and extracts from the most trusted names in the industry.', bullets: ['Shots, powders, capsules, extracts', 'Bliss Xtra, MIT 45, Kanva & more', 'Consistent lab-tested quality'] },
        delta: { tagline: 'Hemp-derived. Customer-approved.', description: 'Full lineup of Delta-8 and Delta-9 gummies, disposables, pre-rolls, and edibles from licensed producers.', bullets: ['Gummies, dabs, disposables, pre-rolls', 'Rock On, Dozo Donut & more', 'Farm-bill compliant'] },
        mushroom: { tagline: 'Functional. Fun. Flying off shelves.', description: 'The fastest-growing category in lifestyle retail. Mushroom gummies, disposables, and pre-rolls.', bullets: ['Shroom Bang, Shroom Puff, Silly Dots', 'Gummies, disposables, pre-rolls', 'Breakout bestseller category'] },
        pseudo: { tagline: 'The new-gen lineup your retail needs.', description: 'Trending alt-category products engineered for modern retail. Bold flavors, strong branding.', bullets: ['Gusherz, Lucid, Ultra Ohmz', 'Flavor-forward SKUs', 'High-margin shelf movers'] },
        bluelotus: { tagline: 'Ancient botanical. Modern delivery.', description: 'Blue lotus cartridges, pre-rolls, and disposables from Mental Health and trusted wellness brands.', bullets: ['Cartridges, pre-rolls, disposables', 'Multiple flavor profiles', 'Fast-growing wellness niche'] },
        supplements: { tagline: 'Wellness shots. Real results.', description: 'Kava shots, kanna blends, mood enhancers, and energy boosters from top wellness brands.', bullets: ['Better Now, Zen Power, Strike Kava', 'Mood, focus, energy shots', 'Counter-ready packaging'] },
        novelties: { tagline: 'Lifestyle accessories.', description: 'Curated lifestyle and novelty products for counter placement and impulse purchases.', bullets: ['Counter-ready novelty SKUs', 'Impulse-buy pricing', 'Fast rotation, fast margin'] },
    };

    var CAT_IMAGES = {
        vape:        'assets/category-tiles/vape.png',
        kratom:      'assets/category-tiles/kratom.png',
        delta:       'assets/category-tiles/delta.png',
        mushroom:    'assets/category-tiles/mushroom.png',
        pseudo:      'assets/category-tiles/pseudo.png',
        bluelotus:   'assets/category-tiles/mental-health-blue-lotus-4grm-disposable-blue-razz-blast.png',
        supplements: 'assets/category-tiles/supplements.png',
        novelties:   'assets/category-tiles/novelties.png',
    };

    var cachedData = null;
    var cachedColors = null;
    function loadData() {
        if (cachedData) return Promise.resolve(cachedData);
        return Promise.all([
            fetch(BASE + 'data/products.json').then(function (r) { return r.json(); }),
            fetch(BASE + 'data/product_colors.json').then(function (r) { return r.json(); }).catch(function () { return {}; }),
        ]).then(function (arr) {
            var data = arr[0];
            cachedColors = arr[1] || {};
            data.products = data.products.map(function (p) {
                return Object.assign({}, p, { image: BASE + p.image });
            });
            data._colors = cachedColors;
            cachedData = data;
            return data;
        });
    }

    function colorStyleFor(p, data) {
        var c = (data && data._colors) ? data._colors[p.id] : null;
        if (!c) return '';
        var s = '--tc-g1:' + c.top + ';--tc-g2:' + c.middle + ';--tc-g3:' + c.bottom + ';--tc-chip:' + c.chip + ';';
        if (c.chip_text) s += '--tc-chip-text:' + c.chip_text + ';';
        return s;
    }

    function waLink(text) {
        return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text || 'Hi, I would like to inquire about your products.');
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function findCategory(data, id) { return data.categories.find(function (c) { return c.id === id; }); }
    function findCompany(data, id) { return data.companies.find(function (c) { return c.id === id; }); }
    function findProduct(data, id) { return data.products.find(function (p) { return p.id === id; }); }
    function getProductsByCategory(data, catId) { return data.products.filter(function (p) { return p.category === catId; }); }
    function getProductsByCompany(data, cid) { return data.products.filter(function (p) { return p.company === cid; }); }
    function getBrandsInCategory(data, catId) {
        var ids = [];
        data.products.filter(function (p) { return p.category === catId; }).forEach(function (p) {
            if (ids.indexOf(p.company) === -1) ids.push(p.company);
        });
        return ids.map(function (id) { return findCompany(data, id); }).filter(Boolean);
    }
    function getRelatedProducts(data, product, limit) {
        limit = limit || 4;
        var sameBrand = data.products.filter(function (p) { return p.company === product.company && p.id !== product.id; });
        var sameCat = data.products.filter(function (p) { return p.category === product.category && p.company !== product.company; });
        return sameBrand.concat(sameCat).slice(0, limit);
    }

    /* ---------- Product color extraction from name/brand ---------- */
    /* Maps flavor/color keywords in product names to gradient colors */
    var COLOR_MAP = {
        /* Flavor keywords -> [gradient-start, gradient-end] */
        'blue razz':        ['#4a6cf7', '#6366f1'],
        'blueberry':        ['#3b5998', '#6366f1'],
        'blue':             ['#2563eb', '#3b82f6'],
        'purple dragon':    ['#7c3aed', '#a855f7'],
        'purple':           ['#7c3aed', '#9333ea'],
        'pink champagne':   ['#ec4899', '#f472b6'],
        'pink':             ['#ec4899', '#f9a8d4'],
        'strawberry':       ['#dc2626', '#f43f5e'],
        'cherry':           ['#be123c', '#e11d48'],
        'watermelon':       ['#16a34a', '#4ade80'],
        'pineapple':        ['#eab308', '#facc15'],
        'peach':            ['#f97316', '#fb923c'],
        'orange':           ['#ea580c', '#f97316'],
        'mango':            ['#f59e0b', '#fbbf24'],
        'lemon':            ['#eab308', '#fde047'],
        'grape':            ['#7c3aed', '#a78bfa'],
        'mint':             ['#059669', '#34d399'],
        'green':            ['#16a34a', '#22c55e'],
        'natural':          ['#78716c', '#a8a29e'],
        'gold':             ['#b45309', '#f59e0b'],
        'black':            ['#1e293b', '#334155'],
        'red':              ['#dc2626', '#ef4444'],
        'yellow':           ['#ca8a04', '#eab308'],
        'sour':             ['#65a30d', '#84cc16'],
        'mixed berry':      ['#7c3aed', '#c084fc'],
        'mixed':            ['#6366f1', '#a78bfa'],
    };

    /* Category fallback gradients (used when no flavor keyword matches) */
    var CAT_GRADIENT = {
        vape:        ['#0284c7', '#0ea5e9'],
        kratom:      ['#15803d', '#22c55e'],
        delta:       ['#b45309', '#f59e0b'],
        mushroom:    ['#92400e', '#d97706'],
        pseudo:      ['#a16207', '#eab308'],
        bluelotus:   ['#4338ca', '#6366f1'],
        supplements: ['#047857', '#10b981'],
        novelties:   ['#be185d', '#ec4899'],
    };

    /* Brand-specific color overrides */
    var BRAND_GRADIENT = {
        'rock-on':       ['#dc2626', '#f97316'],
        'opms':          ['#b45309', '#d97706'],
        'mit-45':        ['#7c2d12', '#c2410c'],
        'silly-dots':    ['#6d28d9', '#a855f7'],
        'shroom-bang':   ['#92400e', '#b45309'],
        'shroom-puff':   ['#059669', '#10b981'],
        'gushers':       ['#dc2626', '#f43f5e'],
        'ultra-ohmz':    ['#1d4ed8', '#3b82f6'],
        'better-now':    ['#0891b2', '#22d3ee'],
        'lucid-50mg':    ['#4338ca', '#818cf8'],
    };

    function getProductGradient(p) {
        var name = (p.name || '').toLowerCase();

        /* 1. Try flavor/color keyword match from product name */
        var keys = Object.keys(COLOR_MAP);
        for (var i = 0; i < keys.length; i++) {
            if (name.indexOf(keys[i]) !== -1) {
                return COLOR_MAP[keys[i]];
            }
        }

        /* 2. Try brand-specific color */
        if (BRAND_GRADIENT[p.company]) {
            return BRAND_GRADIENT[p.company];
        }

        /* 3. Fall back to category color */
        return CAT_GRADIENT[p.category] || ['#475569', '#64748b'];
    }

    /* Card (testing-card style): gradient media -> white info with centered name + pill chip.
       If product image has its own background (scene/promo), image fills 100% of media and
       the gradient is hidden under it. White-bg studio shots show the gradient frame. */
    function renderProductCard(p, data) {
        var company = findCompany(data, p.company);
        var brandName = company ? company.name : '';
        var href = BASE + 'pages/product.html?id=' + encodeURIComponent(p.id);
        var grad = getProductGradient(p);
        var cc = (data && data._colors) ? data._colors[p.id] : null;
        var hasOwnBg = !!(cc && cc.has_own_bg);
        var mediaCls = 'prod-card__media' + (hasOwnBg ? ' prod-card__media--cover' : '');
        var style = '--c:var(--c-' + p.category + ');--c-lt:var(--c-' + p.category + '-lt);--card-g1:' + grad[0] + ';--card-g2:' + grad[1] + ';' + colorStyleFor(p, data);

        return '<article class="prod-card reveal" style="' + style + '">' +
            '<a class="' + mediaCls + '" href="' + href + '">' +
                '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="this.closest(\'.prod-card__media\').classList.add(\'no-img\')">' +
            '</a>' +
            '<div class="prod-card__info">' +
                '<h3 class="prod-card__name"><a href="' + href + '">' + escapeHtml(p.name) + '</a></h3>' +
                (brandName ? '<div class="prod-card__brandchip"><span>' + escapeHtml(brandName) + '</span></div>' : '') +
            '</div>' +
        '</article>';
    }

    /* Full card for category/product pages (with CTA) */
    function renderProductCardFull(p, data, opts) {
        opts = opts || {};
        var company = findCompany(data, p.company);
        var category = findCategory(data, p.category);
        var brandName = company ? company.name : '';
        var catName = category ? category.name : '';
        var href = BASE + 'pages/product.html?id=' + encodeURIComponent(p.id);
        var cc = (data && data._colors) ? data._colors[p.id] : null;
        var hasOwnBg = !!(cc && cc.has_own_bg);
        var mediaCls = 'prod-card__media' + (hasOwnBg ? ' prod-card__media--cover' : '');
        var style = '--c:var(--c-' + p.category + ');--c-lt:var(--c-' + p.category + '-lt);' + colorStyleFor(p, data);
        var showChip = opts.showChip !== false;

        var brandMarkup = '<div class="prod-card__brand"><span>' + escapeHtml(brandName) + '</span></div>';

        return '<article class="prod-card reveal" style="' + style + '">' +
            '<a class="' + mediaCls + '" href="' + href + '">' +
                (showChip ? '<span class="prod-card__chip" style="opacity:1">' + escapeHtml(catName) + '</span>' : '') +
                '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="this.closest(\'.prod-card__media\').classList.add(\'no-img\')">' +
            '</a>' +
            '<div class="prod-card__body">' +
                brandMarkup +
                '<h3 class="prod-card__name"><a href="' + href + '">' + escapeHtml(p.name) + '</a></h3>' +
                '<a class="prod-card__cta" href="' + waLink('Inquiry: ' + p.name + ' (' + p.sku + ')') + '" target="_blank" rel="noopener">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5z"/></svg>' +
                    ' Inquire' +
                '</a>' +
            '</div>' +
        '</article>';
    }

    function renderProductGrid(products, data, container, opts) {
        if (!container) return;
        opts = opts || {};
        if (!products.length) {
            container.innerHTML = '<div class="empty-state"><h3>No products yet</h3><p>' + (opts.emptyText || 'Check back soon.') + '</p><a class="btn btn-primary" href="' + BASE + 'index.html">Back to Home</a></div>';
            return;
        }
        var fn = opts.fullCard ? renderProductCardFull : renderProductCard;
        container.innerHTML = products.map(function (p) { return fn(p, data, opts); }).join('');
    }

    function wireReveal() {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    setTimeout(function () { entry.target.classList.add('in'); }, i * 30);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        requestAnimationFrame(function () {
            document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { obs.observe(el); });
        });
    }

    function wireWhatsapp() {
        document.querySelectorAll('[data-wa]').forEach(function (el) {
            el.href = waLink(el.dataset.wa);
            el.target = '_blank';
            el.rel = 'noopener';
        });
    }

    function qs(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    window.EDG = {
        BASE: BASE,
        ICONS: ICONS,
        CAT_COPY: CAT_COPY,
        CAT_IMAGES: CAT_IMAGES,
        loadData: loadData,
        waLink: waLink,
        escapeHtml: escapeHtml,
        findCategory: findCategory,
        findCompany: findCompany,
        findProduct: findProduct,
        getProductsByCategory: getProductsByCategory,
        getProductsByCompany: getProductsByCompany,
        getBrandsInCategory: getBrandsInCategory,
        getRelatedProducts: getRelatedProducts,
        renderProductCard: renderProductCard,
        renderProductCardFull: renderProductCardFull,
        renderProductGrid: renderProductGrid,
        wireReveal: wireReveal,
        wireWhatsapp: wireWhatsapp,
        qs: qs,
    };
})();
