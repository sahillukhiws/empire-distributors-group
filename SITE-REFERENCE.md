# Empire Distributors Group - Complete Site Reference

> This document contains everything needed to understand, maintain, or recreate this website from scratch.
> Last updated: April 13, 2026

---

## 1. Project Overview

**Business:** Empire Distributors Group - premium wholesale & retail distributor for vape, kratom, delta, mushroom, blue lotus, pseudo, supplements, and lifestyle products.

**Site type:** Static marketing + product catalog website. No backend, no database, no payment. All product data lives in a single JSON file. All interactions (inquiries, orders) go through WhatsApp.

**Tech stack:** Pure HTML + CSS + vanilla JavaScript. No frameworks, no build tools, no npm. Fonts loaded from Google Fonts CDN. Everything runs from a static file server.

**Target audience:** Retail shop owners (smoke shops, convenience stores, gas stations) and end consumers. Primarily mobile + desktop users in the US.

---

## 2. Contact & Business Info

- **Company:** Empire Distributors Group
- **Address:** 2725 Mountain Industrial Blvd, Suite A5, Tucker, GA 30084
- **Phone:** 470-375-3936
- **Email:** empiredistributorsgroup@gmail.com
- **WhatsApp:** +1 470-375-3936 (primary contact channel)

---

## 3. File Structure

```
empire-distributors-group/
├── index.html                  # Home page
├── pages/
│   ├── category.html           # Category listing (loads via ?id=vape, ?id=kratom, etc.)
│   ├── product.html            # Single product detail (loads via ?id=<product-id>)
│   ├── brands.html             # All brands overview with category filter
│   ├── about.html              # Company story, values, categories, CTA
│   └── contact.html            # Contact cards, inquiry form, hours
├── css/
│   ├── style.css               # Global styles (2085 lines)
│   └── pages.css               # Page-specific styles (1271 lines)
├── js/
│   ├── age-gate.js             # Age verification modal (21+ check, localStorage persistence)
│   ├── components.js           # Shared header/nav/footer/floating-actions injector
│   ├── catalog.js              # Data loader, product card renderer, helpers (window.EDG)
│   ├── main.js                 # Home page rendering (categories, featured, marquee)
│   ├── search.js               # Live search dropdown with fuzzy matching
│   └── header.js               # Header state machine (expand/compact on scroll/hover)
├── data/
│   └── products.json           # All product data (161 products, 14 brands, 8 categories)
├── assets/
│   ├── logos/
│   │   ├── empire-logo-removebg-preview.png   # Transparent bg logo (used in header, age gate)
│   │   ├── empire-logo-2.png                  # Dark-teal bg logo (used in footer)
│   │   ├── empire-logo.png                    # Original logo with bg
│   │   └── empire-logo-alt.png                # High-res 4320x4320 variant
│   └── categories/
│       ├── bluelotus/featured/     # 16 images (Mental Health brand)
│       ├── delta/
│       │   ├── 1-delta-8-9-gummies/
│       │   └── rock-on/            # 42 images total
│       ├── kratom/featured/        # 22 images (Bliss Xtra, MIT 45, Kanva, etc.)
│       ├── mushroom/
│       │   ├── shroom-bang/
│       │   ├── shroom-puff/
│       │   └── silly-dots/         # 18 images total
│       ├── pseudo/
│       │   ├── gushers/
│       │   ├── lucid-50mg/
│       │   └── ultra-ohmz/         # 26 images total
│       ├── supplements/
│       │   ├── better-now/
│       │   ├── kanna-kava/
│       │   ├── strike-kava-shot/
│       │   └── zen-power-shot/     # 18 images total
│       ├── vape/vapes-new/         # 19 images
│       └── novelties/              # 0 images (empty category)
└── _incoming/
    └── regenerate.py               # Script to regenerate products.json from asset folders
```

**Total:** 6 HTML pages, 2 CSS files (3356 lines), 6 JS files (1055 lines), 161 product images, 4 logo files.

---

## 4. Pages & Their Purpose

### index.html (Home)
- Hero: auto-sliding product carousel (left) + 2x2 featured grid (right). Every slide and tile is a clickable link to a category or product page.
- "Shop by Category" grid (8 category tiles, each linked to its category page)
- "Best Sellers" - 3 swiper-style carousel rows (Ultra Ohmz / Mushroom / Gushers) with product cards linked to product pages
- **"Our Brand Partners" logo slider** - every logo is a clickable link. Logos mapped to their brand's category page when the brand exists in `data.companies`; unmatched reference logos (Elf Bar, CloudMax, etc.) fall back to the vape category.
- "New Products" grid (latest 2 per category)
- "Trending Now" grid (mid-index products per category)
- Shared header, nav, footer injected by components.js

### pages/category.html?id={categoryId}
- Category-specific hero (slider + 2x2 tile grid) at top - **each slide and tile is clickable**: matched to a real product by image filename and linked to that product's page, with category-page fallback when no match
- Category-colored header section (breadcrumb, icon, title, product/brand count)
- Brand filter chips (click to filter products by brand within the category)
- Full product grid for that category (cards link to product detail)
- "Other Categories" cross-sell section at the bottom (clickable category cards)
- Works for all 8 categories via the `?id=` query parameter

### pages/product.html?id={productId}
- **Borderless fixed-size product frame** (520px desktop → 480/440/360/300 responsive), image always 100% visible (no crop), sticky on desktop, stacks on mobile
- **Hover lens zoom** - circular magnifier (160px → 130/110 responsive) follows cursor with 2.5x zoom on desktop (`hover: hover` + `pointer: fine`); default cursor hidden during hover (`cursor: none`) and a small magnifier-glass icon shown inside the lens. Touch / coarse-pointer devices skip the lens.
- **Click-to-open full-screen lightbox** - click anywhere on the image opens a dark-backdrop lightbox with the full-res image. Close: × button, ESC key, or click backdrop. Body scroll locked while open.
- Product details: brand (logo + name), name, SKU, category, availability
- Auto-generated marketing description (helpers `generateDescription` / `generateFeatures` in [js/catalog.js](js/catalog.js) - auto-build from brand + category + flavor parsed from name; optional `description` / `features` fields in [data/products.json](data/products.json) override the auto-generated text per product)
- 4–5 feature bullets (authentic brand, premium category, flavor profile, wholesale packaging, nationwide shipping)
- "Inquire on WhatsApp" CTA (pre-filled with product name + SKU)
- Trust row (authentic / fast / live support)
- Related products grid (same brand first, then same category)

### pages/brands.html
- Hero with brand count badge
- Category filter chips
- Brand cards grid (each card shows a sample product image, brand name, category, product count)
- Deep-link support (#brand-id scrolls to a specific brand)
- Wholesale CTA at bottom

### pages/about.html
- Hero with mission statement
- "Our Story" section (2-column: logo + 3 paragraphs)
- "The Empire Standard" - 4 values (Authenticity, Fast Fulfillment, Real-Time Support, Partner Pricing)
- 8 Core Categories grid
- Final wholesale CTA

### pages/contact.html
- 3 contact cards: WhatsApp (green), Email, Phone
- Inquiry form: Name, Business Name, Type (dropdown), Category (dropdown), Message → submits to WhatsApp (no backend, generates pre-filled WhatsApp URL)
- Business hours card (Mon-Fri 9-8, Sat 10-6, Sun closed)
- Service area card (Tucker GA HQ, nationwide shipping, pickup by appointment)

---

## 5. Design System

### Fonts
- **Display:** Space Grotesk (weights: 500, 600, 700, 800) - headings, product names, stats
- **Body:** Inter (weights: 400, 500, 600, 700) - paragraphs, UI text, labels
- Loaded from Google Fonts CDN

### Color Palette

**Brand colors (used globally):**
| Token | Value | Use |
|---|---|---|
| `--empire-teal` | `#2f8a94` | Primary brand color (from logo). Buttons, links, accents |
| `--empire-teal-dk` | `#1d6b74` | Hover states, darker accents |
| `--empire-teal-lt` | `#5ab5bf` | Light tint backgrounds |
| `--brand-lt` | `#e6f3f5` | Very light teal tint for backgrounds |

**Background / surface colors (light theme):**
| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#f6f7fb` | Page background |
| `--bg-1` | `#ffffff` | White |
| `--bg-2` | `#f0f2f8` | Soft gray (product image backgrounds) |
| `--bg-3` | `#e8ebf3` | Slightly darker gray |

**Text colors:**
| Token | Value | Use |
|---|---|---|
| `--text` | `#0f1226` | Primary text (headings, body) |
| `--text-2` | `#2a2e45` | Secondary text |
| `--text-dim` | `#5a5f78` | Muted text (descriptions) |
| `--text-mute` | `#8a8f9f` | Very muted (labels, hints) |

**Per-category colors (each category has its own color + light tint):**
| Category | Color | Light | Dark | Why |
|---|---|---|---|---|
| Vape | `#0ea5e9` | `#e0f2fe` | `#0369a1` | Vapor / cool / tech |
| Kratom | `#16a34a` | `#dcfce7` | `#15803d` | Leaf / natural / botanical |
| Delta | `#f59e0b` | `#fef3c7` | `#b45309` | Hemp / warmth / energy |
| Mushroom | `#a16207` | `#fef3c7` | `#713f12` | Soil / organic / grounded |
| Pseudo | `#eab308` | `#fef9c3` | `#a16207` | Energy / lightning / focus |
| Blue Lotus | `#6366f1` | `#e0e7ff` | `#4338ca` | Lotus petal / calm / mystic |
| Supplements | `#10b981` | `#d1fae5` | `#047857` | Health / vitality |
| Novelties | `#ec4899` | `#fce7f3` | `#be185d` | Fun / playful / lifestyle |

**Footer colors (dark theme):**
| Token | Value | Use |
|---|---|---|
| `--f-bg` | `#141a26` | Footer background (warm dark slate) |
| `--f-text` | `#f0f2f8` | Footer primary text |
| `--f-text-dim` | `#a0a6b8` | Footer muted text |
| `--f-text-mute` | `#6e7486` | Footer very muted (legal) |
| `--f-border` | `rgba(255,255,255,0.08)` | Footer divider lines |

### Spacing
| Token | Value |
|---|---|
| `--container` | `1480px` (default), fluid at smaller breakpoints |
| `--header-h` | `84px` (desktop), `76px` (tablet), `114px` (mobile, 2-row) |
| `--nav-h` | `56px` (desktop/tablet), `0px` (mobile, hidden) |
| Container padding | `6.5rem` (desktop) → `4rem` (≤1280) → `2.5rem` (≤1024) → `1.25rem` (≤720) → `1rem` (≤480) → `0.75rem` (≤380) |

### Border Radius
| Token | Value |
|---|---|
| `--r-sm` | `10px` |
| `--r` | `16px` |
| `--r-lg` | `22px` |
| `--r-xl` | `32px` |

### Shadows (layered for depth)
| Token | Use |
|---|---|
| `--sh-xs` | Subtle surface lift |
| `--sh-sm` | Card default |
| `--sh-md` | Card hover |
| `--sh-lg` | Elevated surfaces |
| `--sh-xl` | Modals, hero showcase |

### Easing
| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | All transitions (smooth ease-out) |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Age gate entrance |

---

## 6. Responsive Breakpoints

| Breakpoint | Devices | Key changes |
|---|---|---|
| `≥ 1537px` | Large desktops, 4K | Container 1720-1920px |
| `1281-1536px` | Standard desktops | Container 1480px (default) |
| `≤ 1280px` | Small laptops | Container fluid, padding 4rem |
| `≤ 1024px` | Tablets | 3-col grids, smaller header elements, big logo shrinks |
| `≤ 900px` | Tablet portrait | Hero stacks to 1-col |
| `≤ 720px` | Phones | 2-col grids, hamburger menu, drawer nav, 2-row header, hero becomes 2x2 bento |
| `≤ 480px` | Standard phones | Tighter spacing, full-width buttons |
| `≤ 380px` | Small phones | 1-col product grid, smallest type sizes |

### Touch devices (`@media (hover: none)`)
- All hover lift/scale effects disabled
- Replaced with `:active { transform: scale(0.97) }` tap feedback
- Prevents iOS "sticky hover" bug

### Reduced motion (`@media (prefers-reduced-motion: reduce)`)
- All animations and transitions set to near-zero duration

---

## 7. JavaScript Architecture

### Script load order (every page)
```
1. age-gate.js      - blocks site until 21+ verified
2. components.js    - injects shared header/nav/footer/floating-actions
3. catalog.js       - loads data, exports window.EDG helpers
4. [page script]    - page-specific rendering (main.js for home, inline for others)
5. search.js        - live search dropdown
6. header.js        - scroll/hover state machine
```

### window.EDG API (exported by catalog.js)
```javascript
window.EDG = {
    BASE,                    // '' or '../' depending on page location
    ICONS,                   // SVG icon strings keyed by category ID
    CAT_COPY,                // Marketing copy per category (tagline, description, bullets)
    loadData(),              // Returns Promise<data> from products.json (cached)
    waLink(text),            // Returns WhatsApp URL with pre-filled message
    escapeHtml(s),           // HTML-escapes a string
    findCategory(data, id),  // Find category by ID
    findCompany(data, id),   // Find brand/company by ID
    findProduct(data, id),   // Find product by ID
    getProductsByCategory(data, catId),
    getProductsByCompany(data, companyId),
    getBrandsInCategory(data, catId),
    getRelatedProducts(data, product, limit),
    renderProductCard(p, data, opts),     // Returns HTML string for one product card
    renderProductGrid(products, data, container, opts),  // Fills a container with cards
    wireReveal(),            // Attaches IntersectionObserver for scroll-reveal
    wireWhatsapp(),          // Wires all [data-wa] elements to WhatsApp URLs
    qs(name),                // Returns URL query parameter value
};
```

### Path handling
All JS files detect whether they're running from the root (`/index.html`) or a subfolder (`/pages/*.html`) and set `BASE` accordingly:
```javascript
const inPages = /\/pages\//.test(window.location.pathname);
const BASE = inPages ? '../' : '';
```
This prefix is applied to all `fetch()` calls, image paths, and `<a>` hrefs.

### Header state machine (header.js)
Two states: `.is-expanded` (big logo + nav visible) and `.is-compact` (small logo, nav hidden).

**Triggers:**
- Scroll down past 60px → compact
- Scroll up by 25px+ → expand
- Mouse in top zone (header+nav height) → force expand
- Mouse leaves zone → compact (80ms debounce)
- Search input focused → force expand
- At scroll top (y ≤ 10) → always expanded

**Anti-flicker:** 600ms state lock after every flip prevents nav-collapse layout shift from triggering phantom scroll events.

### Age gate (age-gate.js)
- Checks `localStorage` key `edg_age_verified` with 30-day TTL
- If not verified: blocks site with modal, locks `<html>` scroll
- On "Yes, I am 21 or older" click: stores timestamp, fades out modal, unlocks scroll
- WhatsApp social icon wired directly (doesn't wait for catalog.js)

### Search (search.js)
- Fuzzy matching across product name, SKU, company name, category name
- Scoring: exact match (1000), prefix (500), token start (400), contains (300), subsequence (100-200)
- Groups results into Products, Brands, Categories
- Keyboard navigation (up/down arrows, Enter to select, Escape to close)
- Highlights matching substring with `<mark>` tags
- Live dropdown, debounced 150ms

### Components (components.js)
- Injects shared header (logo, search, WhatsApp button, hamburger)
- Injects shared category nav bar (pill buttons, populated from data)
- Injects shared footer (dark theme, brand column, shop/company/contact columns, social icons, bottom bar)
- Injects mobile drawer menu (auto-populated from nav pills via MutationObserver)
- Injects floating action buttons (WhatsApp + scroll-to-top, appear on scroll past 400px)
- Highlights active nav pill on category pages

---

## 8. Data Schema (products.json)

```json
{
    "categories": [
        {
            "id": "vape",
            "name": "Vape",
            "icon": "...",          // emoji (legacy, not used - SVG icons in catalog.js)
            "description": "Premium vape devices and disposables"
        }
    ],
    "companies": [
        {
            "id": "rock-on",
            "name": "ROCK ON",
            "category": "delta"     // primary category this brand belongs to
        }
    ],
    "products": [
        {
            "id": "delta-rock-on-img-20250411-wa0077",     // unique ID (category-brand-slug)
            "sku": "IMG-20250411-WA0077",                  // uppercase original filename
            "name": "IMG 20250411 WA0077",                 // display name (UPPERCASE, original)
            "company": "rock-on",                          // brand ID
            "category": "delta",                           // category ID
            "image": "assets/categories/delta/rock-on/img-20250411-wa0077.jpg",
            "featured": false,                             // first 2 per category are true
            "inStock": true
        }
    ]
}
```

**Important:** Product names are preserved EXACTLY as the original filenames (UPPERCASE). The `_incoming/regenerate.py` script converts slugified filenames back to uppercase with decimal restoration and flavor-variant parentheses.

---

## 9. Product Card HTML Structure

Every product card across all pages uses the same renderer (`catalog.js → renderProductCard()`):

```html
<article class="prod-card reveal" style="--c: var(--c-delta); --c-lt: var(--c-delta-lt);">
    <a class="prod-card__media" href="pages/product.html?id=...">
        <span class="prod-card__chip">Delta</span>
        <img src="assets/categories/delta/..." alt="..." loading="lazy">
    </a>
    <div class="prod-card__body">
        <div class="prod-card__brand">ROCK ON</div>
        <h3 class="prod-card__name"><a href="...">PRODUCT NAME</a></h3>
        <a class="prod-card__cta" href="https://wa.me/14703753936?text=..." target="_blank">
            <svg>...</svg> Inquire on WhatsApp
        </a>
    </div>
</article>
```

The `--c` and `--c-lt` CSS custom properties on each card drive the category-specific coloring (chip, brand text, hover border, CTA button).

---

## 10. Category Card HTML Structure

```html
<a class="cat-card reveal" style="--c: var(--c-vape); --c-lt: var(--c-vape-lt);" href="pages/category.html?id=vape">
    <div class="cat-card__icon"><svg>...</svg></div>
    <div class="cat-card__body">
        <div class="cat-card__name">Vape</div>
        <div class="cat-card__count">19 products</div>
    </div>
    <div class="cat-card__arrow"><svg>...</svg></div>
</a>
```

Category cards have a thin left accent bar (`::before`), subtle diagonal wash on hover (`::after`), and the icon/arrow/name all use the category color via `--c`.

---

## 11. Header / Nav Architecture

### Desktop (≥ 721px)
The header + nav are wrapped in `.site-top` (sticky):

```
┌─────────────────────────────────────────────┐
│ [logo column: 260px]  [search: 1fr]  [WA]  │ ← .site-header (.header-inner grid)
├─────────────────────────────────────────────┤
│ [logo-pad reserved]   [pill] [pill] [pill]  │ ← .cat-nav
└─────────────────────────────────────────────┘
```

- `.header-inner` grid: `var(--logo-pad) 1fr auto` - left column ALWAYS reserved for logo (260px+2rem), never transitions
- `.brand` (inline small logo) fades in/out (opacity only, no movement)
- `.brand-big-wrap` → `.brand-big` → `<img>` overlay fades in/out on top of the logo column
- `.cat-nav` collapses via `height` transition (56px → 0)
- Background is solid `#fbfbfd` on `.site-top` - no backdrop-filter (prevents repaint flicker during height animation)

### Mobile (≤ 720px)
```
Row 1 (64px): [☰]  [logo centered]  [WA]
Row 2 (50px): [🔍 search full width          ]
```
- Hamburger button visible, opens slide-in drawer from left
- Category nav bar (`cat-nav`) hidden entirely (`display: none`)
- Big logo overlay hidden (`display: none !important`)
- Drawer contains: logo, category links (auto-populated from nav), WhatsApp CTA

---

## 12. Footer Structure

Dark theme (`#141a26` base) with gradient from `#0f1522` at top.

```
┌─────────────────────────────────────────────────────────┐
│  [Logo card]          [Shop]      [Company]   [Contact] │
│  Brand description    Vape        About Us    ADDRESS   │
│  (WA)(📧)(📞)(IG)    Kratom      Brands      EMAIL     │
│                       Delta       Wholesale   PHONE     │
│                       Mushroom    Contact               │
│                       Supplements                       │
├─────────────────────────────────────────────────────────┤
│  © 2026 Empire...     Privacy | Terms | Cookie    21+   │
└─────────────────────────────────────────────────────────┘
```

- Logo uses `empire-logo-2.png` (has its own dark-teal background) inside a glass card
- Contact column uses icon-tile + label-value rows (`.fc-item` grid)
- Social icons fill teal on hover
- Bottom bar has amber warning dot next to 21+ notice

---

## 13. Age Gate Structure

Compact marketing card matching My Smoke Wholesale reference:

```
┌─────────────────────────────────┐
│     [EMPIRE LOGO - 180px]       │
├─────────────────────────────────┤
│ [GIGA BAR PULSE X banner]      │  ← thin wide strip (1:3 ratio)
├─────────────────────────────────┤
│ Experience premium distribution │
│ with Empire Distributors...     │  ← 0.78rem compact text
│                                 │
│ Please verify you are 21+       │  ← teal prompt
│                                 │
│ [  Yes, I am 21 or older    ]   │  ← teal pill button
│                                 │
│ Cookie notice text...           │  ← 0.68rem muted
│ (WA) (📧) (📞) (IG)            │  ← 32px dark circles
└─────────────────────────────────┘
```

- Card max-width: 440px
- Banner image: `assets/categories/vape/vapes-new/img-6937.png` (2500x939, GIGA BAR PULSE X)
- Persists in localStorage for 30 days
- Blocks all interaction until verified

---

## 14. Floating Action Buttons

Fixed bottom-right corner. Both hidden at top, appear together after scrolling past 400px:

```
[WhatsApp - green, pulse ring]   ← top
[Scroll to top - white, teal ↑]  ← bottom
```

- Injected by `components.js` into `<body>`
- WhatsApp opens pre-filled chat
- Scroll-to-top uses `window.scrollTo({ behavior: 'smooth' })`
- 48px on mobile, 56px on desktop

---

## 15. Key Design Decisions & Rationale

1. **No backend / No framework:** Client asked for pure HTML/CSS/JS. All data in `products.json`, rendered client-side. This means zero hosting costs, works on any static server (GitHub Pages, Netlify, shared hosting).

2. **WhatsApp as primary CTA:** No cart, no checkout, no login. Every product interaction leads to WhatsApp with pre-filled product info. This matches the client's B2B wholesale workflow.

3. **Per-category color system:** Each of the 8 categories has its own color drawn from the product itself (vape=blue, kratom=green, delta=amber, etc.). Colors are applied via CSS custom properties `--c` and `--c-lt` set as inline styles on each element. This keeps the CSS generic and the coloring data-driven.

4. **Shared components via JS injection:** Instead of duplicating 80+ lines of header/footer HTML in 6 files, `components.js` injects them into `<div id="site-header">` and `<div id="site-footer">` placeholders. Single source of truth.

5. **Product names in UPPERCASE:** The client strictly required original filename casing. The `regenerate.py` script converts slugified filenames back to uppercase with decimal restoration and flavor-variant parentheses.

6. **Light theme with dark footer:** Light surfaces for product visibility (products pop on white/gray), dark footer for visual anchoring and contrast.

7. **No emojis:** Client requested SVG line icons instead of emojis for category cards. All 8 categories have custom SVG icons defined in `catalog.js`.

8. **Solid header background (no backdrop-filter):** Initially used `backdrop-filter: blur()` but it caused repaint flicker during the nav collapse/expand animation. Replaced with solid `#fbfbfd` background.

9. **Header state lock (600ms):** When the nav collapses, the layout shift can trigger a phantom scroll-up event. A 600ms lock window after every state flip prevents the scroll handler from re-expanding during the collapse animation.

10. **Container padding 6.5rem on desktop:** Client wanted visible breathing room on both sides of the content on laptop/desktop. Scales down to 0.75rem on smallest phones.

---

## 16. How to Run

```bash
cd empire-distributors-group
python3 -m http.server 8000
# Open http://localhost:8000
```

Or use VS Code Live Server, or any static file server. No build step needed.

---

## 17. How to Add New Products

1. Drop product images into `assets/categories/{category}/{brand}/`
2. Run `python3 _incoming/regenerate.py` to rebuild `data/products.json`
3. Refresh the site - new products appear automatically

---

## 18. How to Add a New Category

1. Add the category to `_incoming/regenerate.py` `CAT_META` dict
2. Add the CSS color variables to `style.css` `:root` (e.g., `--c-newcat`, `--c-newcat-lt`, `--c-newcat-dk`)
3. Add an SVG icon to `catalog.js` `ICONS` object
4. Add marketing copy to `catalog.js` `CAT_COPY` object
5. Create the image folder at `assets/categories/newcat/`
6. Drop images and run `regenerate.py`

---

## 19. How to Change the WhatsApp Number

Search and replace `14703753936` across:
- `js/catalog.js` (line 10, `WA_NUMBER`)
- `js/age-gate.js` (line in `waLink` builder)
- Nowhere else - all other WhatsApp links use `[data-wa]` attributes wired by `wireWhatsapp()`

---

## 20. Known Limitations

1. **No server-side rendering:** All rendering is client-side. SEO depends on Google's JavaScript rendering. For better SEO, consider a static site generator (Astro, 11ty) in the future.
2. **No prices:** Products have no price field. All pricing is inquiry-based via WhatsApp.
3. **Novelties category is empty:** No products in `assets/categories/novelties/`. The category appears but shows an empty state.
4. **Product names from filenames:** Some original images had camera names like `IMG_6922.jpg` which show as `IMG 6922`. These need manual renaming if nicer names are desired.
5. **No pagination:** All products in a category load at once. With 42 products in Delta, this is fine. If a category grows to 200+, pagination or lazy loading should be added.
6. **Age gate bypass:** Users can clear localStorage to re-trigger the age gate, or bypass it entirely with JavaScript. This is standard for client-side age gates and is not considered a security measure.