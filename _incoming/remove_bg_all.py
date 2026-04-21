#!/usr/bin/env python3
"""
Batch background removal for ALL 161 product images.
Reads image paths from data/products.json, writes a transparent PNG
sibling next to each source file (foo.jpg -> foo.png in same folder).
Skips files whose .png already exists.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
PRODUCTS_JSON = ROOT / "data" / "products.json"

from rembg import remove, new_session

session = new_session("u2net")


def process(src: Path, dst: Path):
    try:
        with open(src, "rb") as f:
            data = f.read()
        out = remove(data, session=session)
        with open(dst, "wb") as f:
            f.write(out)
        return True, None
    except Exception as e:
        return False, str(e)


def main():
    data = json.load(open(PRODUCTS_JSON))
    products = data.get("products", data) if isinstance(data, dict) else data

    paths = []
    for p in products:
        img = p.get("image") or p.get("img")
        if img:
            paths.append(img)

    print(f"Processing {len(paths)} product images\n")
    ok = skip = fail = 0
    for i, rel in enumerate(paths, 1):
        src = ROOT / rel
        if not src.exists():
            print(f"  [{i:3d}] MISSING SOURCE: {rel}")
            fail += 1
            continue
        dst = src.with_suffix(".png")
        if dst.exists() and dst != src:
            print(f"  [{i:3d}] skip (already has .png): {dst.name}")
            skip += 1
            continue
        # If source is already png, overwrite in place only if not yet transparent.
        # For safety we always write to .png next to source.
        success, err = process(src, dst)
        if success:
            print(f"  [{i:3d}] OK: {src.name} -> {dst.name}")
            ok += 1
        else:
            print(f"  [{i:3d}] FAIL {src.name}: {err}")
            fail += 1

    print(f"\n=== {ok} OK, {skip} skipped, {fail} failed ===")


if __name__ == "__main__":
    main()
