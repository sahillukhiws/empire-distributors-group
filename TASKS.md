# Empire Distributors Group - Project Tasks

## Brand Identity
- **Color**: Dark Blue `#1a3a5c` (accent on white page)
- **Fonts**: Poppins (body) + Mona Sans (display)
- **Logo**: `assets/logos/empire-logo-removebg-preview.png`

## Contact
- WhatsApp: +1 (678) 303-6054 (primary)
- Phone: +1 (470) 640-4502 · +1 (470) 953-3565
- Instagram: https://www.instagram.com/empire_distributors/
- Email: empiredistributorsgroup@gmail.com
- Address: 2725 Mountain Industrial Blvd, Suite A5, Tucker, GA 30084

---

## ✅ COMPLETED

### Foundation
- Images optimized: 38MB → 28MB
- Fonts + dark blue accent
- All 6 pages serve 200
- 161 products, 0 missing images

### Header
- 3-layer: warning bar + main row + nav bar
- Sticky header with search dialog
- **Animated WhatsApp SVG button** in header (green with confetti particles)

### Homepage
- Hero bento: auto-slider + 4 panels
- Category horizontal scroll cards
- Product cards with gradient bg from product packaging color
- Promo bento grids + brands marquee
- Dark blue footer

### Product Data
- 84 bad-named products renamed based on visual analysis
- Rock On: 35 products / 7 product lines
- Vape brands split: Foger, Geek Bar, RAZ, Giga Bar
- Ultra Ohmz / Better Now variants differentiated

### Brand Logos
- 16 real brand logos downloaded (from official sites)
- Displayed on: product cards, brands.html, product detail page
- 9 brands still need logos (not publicly available)

### Contact Info
- WhatsApp updated to +1 (678) 303-6054 site-wide
- Instagram link wired: @empire_distributors
- 3 phone numbers in footer + contact page
- Extra numbers listed on contact page

### Inner Pages Simplification (just done)
- **category.html**: Removed text-heavy hero → simple compact header with icon + count + scrolling brand filter
- **product.html**: Removed description paragraph, "why partners choose" feature list, 3-item trust row → just SKU + category + stock + CTAs
- **brands.html**: Removed page hero + wholesale CTA section → compact header + filter + grid only
- **about.html**: Removed "4 values" feature strip, final CTA section → compact header + brief story + categories showcase
- **contact.html**: Removed wordy hero → compact header + existing cards
- All pages now use consistent `.cat-header` design
- Categories in about/category cross-sell use home page's `.cat-card-v2` style

---

## 🔄 PENDING

### Phase A (in progress): Responsive Refinement
- Unify breakpoints between style.css and pages.css (currently inconsistent: 1280/1024/720 vs 1200/992/768)
- Test each breakpoint across all pages:
  - Desktop (1400+)
  - Laptop (1200)
  - Tablet (992)
  - Mobile (768)
  - Phone (480)
  - Small phone (380)
- Touch targets ≥44px on mobile
- Verify animated WhatsApp SVG scales properly

### Not Started
- Age gate styling refresh to match brand
- Footer visual polish
- Image lazy-loading optimization
- Performance audit

---

## 📝 NOTES
- Products.json backup: `data/products.json.backup`
- Rename scripts in `_incoming/`
- No wholesale pricing anywhere - WhatsApp inquiry only
- Cart/Wishlist/SignIn icons are decorative
