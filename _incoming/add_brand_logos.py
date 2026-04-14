#!/usr/bin/env python3
"""
Add brand logo paths to companies section of products.json.
Only maps brands where we have verified real logos downloaded.
"""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')

# Map: company_id -> logo_path (relative to site root)
LOGO_MAP = {
    "rock-on":           "assets/brand-logos/rock-on.png",
    "silly-dots":        "assets/brand-logos/silly-dots.jpg",
    "shroom-puff":       "assets/brand-logos/shroom-puff.jpeg",
    "featured":          "assets/brand-logos/mental-health.png",  # Mental Health = the brand under 'featured' for bluelotus
    # Note: 1-delta-8-9-gummies products are actually Mystic Labs products
    "1-delta-8-9-gummies": "assets/brand-logos/mystic-labs.png",
}

# Also update the brand's display name where it's wrong
NAME_FIXES = {
    # 'featured' company is actually Mental Health brand (blue lotus)
    "featured": "MENTAL HEALTH",
    # '1-delta-8-9-gummies' company actually sells Mystic Labs products
    "1-delta-8-9-gummies": "MYSTIC LABS",
}


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    updated_logos = 0
    updated_names = 0
    for company in data['companies']:
        cid = company['id']
        if cid in LOGO_MAP:
            company['logo'] = LOGO_MAP[cid]
            updated_logos += 1
            print(f"  LOGO: {cid} -> {LOGO_MAP[cid]}")
        if cid in NAME_FIXES:
            old_name = company['name']
            company['name'] = NAME_FIXES[cid]
            updated_names += 1
            print(f"  RENAME: {cid}: '{old_name}' -> '{NAME_FIXES[cid]}'")

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n=== DONE ===")
    print(f"Logos added: {updated_logos}")
    print(f"Names fixed: {updated_names}")


if __name__ == '__main__':
    main()
