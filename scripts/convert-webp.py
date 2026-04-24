#!/usr/bin/env python3
"""
Convert images referenced by the site from .jpg/.png/.gif to .webp.

Rules:
  - JPG/JPEG  -> lossy WebP, quality 85 (-m 6 max compression effort)
  - PNG with alpha channel  -> LOSSLESS WebP (zero quality loss, preserves alpha)
  - PNG without alpha       -> lossy WebP, quality 90 (safer for flat graphics)
  - GIF (animated or static) -> animated WebP via gif2webp, quality 85

Input: a list of relative image paths (one per line) on stdin OR via --list <file>.
Output: writes <original>.webp next to each source file. Originals are left untouched.
"""
import argparse, os, struct, subprocess, sys, zlib

def has_alpha_png(path):
    # Detect alpha by reading PNG IHDR (color type byte).
    # Color types 4 (gray+alpha) and 6 (RGBA) = alpha. Type 3 (indexed) = alpha iff tRNS chunk exists.
    try:
        with open(path, 'rb') as f:
            sig = f.read(8)
            if sig[:8] != b'\x89PNG\r\n\x1a\n':
                return True  # unknown -> safe default: lossless
            # IHDR
            length = struct.unpack('>I', f.read(4))[0]
            ctype = f.read(4)
            if ctype != b'IHDR':
                return True
            ihdr = f.read(length)
            _ = f.read(4)  # crc
            color_type = ihdr[9]
            if color_type in (4, 6):
                return True
            if color_type == 3:
                # Scan for tRNS chunk
                while True:
                    hdr = f.read(8)
                    if len(hdr) < 8:
                        break
                    length, ctype = struct.unpack('>I4s', hdr)
                    if ctype == b'tRNS':
                        return True
                    if ctype == b'IEND':
                        return False
                    f.seek(length + 4, 1)
            return False
    except Exception:
        return True

def convert_one(src):
    ext = os.path.splitext(src)[1].lower()
    dst = os.path.splitext(src)[0] + '.webp'
    if ext in ('.jpg', '.jpeg'):
        cmd = ['cwebp', '-q', '85', '-m', '6', '-quiet', src, '-o', dst]
    elif ext == '.png':
        if has_alpha_png(src):
            cmd = ['cwebp', '-lossless', '-m', '6', '-quiet', src, '-o', dst]
        else:
            cmd = ['cwebp', '-q', '90', '-m', '6', '-quiet', src, '-o', dst]
    elif ext == '.gif':
        cmd = ['gif2webp', '-q', '85', '-m', '6', '-quiet', src, '-o', dst]
    else:
        return ('skip', src, 0, 0)
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        return ('err', src, 0, 0)
    src_sz = os.path.getsize(src)
    dst_sz = os.path.getsize(dst)
    return ('ok', src, src_sz, dst_sz)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--list', help='File with one relative image path per line')
    ap.add_argument('--only-new', action='store_true',
                    help='Skip sources that already have a .webp sibling')
    args = ap.parse_args()

    if args.list:
        with open(args.list) as f:
            paths = [line.strip() for line in f if line.strip()]
    else:
        paths = [line.strip() for line in sys.stdin if line.strip()]

    total_src = 0
    total_dst = 0
    ok = 0
    skipped = 0
    errors = []
    for p in paths:
        if not os.path.exists(p):
            errors.append(('missing', p))
            continue
        if args.only_new:
            dst = os.path.splitext(p)[0] + '.webp'
            if os.path.exists(dst):
                skipped += 1
                continue
        status, src, ss, ds = convert_one(p)
        if status == 'ok':
            ok += 1
            total_src += ss
            total_dst += ds
        elif status == 'err':
            errors.append(('convert-failed', src))
        else:
            skipped += 1

    MB = 1024 * 1024
    print(f'Converted: {ok} files')
    print(f'Skipped:   {skipped}')
    print(f'Errors:    {len(errors)}')
    for kind, p in errors[:30]:
        print(f'  [{kind}] {p}')
    if ok:
        saved = total_src - total_dst
        pct = (saved / total_src * 100) if total_src else 0
        print(f'Source total: {total_src/MB:.1f} MB')
        print(f'WebP total:   {total_dst/MB:.1f} MB')
        print(f'Saved:        {saved/MB:.1f} MB  ({pct:.1f}%)')

if __name__ == '__main__':
    main()
