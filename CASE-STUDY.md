# Empire Distributors Group — Case Study & Project Documentation

> A zero-dependency, static B2B catalog site built for a wholesale distributor of age-restricted lifestyle products. 216 products, 27 brands, 8 categories — no backend, no checkout, no framework. Inquiries flow through WhatsApp.

---

## TL;DR

| | |
|---|---|
| **Client** | Empire Distributors Group (Tucker, Georgia) |
| **Type** | B2B / B2C wholesale product catalog |
| **Stack** | Pure HTML5 + vanilla JS (ES5) + CSS3 — no frameworks, no build step |
| **Data** | Single `products.json` (2,305 lines, 216 SKUs) |
| **Pages** | 6 HTML files (1 home + 5 templates) |
| **JS** | 6 modules, ~1,681 lines |
| **CSS** | ~4,238 lines across 2 files |
| **Footprint** | ~190 KB uncompressed (CSS + JS + data) |
| **Lead capture** | WhatsApp deep-links (no backend) |
| **Compliance** | 21+ age gate with 30-day localStorage TTL |
| **Hosting** | Any static host (Netlify, GitHub Pages, S3) |

---

## 1. The Brief

Empire Distributors Group needed an online presence for their wholesale operation — vape, kratom, Δ-products, mushroom, pseudo-cannabinoids, blue lotus, supplements, and novelty accessories. The catch: this isn't a Shopify store. Wholesale pricing is **negotiated**, not published. Retail buyers want to browse what's in stock, then talk to a human.

The brief, distilled:

1. Showcase the full catalog with rich category/brand browsing.
2. Drive every inquiry into a single channel — **WhatsApp**.
3. Comply with 21+ age verification on every visit.
4. Stay cheap to host, cheap to update, no developer required to add products.

---

## 2. Why No Framework

We deliberately chose **vanilla HTML/CSS/JS** over React, Next.js, or even a static-site generator. The reasoning:

- **One JSON file is the entire CMS.** A non-developer can rename an image, drop it in a folder, run one Python script ([_incoming/regenerate.py](_incoming/regenerate.py)), and ship.
- **Zero npm dependencies = zero security patch treadmill.** No `npm audit`, no Dependabot noise.
- **190 KB total payload.** No hydration, no bundle splitting needed — the site is already smaller than most React framework chunks.
- **Anywhere it runs.** Drag-and-drop to Netlify, push to GitHub Pages, or `python3 -m http.server`. Deploy in 30 seconds.

The trade-off — no component reuse via JSX — is solved by a tiny home-grown injector ([js/components.js](js/components.js)) that builds the header, nav, footer, and floating action buttons into placeholder divs on every page.

---

## 3. Architecture at a Glance

```
empire-distributors-group/
├── index.html                  # Home (hero, bento grid, carousels)
├── pages/
│   ├── category.html           # ?id=vape|kratom|delta|...
│   ├── product.html            # ?id={sku}
│   ├── brands.html             # 27 brand cards + filter chips
│   ├── about.html              # Story + values
│   └── contact.html            # Form → WhatsApp deep link
├── data/
│   └── products.json           # 216 products, 27 brands, 8 categories
├── js/
│   ├── catalog.js              # Data API + render helpers (407 lines)
│   ├── components.js           # Header/nav/footer injector (422 lines)
│   ├── main.js                 # Home page rendering (488 lines)
│   ├── search.js               # Fuzzy search dropdown (208 lines)
│   ├── header.js               # Sticky/expanded state machine (46 lines)
│   └── age-gate.js             # 21+ modal + localStorage TTL (110 lines)
├── css/
│   ├── style.css               # Global system (2,852 lines)
│   └── pages.css               # Page-specific (1,386 lines)
├── assets/                     # ~439 files: logos, brand logos, products
└── _incoming/                  # Python tooling for asset prep
```

### Data Flow

```
products.json  ──▶  catalog.js (loadData)  ──▶  window.EDG  ──▶  page modules render HTML
                                                     │
                                                     └──▶ wireWhatsapp() turns [data-wa] into wa.me links
```

Every product card knows its WhatsApp message because `catalog.js` exposes a `waLink(sku, name)` helper. No backend. No form handler. No spam.

---

## 4. The Data Model

A single `products.json` file holds everything:

```json
{
  "categories": [...],
  "brands": [...],
  "products": [
    {
      "id": "rock-on-disposable-blue-razz",
      "sku": "RO-BR-5K",
      "name": "Rock On Disposable — Blue Razz",
      "company": "Rock On",
      "category": "vape",
      "image": "assets/categories/vape/rock-on/blue-razz.png",
      "featured": true,
      "inStock": true,
      "description": "(optional) Overrides the auto-generated marketing description",
      "features": ["(optional)", "Array of bullet strings", "shown on the product page"]
    }
  ]
}
```

The product detail page auto-generates a marketing description and 4–5 feature bullets from `name` + `company` + `category` + flavor keywords parsed from the product name (`generateDescription` / `generateFeatures` in [js/catalog.js](js/catalog.js)). Optional `description` / `features` fields override the auto-generated copy per product — keeping the zero-effort default while giving non-developers a way to hand-tune specific SKUs.

**By the numbers:**

| Category | Products |
|---|---:|
| Novelties | 61 |
| Δ-products | 37 |
| Pseudo | 26 |
| Kratom | 22 |
| Vape | 18 |
| Mushroom | 18 |
| Supplements | 18 |
| Blue Lotus | 16 |
| **Total** | **216** |

**Notably missing: prices.** Wholesale pricing is intentional — every product card routes to WhatsApp with the SKU pre-filled, e.g.:

```
https://wa.me/16783036054?text=Hi%2C%20interested%20in%20RO-BR-5K%20%E2%80%94%20Rock%20On%20Blue%20Razz
```

---

## 5. Notable Engineering Choices

### 5.1 Path-aware base resolution

Pages live in `/` and `/pages/`. Rather than hard-code asset paths, [catalog.js](js/catalog.js) detects depth via regex and rewrites `BASE = '../'` for nested pages. Every helper that emits an `<img src>` or `<a href>` runs through it.

### 5.2 Component injection via `outerHTML`

[components.js](js/components.js) finds `<div id="edg-header"></div>` placeholders and replaces them with the full header markup — including the search bar, category nav, and mobile drawer. A `MutationObserver` keeps the drawer in sync if the data loads after the DOM. One source of truth, zero duplication across 6 HTML files.

### 5.3 Custom fuzzy search

[search.js](js/search.js) implements a **scoring algorithm** (not Fuse.js, not Lunr) tuned to this catalog's vocabulary:

| Match type | Score |
|---|---:|
| Exact | 1000 |
| Prefix | 500 |
| Token-start | 400 |
| Contains | 300 |
| Subsequence | 100–200 |

Results group into Products / Brands / Categories, support arrow-key navigation, and highlight matches via `<mark>` tags. 150 ms debounce keeps it snappy.

### 5.4 Category color tokens, applied inline

Each of the 8 categories owns a CSS variable pair (`--c-vape`, `--c-vape-lt`, etc.). Cards inherit it via inline style:

```html
<article class="product-card" style="--c: var(--c-delta); --c-lt: var(--c-delta-lt);">
```

The chip color, hover border, CTA background, and link color all key off `--c`. Recoloring an entire category = changing one variable.

### 5.5 Header state machine

[header.js](js/header.js) — only 46 lines — manages a tricky animation: the big logo collapses into a compact nav on scroll. A 600 ms lock window after a transition prevents phantom flips during the collapse keyframes. Small detail, big difference in feel.

### 5.6 Asset preparation pipeline (`_incoming/`)

Nineteen Python scripts handle the unglamorous work:

- **regenerate.py** — walks `assets/categories/{category}/{brand}/` and rebuilds `products.json` with human-readable names restored from slugified filenames.
- **check_image_framing.py** — uses PIL + NumPy on transparent PNG alpha channels to flag products that are off-center, undersized, or touching edges before they ship.
- **rename_products.py** — fixes 84 camera-original filenames in one pass.
- **remove_bg.py**, **extract_colors.py** — cleanup utilities.

This is what makes the "non-developer can ship a product" promise real.

---

## 6. Compliance & UX Touches

- **Age gate** ([js/age-gate.js](js/age-gate.js)) — full-screen modal blocks all interaction until 21+ confirmation. Verified state cached in `localStorage` for 30 days. Required by the regulated nature of the catalog.
- **Lazy-loaded images** — every `<img>` uses native `loading="lazy"`. No JS observer needed; modern browsers handle it.
- **Scroll-reveal animations** — `IntersectionObserver` adds `.is-visible` to `.reveal` elements with staggered 30 ms delays. Subtle, not distracting.
- **Sticky WhatsApp FAB** — pulse animation, present on every page, never more than a thumb-tap away.
- **Mobile drawer** — auto-syncs with the desktop nav via `MutationObserver`. Touch targets sized to the 44 px guideline.

---

## 7. The WhatsApp-First Funnel

The entire site is engineered around one conversion event: **opening WhatsApp with a pre-filled message**. Three entry points:

1. **Product card** → "Inquire" button → `wa.me/...?text=Hi%2C%20interested%20in%20{SKU}`
2. **Contact form** → fields encoded into the message body, not POSTed anywhere
3. **Floating FAB** → opens a generic inquiry message

Result: zero backend, zero spam, zero email-deliverability headaches. Every lead lands in the team's existing WhatsApp inbox where they already do business.

> **Active work, shipped features, and the running roadmap live in [TASKS.md](TASKS.md).** This document describes what the project *is*; TASKS.md tracks what's *being done*.

---

## 8. What the Numbers Say

| Metric | Value |
|---|---|
| Total page weight (uncompressed) | ~190 KB |
| Third-party requests | 1 (Google Fonts) |
| Frameworks | 0 |
| npm dependencies | 0 |
| Backend services | 0 |
| Lighthouse-friendly features | lazy images, no render-blocking JS, system fonts fallback |
| Time to add a product | < 2 minutes (drop image + run script) |
| Hosting cost | ~$0/mo on Netlify free tier |

---

## 9. Lessons & Takeaways

1. **The right stack is the smallest one that works.** A React app would have done the same job — at 50× the bundle size and 100× the maintenance overhead.
2. **JSON-as-CMS scales further than you'd expect.** 216 products is fine. 2,000 would still be fine if pagination or virtual scrolling is added.
3. **Build the content pipeline first.** The Python scripts in `_incoming/` are what make the site sustainable. Without them, the JSON file would rot.
4. **WhatsApp is a legitimate backend.** For B2B inquiry funnels in markets where messaging is the dominant channel, skipping email/forms entirely is a feature, not a limitation.
5. **Compliance UX matters.** A clean age gate with a 30-day TTL respects both the law and the user's time.

---

## 10. Tech Credits

- **Fonts** — Poppins + Mona Sans (Google Fonts)
- **Icons** — Inline SVG (no icon font, no library)
- **Image processing** — PIL + NumPy (Python tooling)
- **Hosting** — Static (any provider)

---

*Site: [index.html](index.html) · Reference: [SITE-REFERENCE.md](SITE-REFERENCE.md) · Tasks: [TASKS.md](TASKS.md)*
