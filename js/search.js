/* ============================================
   SMART SEARCH - live suggestions with fuzzy matching
   Matches across product name, SKU, company, category, tags
   ============================================ */
(function () {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const clearBtn = document.getElementById('search-clear');
    if (!input || !results) return;

    const inPages = /\/pages\//.test(window.location.pathname);
    const BASE = inPages ? '../' : '';
    const ICONS = (window.EDG && window.EDG.ICONS) || {};

    let data = null;
    let activeIndex = -1;
    let currentItems = [];

    // ---------- Fuzzy scoring ----------
    // Lightweight subsequence + token match scoring.
    // Higher score = better match. 0 = no match.
    function score(query, target) {
        if (!target) return 0;
        const q = query.toLowerCase().trim();
        const t = target.toLowerCase();
        if (!q) return 0;
        // Exact match
        if (t === q) return 1000;
        // Prefix match
        if (t.startsWith(q)) return 500 - (t.length - q.length);
        // Token starts-with (e.g. "geek" in "GeekVape Aegis")
        const tokens = t.split(/\s+/);
        for (const tok of tokens) {
            if (tok.startsWith(q)) return 400;
        }
        // Contains
        if (t.includes(q)) return 250;
        // Subsequence fuzzy (e.g. "gvx" matches "geekvape aegis x")
        let i = 0, j = 0, gaps = 0;
        while (i < q.length && j < t.length) {
            if (q[i] === t[j]) { i++; }
            else { gaps++; }
            j++;
        }
        if (i === q.length) return Math.max(0, 120 - gaps);
        return 0;
    }

    function scoreProduct(query, product, companyName, categoryName) {
        const name = score(query, product.name) * 3;
        const sku = score(query, product.sku) * 2;
        const comp = score(query, companyName) * 2;
        const cat = score(query, categoryName) * 1.5;
        const tags = (product.tags || []).reduce((acc, tag) => Math.max(acc, score(query, tag)), 0);
        const desc = score(query, product.description) * 0.5;
        return name + sku + comp + cat + tags + desc;
    }

    // ---------- Rendering ----------
    function highlight(text, query) {
        if (!query) return escapeHtml(text);
        const esc = escapeHtml(text);
        const q = escapeRegExp(query.trim());
        if (!q) return esc;
        return esc.replace(new RegExp(`(${q})`, 'ig'), '<mark>$1</mark>');
    }
    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function render(query, matches) {
        if (!query) { hideResults(); return; }
        if (matches.length === 0) {
            results.innerHTML = `<div class="search__empty">No matches for "<strong>${escapeHtml(query)}</strong>"</div>`;
            showResults();
            currentItems = [];
            return;
        }

        // Group: top products, then companies, then categories
        const productMatches = matches.slice(0, 6);

        const companyNames = new Set();
        data.companies.forEach(c => {
            if (score(query, c.name) > 0) companyNames.add(c.id);
        });
        const companyList = [...companyNames].slice(0, 4).map(id => data.companies.find(c => c.id === id));

        const catMatches = data.categories.filter(c => score(query, c.name) > 0).slice(0, 4);

        let html = '';

        if (productMatches.length) {
            html += '<div class="search__group"><div class="search__group-title">Products</div>';
            productMatches.forEach((p, i) => {
                const company = data.companies.find(c => c.id === p.company);
                html += `
                    <a class="search__item" data-idx="${i}" href="${BASE}pages/product.html?id=${encodeURIComponent(p.id)}">
                        <img class="search__item-img" src="${p.image}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
                        <div class="search__item-text">
                            <div class="search__item-name">${highlight(p.name, query)}</div>
                            <div class="search__item-meta">${company ? company.name : ''}</div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }

        if (companyList.length) {
            html += '<div class="search__group"><div class="search__group-title">Brands</div>';
            companyList.forEach(c => {
                html += `
                    <a class="search__item" href="${BASE}pages/brands.html#${c.id}">
                        <div class="search__item-img" style="display:grid;place-items:center;font-weight:700;color:var(--empire-teal);">${escapeHtml(c.name[0])}</div>
                        <div class="search__item-text">
                            <div class="search__item-name">${highlight(c.name, query)}</div>
                            <div class="search__item-meta">Brand</div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }

        if (catMatches.length) {
            html += '<div class="search__group"><div class="search__group-title">Categories</div>';
            catMatches.forEach(c => {
                html += `
                    <a class="search__item" href="${BASE}pages/category.html?id=${c.id}">
                        <div class="search__item-img" style="display:grid;place-items:center;color:var(--c-${c.id},var(--empire-teal));">${ICONS[c.id] || ''}</div>
                        <div class="search__item-text">
                            <div class="search__item-name">${highlight(c.name, query)}</div>
                            <div class="search__item-meta">Category</div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }

        results.innerHTML = html;
        currentItems = [...results.querySelectorAll('.search__item')];
        activeIndex = -1;
        showResults();
    }

    function showResults() { results.classList.add('visible'); }
    function hideResults() { results.classList.remove('visible'); activeIndex = -1; }

    // ---------- Core search ----------
    function runSearch(query) {
        if (!data) return;
        query = query.trim();
        clearBtn.classList.toggle('visible', query.length > 0);
        if (!query) { hideResults(); return; }

        const scored = data.products
            .map(p => {
                const company = data.companies.find(c => c.id === p.company);
                const cat = data.categories.find(c => c.id === p.category);
                return { product: p, score: scoreProduct(query, p, company ? company.name : '', cat ? cat.name : '') };
            })
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(s => s.product);

        render(query, scored);
    }

    // ---------- Keyboard nav ----------
    function setActive(idx) {
        if (!currentItems.length) return;
        activeIndex = (idx + currentItems.length) % currentItems.length;
        currentItems.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
        currentItems[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', (e) => runSearch(e.target.value));
    input.addEventListener('focus', () => { if (input.value) runSearch(input.value); });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
        else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            currentItems[activeIndex].click();
        } else if (e.key === 'Escape') { hideResults(); input.blur(); }
    });

    clearBtn.addEventListener('click', () => { input.value = ''; hideResults(); clearBtn.classList.remove('visible'); input.focus(); });

    document.addEventListener('click', (e) => {
        if (!results.contains(e.target) && e.target !== input) hideResults();
    });

    // ---------- Load data (via shared catalog loader) ----------
    if (window.EDG && window.EDG.loadData) {
        window.EDG.loadData()
            .then(json => { data = json; })
            .catch(err => console.error('Search data load failed:', err));
    } else {
        const inPages = /\/pages\//.test(window.location.pathname);
        const BASE = inPages ? '../' : '';
        fetch(BASE + 'data/products.json')
            .then(r => r.json())
            .then(json => { data = json; })
            .catch(err => console.error('Search data load failed:', err));
    }
})();
