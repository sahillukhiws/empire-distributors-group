/* ============================================
   MAIN - home page rendering
   Uses window.EDG from catalog.js for shared logic.
   ============================================ */
(function () {
    const { loadData, ICONS, renderProductCard, wireReveal, wireWhatsapp, escapeHtml } = window.EDG;
    const BASE = window.EDG.BASE;

    function renderCategories(data) {
        const el = document.getElementById('cat-grid');
        if (!el) return;
        el.innerHTML = data.categories.map(c => {
            const count = data.products.filter(p => p.category === c.id).length;
            const style = `--c: var(--c-${c.id}); --c-lt: var(--c-${c.id}-lt);`;
            return `
                <a class="cat-card reveal" style="${style}" href="${BASE}pages/category.html?id=${c.id}">
                    <div class="cat-card__icon">${ICONS[c.id] || ''}</div>
                    <div class="cat-card__body">
                        <div class="cat-card__name">${c.name}</div>
                        <div class="cat-card__count">${count} products</div>
                    </div>
                    <div class="cat-card__arrow" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    </div>
                </a>
            `;
        }).join('');
    }

    function renderCatNav(data) {
        const el = document.getElementById('cat-nav-list');
        if (!el) return;
        el.innerHTML = `
            ${data.categories.map(c => `
                <a class="cat-nav__item" style="--c: var(--c-${c.id}); --c-lt: var(--c-${c.id}-lt);" href="${BASE}pages/category.html?id=${c.id}">${escapeHtml(c.name)}</a>
            `).join('')}
            <a class="cat-nav__item" href="${BASE}pages/brands.html">Brands</a>
            <a class="cat-nav__item" href="${BASE}pages/about.html">About</a>
            <a class="cat-nav__item" href="${BASE}pages/contact.html">Contact</a>
        `;
    }

    function renderFeatured(data) {
        const el = document.getElementById('featured-grid');
        if (!el) return;
        const featured = data.products.filter(p => p.featured).slice(0, 8);
        el.innerHTML = featured.map(p => renderProductCard(p, data)).join('');
    }

    function renderMarquee(data) {
        const el = document.getElementById('marquee-track');
        if (!el) return;
        const brands = data.companies.map(c => c.name);
        const items = [...brands, ...brands].map(b => `<div class="marquee__item">${escapeHtml(b)}</div>`).join('');
        el.innerHTML = items;
    }

    loadData().then(data => {
        renderCatNav(data);
        renderCategories(data);
        renderFeatured(data);
        renderMarquee(data);
        wireWhatsapp();
        wireReveal();
    }).catch(err => console.error('Failed to load data:', err));
})();
