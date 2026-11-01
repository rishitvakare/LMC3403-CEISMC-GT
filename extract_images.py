import re, base64
from pathlib import Path

html_path = Path("index.html")
out_dir = Path("images")
out_dir.mkdir(exist_ok=True)

html = html_path.read_text(encoding="utf-8")
ext_map = {"jpeg": "jpg", "jpg": "jpg", "png": "png", "webp": "webp", "gif": "gif"}
count = 0

def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40]

def replace_img(m):
    global count
    tag = m.group(0)
    src = re.search(r'src="data:image/([a-z0-9+.-]+);base64,([^"]+)"', tag, re.I)
    if not src:
        return tag  # normal <img>, leave alone
    count += 1
    mime, data = src.group(1).lower(), src.group(2)
    alt = re.search(r'alt="([^"]*)"', tag)
    name = slug(alt.group(1)) if alt else "image"
    filename = f"{count:02d}-{name}.{ext_map.get(mime, mime)}"
    (out_dir / filename).write_bytes(base64.b64decode(re.sub(r"\s+", "", data)))
    print(f"Saved images/{filename}")
    return tag.replace(src.group(0), f'src="images/{filename}"', 1)

new_html = re.sub(r"<img\b[^>]*>", replace_img, html)
html_path.write_text(new_html, encoding="utf-8")
print(f"Done. Extracted {count} image(s).")
