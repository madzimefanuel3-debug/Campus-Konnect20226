#!/usr/bin/env python3
"""Generate PNG icons for Campus Konnect PWA from SVG paths using Pillow."""
import struct, zlib, math, os

def make_png(size):
    """Draw a dark background with the cyberpunk network icon at any size."""
    # Create raw RGBA pixel array
    s = size
    cx, cy = s // 2, s // 2
    scale = s / 60.0  # icon.svg viewBox is 60x60

    # Points of the polygon (from icon.svg, translated by 15,10)
    raw_pts = [(0,20),(15,5),(30,20),(20,40),(5,40),(0,20)]
    pts = [(int((x + 15) * scale), int((y + 10) * scale)) for x, y in raw_pts]

    nodes_raw = [(15,5),(30,20),(20,40),(5,40),(0,20),(20,25)]
    nodes = [(int((x+15)*scale), int((y+10)*scale)) for x,y in nodes_raw]

    node_colors = [
        (0,243,255), (255,0,229), (0,243,255),
        (255,0,229), (0,243,255), (255,255,255)
    ]

    # Lines (pairs of node indices from the SVG)
    lines_raw = [
        ((15,5),(20,25)), ((20,25),(30,20)),
        ((20,25),(5,40))
    ]
    lines = [
        (
            (int((a[0]+15)*scale), int((a[1]+10)*scale)),
            (int((b[0]+15)*scale), int((b[1]+10)*scale))
        )
        for a,b in lines_raw
    ]

    # pixel grid: RGBA
    img = [[(8, 9, 15, 255)] * s for _ in range(s)]  # dark bg

    def clamp(v, lo=0, hi=s-1): return max(lo, min(hi, v))

    def set_px(x, y, r, g, b, a=255, glow=False):
        x, y = clamp(x), clamp(y)
        img[y][x] = (r, g, b, a)
        if glow:
            for dx in range(-2, 3):
                for dy in range(-2, 3):
                    dist = math.sqrt(dx*dx + dy*dy)
                    if dist == 0 or dist > 2.5: continue
                    alpha = int(150 * (1 - dist/2.5))
                    nx, ny = clamp(x+dx), clamp(y+dy)
                    or_, og, ob, oa = img[ny][nx]
                    img[ny][nx] = (
                        min(255, or_ + int(r * alpha / 255)),
                        min(255, og + int(g * alpha / 255)),
                        min(255, ob + int(b * alpha / 255)),
                        255
                    )

    def draw_line(x0, y0, x1, y1, r, g, b, width=1):
        dx, dy = x1 - x0, y1 - y0
        steps = max(abs(dx), abs(dy), 1)
        for i in range(steps + 1):
            t = i / steps
            x = int(x0 + t * dx)
            y = int(y0 + t * dy)
            for w in range(-width, width+1):
                set_px(x+w, y, r, g, b)
                set_px(x, y+w, r, g, b)

    def draw_circle(cx, cy, radius, r, g, b, fill=True):
        for dx in range(-radius-1, radius+2):
            for dy in range(-radius-1, radius+2):
                dist = math.sqrt(dx*dx + dy*dy)
                if fill and dist <= radius:
                    set_px(cx+dx, cy+dy, r, g, b, glow=True)
                elif not fill and abs(dist - radius) < 1.5:
                    set_px(cx+dx, cy+dy, r, g, b)

    # Draw polygon outline
    lw = max(1, s // 40)
    cyan = (0, 243, 255)
    magenta = (255, 0, 229)
    for i in range(len(pts)-1):
        x0,y0 = pts[i]; x1,y1 = pts[i+1]
        draw_line(x0, y0, x1, y1, *cyan, width=lw)

    # Draw interior connecting lines
    for (x0,y0),(x1,y1) in lines:
        draw_line(x0, y0, x1, y1, *magenta, width=lw)

    # Draw node circles
    nr = max(2, s // 20)
    for (nx,ny), col in zip(nodes, node_colors):
        draw_circle(nx, ny, nr, *col, fill=True)

    # Pack to PNG bytes
    def pack_png(img_data, w, h):
        def png_chunk(tag, data):
            c = zlib.crc32(tag + data) & 0xffffffff
            return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)

        raw_rows = b''
        for row in img_data:
            raw_rows += b'\x00'
            for r,g,b,a in row:
                raw_rows += bytes([r, g, b, a])

        compressed = zlib.compress(raw_rows, 9)
        sig = b'\x89PNG\r\n\x1a\n'
        ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)  # RGB, 8-bit
        # Use RGBA instead
        ihdr_data = struct.pack('>II', w, h) + bytes([8, 6, 0, 0, 0])

        chunks = [
            png_chunk(b'IHDR', ihdr_data),
            png_chunk(b'IDAT', compressed),
            png_chunk(b'IEND', b''),
        ]
        return sig + b''.join(chunks)

    return pack_png(img, s, s)

# Generate icons
sizes = [72, 96, 128, 144, 152, 192, 384, 512]
os.makedirs('assets', exist_ok=True)
for size in sizes:
    data = make_png(size)
    path = f'assets/icon-{size}.png'
    with open(path, 'wb') as f:
        f.write(data)
    print(f'Generated {path} ({len(data)} bytes)')

print("Done!")
