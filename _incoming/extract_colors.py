#!/usr/bin/env python3
"""
Extract dominant color from each transparent PNG product image.
Output a JSON mapping: filename -> { 'light': '#hex', 'dark': '#hex' }

Algorithm:
1. Load transparent PNG
2. Collect only non-transparent pixels (the actual product)
3. Skip very dark/light/gray pixels (they're usually shadows or whites)
4. Find dominant saturated color via color quantization
5. Generate 2-stop gradient: lighter shade (top) -> darker shade (bottom)
"""
import os
import sys
import json
from pathlib import Path
from collections import Counter
from colorsys import rgb_to_hls, hls_to_rgb

try:
    from PIL import Image
except ImportError:
    print("Need PIL/Pillow. Install: pip3 install --user pillow")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent
ROOT = SCRIPT_DIR.parent
SRC_DIR = ROOT / "assets" / "images"
OUTPUT_JSON = SCRIPT_DIR / "extracted_colors.json"


def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def adjust_lightness(rgb, delta):
    """Adjust lightness by delta (-0.3 to +0.3). Keeps hue + saturation."""
    r, g, b = [c / 255 for c in rgb]
    h, l, s = rgb_to_hls(r, g, b)
    l = max(0.05, min(0.95, l + delta))
    r, g, b = hls_to_rgb(h, l, s)
    return (int(r * 255), int(g * 255), int(b * 255))


def adjust_saturation(rgb, factor):
    """Boost saturation by factor (1.0 = no change, 1.3 = +30% more vivid)."""
    r, g, b = [c / 255 for c in rgb]
    h, l, s = rgb_to_hls(r, g, b)
    s = max(0, min(1, s * factor))
    r, g, b = hls_to_rgb(h, l, s)
    return (int(r * 255), int(g * 255), int(b * 255))


def extract_dominant_color(img_path: Path):
    """Find the dominant saturated color of the product in a transparent PNG."""
    img = Image.open(img_path).convert("RGBA")
    # Resize for speed
    img.thumbnail((200, 200))
    pixels = img.getdata()

    buckets = Counter()
    for r, g, b, a in pixels:
        if a < 180:  # skip transparent areas
            continue
        # skip near-white
        if r > 240 and g > 240 and b > 240:
            continue
        # skip near-black (text, outlines)
        if r < 25 and g < 25 and b < 25:
            continue
        # compute saturation
        mx, mn = max(r, g, b), min(r, g, b)
        if mx == 0:
            continue
        sat = (mx - mn) / mx
        # skip grays (low saturation)
        if sat < 0.18:
            continue

        # quantize into 16-step buckets for stable grouping
        qr, qg, qb = (r // 16) * 16, (g // 16) * 16, (b // 16) * 16
        # weight by saturation so vivid colors win
        weight = int(sat * 100)
        buckets[(qr, qg, qb)] += weight

    if not buckets:
        # fallback: average ALL non-transparent pixels
        totals = [0, 0, 0]
        count = 0
        for r, g, b, a in pixels:
            if a >= 180:
                totals[0] += r
                totals[1] += g
                totals[2] += b
                count += 1
        if count == 0:
            return (100, 100, 120)  # neutral gray fallback
        return tuple(int(t / count) for t in totals)

    # Return the most weighted bucket's center
    top, _ = buckets.most_common(1)[0]
    # shift to middle of quantization bucket
    return (top[0] + 8, top[1] + 8, top[2] + 8)


def build_gradient(rgb):
    """Build a 3-stop SUBTLE gradient from the dominant color.
    Structure: top light -> middle dark -> bottom light (small visible variation).

    If the extracted color is VERY dark (lightness < 0.2), we lift it up so
    the card isn't all black. If it's VERY light (>0.85), we deepen it.
    """
    # Boost saturation modestly so colors pop but stay natural
    base = adjust_saturation(rgb, 1.12)

    # Check lightness and compensate extremes
    r, g, b = [c / 255 for c in base]
    h, l, s = rgb_to_hls(r, g, b)

    # REVIEW MODE: for very dark (black) products, use white/silver shine
    # instead of lifting to gray. Returns early with a light gradient.
    if l < 0.2:
        top    = (245, 245, 248)   # near-white shine
        middle = (210, 212, 218)   # silver-gray
        bottom = (235, 236, 240)   # soft white
        chip   = (60, 60, 68)      # dark chip for contrast with white text
        return {
            "top": rgb_to_hex(top),
            "middle": rgb_to_hex(middle),
            "bottom": rgb_to_hex(bottom),
            "chip": rgb_to_hex(chip),
            "extracted": rgb_to_hex(rgb),
        }

    if l > 0.82:
        # very light - shift middle brightness down a bit
        base = adjust_lightness(base, -0.10)

    # Subtle gradient: small +/- lightness deltas
    top    = adjust_lightness(base, +0.06)  # slightly lighter
    middle = adjust_lightness(base, -0.06)  # slightly darker
    bottom = adjust_lightness(base, +0.04)  # slightly lighter again (not as light as top)

    # Chip: SATURATED / VIBRANT version of the base, not extreme dark.
    # Rule: boost saturation, keep lightness close to base but slightly lower
    # so white text stays readable without becoming burgundy/navy.
    cr, cg, cb = [c / 255 for c in base]
    ch, cl, cs = rgb_to_hls(cr, cg, cb)

    if cl < 0.20:
        # Very dark base (K-Shot black): keep it dark but not pure black
        chip = adjust_lightness(base, +0.02)
    elif cl < 0.40:
        # Already medium-dark: small -8% to keep contrast
        chip = adjust_saturation(adjust_lightness(base, -0.08), 1.35)
    elif cl < 0.65:
        # Medium (most products): boost saturation, drop lightness only ~12%
        chip = adjust_saturation(adjust_lightness(base, -0.12), 1.30)
    else:
        # Light base (pink, light blue): drop lightness ~18% but stay in same hue family
        chip = adjust_saturation(adjust_lightness(base, -0.18), 1.25)

    return {
        "top": rgb_to_hex(top),
        "middle": rgb_to_hex(middle),
        "bottom": rgb_to_hex(bottom),
        "chip": rgb_to_hex(chip),
        "extracted": rgb_to_hex(rgb),
    }


def main():
    if not SRC_DIR.exists():
        print(f"Directory not found: {SRC_DIR}")
        sys.exit(1)

    files = sorted([f for f in SRC_DIR.iterdir() if f.suffix.lower() in (".png", ".jpg", ".jpeg")])
    if not files:
        print(f"No image files in {SRC_DIR}")
        sys.exit(1)

    print(f"Processing {len(files)} images from {SRC_DIR}\n")

    result = {}
    for f in files:
        try:
            rgb = extract_dominant_color(f)
            grad = build_gradient(rgb)
            result[f.name] = grad
            print(f"  {f.name:55s} extracted={grad['extracted']} top={grad['top']} mid={grad['middle']} bot={grad['bottom']} chip={grad['chip']}")
        except Exception as e:
            print(f"  FAIL: {f.name} -- {e}")

    with open(OUTPUT_JSON, "w") as out:
        json.dump(result, out, indent=2)
    print(f"\nSaved {len(result)} color mappings to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
