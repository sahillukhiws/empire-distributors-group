/* ============================================
   MAIN - home page rendering
   ============================================ */
(function () {
    var EDG = window.EDG;
    var BASE = EDG.BASE;

    /* Nav bar links */
    function renderNavBar(data) {
        var el = document.getElementById('nav-bar-list');
        if (!el) return;
        el.innerHTML =
            data.categories.filter(function (c) {
                return data.products.some(function (p) { return p.category === c.id; });
            }).map(function (c) {
                return '<a class="nav-link" href="' + BASE + 'pages/category.html?id=' + c.id + '">' + EDG.escapeHtml(c.name) + '</a>';
            }).join('') +
            '<a class="nav-link" href="' + BASE + 'pages/brands.html">Brands</a>' +
            '<a class="nav-link" href="' + BASE + 'pages/about.html">About</a>' +
            '<a class="nav-link" href="' + BASE + 'pages/contact.html">Contact</a>';
    }

    /* Category scroll cards */
    function renderCategoryRow(data) {
        var el = document.getElementById('cat-row');
        if (!el) return;
        el.innerHTML = data.categories.map(function (c) {
            var count = data.products.filter(function (p) { return p.category === c.id; }).length;
            if (!count) return '';
            var imgSrc = BASE + (EDG.CAT_IMAGES[c.id] || '');
            return '<a class="cat-card-v2" style="--c:var(--c-' + c.id + ')" href="' + BASE + 'pages/category.html?id=' + c.id + '">' +
                '<div class="cat-card-v2__bg"></div>' +
                '<div class="cat-card-v2__img"><img src="' + imgSrc + '" alt="' + EDG.escapeHtml(c.name) + '" loading="lazy"></div>' +
                '<div class="cat-card-v2__name">' + EDG.escapeHtml(c.name) + '</div>' +
            '</a>';
        }).join('');
    }

    /* Popular items */
    function renderPopular(data) {
        var el = document.getElementById('popular-grid');
        if (!el) return;
        var items = data.products.filter(function (p) { return p.featured; }).slice(0, 12);
        el.innerHTML = items.map(function (p) { return EDG.renderProductCard(p, data); }).join('');
    }

    /* New products */
    function renderNew(data) {
        var el = document.getElementById('new-grid');
        if (!el) return;
        var items = [];
        data.categories.forEach(function (c) {
            var catP = data.products.filter(function (p) { return p.category === c.id; });
            items = items.concat(catP.slice(-2));
        });
        el.innerHTML = items.slice(0, 12).map(function (p) { return EDG.renderProductCard(p, data); }).join('');
    }

    /* Trending */
    function renderTrending(data) {
        var el = document.getElementById('trending-grid');
        if (!el) return;
        var cats = ['vape', 'kratom', 'delta', 'mushroom', 'pseudo'];
        var items = [];
        cats.forEach(function (catId) {
            var catP = data.products.filter(function (p) { return p.category === catId; });
            var mid = Math.floor(catP.length / 2);
            items = items.concat(catP.slice(mid, mid + 2));
        });
        el.innerHTML = items.slice(0, 12).map(function (p) { return EDG.renderProductCard(p, data); }).join('');
    }

    /* Category showcase */
    function renderShowcase(data) {
        var el = document.getElementById('showcase-grid');
        if (!el) return;
        var items = [];
        data.categories.forEach(function (c) {
            var catP = data.products.filter(function (p) { return p.category === c.id; });
            if (catP.length) items.push(catP[Math.floor(catP.length / 3)]);
        });
        el.innerHTML = items.slice(0, 8).map(function (p) { return EDG.renderProductCard(p, data); }).join('');
    }

    /* Brands marquee */
    function renderBrands(data) {
        var el = document.getElementById('brands-bar-track');
        if (!el) return;
        var names = data.companies.map(function (c) { return c.name; });
        var doubled = names.concat(names);
        el.innerHTML = doubled.map(function (n) {
            return '<div class="brands-bar__item">' + EDG.escapeHtml(n) + '</div>';
        }).join('');
    }

    /* ---------- Hero Slider ---------- */
    function initHeroSlider() {
        var track = document.getElementById('hero-slider-track');
        var dotsContainer = document.getElementById('hero-slider-dots');
        if (!track || !dotsContainer) return;

        var slides = track.querySelectorAll('.hero-slider__slide');
        var total = slides.length;
        if (total < 2) return;

        var current = 0;
        var interval = null;
        var DELAY = 4000;

        /* Build dots */
        dotsContainer.innerHTML = '';
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'hero-slider__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.dataset.idx = i;
            dotsContainer.appendChild(dot);
        }
        var dots = dotsContainer.querySelectorAll('.hero-slider__dot');

        function goTo(idx) {
            current = ((idx % total) + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function (d, j) {
                d.classList.toggle('active', j === current);
            });
        }

        function next() { goTo(current + 1); }

        function startAuto() {
            stopAuto();
            interval = setInterval(next, DELAY);
        }

        function stopAuto() {
            if (interval) { clearInterval(interval); interval = null; }
        }

        /* Dot clicks */
        dotsContainer.addEventListener('click', function (e) {
            var dot = e.target.closest('.hero-slider__dot');
            if (!dot) return;
            goTo(parseInt(dot.dataset.idx, 10));
            startAuto();
        });

        /* Pause on hover */
        var slider = document.getElementById('hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopAuto);
            slider.addEventListener('mouseleave', startAuto);
        }

        /* Touch swipe support */
        var startX = 0;
        var dragging = false;
        track.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            dragging = true;
            stopAuto();
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (!dragging) return;
            dragging = false;
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) next();
                else goTo(current - 1);
            }
            startAuto();
        }, { passive: true });

        startAuto();
    }

    /* Init */
    EDG.loadData().then(function (data) {
        renderNavBar(data);
        renderCategoryRow(data);
        renderPopular(data);
        renderNew(data);
        renderTrending(data);
        renderShowcase(data);
        renderBrands(data);
        EDG.wireWhatsapp();
        EDG.wireReveal();
        initHeroSlider();
    }).catch(function (err) {
        console.error('Failed to load data:', err);
    });
})();
