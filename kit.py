#!/usr/bin/env python3
"""Ritar appikoner, favicon, og-bild, manifest, robots och sitemap för Kotten och kroppen.

Ikonen är ett hjärta i familjens tallgröna ruta – tre tjocka former, inga tunna streck,
så den överlever 48 px i en katalog.
"""
import json
import pathlib

from PIL import Image, ImageDraw

P = pathlib.Path(__file__).parent / "public"
P.mkdir(exist_ok=True)
ACCENT = (47, 125, 90, 255)
PAPPER = (250, 247, 242, 255)
BLACK = (20, 24, 31, 255)
HJARTA = (200, 71, 60, 255)


def hjarta(d, N):
    r = N * 0.17
    cx, cy = N * 0.5, N * 0.40
    d.ellipse([cx - 2 * r, cy - r, cx, cy + r], fill=HJARTA)
    d.ellipse([cx, cy - r, cx + 2 * r, cy + r], fill=HJARTA)
    d.polygon([(cx - 2 * r + N * 0.02, cy + r * 0.55),
               (cx + 2 * r - N * 0.02, cy + r * 0.55),
               (cx, cy + N * 0.30)], fill=HJARTA)


def ikon(N):
    ss = 4
    im = Image.new("RGBA", (N * ss, N * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, N * ss - 1, N * ss - 1], radius=N * ss * 0.23, fill=ACCENT)
    hjarta(d, N * ss)
    return im.resize((N, N), Image.LANCZOS)


def favicon():
    (P / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
        '<rect width="100" height="100" rx="23" fill="#2f7d5a"/>'
        '<path d="M50 80 C22 62 18 44 26 34 C34 24 46 26 50 36 C54 26 66 24 74 34 '
        'C82 44 78 62 50 80 Z" fill="#c8473c"/></svg>',
        encoding="utf-8")
    ikon(512).save(P / "favicon.png")
    ikon(192).save(P / "icon-192.png")
    ikon(512).save(P / "icon-512.png")
    N = 512
    im = Image.new("RGBA", (N, N), ACCENT)
    inner = Image.new("RGBA", (int(N * 0.66), int(N * 0.66)), (0, 0, 0, 0))
    di = ImageDraw.Draw(inner)
    hjarta(di, int(N * 0.66))
    im.paste(inner, (int(N * 0.17), int(N * 0.17)), inner)
    im.save(P / "icon-maskable-512.png")
    (P / "apple-touch-icon.png").write_bytes((P / "icon-192.png").read_bytes())


def og():
    from PIL import ImageFont
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), PAPPER)
    d = ImageDraw.Draw(im)
    ico = ikon(150)
    im.paste(ico, (int(W / 2 - 75), 54), ico)
    font = None
    for path in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        if pathlib.Path(path).exists():
            font = ImageFont.truetype(path, 58)
            break
    if font is None:
        font = ImageFont.load_default()
    titel = "Kotten och kroppen"
    tw = d.textlength(titel, font=font)
    d.text((W / 2 - tw / 2, 250), titel, font=font, fill=BLACK)
    im.save(P / "og.png")


def manifest():
    (P / "site.webmanifest").write_text(json.dumps({
        "name": "Kotten och kroppen – organen och deras uppgifter",
        "short_name": "Kroppen",
        "lang": "sv",
        "start_url": "/",
        "display": "standalone",
        "orientation": "any",
        "background_color": "#faf7f2",
        "theme_color": "#2f7d5a",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    (P / "robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: https://kottenkroppen.skolappar.com/sitemap.xml\n",
                                  encoding="utf-8")
    (P / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        ' <url><loc>https://kottenkroppen.skolappar.com/</loc></url>\n'
        '</urlset>\n', encoding="utf-8")


if __name__ == "__main__":
    favicon()
    og()
    manifest()
    print("klart:", sorted(p.name for p in P.iterdir()))