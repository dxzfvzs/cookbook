#!/usr/bin/env python3

import os
import re
import sys
import fontforge

sys.stdout.reconfigure(encoding="utf-8")


# ---------------- CONFIG ----------------

SVG_FILE = "dxzfvzs-font.svg"
OUT_FILE = "dxzfvzs.ttf"

CELL = 128

FONT_NAME = "dxzfvzs"
FAMILY = "dxzfvzs"

EM_SIZE = 1000

LEFT_BEARING = 40
RIGHT_BEARING = 40

# the hand-drawn letters only fill ~22% of the em square vertically (lots
# of headroom baked into the original 128x128 grid cells), vs. ~50% for a
# typical typeface, so they render tiny at normal font-sizes. Scale them
# up uniformly about the baseline to compensate.
GLYPH_SCALE = 2.25

LAYOUT = [
    (0, "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,:;?!"),
    (1, "abcdefghijklmnopqrstuvwxyz&@-–—*"),
    (2, '1234567890()[]{}/\\"“„\'%^#~<>|=−'),
    (3, "ÁáÍíÝýÚúŮůÉéÓóÔôÄäĽľĚěČčĎďŇňŘřŠš"),
    (4, "ŤťŽž"),
]


# ---------------- SVG PATH PARSING ----------------

# Only M/L/C (absolute) and c (relative) and z appear in this artwork's
# export. Track them explicitly rather than assuming every number is an
# absolute coordinate pair (relative commands broke a naive centroid check).
TOKEN_RE = re.compile(r'([MLCZmlcz])|(-?\d+\.?\d*(?:[eE]-?\d+)?)')


def parse_path_points(d):
    """Absolute (x, y) points (endpoints + control points) visited by d."""
    tokens = TOKEN_RE.findall(d)
    cmd = None
    cx, cy = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
    pts = []

    i, n = 0, len(tokens)
    while i < n:
        letter, num = tokens[i]
        if letter:
            cmd = letter
            i += 1
            continue

        if cmd in ("M", "m"):
            x, y = float(num), float(tokens[i + 1][1])
            i += 2
            cx, cy = (x, y) if cmd == "M" else (cx + x, cy + y)
            start_x, start_y = cx, cy
            pts.append((cx, cy))
            cmd = "L" if cmd == "M" else "l"
        elif cmd in ("L", "l"):
            x, y = float(num), float(tokens[i + 1][1])
            i += 2
            cx, cy = (x, y) if cmd == "L" else (cx + x, cy + y)
            pts.append((cx, cy))
        elif cmd in ("C", "c"):
            x1, y1 = float(num), float(tokens[i + 1][1])
            x2, y2 = float(tokens[i + 2][1]), float(tokens[i + 3][1])
            x, y = float(tokens[i + 4][1]), float(tokens[i + 5][1])
            i += 6
            if cmd == "C":
                pts.append((x1, y1))
                pts.append((x2, y2))
                cx, cy = x, y
            else:
                pts.append((cx + x1, cy + y1))
                pts.append((cx + x2, cy + y2))
                cx, cy = cx + x, cy + y
            pts.append((cx, cy))
        elif cmd in ("Z", "z"):
            cx, cy = start_x, start_y
            i += 1
        else:
            i += 1
    return pts


def translate_path(d, dx, dy):
    """Rebuild d with absolute commands shifted by (dx, dy). Relative
    commands are translation-invariant and are copied through untouched."""
    tokens = TOKEN_RE.findall(d)
    out = []
    cmd = None
    i, n = 0, len(tokens)
    while i < n:
        letter, num = tokens[i]
        if letter:
            cmd = letter
            out.append(letter)
            i += 1
            continue

        if cmd == "M" or cmd == "L":
            x, y = float(num), float(tokens[i + 1][1])
            i += 2
            out.append(f"{x + dx:.3f},{y + dy:.3f}")
        elif cmd == "C":
            vals = [float(tokens[i + k][1]) for k in range(6)]
            i += 6
            shifted = [vals[k] + (dx if k % 2 == 0 else dy) for k in range(6)]
            out.append(",".join(f"{v:.3f}" for v in shifted))
        elif cmd in ("m", "l", "c"):
            count = 2 if cmd in ("m", "l") else 6
            vals = [tokens[i + k][1] for k in range(count)]
            i += count
            out.append(",".join(vals))
        elif cmd in ("Z", "z"):
            i += 1
        else:
            i += 1
    return "".join(out)


def read_svg(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def assign_paths_to_cells(svg):
    """Map each <path> element to the grid cell its centroid falls in."""
    paths = re.findall(r'<path[^>]*\bd="([^"]+)"', svg)

    cell_paths = {}
    for d in paths:
        pts = parse_path_points(d)
        cx = sum(p[0] for p in pts) / len(pts)
        cy = sum(p[1] for p in pts) / len(pts)
        col = int(cx // CELL)
        row = int(cy // CELL)
        cell_paths.setdefault((row, col), []).append(d)

    return cell_paths


def build_glyph_svg(paths, col, row):
    dx, dy = -(col * CELL), -(row * CELL)
    body = "\n".join(
        f'<path d="{translate_path(d, dx, dy)}" fill="#000000"/>' for d in paths
    )
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="{CELL}"
     height="{CELL}"
     viewBox="0 0 {CELL} {CELL}">
{body}
</svg>
'''


def save_temp_svg(ch, content):
    filename = f"_tmp_{ord(ch)}.svg"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    return filename


# ---------------- FONT BUILD ----------------

font = fontforge.font()

font.encoding = "UnicodeFull"
font.em = EM_SIZE

font.fontname = FONT_NAME
font.familyname = FAMILY
font.fullname = FAMILY + " Regular"


svg = read_svg(SVG_FILE)
cell_paths = assign_paths_to_cells(svg)

built_codepoints = {}

for row, chars in LAYOUT:

    for col, ch in enumerate(chars):

        paths = cell_paths.get((row, col))

        if not paths:
            print(f"WARNING: no artwork found for {ch!r} at row {row} col {col}")
            continue

        # a codepoint can only map to one glyph - font.createChar() on a
        # codepoint that's already built returns the *existing* glyph, so
        # a duplicate LAYOUT entry would silently import a second outline
        # on top of the first (and get double-scaled below) instead of
        # erroring, corrupting both without any obvious symptom until
        # someone spots it rendered
        if ord(ch) in built_codepoints:
            prev_row, prev_col = built_codepoints[ord(ch)]
            raise ValueError(
                f"{ch!r} (U+{ord(ch):04X}) is in LAYOUT twice: "
                f"row {prev_row} col {prev_col} and row {row} col {col}"
            )
        built_codepoints[ord(ch)] = (row, col)

        print("building", ch)

        glyph = font.createChar(ord(ch), ch)

        cell_svg = build_glyph_svg(paths, col, row)
        tmp = save_temp_svg(ch, cell_svg)

        glyph.importOutlines(tmp)

        glyph.removeOverlap()
        glyph.correctDirection()

        # scale up about the baseline (y=0) so descenders/cap-height grow
        # proportionally without shifting the glyph off the baseline
        glyph.transform((GLYPH_SCALE, 0, 0, GLYPH_SCALE, 0, 0))

        # normalize ink to a fixed left margin, then size the advance
        # width to the actual ink width instead of a flat guess
        xmin, _, xmax, _ = glyph.boundingBox()
        glyph.transform((1, 0, 0, 1, LEFT_BEARING - xmin, 0))
        glyph.width = round((xmax - xmin) + LEFT_BEARING + RIGHT_BEARING)

        os.remove(tmp)


# space
space = font.createChar(32, "space")
space.width = 320


# Fit the line-height metrics tightly (plus a small margin) around the
# *actual* ink instead of a fixed 800/200*GLYPH_SCALE formula. That fixed
# formula stopped matching reality once GLYPH_SCALE grew past ~2: cap
# height started overshooting the declared ascent's headroom while
# descent's headroom stayed proportionate, so the ink sat noticeably
# lower than the vertical center of its own line box. NOTE:
# font.ascent/font.descent are deliberately NOT touched here - setting
# them rescales the whole font (and retargets font.em to ascent+descent),
# which would silently undo the per-glyph GLYPH_SCALE transform above.
# Only the table-specific hhea/OS2 override fields are metadata and safe
# to set directly.
MARGIN = 60
real_glyphs = [g for g in font.glyphs() if g.isWorthOutputting()]
max_y = max(g.boundingBox()[3] for g in real_glyphs)
min_y = min(g.boundingBox()[1] for g in real_glyphs)
new_ascent = round(max_y + MARGIN)
new_descent = round(-min_y + MARGIN)

# these fields default to "_add" mode (your value is added on top of
# FontForge's own auto-computed-from-glyph-bounds baseline); turn that
# off so the numbers below are hard overrides instead
font.hhea_ascent_add = False
font.hhea_descent_add = False
font.os2_typoascent_add = False
font.os2_typodescent_add = False
font.os2_winascent_add = False
font.os2_windescent_add = False

font.hhea_ascent = new_ascent
font.hhea_descent = -new_descent
font.os2_typoascent = new_ascent
font.os2_typodescent = -new_descent
font.os2_winascent = new_ascent
font.os2_windescent = new_descent


font.generate(OUT_FILE)

print("DONE:", OUT_FILE)
