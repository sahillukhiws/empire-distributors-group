/* ============================================
   CATALOG - shared data loader + product rendering
   Used by home, category, product, brands, search pages.
   ============================================ */
(function () {
    // Detect if we're in a subfolder (pages/*.html) and set BASE accordingly
    const inPages = /\/pages\//.test(window.location.pathname);
    const BASE = inPages ? '../' : '';

    const WA_NUMBER = '14703753936';

    // ---------- Category icons ----------
    const ICONS = {
        vape:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h10v-2H4a2 2 0 0 0 0 4h12l4-3v8l-4-3H4a2 2 0 0 1 0-4z"/><path d="M18 8v2"/><path d="M14 6v4"/></svg>',
        kratom:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-10 7-10s7 5 7 10a7 7 0 0 1-7 7z"/><path d="M11 3v17"/></svg>',
        delta:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L21 20 L3 20 Z"/></svg>',
        mushroom:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 16 0c0 1-.5 2-2 2H6c-1.5 0-2-1-2-2z"/><path d="M9 14v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6"/></svg>',
        pseudo:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        bluelotus:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c2 3 2 6 0 9-2-3-2-6 0-9z"/><path d="M6 9c3 1 5 3 6 6-3-1-5-3-6-6z"/><path d="M18 9c-3 1-5 3-6 6 3-1 5-3 6-6z"/><path d="M4 17h16"/></svg>',
        supplements: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="10" rx="5"/><path d="M12 8v10"/></svg>',
        novelties:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13"/><path d="M19 12H5"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 1 1 0 5"/></svg>',
    };

    // ---------- Marketing copy per category ----------
    const CAT_COPY = {
        vape: {
            tagline: 'Next-level clouds. Premium devices.',
            description: 'Industry-leading vape devices, disposables, and accessories from the brands your customers demand. Curated, tested, always in stock.',
            bullets: ['Top-tier disposable brands', 'Flavor variety across every line', 'Fast wholesale fulfillment'],
        },
        kratom: {
            tagline: 'Premium kratom. Trusted sources.',
            description: 'High-quality kratom shots, powders, capsules, and extracts from the most trusted names in the industry. Lab-tested consistency your shelves can count on.',
            bullets: ['Shots, powders, capsules, extracts', 'Bliss Xtra, MIT 45, Kanva & more', 'Consistent lab-tested quality'],
        },
        delta: {
            tagline: 'Hemp-derived. Customer-approved.',
            description: 'Full lineup of Delta-8 and Delta-9 gummies, disposables, pre-rolls, and edibles from licensed producers. Compliance-first, shelf-ready.',
            bullets: ['Gummies, dabs, disposables, pre-rolls', 'Rock On, Dozo Donut & more', 'Farm-bill compliant'],
        },
        mushroom: {
            tagline: 'Functional. Fun. Flying off shelves.',
            description: 'The fastest-growing category in lifestyle retail. Mushroom gummies, disposables, and pre-rolls with proprietary blends designed to move.',
            bullets: ['Shroom Bang, Shroom Puff, Silly Dots', 'Gummies, disposables, pre-rolls', 'Breakout bestseller category'],
        },
        pseudo: {
            tagline: 'The new-gen lineup your retail needs.',
            description: 'Trending alt-category products engineered for modern retail. Bold flavors, strong branding, and the packaging that catches eyes at the counter.',
            bullets: ['Gusherz, Lucid, Ultra Ohmz', 'Flavor-forward SKUs', 'High-margin shelf movers'],
        },
        bluelotus: {
            tagline: 'Ancient botanical. Modern delivery.',
            description: 'Blue lotus cartridges, pre-rolls, and disposables from Mental Health and trusted wellness brands. A category on the rise.',
            bullets: ['Cartridges, pre-rolls, disposables', 'Multiple flavor profiles', 'Fast-growing wellness niche'],
        },
        supplements: {
            tagline: 'Wellness shots. Real results.',
            description: 'Kava shots, kanna blends, mood enhancers, and energy boosters from the wellness brands your customers search for. Impulse-buy ready.',
            bullets: ['Better Now, Zen Power, Strike Kava', 'Mood, focus, energy shots', 'Counter-ready packaging'],
        },
        novelties: {
            tagline: 'Lifestyle accessories. Point-of-sale gold.',
            description: 'Curated lifestyle and novelty products that turn browsers into buyers. Perfect for counter placement and impulse purchases.',
            bullets: ['Counter-ready novelty SKUs', 'Impulse-buy pricing', 'Fast rotation, fast margin'],
        },
    };

    // ---------- Data loading ----------
    let cachedData = null;
    function loadData() {
        if (cachedData) return Promise.resolve(cachedData);
        return fetch(BASE + 'data/products.json')
            .then(r => r.json())
            .then(data => {
                // Normalize image paths for current location
                data.products = data.products.map(p => ({
                    ...p,
                    image: BASE + p.image,
                }));
                cachedData = data;
                return data;
            });
    }

    // ---------- WhatsApp link ----------
    function waLink(text) {
        const msg = encodeURIComponent(text || 'Hi, I would like to inquire about your products.');
        return `https://wa.me/${WA_NUMBER}?text=${msg}`;
    }

    // ---------- Escape HTML ----------
    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // ---------- Find helpers ----------
    function findCategory(data, id) { return data.categories.find(c => c.id === id); }
    function findCompany(data, id)  { return data.companies.find(c => c.id === id); }
    function findProduct(data, id)  { return data.products.find(p => p.id === id); }

    function getProductsByCategory(data, catId) {
        return data.products.filter(p => p.category === catId);
    }
    function getProductsByCompany(data, companyId) {
        return data.products.filter(p => p.company === companyId);
    }
    function getBrandsInCategory(data, catId) {
        const ids = [...new Set(data.products.filter(p => p.category === catId).map(p => p.company))];
        return ids.map(id => findCompany(data, id)).filter(Boolean);
    }
    function getRelatedProducts(data, product, limit = 4) {
        const sameBrand = data.products.filter(p => p.company === product.company && p.id !== product.id);
        const sameCategory = data.products.filter(p => p.category === product.category && p.company !== product.company);
        return [...sameBrand, ...sameCategory].slice(0, limit);
    }

    // ---------- Product card HTML ----------
    function renderProductCard(p, data, opts = {}) {
        const company = findCompany(data, p.company);
        const category = findCategory(data, p.category);
        const brandName = company ? company.name : '';
        const catName = category ? category.name : '';
        const detailHref = BASE + 'pages/product.html?id=' + encodeURIComponent(p.id);
        const style = `--c: var(--c-${p.category}); --c-lt: var(--c-${p.category}-lt);`;
        const showChip = opts.showChip !== false;

        return `
            <article class="prod-card reveal" style="${style}">
                <a class="prod-card__media" href="${detailHref}" aria-label="${escapeHtml(p.name)}">
                    ${showChip ? `<span class="prod-card__chip">${escapeHtml(catName)}</span>` : ''}
                    <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.closest('.prod-card__media').classList.add('no-img')">
                </a>
                <div class="prod-card__body">
                    <div class="prod-card__brand">${escapeHtml(brandName)}</div>
                    <h3 class="prod-card__name"><a href="${detailHref}" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</a></h3>
                    <a class="prod-card__cta" href="${waLink('Inquiry: ' + p.name + ' (' + p.sku + ')')}" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5zM12 18.5a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.9.8.8-2.9-.2-.3a6.6 6.6 0 1 1 5.9 3.4zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.4.1-.5.7-.6.8-.2.1-.4 0a5.4 5.4 0 0 1-2.7-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2-.1-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8 8 8 0 0 0 3.1 2.7c1.9.8 1.9.5 2.2.5s1.1-.4 1.2-.9.2-.8.1-.9-.2-.1-.4-.2z"/></svg>
                        Inquire on WhatsApp
                    </a>
                </div>
            </article>
        `;
    }

    function renderProductGrid(products, data, container, opts = {}) {
        if (!container) return;
        if (!products.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                    </div>
                    <h3>No products yet</h3>
                    <p>${opts.emptyText || 'Check back soon - we\'re restocking this category.'}</p>
                    <a class="btn btn-primary" href="${BASE}index.html">Back to Home</a>
                </div>
            `;
            return;
        }
        container.innerHTML = products.map(p => renderProductCard(p, data, opts)).join('');
    }

    // ---------- Scroll reveal ----------
    function wireReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('in'), i * 40);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        requestAnimationFrame(() => {
            document.querySelectorAll('.reveal:not(.in)').forEach(el => observer.observe(el));
        });
    }

    // ---------- Wire WhatsApp buttons ----------
    function wireWhatsapp() {
        document.querySelectorAll('[data-wa]').forEach(el => {
            el.href = waLink(el.dataset.wa);
            el.target = '_blank';
            el.rel = 'noopener';
        });
    }

    // ---------- Get URL query parameter ----------
    function qs(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // ---------- Export ----------
    window.EDG = {
        BASE,
        ICONS,
        CAT_COPY,
        loadData,
        waLink,
        escapeHtml,
        findCategory,
        findCompany,
        findProduct,
        getProductsByCategory,
        getProductsByCompany,
        getBrandsInCategory,
        getRelatedProducts,
        renderProductCard,
        renderProductGrid,
        wireReveal,
        wireWhatsapp,
        qs,
    };
})();
