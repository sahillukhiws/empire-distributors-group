#!/usr/bin/env python3
"""
Remove backgrounds from test images using rembg.
Input:  /assets/image/*.png
Output: /assets/images/*.png  (transparent)
"""
import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
ROOT = SCRIPT_DIR.parent
SRC = ROOT / "assets" / "image"
DST = ROOT / "assets" / "images"

DST.mkdir(parents=True, exist_ok=True)

from rembg import remove
from PIL import Image
import io

def process(src_path: Path, dst_path: Path):
    print(f"  Processing: {src_path.name} ...", end=" ", flush=True)
    try:
        with open(src_path, 'rb') as f:
            input_data = f.read()
        output_data = remove(input_data)
        with open(dst_path, 'wb') as f:
            f.write(output_data)
        src_size = src_path.stat().st_size // 1024
        dst_size = dst_path.stat().st_size // 1024
        print(f"OK ({src_size}KB -> {dst_size}KB)")
        return True
    except Exception as e:
        print(f"FAIL: {e}")
        return False

def main():
    files = sorted(SRC.glob("*.png"))
    if not files:
        print(f"No .png files found in {SRC}")
        sys.exit(1)

    print(f"Found {len(files)} images in {SRC}")
    print(f"Outputting to {DST}\n")

    ok = 0
    fail = 0
    for src in files:
        dst = DST / src.name
        if process(src, dst):
            ok += 1
        else:
            fail += 1

    print(f"\n=== Done: {ok} OK, {fail} failed ===")

if __name__ == "__main__":
    main()
