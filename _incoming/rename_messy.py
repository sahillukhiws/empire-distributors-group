#!/usr/bin/env python3
"""
Rename the remaining 22 messy-named products (Ultra Ohmz + Better Now)
based on visual inspection of their packaging.
"""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')

RENAMES = {
    # ULTRA OHMZ MEGA - 10-pack display box (2-tab cards, 125mg/tab, 500mg total)
    "ultraohmzpseudomega-capsules-box-mockup-bluerazz-011426.jpg": (
        "ULTRA OHMZ PSEUDO MEGA 10-PACK DISPLAY (BLUE RAZZ) 125MG/500MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-10PK-BLUE-RAZZ"
    ),
    "ultraohmzpseudomega-capsules-box-mockup-strawberry-011426.jpg": (
        "ULTRA OHMZ PSEUDO MEGA 10-PACK DISPLAY (STRAWBERRY) 125MG/500MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-10PK-STRAWBERRY"
    ),
    "ultraohmzpseudomega-capsules-box-mockup-watermelon-011426.jpg": (
        "ULTRA OHMZ PSEUDO MEGA 10-PACK DISPLAY (WATERMELON) 125MG/500MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-10PK-WATERMELON"
    ),

    # ULTRA OHMZ MEGA - Single jar bottle (10 tabs, 160mg/tab, 1600mg total)
    "ultraohmzpseudomega-capsules-mockup-blueberry-011226.jpg": (
        "ULTRA OHMZ PSEUDO MEGA JAR 10CT (BLUEBERRY) 160MG/1600MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-JAR-BLUEBERRY"
    ),
    "ultraohmzpseudomega-capsules-mockup-cherry-011226.jpg": (
        "ULTRA OHMZ PSEUDO MEGA JAR 10CT (CHERRY) 160MG/1600MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-JAR-CHERRY"
    ),
    "ultraohmzpseudomega-capsules-mockup-strawberry-011226.jpg": (
        "ULTRA OHMZ PSEUDO MEGA JAR 10CT (STRAWBERRY) 160MG/1600MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-JAR-STRAWBERRY"
    ),
    "ultraohmzpseudomega-capsules-mockup-watermelon-011226.jpg": (
        "ULTRA OHMZ PSEUDO MEGA JAR 10CT (WATERMELON) 160MG/1600MG",
        "ULTRA-OHMZ-PSEUDO-MEGA-JAR-WATERMELON"
    ),

    # ULTRA OHMZ SUPREME - 2-tab 30-pack counter (125mg/tab, 250mg total)
    "ultraohmzpseudosupreme-capsules-mockup-box-bluerazz-010526.jpg": (
        "ULTRA OHMZ PSEUDO SUPREME 2-TAB 30-PACK (BLUE RAZZ) 125MG/250MG",
        "ULTRA-OHMZ-SUPREME-2TAB-30PK-BLUE-RAZZ"
    ),
    "ultraohmzpseudosupreme-capsules-mockup-box-mixedberry-010526.jpg": (
        "ULTRA OHMZ PSEUDO SUPREME 2-TAB 30-PACK (MIXED BERRY) 125MG/250MG",
        "ULTRA-OHMZ-SUPREME-2TAB-30PK-MIXED-BERRY"
    ),
    "ultraohmzpseudosupreme-capsules-mockup-box-strawberry-010526.jpg": (
        "ULTRA OHMZ PSEUDO SUPREME 2-TAB 30-PACK (STRAWBERRY) 125MG/250MG",
        "ULTRA-OHMZ-SUPREME-2TAB-30PK-STRAWBERRY"
    ),

    # ULTRA OHMZ SUPREME - 1-tab 30-pack counter (100mg/tab)
    "ultraohmzpseudosupreme-capsules-mockup-box-bluerazz-110725.jpg": (
        "ULTRA OHMZ PSEUDO SUPREME 1-TAB 30-PACK (BLUE RAZZ) 100MG",
        "ULTRA-OHMZ-SUPREME-1TAB-30PK-BLUE-RAZZ"
    ),
    "ultraohmzpseudosupreme-capsules-mockup-box-mixedberry-110725.jpg": (
        "ULTRA OHMZ PSEUDO SUPREME 1-TAB 30-PACK (MIXED BERRY) 100MG",
        "ULTRA-OHMZ-SUPREME-1TAB-30PK-MIXED-BERRY"
    ),
    "ultraohmzpseudosupreme-capsules-mockup-box-strawberry-110725.jpg": (
        "ULTRA OHMZ PSEUDO SUPREME 1-TAB 30-PACK (STRAWBERRY) 100MG",
        "ULTRA-OHMZ-SUPREME-1TAB-30PK-STRAWBERRY"
    ),

    # BETTER NOW - 4-count card display box (400mg/4ct/100mg each)
    "betternow-capsules-box-mockup-blueberry-012026.jpg": (
        "BETTER NOW CATS CLAW 4-COUNT CARD DISPLAY (BLUEBERRY) 400MG",
        "BETTER-NOW-CATS-CLAW-4CT-CARD-BLUEBERRY"
    ),
    "betternow-capsules-box-mockup-strawberry-012026.jpg": (
        "BETTER NOW CATS CLAW 4-COUNT CARD DISPLAY (STRAWBERRY) 400MG",
        "BETTER-NOW-CATS-CLAW-4CT-CARD-STRAWBERRY"
    ),
    "betternow-capsules-box-mockup-watermelon-012026.jpg": (
        "BETTER NOW CATS CLAW 4-COUNT CARD DISPLAY (WATERMELON) 400MG",
        "BETTER-NOW-CATS-CLAW-4CT-CARD-WATERMELON"
    ),

    # BETTER NOW - Single jar bottle (1000mg/10ct/100mg each)
    "betternow-capsules-jar-mockup-blueberry-012026.jpg": (
        "BETTER NOW CATS CLAW JAR 10CT (BLUEBERRY) 1000MG",
        "BETTER-NOW-CATS-CLAW-JAR-10CT-BLUEBERRY"
    ),
    "betternow-capsules-jar-mockup-strawberry-012026.jpg": (
        "BETTER NOW CATS CLAW JAR 10CT (STRAWBERRY) 1000MG",
        "BETTER-NOW-CATS-CLAW-JAR-10CT-STRAWBERRY"
    ),
    "betternow-capsules-jar-mockup-watermelon-012026.jpg": (
        "BETTER NOW CATS CLAW JAR 10CT (WATERMELON) 1000MG",
        "BETTER-NOW-CATS-CLAW-JAR-10CT-WATERMELON"
    ),

    # BETTER NOW - 30-pack counter display (2ct packets, 200mg/pack)
    "betternow-capsules-mockup-box-blueberry-020926.jpg": (
        "BETTER NOW CATS CLAW 30-PACK COUNTER DISPLAY (BLUEBERRY) 2CT/200MG",
        "BETTER-NOW-CATS-CLAW-30PK-BLUEBERRY"
    ),
    "betternow-capsules-mockup-box-strawberry-020926.jpg": (
        "BETTER NOW CATS CLAW 30-PACK COUNTER DISPLAY (STRAWBERRY) 2CT/200MG",
        "BETTER-NOW-CATS-CLAW-30PK-STRAWBERRY"
    ),
    "betternow-capsules-mockup-box-watermelon-020926.jpg": (
        "BETTER NOW CATS CLAW 30-PACK COUNTER DISPLAY (WATERMELON) 2CT/200MG",
        "BETTER-NOW-CATS-CLAW-30PK-WATERMELON"
    ),
}


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    updated = 0
    for product in data['products']:
        image_file = os.path.basename(product['image'])
        if image_file in RENAMES:
            new_name, new_sku = RENAMES[image_file]
            old_name = product['name']
            product['name'] = new_name
            product['sku'] = new_sku
            updated += 1
            print(f"  {image_file}")
            print(f"    OLD: {old_name}")
            print(f"    NEW: {new_name}")

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n=== DONE ===")
    print(f"Updated: {updated} products")


if __name__ == '__main__':
    main()
