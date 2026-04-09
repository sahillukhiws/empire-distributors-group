#!/usr/bin/env python3
"""
Regenerate products.json from the already-organized assets/categories/ tree.
Preserves ORIGINAL uppercase names by un-slugifying filenames.
Source zip filenames were all UPPERCASE, so we match that style.
"""
import os, re, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "categories"
DATA = ROOT / "data" / "products.json"

CAT_META = {
    "vape":        {"name": "Vape",        "icon": "💨", "description": "Premium vape devices and disposables"},
    "kratom":      {"name": "Kratom",      "icon": "🌿", "description": "Premium kratom shots, powders and capsules"},
    "delta":       {"name": "Delta",       "icon": "🔥", "description": "Delta-8, Delta-9 edibles and disposables"},
    "mushroom":    {"name": "Mushroom",    "icon": "🍄", "description": "Functional mushroom gummies and more"},
    "pseudo":      {"name": "Pseudo",      "icon": "⚡", "description": "Premium pseudo products"},
    "bluelotus":   {"name": "Blue Lotus",  "icon": "🌸", "description": "Blue lotus carts, prerolls and disposables"},
    "supplements": {"name": "Supplements", "icon": "💊", "description": "Wellness shots and supplement blends"},
    "novelties":   {"name": "Novelties",   "icon": "🎁", "description": "Unique lifestyle accessories"},
}

def unslug_upper(slug: str) -> str:
    """Convert slug → uppercase name, restoring decimals and wrapping flavor variants in parens.

    'bliss-xtra-gold-shot' → 'BLISS XTRA GOLD SHOT'
    'mental-health-blue-lotus-2ct-preroll-1-5grm-each-blue-razz-blast'
        → 'MENTAL HEALTH BLUE LOTUS 2CT PREROLL 1.5GRM EACH (BLUE RAZZ BLAST)'
    """
    name = slug.replace("-", " ").upper()

    # Restore decimals inside measurements: "1 5GRM" → "1.5GRM", "0 5ML" → "0.5ML"
    name = re.sub(r"(\d) (\d)(GRM|GM|ML|MG|CT|G|OZ|L)\b", r"\1.\2\3", name)
    # Also: "1 5 GRM" variant
    name = re.sub(r"(\d) (\d) (GRM|GM|ML|MG|CT|G|OZ|L)\b", r"\1.\2 \3", name)

    # Wrap flavor variants in parens. A flavor is typically 2-4 uppercase words at the END,
    # after a main product phrase that contains at least one measurement (e.g. "4GRM", "2CT", "1GRM", "1.5GRM").
    FLAVORS = {
        "BLUE RAZZ BLAST", "PINEAPPLE PARADISE", "PINK CHAMPAGNE",
        "PURPLE DRAGON", "STRAWBERRY SPLASH", "WATERMELON GUSHERS",
        "BLUEBERRY BLAST", "WATERMELON", "MANGO", "STRAWBERRY",
        "TROPICAL", "BLUEBERRY", "GRAPE", "PEACH", "MINT",
    }
    # Sort flavors longest-first so multi-word flavors match before single words
    for flavor in sorted(FLAVORS, key=len, reverse=True):
        if name.endswith(" " + flavor):
            base = name[: -(len(flavor) + 1)]
            name = f"{base} ({flavor})"
            return name.strip()
    return name.strip()

def unslug_brand(slug: str) -> str:
    """Brand display name, also uppercase to match source."""
    return slug.replace("-", " ").upper()

def main():
    all_products = []
    companies = {}

    for cat_dir in sorted(ASSETS.iterdir()):
        if not cat_dir.is_dir():
            continue
        cat_id = cat_dir.name
        if cat_id not in CAT_META:
            continue

        for brand_dir in sorted(cat_dir.iterdir()):
            if not brand_dir.is_dir():
                continue
            brand_slug = brand_dir.name
            brand_name = unslug_brand(brand_slug)

            if brand_slug not in companies:
                companies[brand_slug] = {
                    "id": brand_slug,
                    "name": brand_name,
                    "category": cat_id,
                }

            for f in sorted(brand_dir.iterdir()):
                if not f.is_file():
                    continue
                ext = f.suffix.lower()
                if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
                    continue

                slug = f.stem  # already slugified
                name = unslug_upper(slug)  # ORIGINAL CASE = UPPERCASE

                rel = f.relative_to(ROOT).as_posix()
                all_products.append({
                    "id": f"{cat_id}-{brand_slug}-{slug}"[:90],
                    "sku": slug.upper(),
                    "name": name,
                    "company": brand_slug,
                    "category": cat_id,
                    "image": rel,
                    "featured": False,
                    "inStock": True,
                })

    # Mark first 2 of each category as featured
    by_cat = {}
    for p in all_products:
        by_cat.setdefault(p["category"], []).append(p)
    for cat, items in by_cat.items():
        for p in items[:2]:
            p["featured"] = True

    data = {
        "categories": [{"id": cid, **meta} for cid, meta in CAT_META.items()],
        "companies": sorted(companies.values(), key=lambda c: c["name"]),
        "products": all_products,
    }

    DATA.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✓ wrote {DATA.relative_to(ROOT)} - {len(all_products)} products, {len(companies)} brands")

if __name__ == "__main__":
    main()
