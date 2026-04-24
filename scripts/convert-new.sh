#!/usr/bin/env bash
# Convert any .jpg/.jpeg/.png/.gif in assets/ that doesn't already have a .webp sibling.
# Safe to run repeatedly — skips files that are already converted.
# Run from the project root:   ./scripts/convert-new.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v cwebp >/dev/null 2>&1; then
    echo "Error: cwebp not installed. Run: brew install webp" >&2
    exit 1
fi

# Find every source image under assets/
LIST=$(mktemp)
find assets -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.gif' \) > "$LIST"

python3 scripts/convert-webp.py --only-new --list "$LIST"
rm -f "$LIST"

echo ""
echo "Done. New .webp files written next to their sources."
echo "Remember to update references in data/ / js/ / pages/ / css/ to point at the new .webp files."
