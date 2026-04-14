#!/usr/bin/env python3
"""Link the final newly-found logos: OPMS and RAZ."""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')

FINAL_LOGOS = {
    "opms": "assets/brand-logos/opms.png",
    "raz": "assets/brand-logos/raz.png",
}


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    for company in data['companies']:
        if company['id'] in FINAL_LOGOS:
            company['logo'] = FINAL_LOGOS[company['id']]
            print(f"  {company['id']} -> {FINAL_LOGOS[company['id']]}")

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Final summary
    total = len(data['companies'])
    with_logo = sum(1 for c in data['companies'] if 'logo' in c)
    print(f"\n=== FINAL LOGO COVERAGE: {with_logo}/{total} brands ===\n")
    print("Brands WITH logos:")
    for c in sorted(data['companies'], key=lambda x: x['id']):
        if 'logo' in c:
            count = sum(1 for p in data['products'] if p['company'] == c['id'])
            print(f"  ✓ {c['id']:20s} ({c['name']:22s}) {count} products")

    print("\nBrands WITHOUT logos (not publicly available):")
    for c in sorted(data['companies'], key=lambda x: x['id']):
        if 'logo' not in c:
            count = sum(1 for p in data['products'] if p['company'] == c['id'])
            print(f"  ✗ {c['id']:20s} ({c['name']:22s}) {count} products")


if __name__ == '__main__':
    main()
