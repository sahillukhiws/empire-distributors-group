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

    /* Detect flavor variants for a product.
       Groups products by company + base name (name without flavor).
       Detects flavors in parentheses OR using flavor word list.
       Returns array of variant objects with id, name, flavor, and isActive flag. */
    function getFlavorVariants(data, product) {
        if (!product || !product.name) return [];

        var productName = String(product.name);

        // Sort flavor words by length (longest first) to match compound flavors
        var sortedFlavorWords = FLAVOR_VARIANT_WORDS.slice().sort(function(a, b) {
            return b.length - a.length;
        });

        // First, try to extract flavor from parentheses
        var flavorMatch = productName.match(/\(([^)]+)\)$/);
        var baseName, flavor;

        if (flavorMatch) {
            // Has parentheses - use existing logic
            baseName = productName.replace(/\s*\([^)]+\)\s*$/g, '').trim();
            flavor = flavorMatch[1].trim();
        } else {
            // No parentheses - try to detect flavor word at the end
            var detectedFlavor = '';
            var detectedBaseName = productName;

            // Check if any flavor word matches at the end of the name
            for (var i = 0; i < sortedFlavorWords.length; i++) {
                var flavorWord = sortedFlavorWords[i];
                if (productName.endsWith(' ' + flavorWord) || productName === flavorWord) {
                    detectedFlavor = flavorWord;
                    detectedBaseName = productName.substring(0, productName.lastIndexOf(flavorWord)).trim();
                    break;
                }
            }

            // Only use detected flavor if we found one and it's not the whole name
            if (detectedFlavor && detectedBaseName) {
                baseName = detectedBaseName.trim();
                flavor = detectedFlavor;
            } else {
                // No flavor detected - treat as single product
                return [];
            }
        }

        if (!baseName) return [];

        // Find all products with same company, category, and base name
        var variants = data.products.filter(function (p) {
            if (p.company !== product.company || p.category !== product.category) return false;
            var pName = String(p.name || '');

            // Check if this product matches our base name pattern
            var pBaseName, pFlavor;
            var pFlavorMatch = pName.match(/\(([^)]+)\)$/);

            if (pFlavorMatch) {
                pBaseName = pName.replace(/\s*\([^)]+\)\s*$/g, '').trim();
                pFlavor = pFlavorMatch[1].trim();
            } else {
                // Try to detect flavor word at the end using sorted flavor words
                var pDetectedFlavor = '';
                var pDetectedBaseName = pName;

                // Reuse the same sorted flavor words for consistency
                for (var j = 0; j < sortedFlavorWords.length; j++) {
                    var pFlavorWord = sortedFlavorWords[j];
                    if (pName.endsWith(' ' + pFlavorWord) || pName === pFlavorWord) {
                        pDetectedFlavor = pFlavorWord;
                        pDetectedBaseName = pName.substring(0, pName.lastIndexOf(pFlavorWord)).trim();
                        break;
                    }
                }

                if (pDetectedFlavor && pDetectedBaseName) {
                    pBaseName = pDetectedBaseName.trim();
                    pFlavor = pDetectedFlavor;
                } else {
                    pBaseName = pName;
                    pFlavor = '';
                }
            }

            return pBaseName === baseName;
        });

        // If only 1 variant (current product), return empty array
        if (variants.length <= 1) {
            return [];
        }

        // Extract flavor from each variant and build result
        return variants.map(function (p) {
            var pName = String(p.name || '');
            var pFlavorMatch = pName.match(/\(([^)]+)\)$/);
            var pFlavor = pFlavorMatch ? pFlavorMatch[1].trim() : '';

            // If no parentheses, detect from flavor words using sorted list
            if (!pFlavor) {
                for (var k = 0; k < sortedFlavorWords.length; k++) {
                    var flavorWord = sortedFlavorWords[k];
                    if (pName.endsWith(' ' + flavorWord) || pName === flavorWord) {
                        pFlavor = flavorWord;
                        break;
                    }
                }
            }

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
                { img: 'assets/products/Product/vapeScroll/ChatGPT Image Apr 18, 2026, 12_41_01 AM.png', label: 'Top Devices' },
                { img: 'assets/products/Product/vapeScroll/ChatGPT Image Apr 18, 2026, 12_42_42 AM.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/vapeScroll/ChatGPT Image Apr 18, 2026, 12_44_30 AM.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/vapeScroll/ChatGPT Image Apr 17, 2026, 09_13_47 PM.png', label: 'Premium Vapes' },
                { img: 'assets/products/Product/vapeScroll/ChatGPT Image Apr 18, 2026, 12_48_10 AM.png', label: 'Vape Collection' },
            ],
            tiles: [
                { img: 'assets/categories/vape/vapes-new/geekbar-pulse-collection-3colors.png', label: 'GeekBar', link: '' },
                { img: '/assets/categories/vape/vapes-new/raz-ltx-25k-boost-mode-animated.gif', label: 'Raz ITX', link: '' },
                { img: 'assets/categories/vape/vapes-new/geekbar-pulse-x-3d-curved-screen.jpg', label: 'GeekBar Plus', link: '' },
                { img: 'assets/categories/vape/vapes-new/foger-switch-pro-pod-watermelon-ice.jpg', label: 'More Vapes', link: '' },
            ],
        },
        kratom: {
            slides: [
                { img: 'assets/products/Product/karatomScroll/ChatGPT Image Apr 18, 2026, 04_27_19 PM.png', label: 'Top Kratom' },
                { img: 'assets/products/Product/karatomScroll/ChatGPT Image Apr 18, 2026, 04_28_43 PM.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/karatomScroll/ChatGPT Image Apr 18, 2026, 04_32_08 PM.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/karatomScroll/ChatGPT Image Apr 18, 2026, 04_33_23 PM.png', label: 'Premium Kratom' },
                { img: 'assets/products/Product/karatomScroll/ChatGPT Image Apr 18, 2026, 04_35_09 PM.png', label: 'Kratom Collection' },
                { img: 'assets/products/Product/karatomScroll/Gemini_Generated_Image_basgmsbasgmsbasg.png', label: 'Featured Kratom' },
                { img: 'assets/products/Product/karatomScroll/karatom.png', label: 'Kratom Collection' },
            ],
            tiles: [
                { img: 'assets/categories/kratom/featured/opms-black.png', label: 'OPMS', link: '' },
                { img: 'assets/categories/kratom/featured/kshot-black.jpg', label: 'K-Shot', link: '' },
                { img: 'assets/categories/kratom/featured/mystic-lab-kratom-gummies.jpg', label: 'Mystic Lab', link: '' },
                { img: 'assets/categories/kratom/featured/opms-black.jpg', label: 'More Kratom', link: '' },
            ],
        },
        delta: {
            slides: [
                { img: 'assets/products/Product/daltaScroll/ChatGPT Image Apr 19, 2026, 02_15_20 PM.png', label: 'Top Delta' },
                { img: 'assets/products/Product/daltaScroll/ChatGPT Image Apr 19, 2026, 02_22_53 PM.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/daltaScroll/ChatGPT Image Apr 19, 2026, 02_23_53 PM.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/daltaScroll/ChatGPT Image Apr 19, 2026, 02_27_32 PM.png', label: 'Premium Delta' },
                { img: 'assets/products/Product/daltaScroll/Gemini_Generated_Image_10jmga10jmga10jm.png', label: 'Featured Delta' },
                { img: 'assets/products/Product/daltaScroll/delta.png', label: 'Delta Collection' },
            ],
            tiles: [
                { img: 'assets/categories/delta/1-delta-8-9-gummies/ml-product-photo-12ct-gummies.png', label: 'Delta Gummies', link: '' },
                { img: 'assets/categories/delta/rock-on/img-20250411-wa0077.png', label: 'THC-P Pre-Rolls', link: '' },
                { img: 'assets/categories/delta/rock-on/img-20250411-wa0103.png', label: 'Live Resin Disposables', link: '' },
                { img: 'assets/categories/delta/rock-on/img-20250411-wa0088.png', label: 'Live Resin Dabs', link: '' },
            ],
        },
        mushroom: {
            slides: [
                { img: 'assets/products/Product/mashroomScroll/ChatGPT Image Apr 19, 2026, 02_29_14 PM.png', label: 'Top Mushroom' },
                { img: 'assets/products/Product/mashroomScroll/ChatGPT Image Apr 19, 2026, 02_34_36 PM.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/mashroomScroll/ChatGPT Image Apr 19, 2026, 02_36_03 PM.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/mashroomScroll/ChatGPT Image Apr 19, 2026, 02_36_19 PM.png', label: 'Premium Mushroom' },
                { img: 'assets/products/Product/mashroomScroll/ChatGPT Image Apr 19, 2026, 02_38_51 PM.png', label: 'Featured Mushroom' },
                { img: 'assets/products/Product/mashroomScroll/mashroom.png', label: 'Mushroom Collection' },
            ],
            tiles: [
                { img: 'assets/categories/mushroom/shroom-puff/shroom-puff-2ct-pre-roll.png', label: 'Shroom Puff Pre-Roll', link: '' },
                { img: 'assets/categories/mushroom/shroom-puff/shroom-puff-blaster.jpg', label: 'Blaster Disposable', link: '' },
                { img: 'assets/categories/mushroom/silly-dots/silly-dots-mega-dose-blue-razz.jpg', label: 'Silly Dots Gummies', link: '' },
                { img: 'assets/categories/mushroom/shroom-puff/shroom-pugg-gummies.jpg', label: 'Shroom Puff Gummies', link: '' },
            ],
        },
        pseudo: {
            slides: [
                { img: 'assets/products/Product/pseudoScroll/ChatGPT Image Apr 19, 2026, 02_53_21 PM.png', label: 'Top Pseudo' },
                { img: 'assets/products/Product/pseudoScroll/ChatGPT Image Apr 19, 2026, 02_57_32 PM.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/pseudoScroll/ChatGPT Image Apr 19, 2026, 03_00_14 PM.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/pseudoScroll/ChatGPT Image Apr 19, 2026, 03_03_36 PM.png', label: 'Premium Pseudo' },
                { img: 'assets/products/Product/pseudoScroll/ChatGPT Image Apr 19, 2026, 03_08_21 PM.png', label: 'Featured Pseudo' },
                { img: 'assets/products/Product/pseudoScroll/psuedo.png', label: 'Pseudo Collection' },
            ],
            tiles: [
                { img: 'assets/categories/pseudo/ultra-ohmz/ultraohmzpseudomega-capsules-box-mockup-bluerazz-011426.png', label: 'Ultra Ohmz', link: '' },
                { img: 'assets/categories/pseudo/gushers/gusherz-pseudo-10ct-jar-blueberry-blast.png', label: 'Gusherz', link: '' },
                { img: 'assets/categories/pseudo/lucid-50mg/photoroom-20260325-155055.png', label: 'Lucid 50mg', link: '' },
                { img: 'assets/categories/pseudo/gushers/gusherz-pseudo-10ct-jar-watermelon-gushers.png', label: 'Watermelon Gusherz', link: '' },
            ],
        },
        bluelotus: {
            slides: [
                { img: 'assets/products/Product/bluelotusScroll/ChatGPT Image Apr 19, 2026, 03_21_20 PM.png', label: 'Top Blue Lotus' },
                { img: 'assets/products/Product/bluelotusScroll/ChatGPT Image Apr 19, 2026, 03_31_38 PM.png', label: 'Premium Blue Lotus' },
                { img: 'assets/products/Product/bluelotusScroll/bluelotus.png', label: 'Blue Lotus Collection' },
            ],
            tiles: [
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-1grm-cartridges-purple-dragon.png', label: 'Cartridges', link: '' },
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-4grm-disposable-pink-champagne.png', label: 'Disposables', link: '' },
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-2ct-preroll-1-5grm-each-purple-dragon.png', label: 'Pre-Rolls', link: '' },
                { img: 'assets/categories/bluelotus/featured/mental-health-blue-lotus-4grm-disposable-strawberry-splash.png', label: 'Strawberry Splash', link: '' },
            ],
        },
        supplements: {
            slides: [
                { img: 'assets/products/Product/supplimentsScroll/ChatGPT Image Apr 19, 2026, 03_34_50 PM.png', label: 'Top Supplements' },
                { img: 'assets/products/Product/supplimentsScroll/ChatGPT Image Apr 19, 2026, 03_37_04 PM.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/supplimentsScroll/ChatGPT Image Apr 19, 2026, 03_41_07 PM.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/supplimentsScroll/ChatGPT Image Apr 19, 2026, 03_58_00 PM.png', label: 'Premium Supplements' },
                { img: 'assets/products/Product/supplimentsScroll/Gemini_Generated_Image_y8vjlpy8vjlpy8vj.png', label: 'Featured Supplements' },
                { img: 'assets/products/Product/supplimentsScroll/supliments.png', label: 'Supplements Collection' },
            ],
            tiles: [
                { img: 'assets/categories/supplements/better-now/betternow-capsules-mockup-box-watermelon-020926.png', label: 'Better Now', link: '' },
                { img: 'assets/categories/supplements/strike-kava-shot/strike-kava-shot-strawberry.jpg', label: 'Strike Kava', link: '' },
                { img: 'assets/categories/supplements/kanna-kava/kanna-kava-relaxing-tonic.jpg', label: 'Kanna Kava', link: '' },
                { img: 'assets/categories/supplements/zen-power-shot/img-7056.png', label: 'Zen Power Shot', link: '' },
            ],
        },
        novelties: {
            slides: [
                { img: 'assets/products/Product/noveltiesScroll/ChatGPT Image Apr 19, 2026, 04_03_10 PM.png', label: 'Top Novelties' },
                { img: 'assets/products/Product/noveltiesScroll/Gemini_Generated_Image_6gynyq6gynyq6gyn.png', label: 'Best Sellers' },
                { img: 'assets/products/Product/noveltiesScroll/Gemini_Generated_Image_70y3ug70y3ug70y3.png', label: 'New Arrivals' },
                { img: 'assets/products/Product/noveltiesScroll/Gemini_Generated_Image_88pzra88pzra88pz (2).png', label: 'Premium Novelties' },
                { img: 'assets/products/Product/noveltiesScroll/Gemini_Generated_Image_cx62w8cx62w8cx62.png', label: 'Featured Novelties' },
                { img: 'assets/products/Product/noveltiesScroll/Gemini_Generated_Image_kp56mgkp56mgkp56-ezremove.png', label: 'Novelties Collection' },
                { img: 'assets/products/Product/noveltiesScroll/Gemini_Generated_Image_mfgdnqmfgdnqmfgd (1).png', label: 'More Novelties' },
            ],
            tiles: [
                { img: 'assets/categories/novelties/misc/azza-air-fresheners-200-300ml.jpg', label: 'Air Fresheners', link: '' },
                { img: 'assets/categories/novelties/misc/jewelry-display-crystals-roses.jpg', label: 'Jewelry', link: '' },
                { img: 'assets/categories/novelties/misc/car-logo-keychains.jpg', label: 'Keychains', link: '' },
                { img: 'assets/categories/novelties/misc/tactical-stoneman-knife-display.jpg', label: 'Knives', link: '' },
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
