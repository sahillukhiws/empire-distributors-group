#!/usr/bin/env python3
"""
Selective rembg: process ONLY products whose current image is a white-bg studio shot
(has_own_bg = false in product_colors.json). Leaves the 61 has-own-bg products untouched.
Writes transparent PNG siblings next to originals; updates products.json to point at .png.
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
PRODUCTS = ROOT / "data" / "products.json"
COLORS = ROOT / "data" / "product_colors.json"

from rembg import remove, new_session
session = new_session("u2net")


def main():
    data = json.load(open(PRODUCTS))
    colors = json.load(open(COLORS))
    products = data["products"]

    targets = []
    for p in products:
        pid = p["id"]
        c = colors.get(pid, {})
        if c.get("has_own_bg"):  # skip scene/promo images
            continue
        img_rel = p.get("image", "")
        src = ROOT / img_rel
        if not src.exists():
            continue
        # if already .png pointing at something we already processed, skip regen
        if src.suffix.lower() == ".png":
            # confirm it actually has transparency; simple check: file path unchanged - keep
            # still re-run so we get consistent result
            pass
        targets.append((p, src))

    print(f"Processing {len(targets)} white-bg products\n")
    ok = fail = 0
    for i, (p, src) in enumerate(targets, 1):
        dst = src.with_suffix(".png")
        try:
            with open(src, "rb") as f:
                data_in = f.read()
            out = remove(data_in, session=session)
            with open(dst, "wb") as f:
                f.write(out)
            new_rel = str(dst.relative_to(ROOT))
            if p["image"] != new_rel:
                p["image"] = new_rel
            print(f"  [{i:3d}/{len(targets)}] OK {src.name} -> {dst.name}")
            ok += 1
        except Exception as e:
            print(f"  [{i:3d}/{len(targets)}] FAIL {src.name}: {e}")
            fail += 1

    json.dump(data, open(PRODUCTS, "w"), indent=2)
    print(f"\n=== {ok} OK, {fail} failed — products.json updated ===")


if __name__ == "__main__":
    main()
