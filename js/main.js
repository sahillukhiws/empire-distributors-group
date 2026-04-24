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

    /* Best Sellers - 3 swiper-style carousel rows (one-by-one, auto-play, dots) */
    function renderBestSellers(data) {
        var rows = [
            { el: document.getElementById('bs-row-1'), company: 'ultra-ohmz', type: 'company' },
            { el: document.getElementById('bs-row-2'), company: 'mushroom', type: 'category' },
            { el: document.getElementById('bs-row-3'), company: 'gushers', type: 'company' },
        ];

        rows.forEach(function (row) {
            if (!row.el) return;
            var items;
            if (row.type === 'category') {
                items = data.products.filter(function (p) { return p.category === row.company; });
            } else {
                items = data.products.filter(function (p) { return p.company === row.company; });
            }
            if (!items.length) return;
            row.el.innerHTML = items.map(function (p) {
                return '<div class="bs-carousel__slide">' + EDG.renderProductCard(p, data) + '</div>';
            }).join('');
            initBsCarousel(row.el.closest('.bs-carousel'));
        });
    }

    function initBsCarousel(carousel) {
        if (!carousel) return;
        var track = carousel.querySelector('.bs-carousel__track');
        var dotsWrap = carousel.querySelector('.bs-carousel__dots');
        var origSlides = track.querySelectorAll('.bs-carousel__slide');
        var total = origSlides.length;
        if (total < 1) return;

        var direction = carousel.dataset.direction === 'left' ? -1 : 1;
        var DELAY = 3000;
        var current = 0;
        var interval = null;

        // Clone all slides: append copies for forward loop, prepend copies for backward loop
        for (var c = 0; c < total; c++) {
            var cloneAfter = origSlides[c].cloneNode(true);
            cloneAfter.classList.add('bs-clone');
            track.appendChild(cloneAfter);
        }
        for (var b = total - 1; b >= 0; b--) {
            var cloneBefore = origSlides[b].cloneNode(true);
            cloneBefore.classList.add('bs-clone');
            track.insertBefore(cloneBefore, track.firstChild);
        }
        // Now track order: [clone of 0..N-1 reversed] [original 0..N-1] [clone of 0..N-1]
        // Real slides start at index = total (offset by the prepended clones)

        var offset = total; // starting index is at the first real slide
        current = 0;

        function getSlideW() {
            return origSlides[0].offsetWidth + 18;
        }

        // Build dots (one per original slide)
        dotsWrap.innerHTML = '';
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'bs-dot' + (i === 0 ? ' active' : '');
            dot.dataset.idx = i;
            dotsWrap.appendChild(dot);
        }
        var dots = dotsWrap.querySelectorAll('.bs-dot');

        function updateDots() {
            var dotIdx = ((current % total) + total) % total;
            dots.forEach(function (d, j) { d.classList.toggle('active', j === dotIdx); });
        }

        function slideTo(idx, animate) {
            current = idx;
            var pos = (offset + current) * getSlideW();
            if (animate !== false) {
                track.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)';
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = 'translateX(-' + pos + 'px)';
            updateDots();
        }

        // Seamless reset: when animation ends at a clone region, silently jump
        track.addEventListener('transitionend', function () {
            if (current >= total) {
                slideTo(current - total, false);
            } else if (current < 0) {
                slideTo(current + total, false);
            }
        });

        // Set initial position without animation
        slideTo(0, false);

        function next() { slideTo(current + 1); }
        function prev() { slideTo(current - 1); }
        function startAuto() { stopAuto(); interval = setInterval(function () { if (direction > 0) next(); else prev(); }, DELAY); }
        function stopAuto() { if (interval) { clearInterval(interval); interval = null; } }

        // Arrow buttons
        var prevBtn = carousel.querySelector('.bs-arrow--prev');
        var nextBtn = carousel.querySelector('.bs-arrow--next');
        if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });

        // Dot clicks
        dotsWrap.addEventListener('click', function (e) {
            var d = e.target.closest('.bs-dot');
            if (!d) return;
            slideTo(parseInt(d.dataset.idx, 10));
            startAuto();
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);

        // Touch swipe
        var startX = 0, dragging = false;
        track.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX; dragging = true; stopAuto();
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (!dragging) return; dragging = false;
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { if (diff > 0) next(); else prev(); }
            startAuto();
        }, { passive: true });

        startAuto();
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

    /* Category Showcase - 8 tiles in testing-card style (gradient + product image + name + chip) */
    function renderCatShowcase(data) {
        var el = document.getElementById('cat-showcase-grid');
        if (!el) return;
        el.innerHTML = data.categories.map(function (c) {
            var imgSrc = BASE + (EDG.CAT_IMAGES[c.id] || '');
            return '<a class="cat-tile" style="--c:var(--c-' + c.id + ');--c-lt:var(--c-' + c.id + '-lt);" href="' + BASE + 'pages/category.html?id=' + c.id + '">' +
                '<div class="cat-tile__media">' +
                    (imgSrc ? '<img src="' + imgSrc + '" alt="' + EDG.escapeHtml(c.name) + '" loading="lazy">' : '') +
                '</div>' +
                '<div class="cat-tile__info">' +
                    '<div class="cat-tile__name">' + EDG.escapeHtml(c.name) + '</div>' +
                '</div>' +
            '</a>';
        }).join('');
    }

    /* Pick 10 featured products across categories for the hero slider */
    function buildHeroSlides(data) {
        var track = document.getElementById('hero-slider-track');
        if (!track) return;
        // one per category first, then fill
        var picks = [];
        var seenCats = {};
        data.products.forEach(function (p) {
            if (!seenCats[p.category]) {
                picks.push(p);
                seenCats[p.category] = true;
            }
        });
        // fill to 10 from featured products
        var featured = data.products.filter(function (p) { return p.featured; });
        for (var i = 0; i < featured.length && picks.length < 10; i++) {
            if (picks.indexOf(featured[i]) === -1) picks.push(featured[i]);
        }
        // final fallback
        for (var j = 0; j < data.products.length && picks.length < 10; j++) {
            if (picks.indexOf(data.products[j]) === -1) picks.push(data.products[j]);
        }
        track.innerHTML = picks.slice(0, 10).map(function (p) {
            var cc = (data._colors || {})[p.id] || {};
            var g1 = cc.top || '#eee', g2 = cc.middle || '#ddd', g3 = cc.bottom || g1;
            var style = '--tc-g1:' + g1 + ';--tc-g2:' + g2 + ';--tc-g3:' + g3 + ';';
            return '<a href="' + BASE + 'pages/product.html?id=' + encodeURIComponent(p.id) + '" class="hero__slide" style="' + style + '">' +
                '<img src="' + p.image + '" alt="' + EDG.escapeHtml(p.name) + '">' +
                '<div class="hero__slide-label">' + EDG.escapeHtml(p.name) + '</div>' +
            '</a>';
        }).join('');
    }

    /* Brands marquee */
    /* Brand Partners - logo slider gallery (auto-scrolling infinite).
       Client-approved brand partner logos (provided by Empire Distributors Group). */
    function renderBrands(data) {
        var el = document.getElementById('brand-partners-track');
        if (!el) return;

        var refLogos = [
            { name: 'BiC',             src: 'assets/brand-logos/bic.webp' },
            { name: 'Bliss Xtra',      src: 'assets/brand-logos/bliss-xtra.webp' },
            { name: 'Crownzen',        src: 'assets/brand-logos/crownzen.webp' },
            { name: 'Dozo',            src: 'assets/brand-logos/dozo.webp' },
            { name: 'Flying Monkey',   src: 'assets/brand-logos/flying-monkey.webp' },
            { name: 'Foger',           src: 'assets/brand-logos/foger.webp' },
            { name: 'Fume',            src: 'assets/brand-logos/fume.webp' },
            { name: 'Geek Bar',        src: 'assets/brand-logos/geek-bar.webp' },
            { name: 'Kanva',           src: 'assets/brand-logos/kanva.webp' },
            { name: 'Lost THC',        src: 'assets/brand-logos/lost-thc.webp' },
            { name: 'MIT 45',          src: 'assets/brand-logos/mit-45.webp' },
            { name: 'Mystic Labs',     src: 'assets/brand-logos/mystic-labs.webp' },
            { name: 'Purple',          src: 'assets/brand-logos/purple.webp' },
            { name: 'Rock On',         src: 'assets/brand-logos/rock-on.webp' },
            { name: 'Shroom Puff',     src: 'assets/brand-logos/shroom-puff.webp' },
            { name: 'Techno Torch',    src: 'assets/brand-logos/techno-torch.webp' },
            { name: 'Tyson 2.0',       src: 'assets/brand-logos/tyson-2.webp' },
            { name: 'Ultra Ohmz',      src: 'assets/brand-logos/ultra-ohmz.webp' },
            { name: 'Ultra Ohmz Mega', src: 'assets/brand-logos/ultra-ohmz-mega.webp' },
            { name: 'Vivazen',         src: 'assets/brand-logos/vivazen.webp' },
        ];

        // Also add our own brand logos that aren't in the ref list
        var refNames = refLogos.map(function (l) { return l.name.toLowerCase(); });
        var seen = {};
        data.companies.forEach(function (c) {
            if (!c.logo) return;
            if (seen[c.logo]) return;
            seen[c.logo] = true;
            var nameLC = c.name.toLowerCase();
            var alreadyIn = refNames.some(function (rn) { return nameLC.indexOf(rn) >= 0 || rn.indexOf(nameLC) >= 0; });
            if (!alreadyIn) {
                refLogos.push({ name: c.name, src: c.logo, companyId: c.id, categoryId: c.category });
            }
        });

        // Resolve each logo to a destination href:
        //   1. matching company in data -> its category page
        //   2. reference-only logo (Elf Bar, CloudMax, etc.) -> vape category (all are vape brands)
        function hrefForLogo(l) {
            if (l.categoryId) return BASE + 'pages/category.html?id=' + l.categoryId;
            var nameLC = l.name.toLowerCase();
            var match = data.companies.find(function (c) {
                var cn = c.name.toLowerCase();
                return cn === nameLC || cn.indexOf(nameLC) >= 0 || nameLC.indexOf(cn) >= 0;
            });
            if (match) return BASE + 'pages/category.html?id=' + match.category;
            return BASE + 'pages/category.html?id=vape';
        }

        // Triple the logos so we have room to wrap in both directions
        var tripled = refLogos.concat(refLogos).concat(refLogos);
        el.innerHTML = tripled.map(function (l) {
            return '<a class="bp-logo" href="' + hrefForLogo(l) + '" aria-label="' + EDG.escapeHtml(l.name) + '">' +
                '<img src="' + BASE + l.src + '" alt="' + EDG.escapeHtml(l.name) + '" loading="lazy">' +
            '</a>';
        }).join('');

        // Arrow button scroll controls with circular wrapping
        var leftBtn = document.getElementById('bp-arrow-left');
        var rightBtn = document.getElementById('bp-arrow-right');
        var scrollAmt = 300; // px per click
        var manualMode = false;
        var manualPos = 0;
        var isAnimating = false;

        // Calculate the width of one set of logos (1/3 of total track)
        function getOneSetWidth() {
            return el.scrollWidth / 3;
        }

        // Wrap position so it stays within the middle set
        function wrapPos(pos) {
            var oneSet = getOneSetWidth();
            // We want to keep pos between -oneSet*2 and 0
            // The middle set is from -oneSet to -oneSet*2
            while (pos > -oneSet) pos -= oneSet;      // wrapped too far left (past start)
            while (pos < -oneSet * 2) pos += oneSet;  // wrapped too far right (past end)
            return pos;
        }

        function enterManualMode() {
            if (!manualMode) {
                // Capture current animated position
                var computed = getComputedStyle(el).transform;
                var matrix = computed.match(/matrix.*\((.+)\)/);
                manualPos = matrix ? parseFloat(matrix[1].split(',')[4]) : 0;
                // Stop CSS animation
                el.style.animation = 'none';
                el.style.transform = 'translateX(' + manualPos + 'px)';
                manualMode = true;
            }
        }

        function scrollTrack(direction) {
            if (isAnimating) return;
            enterManualMode();
            isAnimating = true;

            var target = manualPos + (direction * scrollAmt);
            target = wrapPos(target);

            // If wrapping caused a big jump, snap instantly then animate
            var diff = Math.abs(target - manualPos);
            if (diff > scrollAmt * 1.5) {
                // Snap to wrapped position without transition, then animate small step
                manualPos = wrapPos(manualPos);
                el.style.transition = 'none';
                el.style.transform = 'translateX(' + manualPos + 'px)';
                // Force reflow
                el.offsetHeight;
                target = manualPos + (direction * scrollAmt);
            }

            manualPos = target;
            el.style.transition = 'transform 0.4s ease';
            el.style.transform = 'translateX(' + manualPos + 'px)';

            setTimeout(function () {
                el.style.transition = 'none';
                // Silently wrap position to keep in middle set
                manualPos = wrapPos(manualPos);
                el.style.transform = 'translateX(' + manualPos + 'px)';
                isAnimating = false;
            }, 420);
        }

        if (leftBtn) {
            leftBtn.addEventListener('click', function () {
                scrollTrack(1);  // scroll left = move track right = positive direction
            });
        }
        if (rightBtn) {
            rightBtn.addEventListener('click', function () {
                scrollTrack(-1); // scroll right = move track left = negative direction
            });
        }
    }

    /* ---------- Hero Slider ---------- */
    function initHeroSlider() {
        var track = document.getElementById('hero-slider-track');
        var dotsContainer = document.getElementById('hero-slider-dots');
        if (!track || !dotsContainer) return;

        var slides = track.querySelectorAll('.hero__slide');
        var total = slides.length;
        if (total < 2) return;

        var current = 0;
        var interval = null;
        var DELAY = 4000;

        /* Build dots */
        dotsContainer.innerHTML = '';
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'hero__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.dataset.idx = i;
            dotsContainer.appendChild(dot);
        }
        var dots = dotsContainer.querySelectorAll('.hero__dot');

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
            var dot = e.target.closest('.hero__dot');
            if (!dot) return;
            goTo(parseInt(dot.dataset.idx, 10));
            startAuto();
        });

        /* Arrow buttons */
        var slider = document.getElementById('hero-slider');
        if (slider) {
            var prev = slider.querySelector('.hero__arrow--prev');
            var nxt = slider.querySelector('.hero__arrow--next');
            if (prev) prev.addEventListener('click', function () { goTo(current - 1); startAuto(); });
            if (nxt) nxt.addEventListener('click', function () { next(); startAuto(); });
        }

        /* Pause on hover */
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
        renderCatShowcase(data);
        renderBestSellers(data);
        renderNew(data);
        renderTrending(data);
        renderBrands(data);
        EDG.wireWhatsapp();
        EDG.wireReveal();
        initHeroSlider();
    }).catch(function (err) {
        console.error('Failed to load data:', err);
    });
})();
