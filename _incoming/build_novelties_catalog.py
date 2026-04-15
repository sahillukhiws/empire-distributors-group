#!/usr/bin/env python3
"""
Build products.json entries for the 61 novelty files.
- Two companies: novelties-lighters (for lighter products) + novelties-accessories (misc)
- Product name: derived from filename slug, prettified
- category: novelties
- image: relative path to .jpg (rembg step later will add .png siblings)
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
PRODUCTS = ROOT / "data" / "products.json"
LIGHTERS = ROOT / "assets" / "categories" / "novelties" / "lighters"
MISC = ROOT / "assets" / "categories" / "novelties" / "misc"

# Nice display names for misc items (based on inspection)
MISC_NAMES = {
    "high-times-socks-display": "HIGH TIMES SOCKS DISPLAY",
    "hidden-pocket-socks-48ct": "HIDDEN POCKET SOCKS 48CT",
    "jewelry-display-crystals-roses": "JEWELRY DISPLAY CRYSTALS & ROSES",
    "azza-air-fresheners-200-300ml": "AZZA AIR FRESHENERS 200/300ML",
    "aris-body-spray-perfume-set": "ARIS BODY SPRAY & PERFUME SET",
    "digital-scales-display": "DIGITAL SCALES DISPLAY",
    "satya-nag-champa-agarbatti": "SATYA NAG CHAMPA AGARBATTI",
    "satya-nag-champa-84ct-display": "SATYA NAG CHAMPA 84CT DISPLAY",
    "budeez-caps-display-144ct": "BUDEEZ CAPS DISPLAY 144CT",
    "warner-premium-pinnacle-batteries": "WARNER PREMIUM/PINNACLE BATTERIES",
    "taisun-charger-display": "TAISUN CHARGER DISPLAY",
    "tactical-stoneman-knife-display": "TACTICAL & STONEMAN KNIFE DISPLAY",
    "assorted-knife-jars": "ASSORTED KNIFE JARS",
    "car-logo-keychains": "CAR LOGO KEYCHAINS",
    "keychain-display-300ct": "KEYCHAIN DISPLAY 300CT",
    "bracelet-display-50ct": "BRACELET DISPLAY 50CT",
    "chorboy-scrubber-display": "CHORBOY SCRUBBER DISPLAY",
    "assorted-premium-knives-jars": "ASSORTED PREMIUM KNIVES JARS",
    "knife-display-48ct-96ct": "KNIFE DISPLAY 48CT / 96CT",
}

def prettify_lighter(stem: str) -> str:
    """dragon-lighter-25ct -> DRAGON LIGHTER 25CT"""
    parts = stem.replace("-", " ").upper().split()
    # drop trailing numeric noise like "1" "2" "3" (dup markers)
    if parts and parts[-1] in ("1", "2", "3") and len(parts) > 1:
        parts = parts[:-1]
    return " ".join(parts)


def main():
    data = json.load(open(PRODUCTS))

    # add companies if not present
    existing_ids = {c["id"] for c in data["companies"]}
    if "novelties-lighters" not in existing_ids:
        data["companies"].append({
            "id": "novelties-lighters",
            "name": "NOVELTY LIGHTERS",
            "category": "novelties",
        })
    if "novelties-accessories" not in existing_ids:
        data["companies"].append({
            "id": "novelties-accessories",
            "name": "NOVELTY ACCESSORIES",
            "category": "novelties",
        })

    # remove any pre-existing novelty products so this is idempotent
    data["products"] = [p for p in data["products"] if p.get("category") != "novelties"]

    new_products = []

    # LIGHTERS
    for f in sorted(LIGHTERS.iterdir()):
        if f.is_dir() or f.name.startswith(".") or f.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        stem = f.stem
        name = prettify_lighter(stem)
        pid = f"novelties-lighters-{stem}"
        new_products.append({
            "id": pid,
            "sku": stem.upper().replace("-", "-"),
            "name": name,
            "company": "novelties-lighters",
            "category": "novelties",
            "image": f"assets/categories/novelties/lighters/{f.name}",
            "inStock": True,
        })

    # MISC
    for f in sorted(MISC.iterdir()):
        if f.is_dir() or f.name.startswith(".") or f.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        stem = f.stem
        name = MISC_NAMES.get(stem, stem.replace("-", " ").upper())
        pid = f"novelties-accessories-{stem}"
        new_products.append({
            "id": pid,
            "sku": stem.upper(),
            "name": name,
            "company": "novelties-accessories",
            "category": "novelties",
            "image": f"assets/categories/novelties/misc/{f.name}",
            "inStock": True,
        })

    data["products"].extend(new_products)

    json.dump(data, open(PRODUCTS, "w"), indent=2)
    print(f"Added {len(new_products)} novelty products")
    print(f"Total products: {len(data['products'])}")
    print(f"Total companies: {len(data['companies'])}")


if __name__ == "__main__":
    main()
