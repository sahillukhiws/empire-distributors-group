#!/usr/bin/env python3
"""
Split the 'featured' catch-all company into proper individual brands.
The 'featured' currently groups:
  - Blue Lotus: Mental Health brand
  - Kratom: OPMS, MIT 45, Bliss Xtra, K-Shot, Feel Free, Kanva, Mystic Lab, Vivazen

This script:
1. Creates individual brand companies for each
2. Reassigns products to correct companies
3. Keeps 'featured' for backward compatibility but removes its products
4. Fixes typos ("FEEK FREE" -> "FEEL FREE")
5. Maps logos where available
"""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')

# Brand prefix detection from image filename (or product name)
# Order matters - more specific first
BRAND_RULES = [
    # (image-filename-prefix, company_id, company_name, logo_filename_or_None)
    ("mental-health-blue-lotus", "mental-health", "MENTAL HEALTH", "mental-health.png"),
    ("opms-", "opms", "OPMS", None),
    ("opms.png", "opms", "OPMS", None),
    ("mit-45-", "mit-45", "MIT 45", "mit-45.png"),
    ("bliss-xtra-", "bliss-xtra", "BLISS XTRA", "bliss-xtra.png"),
    ("feel-free", "feel-free", "FEEL FREE", "feel-free.webp"),
    ("feek-free", "feel-free", "FEEL FREE", "feel-free.webp"),  # typo correction
    ("kanva-", "kanva", "KANVA BOTANICALS", "kanva.png"),
    ("kshot-", "kshot", "KSHOT", "kshot.png"),
    ("mystic-lab", "mystic-labs", "MYSTIC LABS", "mystic-labs.png"),
    ("vivazen-", "vivazen", "VIVAZEN", None),
    ("viva-xtreme", "viva-xtreme", "VIVA XTREME", None),
]

# Also vapes-new should be split
VAPE_RULES = [
    # These match based on product name content (since filenames are img-XXXX.jpg)
    # But I already renamed products with proper brand names - detect from name
    ("FOGER", "foger", "FOGER", None),
    ("GEEK BAR", "geek-bar", "GEEK BAR", "geek-bar.jpg"),
    ("RAZ", "raz", "RAZ", None),
    ("GIGA BAR", "giga-bar", "GIGA BAR", None),
]


def detect_brand(product):
    """Detect the proper brand for a product."""
    image_file = os.path.basename(product['image']).lower()
    name = product['name'].upper()

    # For kratom/bluelotus (under 'featured' company)
    if product['company'] == 'featured':
        for prefix, cid, cname, logo in BRAND_RULES:
            if image_file.startswith(prefix):
                return cid, cname, logo

    # For vapes (under 'vapes-new' company)
    if product['company'] == 'vapes-new':
        for name_prefix, cid, cname, logo in VAPE_RULES:
            if name.startswith(name_prefix):
                return cid, cname, logo

    return None, None, None


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    # Collect all new brand companies we need to create
    new_companies = {}
    company_category_map = {}

    for p in data['products']:
        new_cid, new_cname, logo = detect_brand(p)
        if new_cid:
            if new_cid not in new_companies:
                new_companies[new_cid] = {
                    "id": new_cid,
                    "name": new_cname,
                    "category": p['category'],
                }
                if logo:
                    new_companies[new_cid]['logo'] = f"assets/brand-logos/{logo}"

    # Add any new companies that don't already exist
    existing_ids = {c['id'] for c in data['companies']}
    added = 0
    for cid, company_data in new_companies.items():
        if cid not in existing_ids:
            data['companies'].append(company_data)
            added += 1
            print(f"  NEW COMPANY: {cid} ({company_data['name']})")

    # Reassign products to new companies
    reassigned = 0
    name_fixes = 0
    for p in data['products']:
        new_cid, new_cname, _ = detect_brand(p)
        if new_cid and p['company'] != new_cid:
            old_c = p['company']
            p['company'] = new_cid

            # Also fix product name typos (FEEK FREE -> FEEL FREE)
            if 'FEEK FREE' in p['name']:
                p['name'] = p['name'].replace('FEEK FREE', 'FEEL FREE')
                name_fixes += 1

            # Update product ID to reflect new brand (but keep same slug for URL compat)
            # Don't change IDs to avoid breaking links

            reassigned += 1
            print(f"  REASSIGN: {p['name'][:50]}... {old_c} -> {new_cid}")

    # Keep companies sorted alphabetically by ID
    data['companies'].sort(key=lambda c: c['id'])

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n=== DONE ===")
    print(f"New brand companies added: {added}")
    print(f"Products reassigned: {reassigned}")
    print(f"Name typos fixed: {name_fixes}")

    # Final summary
    from collections import Counter
    company_count = Counter(p['company'] for p in data['products'])
    print(f"\n=== PRODUCTS PER COMPANY (after split) ===")
    for cid in sorted(company_count):
        print(f"  {cid}: {company_count[cid]}")


if __name__ == '__main__':
    main()
