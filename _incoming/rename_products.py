#!/usr/bin/env python3
"""
Renames 62 bad-named products in products.json based on visual analysis of their images.
Each mapping is derived from actually reading the product packaging from the image.
"""
import json
import os
import sys

# Path to products.json relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'products.json')

# Map: original filename (without path) -> (new name, new sku)
RENAMES = {
    # DELTA / 1-DELTA-8-9-GUMMIES (Mystic Labs actually)
    "delta-8-gummies-1.jpg": (
        "MYSTIC LABS DELTA-8 THC GUMMIES COLLECTION",
        "MYSTIC-LABS-D8-GUMMIES-COLLECTION"
    ),
    "ml-product-photo-12ct-gummies.jpg": (
        "MYSTIC LABS DELTA-8 GUMMIES 12CT VARIETY PACK",
        "MYSTIC-LABS-D8-GUMMIES-12CT-VARIETY"
    ),

    # DELTA / ROCK ON - 2-pack pre-rolls (3x 1.55g, 4.65g total)
    "img-20250411-wa0077.jpg": (
        "ROCK ON THC-P PRE-ROLL 3CT (OG KUSH)",
        "ROCK-ON-THCP-PREROLL-3CT-OG-KUSH"
    ),
    "img-20250411-wa0078.jpg": (
        "ROCK ON THC-P PRE-ROLL 3CT (FRUITY PEBBLES)",
        "ROCK-ON-THCP-PREROLL-3CT-FRUITY-PEBBLES"
    ),
    "img-20250411-wa0079.jpg": (
        "ROCK ON THC-P PRE-ROLL 3CT (SOUR DIESEL)",
        "ROCK-ON-THCP-PREROLL-3CT-SOUR-DIESEL"
    ),
    "img-20250411-wa0080.jpg": (
        "ROCK ON THC-P PRE-ROLL 3CT (BERRY DREAM)",
        "ROCK-ON-THCP-PREROLL-3CT-BERRY-DREAM"
    ),
    "img-20250411-wa0083.jpg": (
        "ROCK ON THC-P PRE-ROLL 3CT (CALI RUNTZ)",
        "ROCK-ON-THCP-PREROLL-3CT-CALI-RUNTZ"
    ),

    # ROCK ON 10-pack display boxes
    "img-20250411-wa0081.jpg": (
        "ROCK ON THC-P PRE-ROLL 10-PACK DISPLAY (OG KUSH)",
        "ROCK-ON-THCP-PREROLL-10PK-OG-KUSH"
    ),
    "img-20250411-wa0082.jpg": (
        "ROCK ON THC-P PRE-ROLL 10-PACK DISPLAY (CALI RUNTZ)",
        "ROCK-ON-THCP-PREROLL-10PK-CALI-RUNTZ"
    ),
    "img-20250411-wa0084.jpg": (
        "ROCK ON THC-P PRE-ROLL 10-PACK DISPLAY (FRUITY PEBBLES)",
        "ROCK-ON-THCP-PREROLL-10PK-FRUITY-PEBBLES"
    ),
    "img-20250411-wa0085.jpg": (
        "ROCK ON THC-P PRE-ROLL 10-PACK DISPLAY (BERRY DREAM)",
        "ROCK-ON-THCP-PREROLL-10PK-BERRY-DREAM"
    ),
    "img-20250411-wa0086.jpg": (
        "ROCK ON THC-P PRE-ROLL 10-PACK DISPLAY (SOUR DIESEL)",
        "ROCK-ON-THCP-PREROLL-10PK-SOUR-DIESEL"
    ),

    # ROCK ON THC-P Dabs 6-pack 5g each
    "img-20250411-wa0087.jpg": (
        "ROCK ON THC-P LIVE RESIN DABS 6-PACK (SOUR SPACE CANDY)",
        "ROCK-ON-THCP-DABS-6PK-SOUR-SPACE-CANDY"
    ),
    "img-20250411-wa0088.jpg": (
        "ROCK ON THC-P LIVE RESIN DABS 6-PACK (PINEAPPLE EXPRESS)",
        "ROCK-ON-THCP-DABS-6PK-PINEAPPLE-EXPRESS"
    ),
    "img-20250411-wa0089.jpg": (
        "ROCK ON THC-P LIVE RESIN DABS 6-PACK (BLUEBERRY KUSH)",
        "ROCK-ON-THCP-DABS-6PK-BLUEBERRY-KUSH"
    ),

    # ROCK ON D9 Live Resin Disposable 6g 35K puffs
    "img-20250411-wa0103.jpg": (
        "ROCK ON D9 LIVE RESIN DISPOSABLE 6G 35K (ALASKAN THUNDERFUCK)",
        "ROCK-ON-D9-DISPOSABLE-6G-ALASKAN-THUNDERFUCK"
    ),
    "img-20250411-wa0105.jpg": (
        "ROCK ON D9 LIVE RESIN DISPOSABLE 6G 35K (GREEN CRACK)",
        "ROCK-ON-D9-DISPOSABLE-6G-GREEN-CRACK"
    ),
    "img-20250411-wa0107.jpg": (
        "ROCK ON D9 LIVE RESIN DISPOSABLE 6G 35K (BLUE DREAM)",
        "ROCK-ON-D9-DISPOSABLE-6G-BLUE-DREAM"
    ),
    "img-20250411-wa0108.jpg": (
        "ROCK ON D9 LIVE RESIN DISPOSABLE 6G 35K (SUPER BOOF)",
        "ROCK-ON-D9-DISPOSABLE-6G-SUPER-BOOF"
    ),
    "img-20250411-wa0113.jpg": (
        "ROCK ON D9 LIVE RESIN DISPOSABLE 6G 35K (PURPLE PUNCH)",
        "ROCK-ON-D9-DISPOSABLE-6G-PURPLE-PUNCH"
    ),

    # ROCK ON THC-P 2-Gram Pre-Roll Jars (40 units)
    "img-20250522-wa0266.jpg": (
        "ROCK ON THC-P LIVE RESIN 2G PRE-ROLL JAR 40CT (SOUR DIESEL)",
        "ROCK-ON-THCP-JAR-40CT-SOUR-DIESEL"
    ),
    "img-20250522-wa0267.jpg": (
        "ROCK ON THC-P LIVE RESIN 2G PRE-ROLL JAR 40CT (CALI RUNTZ)",
        "ROCK-ON-THCP-JAR-40CT-CALI-RUNTZ"
    ),
    "img-20250522-wa0268.jpg": (
        "ROCK ON THC-P LIVE RESIN 2G PRE-ROLL JAR 40CT (FRUITY PEBBLES)",
        "ROCK-ON-THCP-JAR-40CT-FRUITY-PEBBLES"
    ),
    "img-20250522-wa0269.jpg": (
        "ROCK ON THC-P LIVE RESIN 2G PRE-ROLL JAR 40CT (OG KUSH)",
        "ROCK-ON-THCP-JAR-40CT-OG-KUSH"
    ),
    "img-20250522-wa0270.jpg": (
        "ROCK ON THC-P LIVE RESIN 2G PRE-ROLL JAR 40CT (BERRY DREAM)",
        "ROCK-ON-THCP-JAR-40CT-BERRY-DREAM"
    ),

    # ROCK ON Pure THC Gummies (20ct bags, 1000mg)
    "img-20250523-wa0044.jpg": (
        "ROCK ON PURE THC GUMMIES 20CT 1000MG (BLUE RAZZ BURST)",
        "ROCK-ON-PURE-THC-GUMMIES-20CT-BLUE-RAZZ"
    ),
    "img-20250523-wa0045.jpg": (
        "ROCK ON PURE THC GUMMIES 20CT 1000MG (WATERMELON GUSHERS)",
        "ROCK-ON-PURE-THC-GUMMIES-20CT-WATERMELON"
    ),
    "img-20250523-wa0046.jpg": (
        "ROCK ON PURE THC GUMMIES 20CT 1000MG (TROPICAL PUNCH)",
        "ROCK-ON-PURE-THC-GUMMIES-20CT-TROPICAL"
    ),
    "img-20250523-wa0047.jpg": (
        "ROCK ON PURE THC GUMMIES 20CT 1000MG (STRAWBERRY HAZE)",
        "ROCK-ON-PURE-THC-GUMMIES-20CT-STRAWBERRY"
    ),

    # ROCK ON gummies display boxes
    "img-20250523-wa0048.jpg": (
        "ROCK ON PURE THC GUMMIES DISPLAY BOX 6CT (BLUE RAZZ BURST)",
        "ROCK-ON-PURE-THC-GUMMIES-DISPLAY-BLUE-RAZZ"
    ),
    "img-20250523-wa0049.jpg": (
        "ROCK ON PURE THC GUMMIES DISPLAY BOX 6CT (VARIETY)",
        "ROCK-ON-PURE-THC-GUMMIES-DISPLAY-VARIETY"
    ),

    # ROCK ON variety pack
    "img-20250604-wa0179.jpg": (
        "ROCK ON THC LIVE RESIN GUMMIES VARIETY 5-FLAVOR PACK",
        "ROCK-ON-LIVE-RESIN-GUMMIES-VARIETY-PACK"
    ),

    # ROCK ON THC Live Resin Gummies 30-bag display counter
    "img-20250604-wa0176.jpg": (
        "ROCK ON THC LIVE RESIN GUMMIES 30-BAG COUNTER DISPLAY (BLUE RAZZ BURST)",
        "ROCK-ON-LIVE-RESIN-GUMMIES-30BAG-BLUE-RAZZ"
    ),
    "img-20250604-wa0177.jpg": (
        "ROCK ON THC LIVE RESIN GUMMIES 30-BAG COUNTER DISPLAY (WATERMELON GUSHERS)",
        "ROCK-ON-LIVE-RESIN-GUMMIES-30BAG-WATERMELON"
    ),
    "img-20250604-wa0178.jpg": (
        "ROCK ON THC LIVE RESIN GUMMIES 30-BAG COUNTER DISPLAY (TROPICAL PUNCH)",
        "ROCK-ON-LIVE-RESIN-GUMMIES-30BAG-TROPICAL"
    ),
    "whatsapp-image-2025-06-04-at-18-09-29-8f5e8ee6.jpg": (
        "ROCK ON THC LIVE RESIN GUMMIES 30-BAG COUNTER DISPLAY (GRAPE APE)",
        "ROCK-ON-LIVE-RESIN-GUMMIES-30BAG-GRAPE-APE"
    ),
    "whatsapp-image-2025-06-04-at-18-15-28-64b204f4.jpg": (
        "ROCK ON THC LIVE RESIN GUMMIES 30-BAG COUNTER DISPLAY (STRAWBERRY HAZE)",
        "ROCK-ON-LIVE-RESIN-GUMMIES-30BAG-STRAWBERRY"
    ),

    # MUSHROOM / SHROOM PUFF
    "shroom-pugg-gummies.jpg": (
        "SHROOM PUFF MAGIC MUSHROOM GUMMIES DISPLAY (3 FLAVORS)",
        "SHROOM-PUFF-MAGIC-MUSHROOM-GUMMIES-DISPLAY"
    ),

    # PSEUDO / LUCID
    "photoroom-20260325-155055.jpg": (
        "LUCID PREMIUM ALKALOIDS PSEUDO BLEND CHEWABLES 200MG 50CT",
        "LUCID-PSEUDO-BLEND-CHEWABLES-200MG-50CT"
    ),

    # SUPPLEMENTS / BETTER NOW
    "whatsapp-image-2026-04-07-at-5-28-35-pm.jpg": (
        "BETTER NOW CATS CLAW EXTRACT 200MG 2CT (WATERMELON)",
        "BETTER-NOW-CATS-CLAW-200MG-2CT-WATERMELON"
    ),
    "whatsapp-image-2026-04-07-at-5-29-14-pm.jpg": (
        "BETTER NOW CATS CLAW EXTRACT 200MG 2CT (BLUEBERRY)",
        "BETTER-NOW-CATS-CLAW-200MG-2CT-BLUEBERRY"
    ),

    # ZEN POWER SHOT
    "img-7056.jpg": (
        "ZEN POWER 2OZ ENERGY SHOT DISPLAY BOX",
        "ZEN-POWER-2OZ-ENERGY-SHOT-DISPLAY"
    ),
    "img-7057.png": (
        "ZEN POWER 2 FL OZ ENERGY SHOT 3-PACK",
        "ZEN-POWER-2FL-OZ-SHOT-3PACK"
    ),

    # VAPE - FOGER Switch Pro family
    "file-003.png": (
        "FOGER SWITCH PRO DISPOSABLE & POWER BANK 30K/18K",
        "FOGER-SWITCH-PRO-DISPOSABLE-POWER-BANK"
    ),
    "img-6924.jpg": (
        "FOGER SWITCH PRO 30K DISPOSABLE (KIWI DRAGON BERRY)",
        "FOGER-SWITCH-PRO-30K-KIWI-DRAGON-BERRY"
    ),
    "img-6925.jpg": (
        "FOGER SWITCH PRO DUAL MODE 30K/18K DEVICE",
        "FOGER-SWITCH-PRO-DUAL-MODE-30K"
    ),
    "img-6926.jpg": (
        "FOGER SWITCH PRO REPLACEMENT POD (MEXICO MANGO)",
        "FOGER-SWITCH-PRO-POD-MEXICO-MANGO"
    ),
    "img-6927.jpg": (
        "FOGER SWITCH PRO POD 19ML 30K (WATERMELON ICE)",
        "FOGER-SWITCH-PRO-POD-WATERMELON-ICE"
    ),

    # VAPE - FOGER Bit 35K family
    "img-6922.jpg": (
        "FOGER BIT 35K CLEAR TANK DISPOSABLE",
        "FOGER-BIT-35K-CLEAR-TANK"
    ),
    "img-6923.png": (
        "FOGER BIT 35K DISPOSABLE (BITCOIN EDITION 3-PACK)",
        "FOGER-BIT-35K-BITCOIN-EDITION"
    ),

    # VAPE - GEEK BAR family
    "file-013.jpg": (
        "GEEK BAR PULSE 25K PUFFS DISPOSABLE (3 FLAVORS)",
        "GEEK-BAR-PULSE-25K-3FLAVOR"
    ),
    "img-6230.jpg": (
        "GEEK BAR PULSE 25K DISPOSABLE (PLANET EDITION)",
        "GEEK-BAR-PULSE-25K-PLANET"
    ),
    "img-6933.png": (
        "GEEK BAR PULSE COLLECTION (RED, BLUE, PURPLE)",
        "GEEK-BAR-PULSE-COLLECTION"
    ),
    "img-6934.jpg": (
        "GEEK BAR PULSE X 3D CURVED SCREEN DISPOSABLE",
        "GEEK-BAR-PULSE-X-3D-SCREEN"
    ),
    "img-6935.jpg": (
        "GEEK BAR PULSE X 25K CONSTELLATION (3 COLORS)",
        "GEEK-BAR-PULSE-X-25K-CONSTELLATION"
    ),

    # VAPE - RAZ LTX family
    "img-6928.gif": (
        "RAZ LTX 25K DISPOSABLE BOOST MODE (ANIMATED)",
        "RAZ-LTX-25K-BOOST-MODE"
    ),
    "img-6929.jpg": (
        "RAZ LTX 25K FIRE & ICE DISPOSABLE",
        "RAZ-LTX-25K-FIRE-ICE"
    ),
    "img-6930.jpg": (
        "RAZ LTX 25K DISPOSABLE (BANGIN SOUR BERRIES)",
        "RAZ-LTX-25K-BANGIN-SOUR-BERRIES"
    ),
    "img-6931.jpg": (
        "RAZ LTX 25K GAME-CHANGER DISPOSABLE",
        "RAZ-LTX-25K-GAME-CHANGER"
    ),

    # VAPE - GIGA BAR family
    "img-6936.jpg": (
        "GIGA BAR PULSE X DISPOSABLE (SPACE EDITION)",
        "GIGA-BAR-PULSE-X-SPACE"
    ),
    "img-6937.png": (
        "GIGA BAR PULSE X 25K/15K DUAL MODE DISPOSABLE",
        "GIGA-BAR-PULSE-X-DUAL-MODE"
    ),
    "img-6938.jpg": (
        "GIGA BAR PULSE X 25K CURVED SCREEN DISPOSABLE",
        "GIGA-BAR-PULSE-X-25K-CURVED"
    ),
}


def main():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    updated = 0
    not_matched = []

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

    # Also check our rename keys against what's in the JSON
    product_files = {os.path.basename(p['image']) for p in data['products']}
    for key in RENAMES:
        if key not in product_files:
            not_matched.append(key)

    with open(JSON_PATH, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n=== DONE ===")
    print(f"Updated: {updated} products")
    if not_matched:
        print(f"Rename keys not found in JSON: {not_matched}")


if __name__ == '__main__':
    main()
