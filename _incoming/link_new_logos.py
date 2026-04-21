#!/usr/bin/env python3
"""Link remaining brand logos to companies in products.json."""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')

# Additional logos to link
LOGO_UPDATES = {
    "foger": "assets/brand-logos/foger.png",
    "ultra-ohmz": "assets/brand-logos/ultra-ohmz.png",
    "kanna-kava": "assets/brand-logos/kanva.png",  # Kanna Kava = Kanva Botanicals product
}


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    updated = 0
    for company in data['companies']:
        if company['id'] in LOGO_UPDATES:
            company['logo'] = LOGO_UPDATES[company['id']]
            updated += 1
            print(f"  {company['id']} ({company['name']}) -> {LOGO_UPDATES[company['id']]}")

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nUpdated {updated} companies")

    # Summary
    total = len(data['companies'])
    with_logo = sum(1 for c in data['companies'] if 'logo' in c)
    print(f"\n=== FINAL LOGO COVERAGE ===")
    print(f"Brands with logos: {with_logo} / {total}")
    print(f"\nBrands WITHOUT logos (may need manual sourcing):")
    for c in data['companies']:
        if 'logo' not in c:
            count = sum(1 for p in data['products'] if p['company'] == c['id'])
            print(f"  {c['id']:20s} ({c['name']:22s}) {count} products")


if __name__ == '__main__':
    main()
