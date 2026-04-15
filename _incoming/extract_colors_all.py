#!/usr/bin/env python3
"""
Extract dominant color for every product image referenced in products.json.
Operates on the transparent .png sibling of each image.
Writes data/product_colors.json mapping product id -> { top, middle, bottom, chip, extracted }.
Reuses the same algorithm as extract_colors.py.
"""
import json
from pathlib import Path
from collections import Counter
from colorsys import rgb_to_hls, hls_to_rgb
from PIL import Image

ROOT = Path(__file__).parent.parent
PRODUCTS_JSON = ROOT / "data" / "products.json"
OUT = ROOT / "data" / "product_colors.json"


def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def adjust_lightness(rgb, delta):
    r, g, b = [c / 255 for c in rgb]
    h, l, s = rgb_to_hls(r, g, b)
    l = max(0.05, min(0.95, l + delta))
    r, g, b = hls_to_rgb(h, l, s)
    return (int(r * 255), int(g * 255), int(b * 255))


def adjust_saturation(rgb, factor):
    r, g, b = [c / 255 for c in rgb]
    h, l, s = rgb_to_hls(r, g, b)
    s = max(0, min(1, s * factor))
    r, g, b = hls_to_rgb(h, l, s)
    return (int(r * 255), int(g * 255), int(b * 255))


def extract_dominant_color(img_path: Path):
    img = Image.open(img_path).convert("RGBA")
    img.thumbnail((200, 200))
    pixels = list(img.getdata())

    buckets = Counter()
    for r, g, b, a in pixels:
        if a < 180:
            continue
        if r > 240 and g > 240 and b > 240:
            continue
        if r < 25 and g < 25 and b < 25:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        if mx == 0:
            continue
        sat = (mx - mn) / mx
        if sat < 0.18:
            continue
        qr, qg, qb = (r // 16) * 16, (g // 16) * 16, (b // 16) * 16
        buckets[(qr, qg, qb)] += int(sat * 100)

    if not buckets:
        totals = [0, 0, 0]
        count = 0
        for r, g, b, a in pixels:
            if a >= 180:
                totals[0] += r
                totals[1] += g
                totals[2] += b
                count += 1
        if count == 0:
            return (100, 100, 120)
        return tuple(int(t / count) for t in totals)

    top, _ = buckets.most_common(1)[0]
    return (top[0] + 8, top[1] + 8, top[2] + 8)


def build_gradient(rgb):
    base = adjust_saturation(rgb, 1.12)
    r, g, b = [c / 255 for c in base]
    h, l, s = rgb_to_hls(r, g, b)

    # Very dark -> white/silver shine (matches homepage pipeline)
    if l < 0.2:
        return {
            "top": rgb_to_hex((245, 245, 248)),
            "middle": rgb_to_hex((210, 212, 218)),
            "bottom": rgb_to_hex((235, 236, 240)),
            "chip": rgb_to_hex((60, 60, 68)),
            "extracted": rgb_to_hex(rgb),
        }
    if l > 0.82:
        base = adjust_lightness(base, -0.10)

    top = adjust_lightness(base, +0.06)
    middle = adjust_lightness(base, -0.06)
    bottom = adjust_lightness(base, +0.04)

    _, cl, _ = rgb_to_hls(*[c / 255 for c in base])
    if cl < 0.20:
        chip = adjust_lightness(base, +0.02)
    elif cl < 0.40:
        chip = adjust_saturation(adjust_lightness(base, -0.08), 1.35)
    elif cl < 0.65:
        chip = adjust_saturation(adjust_lightness(base, -0.12), 1.30)
    else:
        chip = adjust_saturation(adjust_lightness(base, -0.18), 1.25)

    return {
        "top": rgb_to_hex(top),
        "middle": rgb_to_hex(middle),
        "bottom": rgb_to_hex(bottom),
        "chip": rgb_to_hex(chip),
        "extracted": rgb_to_hex(rgb),
    }


def main():
    data = json.load(open(PRODUCTS_JSON))
    products = data.get("products", data) if isinstance(data, dict) else data

    result = {}
    ok = fail = 0
    for p in products:
        pid = p.get("id")
        img = p.get("image") or p.get("img")
        if not pid or not img:
            continue
        src = ROOT / img
        if not src.exists():
            print(f"  MISS: {pid} {src}")
            fail += 1
            continue
        try:
            # Classify: if image has a real alpha channel with transparent pixels,
            # it's a rembg'd product -> gradient frame mode.
            # Otherwise sample perimeter: if all 8 points near-white -> gradient frame;
            # if any corner is colored -> has_own_bg (show as-is, fill 100%).
            im_full = Image.open(src)
            has_alpha = False
            if im_full.mode in ("RGBA", "LA") or (im_full.mode == "P" and "transparency" in im_full.info):
                im_rgba = im_full.convert("RGBA")
                # quick transparency check: any pixel with alpha < 255?
                alpha = im_rgba.split()[-1]
                has_alpha = alpha.getextrema()[0] < 250
            im = im_full.convert("RGB")
            w, h = im.size
            if has_alpha:
                white_bg = True  # rembg'd transparent product -> studio
            else:
                def sample(x, y):
                    x = max(0, min(w - 20, x)); y = max(0, min(h - 20, y))
                    box = im.crop((x, y, x + 20, y + 20)).resize((1, 1))
                    return box.getpixel((0, 0))
                samples = [
                    sample(0, 0), sample(w - 20, 0), sample(0, h - 20), sample(w - 20, h - 20),
                    sample(w // 2 - 10, 0), sample(w // 2 - 10, h - 20),
                    sample(0, h // 2 - 10), sample(w - 20, h // 2 - 10),
                ]
                def is_whiteish(c):
                    if c[0] < 235 or c[1] < 235 or c[2] < 235:
                        return False
                    mx, mn = max(c), min(c)
                    sat = 0 if mx == 0 else (mx - mn) / mx
                    return sat <= 0.10
                white_bg = all(is_whiteish(c) for c in samples)

            rgb = extract_dominant_color(src)
            entry = build_gradient(rgb)
            entry["has_own_bg"] = not white_bg
            result[pid] = entry
            ok += 1
        except Exception as e:
            print(f"  FAIL: {pid}: {e}")
            fail += 1

    json.dump(result, open(OUT, "w"), indent=2)
    print(f"\n{ok} colors extracted, {fail} failed -> {OUT}")


if __name__ == "__main__":
    main()
