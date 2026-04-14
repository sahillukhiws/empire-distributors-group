#!/usr/bin/env python3
"""
Final cleanup:
1. Merge duplicate Mystic Labs entries (1-delta-8-9-gummies + mystic-labs)
2. Remove empty/unused companies (featured, vapes-new, 1-delta-8-9-gummies after merge)
"""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    # Merge 1-delta-8-9-gummies -> mystic-labs
    # First reassign its products
    merged = 0
    for p in data['products']:
        if p['company'] == '1-delta-8-9-gummies':
            p['company'] = 'mystic-labs'
            merged += 1

    # Remove duplicate/empty companies
    from collections import Counter
    counts = Counter(p['company'] for p in data['products'])
    before = len(data['companies'])
    data['companies'] = [c for c in data['companies'] if counts.get(c['id'], 0) > 0]
    removed = before - len(data['companies'])

    # Make sure mystic-labs company has the logo
    for c in data['companies']:
        if c['id'] == 'mystic-labs' and 'logo' not in c:
            c['logo'] = 'assets/brand-logos/mystic-labs.png'

    # Final sort
    data['companies'].sort(key=lambda c: c['id'])

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Products reassigned: {merged}")
    print(f"Empty companies removed: {removed}")
    print(f"Final company count: {len(data['companies'])}")

    print("\n=== FINAL STATE ===")
    for c in sorted(data['companies'], key=lambda x: x['id']):
        logo = '✓' if 'logo' in c else ' '
        count = counts.get(c['id'], 0)
        print(f"  [{logo}] {c['id']:20s} ({c['name']:22s}) {count} products")


if __name__ == '__main__':
    main()
