#!/usr/bin/env python3
"""Rename all novelty files to clean slugs. Returns mapping for later use."""
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
LIGHTERS = ROOT / "assets" / "categories" / "novelties" / "lighters"
MISC = ROOT / "assets" / "categories" / "novelties" / "misc"


def slugify(name):
    # lowercase, replace non-alnum with dash, collapse
    s = name.lower()
    s = re.sub(r"[\s_\-]+", "-", s)
    s = re.sub(r"[^a-z0-9\-\.]", "", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


# Manual slugs for the 19 misc WhatsApp images (per inspection)
MISC_MANUAL = {
    "WhatsApp Image 2026-04-13 at 2.55.13 PM.jpeg": "high-times-socks-display",
    "WhatsApp Image 2026-04-13 at 2.55.13 PM (1).jpeg": "hidden-pocket-socks-48ct",
    "WhatsApp Image 2026-04-13 at 2.55.13 PM (2).jpeg": "jewelry-display-crystals-roses",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (3).jpeg": "azza-air-fresheners-200-300ml",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (4).jpeg": "aris-body-spray-perfume-set",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (5).jpeg": "digital-scales-display",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (6).jpeg": "satya-nag-champa-agarbatti",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (7).jpeg": "satya-nag-champa-84ct-display",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (8).jpeg": "budeez-caps-display-144ct",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (9).jpeg": "warner-premium-pinnacle-batteries",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (10).jpeg": "taisun-charger-display",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (11).jpeg": "tactical-stoneman-knife-display",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (12).jpeg": "assorted-knife-jars",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (13).jpeg": "car-logo-keychains",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (14).jpeg": "keychain-display-300ct",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (15).jpeg": "bracelet-display-50ct",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (16).jpeg": "chorboy-scrubber-display",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (17).jpeg": "assorted-premium-knives-jars",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (18).jpeg": "knife-display-48ct-96ct",
}

# Lighters folder: 42 files. Use slugified original filename, drop parenthetical (1)(2) dups
LIGHTER_WHATSAPP = {
    "WhatsApp Image 2026-04-13 at 2.55.13 PM (3).jpeg": "assorted-torch-lighters-display-a",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (1).jpeg": "assorted-torch-lighters-display-b",
    "WhatsApp Image 2026-04-13 at 2.55.14 PM (2).jpeg": "assorted-torch-lighters-display-c",
}


def rename_dir(folder: Path, whatsapp_map: dict = None):
    whatsapp_map = whatsapp_map or {}
    mapping = {}
    for f in sorted(folder.iterdir()):
        if f.is_dir() or f.name.startswith("."):
            continue
        orig = f.name
        if orig in whatsapp_map:
            slug = whatsapp_map[orig]
            ext = f.suffix.lower()
            if ext == ".jpeg":
                ext = ".jpg"
            new_name = slug + ext
        else:
            stem = f.stem
            ext = f.suffix.lower()
            if ext == ".jpeg":
                ext = ".jpg"
            slug = slugify(stem)
            # drop trailing (-1)(-2) from dup filenames so "card lighter 20ct-1" becomes "card-lighter-20ct-alt"
            new_name = slug + ext
        # avoid collision
        new_path = folder / new_name
        if new_path.exists() and new_path != f:
            # append suffix
            stem2 = new_path.stem
            n = 2
            while True:
                candidate = folder / f"{stem2}-alt{n}{new_path.suffix}"
                if not candidate.exists():
                    new_path = candidate
                    break
                n += 1
        if new_path != f:
            shutil.move(str(f), str(new_path))
        mapping[orig] = new_path.name
        print(f"  {orig}  ->  {new_path.name}")
    return mapping


def main():
    print("=== LIGHTERS ===")
    m1 = rename_dir(LIGHTERS, LIGHTER_WHATSAPP)
    print(f"\n=== MISC ===")
    m2 = rename_dir(MISC, MISC_MANUAL)
    print(f"\nTotal renamed: {len(m1) + len(m2)}")


if __name__ == "__main__":
    main()
