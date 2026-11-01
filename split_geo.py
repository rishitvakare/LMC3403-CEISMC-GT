
import json
import re
import sys
from pathlib import Path

if len(sys.argv) < 2:
    print("Usage: python3 split_geo.py your-file.html")
    sys.exit(1)

html_path = Path(sys.argv[1])
html = html_path.read_text(encoding="utf-8")

# Find the beginning of the giant data declaration.
start_match = re.search(r"\bconst\s+land\s*=", html)
if not start_match:
    raise ValueError("Could not find 'const land=' in the file.")

decoder = json.JSONDecoder()

# Extract the land GeoJSON object.
land_start = start_match.end()
land, land_end = decoder.raw_decode(html[land_start:])

# Find and extract the separate georgia array.
georgia_match = re.match(
    r"\s*,\s*georgia\s*=",
    html[land_start + land_end:]
)
if not georgia_match:
    raise ValueError("Could not find the georgia array after land.")

georgia_start = land_start + land_end + georgia_match.end()
georgia, georgia_end = decoder.raw_decode(html[georgia_start:])

# Find the end of the rad declaration.
rad_start = georgia_start + georgia_end
rad_match = re.match(
    r"\s*,\s*rad\s*=\s*Math\.PI\s*/\s*180\s*;",
    html[rad_start:]
)
if not rad_match:
    raise ValueError("Could not find the rad=Math.PI/180 declaration.")

end = rad_start + rad_match.end()

# Write the extracted data into its own JavaScript file.
data = {
    "land": land,
    "georgia": georgia,
    "rad": 3.141592653589793 / 180
}

data_path = html_path.parent / "land-data.js"
data_path.write_text(
    "window.LAND_DATA = " + json.dumps(data, separators=(",", ":")) + ";\n",
    encoding="utf-8"
)

# Replace the giant declaration with a short reference.
replacement = "const { land, georgia, rad } = window.LAND_DATA;"

cleaned_html = html[:start_match.start()] + replacement + html[end:]

# Load the data file before the script that uses it.
script_open = cleaned_html.rfind("<script", 0, start_match.start())
if script_open == -1:
    raise ValueError("Could not find the HTML script tag containing the data.")

script_tag = '<script src="land-data.js"></script>\n'
cleaned_html = (
    cleaned_html[:script_open]
    + script_tag
    + cleaned_html[script_open:]
)

output_path = html_path.with_name(html_path.stem + ".cleaned.html")
output_path.write_text(cleaned_html, encoding="utf-8")

print("Done!")
print(f"Cleaned HTML: {output_path}")
print(f"Extracted data: {data_path}")
print(f"Geometries extracted: {len(land.get('geometries', []))}")
