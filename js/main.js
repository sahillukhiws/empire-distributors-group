/* ============================================
   MAIN - home page rendering + scroll reveal
   ============================================ */
(function () {
    const WA_NUMBER = '14703753936';

    function waLink(text) {
        const msg = encodeURIComponent(text || 'Hi, I would like to inquire about your products.');
        return `https://wa.me/${WA_NUMBER}?text=${msg}`;
    }

    // ---------- SVG icons for categories (replaces emojis) ----------
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

    // ---------- Category grid ----------
    function renderCategories(data) {
        const el = document.getElementById('cat-grid');
        if (!el) return;
        el.innerHTML = data.categories.map(c => {
            const count = data.products.filter(p => p.category === c.id).length;
            const style = `--c: var(--c-${c.id}); --c-lt: var(--c-${c.id}-lt);`;
            return `
                <a class="cat-card reveal" style="${style}" href="pages/category.html?id=${c.id}">
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

    // ---------- Category nav (pill bar) ----------
    function renderCatNav(data) {
        const el = document.getElementById('cat-nav-list');
        if (!el) return;
        el.innerHTML = `
            <a class="cat-nav__item active" href="index.html">All</a>
            ${data.categories.map(c => `
                <a class="cat-nav__item" style="--c: var(--c-${c.id}); --c-lt: var(--c-${c.id}-lt);" href="pages/category.html?id=${c.id}">${c.name}</a>
            `).join('')}
        `;
    }

    // ---------- Featured products ----------
    function renderFeatured(data) {
        const el = document.getElementById('featured-grid');
        if (!el) return;
        const featured = data.products.filter(p => p.featured).slice(0, 8);
        el.innerHTML = featured.map(p => renderProductCard(p, data)).join('');
    }

    // ---------- Product card ----------
    function renderProductCard(p, data) {
        const company = data.companies.find(c => c.id === p.company);
        const category = data.categories.find(c => c.id === p.category);
        const brandName = company ? company.name : '';
        const catName = category ? category.name : '';
        const msg = `Inquiry: ${p.name} (${p.sku})`;

        const style = `--c: var(--c-${p.category}); --c-lt: var(--c-${p.category}-lt);`;
        return `
            <article class="prod-card reveal" style="${style}">
                <div class="prod-card__media">
                    <span class="prod-card__chip">${escapeHtml(catName)}</span>
                    <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.closest('.prod-card__media').classList.add('no-img')">
                </div>
                <div class="prod-card__body">
                    <div class="prod-card__brand">${escapeHtml(brandName)}</div>
                    <h3 class="prod-card__name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h3>
                    <a class="prod-card__cta" href="${waLink(msg)}" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 20.9l5-1.3a7.9 7.9 0 0 0 11.9-6.8 7.8 7.8 0 0 0-2.3-5.5zM12 18.5a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.9.8.8-2.9-.2-.3a6.6 6.6 0 1 1 5.9 3.4zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.4.1-.5.7-.6.8-.2.1-.4 0a5.4 5.4 0 0 1-2.7-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2-.1-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.3a.7.7 0 0 0-.5.2 2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8 8 8 0 0 0 3.1 2.7c1.9.8 1.9.5 2.2.5s1.1-.4 1.2-.9.2-.8.1-.9-.2-.1-.4-.2z"/></svg>
                        Inquire on WhatsApp
                    </a>
                </div>
            </article>
        `;
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // ---------- Brand marquee ----------
    function renderMarquee(data) {
        const el = document.getElementById('marquee-track');
        if (!el) return;
        const brands = data.companies.map(c => c.name);
        const items = [...brands, ...brands].map(b => `<div class="marquee__item">${escapeHtml(b)}</div>`).join('');
        el.innerHTML = items;
    }

    // ---------- WhatsApp links ----------
    function wireWhatsapp() {
        document.querySelectorAll('[data-wa]').forEach(el => {
            el.href = waLink(el.dataset.wa);
            el.target = '_blank';
            el.rel = 'noopener';
        });
    }

    // ---------- Scroll reveal (subtle) ----------
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
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });
    }

    // ---------- Load ----------
    fetch('data/products.json')
        .then(r => r.json())
        .then(data => {
            renderCatNav(data);
            renderCategories(data);
            renderFeatured(data);
            renderMarquee(data);
            wireWhatsapp();
            wireReveal();
        })
        .catch(err => console.error('Failed to load data:', err));
})();
