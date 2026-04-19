# Empire Distributors Group — Working Tasks

> This is the **active working file** for the project. Project overview lives in [CASE-STUDY.md](CASE-STUDY.md). Site structure reference lives in [SITE-REFERENCE.md](SITE-REFERENCE.md).
>
> **How to use this file:**
> - Move items between sections as work progresses (Active → In Progress → Done).
> - Run the **Permanent Checks** (section at bottom) after *every* change, big or small.
> - When Done items pile up, trim them — this is not a changelog.

---

## Quick Reference

**Brand**
- Color: Dark Blue `#1a3a5c` (accent on white)
- Fonts: Poppins (body) + Mona Sans (display)
- Logo: [assets/logos/empire-logo-removebg-preview.png](assets/logos/empire-logo-removebg-preview.png)

**Contact**
- WhatsApp (primary): +1 (678) 303-6054
- Phones: +1 (470) 640-4502 · +1 (470) 953-3565
- Instagram: [@empire_distributors](https://www.instagram.com/empire_distributors/)
- Email: empiredistributorsgroup@gmail.com
- Address: 2725 Mountain Industrial Blvd, Suite A5, Tucker, GA 30084

---

## 🔁 Permanent Checks — Run After EVERY Change

These are non-negotiable. Every time a page, component, stylesheet, or JS module is touched, walk this list before marking work done.

### Responsiveness
- [ ] Desktop (1400+) — layout holds, no horizontal scroll
- [ ] Laptop (1200) — breakpoints transition cleanly
- [ ] Tablet (992) — nav collapses properly, touch targets work
- [ ] Mobile (768) — mobile drawer opens, content stacks
- [ ] Phone (480) — all text readable, no overflow
- [ ] Small phone (380) — nothing clipped, buttons tappable
- [ ] Touch targets ≥ 44px on all interactive elements (buttons, links, nav items)
- [ ] No horizontal scrollbar appears at any breakpoint

### Structure & Consistency
- [ ] Header renders correctly on the changed page (logo, search, WhatsApp, nav)
- [ ] Footer renders correctly (all 4 columns, links, social icons)
- [ ] Mobile drawer opens/closes and mirrors main nav
- [ ] Sticky header appears when scrolling up
- [ ] Category colors apply correctly if page uses `--c` tokens
- [ ] Fonts load (Poppins + Mona Sans) — no FOUC
- [ ] Dark blue accent `#1a3a5c` used consistently, no stray colors

### Functional Integrity
- [ ] All pages still return 200 (home, category, product, brands, about, contact)
- [ ] Age gate modal appears on first visit, dismisses on "Yes 21+"
- [ ] Search dropdown works (type 2+ chars, results appear, keyboard nav works)
- [ ] WhatsApp CTAs open `wa.me/16783036054` with pre-filled SKU message
- [ ] Contact form builds correct WhatsApp URL on submit
- [ ] Product images load (lazy-loaded, no broken `src`)
- [ ] Category filter chips on brands.html / category.html filter correctly
- [ ] Related products render on product detail page
- [ ] No JS console errors on any page

### Data Integrity
- [ ] [data/products.json](data/products.json) is valid JSON (no trailing commas)
- [ ] Every product has: id, sku, name, company, category, image, featured, inStock
- [ ] Every `image` path points to an existing file in [assets/](assets/)
- [ ] Every `category` value matches one of the 8 defined categories
- [ ] `inStock: false` products hide/grey-out correctly

### Performance & SEO
- [ ] All `<img>` tags have `loading="lazy"` (except above-the-fold hero)
- [ ] All `<img>` tags have meaningful `alt` text
- [ ] No render-blocking JS added (defer/async where possible)
- [ ] Page weight stays reasonable (home + all assets should stay well under 2 MB)
- [ ] `<title>` and `<meta name="description">` set on every page

### Accessibility
- [ ] All interactive elements reachable via keyboard (Tab / Shift+Tab)
- [ ] Focus ring visible on focused elements
- [ ] Color contrast passes WCAG AA on text over backgrounds
- [ ] Icons that convey meaning have `aria-label`

### Git Hygiene
- [ ] Changes don't break any other page (cross-page regression test)
- [ ] Commit message describes the *why*, not just the *what*
- [ ] No debug `console.log` or commented-out code left behind

---

## 🔴 Active — Pick Up Next

### Phase A — Responsive Refinement
- [x] ~~Unify breakpoints between style.css and pages.css~~ — verified already unified at `1400 / 1200 / 992 / 768 / 480 / 380`. No conflicts found.
- [ ] Walk each breakpoint across all 6 pages (manual browser test, record any layout issues)
- [ ] Verify animated WhatsApp SVG scales properly at all sizes
- [ ] Audit `.cat-header` consistency across category/product/brands/about/contact pages

### Not Started
- [ ] Age gate styling refresh to match brand (currently generic)
- [ ] Source remaining 11 brand logos (or design fallback placeholder)
- [ ] Run image-framing pass via [_incoming/check_image_framing.py](_incoming/check_image_framing.py)
- [ ] Performance audit (Lighthouse on all pages, record baseline)
- [ ] Design a proper dedicated favicon (currently using full logo PNG — works but not optimal size)
- [ ] Add canonical URL meta tags once production domain is confirmed

---

## 🟡 In Progress

*(Move items here when actively being worked on. Empty means nothing is blocked mid-flight.)*

---

## ✅ Recently Done

*(Keep a short rolling list — prune when it gets long. This is not a full history.)*

- **Product detail page upgrade — borderless fixed frame + hover lens-zoom + click-to-open lightbox** — [pages/product.html](pages/product.html) main image now renders in a fixed-size, borderless area (520px → 480/440/360/300 responsive) so every product presents at identical dimensions with `object-fit: contain` keeping the image 100% visible (no crop). On desktop (`hover: hover` + `pointer: fine`) a 160px circular lens follows the cursor at 2.5x zoom, default cursor is hidden (`cursor: none`) and a small magnifier icon shows inside the lens. Touch / coarse-pointer devices skip the lens. Click the image → full-screen lightbox with × button, ESC, and backdrop-click close; body scroll locked while open. All CSS lives in [css/pages.css](css/pages.css); JS wiring in `wireLensAndLightbox()` inside the product page IIFE.
- **Site-wide image clickability + auto product descriptions** — every product image / category image / brand logo now leads somewhere. (1) Category-page hero slider slides and 2x2 tiles switched from `<div>` to `<a>`, matched to real products by image filename via `findProductByImagePath()` with category-page fallback. (2) Home-page "Our Brand Partners" logos wrapped in `<a>` — known brands go to their category page, unmatched reference logos (Elf Bar, CloudMax, Hyppe Bar, etc.) fall back to vape. (3) Product detail page now shows an auto-generated marketing description + 4–5 feature bullets, built from brand + category + flavor keywords parsed from the product name (`generateDescription` / `generateFeatures` in [js/catalog.js](js/catalog.js)). Hybrid design: if a product defines its own `description` or `features` array in [data/products.json](data/products.json), those override the auto-generated text.
- **Footer mobile layout + clickable address** — on mobile (≤768px), Shop and Company columns now sit side-by-side instead of stacking, reducing scroll height; Brand and Contact remain full-width. Address is now a clickable Google Maps link (opens in new tab with `rel="noopener"`). Desktop and tablet layouts untouched.
- **Footer polish + bug fixes** — fixed wrong phone number in footer (was `470-375-3936`, replaced with real numbers: WhatsApp `+1 (678) 303-6054`, plus `+1 (470) 640-4502` and `+1 (470) 953-3565`). Completed Shop column to all 8 categories (added Pseudo, Blue Lotus, Novelties). Removed dead Privacy/Terms/Cookies placeholder links. Added small CSS polish for stacked contact values.
- **SEO + social polish** — added Open Graph tags, Twitter Card, favicon, and apple-touch-icon to all 6 pages. Normalized `theme-color` to brand `#1a3a5c` site-wide. WhatsApp/social link previews now render properly with logo + description.
- **Alt-text audit** — confirmed 100% `alt` coverage across all HTML and JS-generated `<img>` tags.
- **Breakpoint audit** — confirmed style.css and pages.css already share unified breakpoints (`1400 / 1200 / 992 / 768 / 480 / 380`). No unification work needed.
- Removed time-bound sections from case-study doc; split into project description + working tasks
- Deleted stale `NAVBAR-HEADER-ANALYSIS.md` (covered by CASE-STUDY.md now)
- Inner page simplification: category / product / brands / about / contact now use consistent `.cat-header`
- 16 brand logos sourced and wired into product cards, brands.html, product detail
- Contact info unified across site (WhatsApp +1 678-303-6054, Instagram, 3 phone numbers)
- 84 products renamed based on visual analysis (Rock On split, vape brands separated, Ultra Ohmz variants)
- Homepage rebuilt: hero bento + auto-slider, category horizontal scroll, gradient product cards, brand marquee
- Animated WhatsApp SVG button in header
- Age gate (21+) with 30-day localStorage TTL

---

## 📝 Notes

- Products JSON backup: [data/products.json.backup](data/products.json.backup)
- Asset pipeline scripts: [_incoming/](_incoming/)
- No wholesale pricing anywhere on site — WhatsApp inquiry only
- Cart / Wishlist / SignIn icons in header are decorative (no functionality)
- NOVELTIES bulk imports arrive as zip files; use [_incoming/regenerate.py](_incoming/regenerate.py) to rebuild products.json
