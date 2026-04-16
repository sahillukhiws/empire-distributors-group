#!/usr/bin/env python3
"""
Auto-trim and center all transparent PNG product images.
For each image:
1. Find bounding box of non-transparent pixels
2. Crop to product + 5% padding
3. Place centered on a square canvas (same max dimension)
4. Overwrite the file
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent.parent
PRODUCTS = ROOT / "data" / "products.json"
PAD_PCT = 0.05  # 5% padding around the product


def process(img_path: Path):
    im = Image.open(img_path)
    if im.mode not in ("RGBA", "LA"):
        if im.mode == "P" and "transparency" in im.info:
            im = im.convert("RGBA")
        else:
            return False, "not transparent"

    im = im.convert("RGBA")
    alpha = im.split()[-1]

    # Find bounding box of non-transparent pixels
    bbox = alpha.getbbox()
    if not bbox:
        return False, "fully transparent"

    x1, y1, x2, y2 = bbox
    pw, ph = x2 - x1, y2 - y1

    # Add padding
    pad_x = int(pw * PAD_PCT)
    pad_y = int(ph * PAD_PCT)
    x1 = max(0, x1 - pad_x)
    y1 = max(0, y1 - pad_y)
    x2 = min(im.width, x2 + pad_x)
    y2 = min(im.height, y2 + pad_y)

    # Crop to padded bounding box
    cropped = im.crop((x1, y1, x2, y2))
    cw, ch = cropped.size

    # Make square canvas (max of w/h)
    size = max(cw, ch)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    # Center the product
    ox = (size - cw) // 2
    oy = (size - ch) // 2
    canvas.paste(cropped, (ox, oy))

    canvas.save(img_path, "PNG")
    fill_before = (pw * ph) / (im.width * im.height) * 100
    fill_after = (cw * ch) / (size * size) * 100
    return True, f"fill {fill_before:.0f}%->{fill_after:.0f}%"


def main():
    data = json.load(open(PRODUCTS))
    products = data["products"]

    ok = skip = fail = 0
    for i, p in enumerate(products, 1):
        img = p.get("image", "")
        if not img.lower().endswith(".png"):
            skip += 1
            continue
        path = ROOT / img
        if not path.exists():
            skip += 1
            continue
        success, msg = process(path)
        if success:
            print(f"  [{i:3d}] OK {path.name} — {msg}")
            ok += 1
        else:
            skip += 1

    print(f"\n=== {ok} trimmed+centered, {skip} skipped ===")


if __name__ == "__main__":
    main()
