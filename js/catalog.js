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
        whitelotus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="11" r="2"/><path d="M12 5c1.5 2 1.5 4 0 6"/><path d="M7 7c2 2 3 4 3 6"/><path d="M17 7c-2 2-3 4-3 6"/><path d="M5 12c2 0 4 1 5 3"/><path d="M19 12c-2 0-4 1-5 3"/><path d="M4 18h16"/></svg>',
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
        whitelotus: { tagline: 'Pure botanical. Zero compromise.', description: 'Ultra White Lotus pre-rolls and disposables — no THC, no Delta. Clean herbal alternatives in bold flavors.', bullets: ['3-gram disposables, 2ct pre-rolls', 'Blueberry Razzle, Fruity Pebbles, Purple Rain, Strawberry', 'No THC, no Delta — fully compliant'] },
        supplements: { tagline: 'Wellness shots. Real results.', description: 'Kava shots, kanna blends, mood enhancers, and energy boosters from top wellness brands.', bullets: ['Better Now, Zen Power, Strike Kava', 'Mood, focus, energy shots', 'Counter-ready packaging'] },
        novelties: { tagline: 'Lifestyle accessories.', description: 'Curated lifestyle and novelty products for counter placement and impulse purchases.', bullets: ['Counter-ready novelty SKUs', 'Impulse-buy pricing', 'Fast rotation, fast margin'] },
    };

    var CAT_IMAGES = {
        vape:        'assets/category-tiles/vape.webp',
        kratom:      'assets/category-tiles/kratom.webp',
        delta:       'assets/category-tiles/MYSTIC LAB DELTA 9 GUMMIES.png',
        mushroom:    'assets/category-tiles/mushroom.webp',
        pseudo:      'assets/category-tiles/pseudo.webp',
        bluelotus:   'assets/category-tiles/mental-health-blue-lotus-4grm-disposable-blue-razz-blast.webp',
        whitelotus:  'assets/category-tiles/whitelotus.webp',
        supplements: 'assets/category-tiles/supplements.webp',
        novelties:   'assets/category-tiles/novelties.webp',
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

        // Combine and take up to limit
        var related = sameBrand.concat(sameCat).slice(0, limit);

        // If we don't have enough related products, fill with featured products from other categories
        if (related.length < limit) {
            var featured = data.products.filter(function (p) {
                return p.featured && p.id !== product.id && p.category !== product.category;
            });
            related = related.concat(featured).slice(0, limit);
        }

        // If still not enough, fill with random products from other categories
        if (related.length < limit) {
            var others = data.products.filter(function (p) {
                return p.id !== product.id && p.category !== product.category;
            });
            related = related.concat(others).slice(0, limit);
        }

        return related;
    }

    var FLAVOR_VARIANT_WORDS = [
        // Colors
        'RED', 'GOLD', 'BLACK', 'BLUE', 'PURPLE', 'PINK', 'GREEN', 'WHITE', 'YELLOW',
        'ORANGE', 'SILVER', 'BROWN', 'NATURAL', 'REGULAR', 'BLACK SHOT', 'BLUE SHOT',
        'PURPLE SHOT', 'GOLD SHOT', 'GO BOLDLY',

        // Fruits and flavors
        'OG KUSH', 'BLUE RAZZ', 'STRAWBERRY', 'WATERMELON', 'GRAPE', 'MANGO', 'PINEAPPLE',
        'CHERRY', 'PEACH', 'LEMON', 'LIME', 'ORANGE', 'APPLE', 'BERRY', 'RASPBERRY',
        'BLUEBERRY', 'BLACKBERRY', 'CRANBERRY', 'HONEYDEW', 'CANTALOUPE', 'KIWI',
        'BANANA', 'COCONUT', 'MELON', 'TROPICAL', 'FRUIT', 'CITRUS', 'MIX', 'MIXED BERRY',
        'CHERRY BERRY', 'BLUE RAZZ BURST', 'WATERMELON GUSHERS', 'TROPICAL PUNCH',
        'STRAWBERRY HAZE', 'STRAWBERRY SPLASH', 'BLUEBERRY BLAST', 'SOUR DIESEL',
        'BERRY DREAM', 'CALI RUNTZ', 'FRUITY PEBBLES', 'PINEAPPLE EXPRESS', 'SOUR SPACE CANDY',
        'BLUE RAZZ BLAST', 'PINEAPPLE PARADISE', 'PINK CHAMPAGNE', 'PURPLE DRAGON',
        'KIWI DRAGON BERRY', 'MEXICO MANGO', 'WATERMELON ICE', 'PLANET EDITION',
        'FIRE & ICE', 'BANGIN SOUR BERRIES', 'SPACE EDITION', 'CONSTELLATION',

        // Sizes/measurements (to exclude from flavor detection)
        'ML', 'L', 'MG', 'GRM', 'GRAM', 'KG', 'CT', 'PACK', 'JAR', 'TABLET', 'DISPOSABLE',
        'CARTRIDGE', 'PRE ROLL', 'PREROLL', 'CAPSULE', 'GUMMIES', 'DISPLAY', 'DOSE',
        'HERO DOSE', 'MEGA DOSE', 'SUPER DOSE', '1CT', '2CT', '3CT', '4CT', '5CT', '6CT',
        '10CT', '10PK', '10-PACK', '20CT', '30CT', '40CT', '50CT', '84CT', '100MG', '125MG',
        '160MG', '200MG', '250MG', '500MG', '1000MG', '1600MG', '1GRM', '1.5GRM', '2GRM', '3GRM', '4GRM',
        'EDITION', 'ANIMATED', 'GAME-CHANGER', 'COLLECTION', 'BOOST MODE', 'CURVED SCREEN'
    ];

    /* Detect flavor/variant siblings for a product.
       Priority: explicit `variantGroup` field > parentheses anywhere in name > trailing flavor word.
       Siblings share the same company + category + variantGroup (if set) OR same base name.
       Returns an array of variant objects with id, name, flavor, isActive. */
    function getFlavorVariants(data, product) {
        if (!product || !product.name) return [];

        var productName = String(product.name);

        // Helper: extract (flavor) from anywhere in the name + compute base
        function parseFlavorFromName(name) {
            var m = name.match(/\(([^)]+)\)/);
            if (m) {
                return {
                    base: name.replace(/\s*\([^)]+\)\s*/, ' ').replace(/\s+/g, ' ').trim(),
                    flavor: m[1].trim()
                };
            }
            // Fallback: check known flavor words at end
            var sorted = FLAVOR_VARIANT_WORDS.slice().sort(function(a,b){ return b.length - a.length; });
            for (var i = 0; i < sorted.length; i++) {
                var fw = sorted[i];
                if (name.endsWith(' ' + fw) || name === fw) {
                    return {
                        base: name.substring(0, name.lastIndexOf(fw)).trim(),
                        flavor: fw
                    };
                }
            }
            return { base: name, flavor: '' };
        }

        var variants;

        // PRIORITY 1: explicit variantGroup
        if (product.variantGroup) {
            variants = data.products.filter(function (p) {
                return p.variantGroup === product.variantGroup;
            });
        } else {
            // PRIORITY 2: match by base name (anywhere parentheses, or trailing flavor word)
            var parsed = parseFlavorFromName(productName);
            if (!parsed.flavor) return []; // no flavor found -> no siblings
            var baseName = parsed.base;
            if (!baseName) return [];

            variants = data.products.filter(function (p) {
                if (p.company !== product.company || p.category !== product.category) return false;
                // Skip products in an explicit group (they were already matched above)
                if (p.variantGroup) return false;
                var pParsed = parseFlavorFromName(String(p.name || ''));
                return pParsed.base === baseName;
            });
        }

        // If only the current product matches, no siblings to show
        if (variants.length <= 1) {
            return [];
        }

        // Build result list; extract flavor/variant label per sibling
        return variants.map(function (p) {
            var pParsed = parseFlavorFromName(String(p.name || ''));
            var pFlavor = pParsed.flavor;
            // If still no flavor, use variantLabel field (explicit) or fall back to the full name
            if (!pFlavor) pFlavor = p.variantLabel || p.name;

            return {
                id: p.id,
                name: p.name,
                flavor: pFlavor,
                image: p.image,
                sku: p.sku,
                category: p.category,
                isActive: p.id === product.id
            };
        }).sort(function (a, b) {
            // Sort: active first, then alphabetically by flavor
            if (a.isActive) return -1;
            if (b.isActive) return 1;
            return a.flavor.localeCompare(b.flavor);
        });
    }

    /* Match a hero slide/tile image path to a real product (by filename basename).
       Useful for making category hero imagery link to an actual product page. */
    function findProductByImagePath(data, imgPath) {
        if (!imgPath) return null;
        var norm = String(imgPath).toLowerCase().replace(/^\/+/, '').split('?')[0].split('#')[0];
        var base = norm.split('/').pop();
        if (!base) return null;
        return data.products.find(function (p) {
            var pi = String(p.image || '').toLowerCase().split('/').pop();
            return pi && pi === base;
        }) || null;
    }

    /* Auto-generate a product description when no explicit one is set.
       Uses brand + category + flavor/keywords parsed from the name. */
    var FLAVOR_WORDS = [
        'blue razz blast','blue razz','blueberry blast','blueberry','pineapple paradise','pineapple',
        'pink champagne','purple dragon','strawberry splash','strawberry','watermelon ice','watermelon',
        'mango','peach','lemon','lime','mint','mixed berry','mixed','cherry','grape','gummy bear',
        'sour','apple','orange','banana','coconut','vanilla','chocolate','caramel','tropical'
    ];
    function extractFlavor(name) {
        var n = String(name || '').toLowerCase();
        for (var i = 0; i < FLAVOR_WORDS.length; i++) {
            if (n.indexOf(FLAVOR_WORDS[i]) !== -1) return FLAVOR_WORDS[i];
        }
        var m = n.match(/\(([^)]+)\)/);
        return m ? m[1].trim() : '';
    }
    function titleCase(s) {
        return String(s || '').toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    function generateDescription(p, data) {
        if (p && p.description) return p.description;
        var cat = findCategory(data, p.category);
        var brand = findCompany(data, p.company);
        var brandName = brand ? titleCase(brand.name) : '';
        var catName = cat ? cat.name : 'premium';
        var flavor = extractFlavor(p.name);
        var cleanName = titleCase(String(p.name || '').replace(/\([^)]*\)/g, '').trim());
        var parts = [];
        parts.push(cleanName + (brandName ? ' by ' + brandName : '') + '.');
        if (flavor) parts.push('Available in ' + titleCase(flavor) + '.');
        parts.push('A premium ' + catName.toLowerCase() + ' product curated by Empire Distributors Group for wholesale partners.');
        parts.push('Consistent quality, fast fulfillment, and nationwide shipping from Tucker, GA.');
        return parts.join(' ');
    }
    function generateFeatures(p, data) {
        if (p && Array.isArray(p.features) && p.features.length) return p.features;
        var cat = findCategory(data, p.category);
        var brand = findCompany(data, p.company);
        var feats = [];
        if (brand) feats.push('Authentic ' + titleCase(brand.name) + ' product');
        if (cat) feats.push('Premium ' + cat.name + ' category');
        var flavor = extractFlavor(p.name);
        if (flavor) feats.push(titleCase(flavor) + ' flavor profile');
        feats.push('Wholesale-ready packaging');
        feats.push('Nationwide shipping from Tucker, GA');
        return feats;
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
        whitelotus:  ['#7c3aed', '#a855f7'],
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

    /* ---------- Category Hero Data ---------- */
    /* Each category gets slider images and 2x2 tile images for its hero section.
       You can replace these placeholder paths with your own images. */
    var CAT_HERO = {
        vape: {
            slides: [
                { img: 'assets/products/Product/vapeScroll/vape-scroll-01.webp', label: 'Foger Bit 35K', link: 'pages/product.html?id=vape-foger-bit-35k-bitcoin-edition' },
                { img: 'assets/products/Product/vapeScroll/vape-scroll-02.webp', label: 'Foger Switch Pro', link: 'pages/product.html?id=vape-foger-switch-pro-kiwi-dragon-berry' },
                { img: 'assets/products/Product/vapeScroll/vape-scroll-03.webp', label: 'Raz Smart', link: 'pages/product.html?id=vape-raz-ltx-25k-boost-mode' },
                { img: 'assets/products/Product/vapeScroll/vape-scroll-04.webp', label: 'Gigabar Next Gen', link: 'pages/product.html?id=vape-gigabar-pulse-x-25k-curved-screen' },
                { img: 'assets/products/Product/vapeScroll/vape-scroll-05.webp', label: 'Gigabar Pulse X', link: 'pages/product.html?id=vape-gigabar-pulse-x-25k-curved-screen' },
                { img: 'assets/products/Product/vapeScroll/vape-scroll-06.webp', label: 'Geek Bar 25K', link: 'pages/product.html?id=vape-geekbar-pulse-25k-3flavors' },
            ],
            tiles: [
                { img: 'assets/categories/vape/vapes-new/geekbar-pulse-collection-3colors.webp', label: 'GeekBar', link: 'pages/product.html?id=vape-geekbar-pulse-collection-3colors' },
                { img: 'assets/categories/vape/vapes-new/raz-ltx-25k-boost-mode-animated.webp', label: 'Raz ITX', link: 'pages/product.html?id=vape-raz-ltx-25k-boost-mode' },
                { img: 'assets/categories/vape/vapes-new/geekbar-pulse-x-3d-curved-screen.webp', label: 'GeekBar Plus', link: 'pages/product.html?id=vape-geekbar-pulse-x-3d-curved-screen' },
                { img: 'assets/categories/vape/vapes-new/foger-switch-pro-pod-watermelon-ice.webp', label: 'More Vapes', link: 'pages/product.html?id=vape-foger-switch-pro-pod-watermelon-ice' },
            ],
        },
        kratom: {
            slides: [
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-01.webp', label: 'Kanva Focus + Flow', link: 'pages/product.html?id=kratom-featured-kanva-focus-flow-shot' },
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-02.webp', label: 'Bliss Xtra Gold', link: 'pages/product.html?id=kratom-featured-bliss-xtra-gold-shot' },
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-03.webp', label: 'Feel Free Classic', link: 'pages/product.html?id=kratom-featured-feel-free-shot' },
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-04.webp', label: 'MIT 45 Blue Shot', link: 'pages/product.html?id=kratom-featured-mit-45-blue-shot' },
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-05.webp', label: 'OPMS Black', link: 'pages/product.html?id=kratom-featured-opms-black' },
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-06.webp', label: 'Mystic Labs Gummies', link: 'pages/product.html?id=kratom-featured-mystic-lab-kratom-gummies' },
                { img: 'assets/products/Product/karatomScroll/karatom-scroll-07.webp', label: 'Viva Xtreme Kratom', link: 'pages/product.html?id=kratom-featured-viva-xtreme' },
            ],
            tiles: [
                { img: 'assets/categories/kratom/featured/opms-black.webp', label: 'OPMS Black', link: 'pages/product.html?id=kratom-featured-opms-black' },
                { img: 'assets/categories/kratom/featured/kshot-black.webp', label: 'K-Shot Black', link: 'pages/product.html?id=kratom-featured-kshot-black' },
                { img: 'assets/categories/kratom/featured/mystic-lab-kratom-gummies.webp', label: 'Mystic Lab Gummies', link: 'pages/product.html?id=kratom-featured-mystic-lab-kratom-gummies' },
                { img: 'assets/categories/kratom/featured/bliss-xtra-gold-shot.webp', label: 'Bliss Xtra Gold', link: 'pages/product.html?id=kratom-featured-bliss-xtra-gold-shot' },
            ],
        },
        delta: {
            slides: [
                { img: 'assets/products/Product/daltaScroll/delta-scroll-01.webp', label: 'Rock On Live Resin Gummies', link: 'pages/product.html?id=delta-rock-on-live-resin-gummies-30bag-blue-razz-burst' },
                { img: 'assets/products/Product/daltaScroll/delta-scroll-02.webp', label: 'Rock On THC-P Pre-Rolls', link: 'pages/product.html?id=delta-rock-on-thcp-preroll-10pk-og-kush' },
                { img: 'assets/products/Product/daltaScroll/delta-scroll-03.webp', label: 'Rock On 2G Pre-Roll Jars', link: 'pages/product.html?id=delta-rock-on-thcp-jar-40ct-sour-diesel' },
                { img: 'assets/products/Product/daltaScroll/delta-scroll-04.webp', label: 'Rock On Liquid Diamonds Dabs', link: 'pages/product.html?id=delta-rock-on-thcp-dabs-6pk-sour-space-candy' },
                { img: 'assets/products/Product/daltaScroll/delta-scroll-05.webp', label: 'Rock On Liquid Diamonds Disposables', link: 'pages/product.html?id=delta-rock-on-d9-disposable-6g-blue-dream' },
                { img: 'assets/products/Product/daltaScroll/ChatGPT Image Apr 28, 2026, 08_10_25 PM.png', label: 'Delta 8 Disposables', link: 'pages/product.html?id=delta-1-delta-8-9-gummies-ml-product-photo-12ct-gummies' },
                { img: 'assets/products/Product/daltaScroll/ChatGPT Image Apr 28, 2026, 08_07_51 PM.png', label: 'Delta 9 Gummies', link: 'pages/product.html?id=delta-1-delta-8-9-gummies-12ct-delta-9-gummies' },
                { img: 'assets/products/Product/daltaScroll/delta-scroll-06.webp', label: 'Rock On Pure THC Gummies', link: 'pages/product.html?id=delta-rock-on-pure-thc-gummies-20ct-blue-razz-burst' },
                { img: 'assets/products/Product/daltaScroll/1.png 15-24-20-962.png', label: 'Dozo THC-P Donut Rolls', link: 'pages/product.html?id=delta-dozo-thcp-donut-rolls-3ct-frosted-wedding-cake' },
            ],
            tiles: [
                { img: 'assets/categories/delta/1-delta-8-9-gummies/ml-product-photo-12ct-gummies.webp', label: 'Delta Gummies', link: 'pages/product.html?id=delta-1-delta-8-9-gummies-ml-product-photo-12ct-gummies' },
                { img: 'assets/categories/delta/rock-on/rock-on-thcp-preroll-3ct-og-kush.webp', label: 'THC-P Pre-Rolls', link: 'pages/product.html?id=delta-rock-on-thcp-preroll-3ct-og-kush' },
                { img: 'assets/categories/delta/rock-on/rock-on-d9-disposable-6g-alaskan-thunderfuck.webp', label: 'Live Resin Disposables', link: 'pages/product.html?id=delta-rock-on-d9-disposable-6g-alaskan-thunderfuck' },
                { img: 'assets/categories/delta/Dozo/3DR_01_0001_grande.webp', label: 'Dozo THC-P Donut Rolls', link: 'pages/product.html?id=delta-dozo-thcp-donut-rolls-3ct-frosted-wedding-cake' },
            ],
        },
        mushroom: {
            slides: [
                { img: 'assets/products/Product/mashroomScroll/mushroom-scroll-01.webp', label: 'Extreme Mushroom Pre-Rolls', link: 'pages/product.html?id=mushroom-shroom-puff-shroom-puff-pre-roll-40ct-jar' },
                { img: 'assets/products/Product/mashroomScroll/mushroom-scroll-02.webp', label: 'Shroom Puff Blasters', link: 'pages/product.html?id=mushroom-shroom-puff-shroom-puff-blaster' },
                { img: 'assets/products/Product/mashroomScroll/mushroom-scroll-03.webp', label: 'Silly Dots Super Dose', link: 'pages/product.html?id=mushroom-silly-dots-silly-dots-super-dose' },
                { img: 'assets/products/Product/mashroomScroll/mushroom-scroll-04.webp', label: 'Shroom Puff Cartridge', link: 'pages/product.html?id=mushroom-shroom-puff-shroom-puff-1-grm-cartridge' },
                { img: 'assets/products/Product/mashroomScroll/mushroom-scroll-05.webp', label: 'Shroom Bang Tablet', link: 'pages/product.html?id=mushroom-shroom-bang-shroom-bang-4ct-tablet' },
                { img: 'assets/products/Product/mashroomScroll/mushroom-scroll-06.webp', label: 'Shroom Bang Disposable', link: 'pages/product.html?id=mushroom-shroom-bang-shroom-bang-4grm-disposable' },
            ],
            tiles: [
                { img: 'assets/categories/mushroom/shroom-puff/shroom-puff-2ct-pre-roll.webp', label: 'Shroom Puff Pre-Roll', link: 'pages/product.html?id=mushroom-shroom-puff-shroom-puff-2ct-pre-roll' },
                { img: 'assets/categories/mushroom/shroom-puff/shroom-puff-blaster.webp', label: 'Blaster Disposable', link: 'pages/product.html?id=mushroom-shroom-puff-shroom-puff-blaster' },
                { img: 'assets/categories/mushroom/silly-dots/silly-dots-mega-dose-blue-razz.webp', label: 'Silly Dots Gummies', link: 'pages/product.html?id=mushroom-silly-dots-silly-dots-mega-dose-blue-razz' },
                { img: 'assets/categories/mushroom/shroom-bang/shroom-bang-4ct-tablet.webp', label: 'Shroom Bang Tablet', link: 'pages/product.html?id=mushroom-shroom-bang-shroom-bang-4ct-tablet' },
            ],
        },
        pseudo: {
            slides: [
                { img: 'assets/products/Product/pseudoScroll/pseudo-scroll-01.webp', label: 'Ultra Ohmz Pseudo Supreme', link: 'pages/product.html?id=pseudo-ultra-ohmz-ultraohmzpseudosupreme-capsules-mockup-box-bluerazz-010526' },
                { img: 'assets/products/Product/pseudoScroll/pseudo-scroll-02.webp', label: 'Ultra Ohmz Pseudo Mega Bottles', link: 'pages/product.html?id=pseudo-ultra-ohmz-ultraohmzpseudomega-capsules-mockup-blueberry-011226' },
                { img: 'assets/products/Product/pseudoScroll/pseudo-scroll-03.webp', label: 'Ultra Ohmz Pseudo Mega Display', link: 'pages/product.html?id=pseudo-ultra-ohmz-ultraohmzpseudomega-capsules-box-mockup-bluerazz-011426' },
                { img: 'assets/products/Product/pseudoScroll/pseudo-scroll-04.webp', label: 'Lucid Pseudo Blend', link: 'pages/product.html?id=pseudo-lucid-50mg-photoroom-20260325-155055' },
                { img: 'assets/products/Product/pseudoScroll/pseudo-scroll-05.webp', label: 'Gusherz Pseudo Tablets', link: 'pages/product.html?id=pseudo-gushers-gusherz-pseudo-1ct-tablet-blueberry-blast' },
                { img: 'assets/products/Product/pseudoScroll/pseudo-scroll-06.webp', label: 'Gusherz Pseudo Jars', link: 'pages/product.html?id=pseudo-gushers-gusherz-pseudo-10ct-jar-blueberry-blast' },
            ],
            tiles: [
                { img: 'assets/categories/pseudo/ultra-ohmz/ultraohmzpseudomega-capsules-box-mockup-bluerazz-011426.webp', label: 'Ultra Ohmz', link: 'pages/product.html?id=pseudo-ultra-ohmz-ultraohmzpseudomega-capsules-box-mockup-bluerazz-011426' },
                { img: 'assets/categories/pseudo/ultra-ohmz/ultraohmzpseudomega-capsules-mockup-blueberry-011226.webp', label: 'Ultra Ohmz Mega', link: 'pages/product.html?id=pseudo-ultra-ohmz-ultraohmzpseudomega-capsules-mockup-blueberry-011226' },
                { img: 'assets/categories/pseudo/lucid-50mg/lucid-50mg-pseudo-blend-chewables-display.webp', label: 'Lucid 50mg', link: 'pages/product.html?id=pseudo-lucid-50mg-photoroom-20260325-155055' },
                { img: 'assets/categories/pseudo/gushers/gusherz-pseudo-10ct-jar-watermelon-gushers.webp', label: 'Watermelon Gusherz', link: 'pages/product.html?id=pseudo-gushers-gusherz-pseudo-10ct-jar-watermelon-gushers' },
            ],
        },
        bluelotus: {
            slides: [
                { img: 'assets/products/Product/bluelotusScroll/bluelotus-scroll-01.webp', label: 'Blue Lotus 4G Disposables', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-4grm-disposable-blue-razz-blast' },
                { img: 'assets/products/Product/bluelotusScroll/bluelotus-scroll-02.webp', label: 'Blue Lotus 2CT Prerolls', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-2ct-preroll-1-5grm-each-blue-razz-blast' },
                { img: 'assets/products/Product/bluelotusScroll/bluelotus-scroll-03.webp', label: 'Blue Lotus 1G Cartridges', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-1grm-cartridges-blue-razz-blast' },
            ],
            tiles: [
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-1grm-cartridges-purple-dragon.webp', label: 'Cartridges', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-1grm-cartridges-purple-dragon' },
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-4grm-disposable-pink-champagne.webp', label: 'Disposables', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-4grm-disposable-pink-champagne' },
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-2ct-preroll-1-5grm-each-purple-dragon.webp', label: 'Pre-Rolls', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-2ct-preroll-1-5grm-each-purple-dragon' },
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-4grm-disposable-strawberry-splash.webp', label: 'Strawberry Splash', link: 'pages/product.html?id=bluelotus-featured-mental-health-blue-lotus-4grm-disposable-strawberry-splash' },
            ],
        },
        whitelotus: {
            slides: [
                { img: 'assets/products/Product/ultraWhiteScroll/1.png', label: 'Ultra White Lotus', link: 'pages/product.html?id=whitelotus-ultra-white-lotus-ultra-white-lotus-3gram-disposable' },
                { img: 'assets/products/Product/ultraWhiteScroll/2.png', label: 'Ultra White Lotus', link: 'pages/product.html?id=whitelotus-ultra-white-lotus-ultra-white-lotus-2ct-pre-roll-1-5-grm-each' },
            ],
            tiles: [
                { img: 'assets/categories/whitelotus/ultra-white-lotus-3gram-disposable.png', label: 'Blueberry Razzle 3G', link: 'pages/product.html?id=whitelotus-ultra-white-lotus-ultra-white-lotus-3gram-disposable' },
                { img: 'assets/categories/whitelotus/ultra-white-lotus-3gram-disposable1.png', label: 'Purple Rain 3G', link: 'pages/product.html?id=whitelotus-ultra-white-lotus-ultra-white-lotus-3gram-disposable1' },
                { img: 'assets/categories/whitelotus/ultra-white-lotus-3gram-disposable3.png', label: 'Strawberry 3G', link: 'pages/product.html?id=whitelotus-ultra-white-lotus-ultra-white-lotus-3gram-disposable3' },
                { img: 'assets/categories/whitelotus/ultra-white-lotus-2ct-pre-roll-1-5-grm-each.png', label: 'Fruity Pebbles 2CT', link: 'pages/product.html?id=whitelotus-ultra-white-lotus-ultra-white-lotus-2ct-pre-roll-1-5-grm-each' },
            ],
        },
        supplements: {
            slides: [
                { img: 'assets/products/Product/supplimentsScroll/suppliments-scroll-01.webp', label: 'Better Now 30-Pack Dispenser', link: 'pages/product.html?id=supplements-better-now-betternow-capsules-mockup-box-blueberry-020926' },
                { img: 'assets/products/Product/supplimentsScroll/suppliments-scroll-02.webp', label: 'Better Now Card Display', link: 'pages/product.html?id=supplements-better-now-betternow-capsules-box-mockup-blueberry-012026' },
                { img: 'assets/products/Product/supplimentsScroll/suppliments-scroll-03.webp', label: 'Better Now 5CT', link: 'pages/product.html?id=supplements-better-now-better-now-5ct-blueberry' },
                { img: 'assets/products/Product/supplimentsScroll/suppliments-scroll-04.webp', label: 'Kanna + Kava Tonic', link: 'pages/product.html?id=supplements-kanna-kava-kanna-kava-relaxing-tonic' },
                { img: 'assets/products/Product/supplimentsScroll/suppliments-scroll-05.webp', label: 'Zen Power Shots', link: 'pages/product.html?id=supplements-zen-power-shot-img-7056' },
                { img: 'assets/products/Product/supplimentsScroll/suppliments-scroll-06.png', label: 'Strike Kava Shot', link: 'pages/product.html?id=supplements-strike-kava-shot-strike-kava-shot-strawberry' },
            ],
            tiles: [
                { img: 'assets/categories/supplements/better-now/betternow-capsules-mockup-box-watermelon-020926.webp', label: 'Better Now', link: 'pages/product.html?id=supplements-better-now-betternow-capsules-mockup-box-watermelon-020926' },
                { img: 'assets/categories/supplements/strike-kava-shot/strike-kava-shot-strawberry.png', label: 'Strike Kava', link: 'pages/product.html?id=supplements-strike-kava-shot-strike-kava-shot-strawberry' },
                { img: 'assets/categories/supplements/kanna-kava/kanna-kava-relaxing-tonic.png', label: 'Kanna Kava', link: 'pages/product.html?id=supplements-kanna-kava-kanna-kava-relaxing-tonic' },
                { img: 'assets/categories/supplements/zen-power-shot/zen-power-shot-2oz-display-box.webp', label: 'Zen Power Shot', link: 'pages/product.html?id=supplements-zen-power-shot-img-7056' },
            ],
        },
        novelties: {
            slides: [
                { img: 'assets/products/Product/noveltiesScroll/novelties-scroll-02.webp', label: 'ChoreBoy Copper Scrubbers', link: 'pages/product.html?id=novelties-misc-chore-boy' },
                { img: 'assets/products/Product/noveltiesScroll/novelties-scroll-06.webp', label: 'Aris Perfume Display', link: 'pages/product.html?id=novelties-misc-air-fresheners-200-and-300ml' },
                { img: 'assets/products/Product/noveltiesScroll/novelties-scroll-07.webp', label: 'Techno Coin Lighter', link: 'pages/product.html?id=novelties-lighters-x-dog-coin-lighter-20ct-00001b' },
                { img: 'assets/products/Product/noveltiesScroll/ARIS BODY SPRAY 200ML 12CT.png', label: 'Aris Body Spray 200ML 12CT', link: 'pages/product.html?id=novelties-misc-aris-body-spray-200ml-12ct' },
                { img: 'assets/products/Product/noveltiesScroll/GRENADE REGULAR FLAME LIGHTER 12CT 06666.png', label: 'Grenade Flame Lighter 12CT', link: 'pages/product.html?id=novelties-lighters-grenade-regular-flame-lighter-12ct-06666' },
                { img: 'assets/products/Product/noveltiesScroll/KNIVES BIG DISPLAY 96CT.png', label: 'Knives Big Display 96CT', link: 'pages/product.html?id=novelties-misc-knives-big-display-96ct' },
                { img: 'assets/products/Product/noveltiesScroll/TECHNO BBQ LIGHTERS  12CT_BOX (2).png', label: 'Techno BBQ Lighter (AK-47)', link: 'pages/product.html?id=novelties-lighters-techno-bbq-lighters-12ct-box-variant-2' },
            ],
            tiles: [
                { img: 'assets/categories/novelties/misc/air-fresheners-200-and-300ml.png', label: 'Air Fresheners', link: 'pages/product.html?id=novelties-misc-air-fresheners-200-and-300ml' },
                { img: 'assets/categories/novelties/misc/4-sided-jewelry-display.png', label: 'Jewelry', link: 'pages/product.html?id=novelties-misc-4-sided-jewelry-display' },
                { img: 'assets/categories/novelties/misc/keychain-display-300ct.png', label: 'Keychains', link: 'pages/product.html?id=novelties-misc-keychain-display-300ct' },
                { img: 'assets/categories/novelties/misc/knives-big-display-96ct.png', label: 'Knives', link: 'pages/product.html?id=novelties-misc-knives-big-display-96ct' },
            ],
        },
    };

    window.EDG = {
        BASE: BASE,
        ICONS: ICONS,
        CAT_COPY: CAT_COPY,
        CAT_IMAGES: CAT_IMAGES,
        CAT_HERO: CAT_HERO,
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
        getFlavorVariants: getFlavorVariants,
        findProductByImagePath: findProductByImagePath,
        generateDescription: generateDescription,
        generateFeatures: generateFeatures,
        renderProductCard: renderProductCard,
        renderProductCardFull: renderProductCardFull,
        renderProductGrid: renderProductGrid,
        wireReveal: wireReveal,
        wireWhatsapp: wireWhatsapp,
        qs: qs,
    };
})();
