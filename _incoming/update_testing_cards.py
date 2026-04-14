#!/usr/bin/env python3
"""
Update index.html testing cards:
1. Replace --tc-g1, --tc-g2, --tc-chip, --tc-bg-match CSS vars with extracted colors
2. Remove data-dark attribute (no longer needed)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
HTML = ROOT / "index.html"
COLORS_JSON = Path(__file__).parent / "extracted_colors.json"

with open(COLORS_JSON) as f:
    colors = json.load(f)

html = HTML.read_text()

# Find each testing-card <a> tag and replace its style inline.
# Pattern: match the whole <a class="testing-card"...> opening tag,
# then capture its nested img src to know which color mapping to use.

def replace_card(match):
    tag = match.group(0)
    # extract src from the following <img> (within ~200 chars forward)
    return tag  # placeholder - we'll do targeted replacement below


# Instead of regex, do a line-based approach: for each "--tc-g1" occurrence
# find the nearest <img src="assets/images/..."> right after, get filename,
# lookup in colors dict, replace the style attribute.

def replace_testing_card_styles(html: str) -> str:
    # Match the anchor tag with the style attribute
    # followed (within a few lines) by an <img src="assets/images/FILENAME">
    pattern = re.compile(
        r'(<a\s+href="[^"]*"\s+class="testing-card"(?:\s+data-dark="1")?)\s+style="[^"]*"([^>]*>\s*<div class="testing-card__media">\s*<img src="assets/images/([^"]+)")',
        re.DOTALL,
    )

    count = [0]
    def repl(m):
        prefix = m.group(1)
        middle = m.group(2)
        filename = m.group(3)
        if filename in colors:
            c = colors[filename]
            new_style = f' style="--tc-g1:{c["top"]};--tc-g2:{c["middle"]};--tc-g3:{c["bottom"]};--tc-chip:{c["chip"]};"'
            count[0] += 1
            # Strip data-dark since we no longer need blend-mode tricks
            prefix_no_dark = re.sub(r'\s+data-dark="1"', '', prefix)
            return prefix_no_dark + new_style + middle
        return m.group(0)

    new_html = pattern.sub(repl, html)
    print(f"Updated {count[0]} testing-card styles")
    return new_html


new_html = replace_testing_card_styles(html)
HTML.write_text(new_html)
print("index.html saved")
