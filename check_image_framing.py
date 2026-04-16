#!/usr/bin/env python3
"""Check product images for bad framing: too much whitespace, cut-off, or poor centering."""

import json
import os
from PIL import Image

BASE_DIR = "/Users/mac/Documents/empiredistributorsgroup/empire-distributors-group"
PRODUCTS_JSON = os.path.join(BASE_DIR, "data/products.json")

# Thresholds
FILL_THRESHOLD = 0.40      # product must fill at least 40% of image area
CENTER_THRESHOLD = 0.10    # center of bbox must be within 10% of image center (relative to image dimensions)
EDGE_MARGIN = 2            # pixels from edge counts as "touching edge"
ALPHA_THRESHOLD = 10       # alpha > 10 means non-transparent

def check_image(img_path):
    """Returns dict with framing metrics, or None if not a transparent PNG."""
    if not img_path.lower().endswith(".png"):
        return None
    full_path = os.path.join(BASE_DIR, img_path)
    if not os.path.exists(full_path):
        return {"error": "file_not_found"}
    try:
        img = Image.open(full_path)
    except Exception as e:
        return {"error": str(e)}

    if img.mode != "RGBA":
        # Not transparent PNG - skip
        return None

    w, h = img.size
    alpha = img.split()[3]  # alpha channel

    # Get bounding box of non-transparent pixels
    import numpy as np
    alpha_arr = np.array(alpha)
    mask = alpha_arr > ALPHA_THRESHOLD
    if not mask.any():
        return {"error": "fully_transparent"}

    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    top = int(np.argmax(rows))
    bottom = int(len(rows) - 1 - np.argmax(rows[::-1]))
    left = int(np.argmax(cols))
    right = int(len(cols) - 1 - np.argmax(cols[::-1]))

    bbox_w = right - left + 1
    bbox_h = bottom - top + 1
    product_area = bbox_w * bbox_h
    image_area = w * h
    fill_ratio = product_area / image_area

    # Check if bounding box touches any edge
    touches_top = top <= EDGE_MARGIN
    touches_bottom = bottom >= (h - 1 - EDGE_MARGIN)
    touches_left = left <= EDGE_MARGIN
    touches_right = right >= (w - 1 - EDGE_MARGIN)
    touches_edge = touches_top or touches_bottom or touches_left or touches_right

    # Check centering: compare bbox center to image center
    bbox_cx = (left + right) / 2.0
    bbox_cy = (top + bottom) / 2.0
    img_cx = w / 2.0
    img_cy = h / 2.0
    offset_x = abs(bbox_cx - img_cx) / w
    offset_y = abs(bbox_cy - img_cy) / h
    is_offcenter = offset_x > CENTER_THRESHOLD or offset_y > CENTER_THRESHOLD

    return {
        "fill_ratio": fill_ratio,
        "touches_edge": touches_edge,
        "touches_top": touches_top,
        "touches_bottom": touches_bottom,
        "touches_left": touches_left,
        "touches_right": touches_right,
        "is_offcenter": is_offcenter,
        "offset_x_pct": offset_x * 100,
        "offset_y_pct": offset_y * 100,
        "image_size": (w, h),
        "bbox": (left, top, right, bottom),
    }

def main():
    with open(PRODUCTS_JSON) as f:
        data = json.load(f)

    products = data.get("products", [])
    print(f"Total products in JSON: {len(products)}")

    transparent_pngs = []
    skipped_no_alpha = []
    skipped_not_png = []
    not_found = []
    errors = []

    for p in products:
        img_path = p.get("image", "")
        if not img_path:
            continue
        result = check_image(img_path)
        if result is None:
            if img_path.lower().endswith(".png"):
                skipped_no_alpha.append(p["id"])
            else:
                skipped_not_png.append(p["id"])
            continue
        if "error" in result:
            if result["error"] == "file_not_found":
                not_found.append(img_path)
            else:
                errors.append((p["id"], result["error"]))
            continue
        transparent_pngs.append((p, result))

    print(f"Transparent PNGs analyzed: {len(transparent_pngs)}")
    print(f"Non-transparent PNGs (skipped): {len(skipped_no_alpha)}")
    print(f"Non-PNG images (skipped): {len(skipped_not_png)}")
    print(f"Files not found: {len(not_found)}")
    if errors:
        print(f"Errors: {len(errors)}")
    print()

    # Categorize problems
    too_much_whitespace = []
    cut_off = []
    offcenter_only = []
    ok = []

    for p, r in transparent_pngs:
        issues = []
        if r["fill_ratio"] < FILL_THRESHOLD:
            issues.append(f"low_fill={r['fill_ratio']*100:.1f}%")
        if r["touches_edge"]:
            edges = []
            if r["touches_top"]: edges.append("top")
            if r["touches_bottom"]: edges.append("bottom")
            if r["touches_left"]: edges.append("left")
            if r["touches_right"]: edges.append("right")
            issues.append(f"touches_edge({','.join(edges)})")
        if r["is_offcenter"]:
            issues.append(f"offcenter(dx={r['offset_x_pct']:.1f}%,dy={r['offset_y_pct']:.1f}%)")

        if not issues:
            ok.append(p["id"])
        else:
            if r["fill_ratio"] < FILL_THRESHOLD:
                too_much_whitespace.append((p["id"], issues, r))
            elif r["touches_edge"]:
                cut_off.append((p["id"], issues, r))
            else:
                offcenter_only.append((p["id"], issues, r))

    print("=" * 60)
    print(f"RESULTS SUMMARY")
    print("=" * 60)
    print(f"  OK (good framing):          {len(ok)}")
    print(f"  Too much whitespace (<40%): {len(too_much_whitespace)}")
    print(f"  Potentially cut off:        {len(cut_off)}")
    print(f"  Off-center only:            {len(offcenter_only)}")
    total_problems = len(too_much_whitespace) + len(cut_off) + len(offcenter_only)
    print(f"  TOTAL PROBLEMATIC:          {total_problems}")
    print()

    if too_much_whitespace:
        print(f"--- TOO MUCH WHITESPACE ({len(too_much_whitespace)}) ---")
        for pid, issues, r in sorted(too_much_whitespace, key=lambda x: x[2]["fill_ratio"]):
            print(f"  {pid}")
            print(f"    Issues: {', '.join(issues)}")
        print()

    if cut_off:
        print(f"--- POTENTIALLY CUT OFF ({len(cut_off)}) ---")
        for pid, issues, r in cut_off:
            print(f"  {pid}")
            print(f"    Issues: {', '.join(issues)}")
        print()

    if offcenter_only:
        print(f"--- OFF-CENTER ONLY ({len(offcenter_only)}) ---")
        for pid, issues, r in offcenter_only:
            print(f"  {pid}")
            print(f"    Issues: {', '.join(issues)}")
        print()

    if not_found:
        print(f"--- FILES NOT FOUND ({len(not_found)}) ---")
        for p in not_found:
            print(f"  {p}")

if __name__ == "__main__":
    main()
