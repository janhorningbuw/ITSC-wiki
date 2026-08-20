#!/bin/bash
# Erzeugt index.json automatisch aus allen HTML/PDF Dateien im docs/ Ordner.

DOCS="docs"
OUTPUT="$DOCS/index.json"

echo "[" > "$OUTPUT"

first=true

for f in "$DOCS"/*.html "$DOCS"/*.pdf; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  name=$(basename "$f" | sed 's/\.[^.]*$//' | tr '-' ' ' | sed 's/\b\(.\)/\u\1/g')
  ext="${filename##*.}"
  size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
  date=$(stat -f%Sm -t"%Y-%m-%d" "$f" 2>/dev/null || stat -c%y "$f" 2>/dev/null | cut -d' ' -f1)

  if [ "$first" = true ]; then first=false; else echo "," >> "$OUTPUT"; fi
  printf '  {"name":"%s","file":"%s","type":"%s","description":"","tags":[],"size":%s,"date":"%s"}' \
    "$name" "$filename" "$ext" "$size" "$date" >> "$OUTPUT"
done

echo "" >> "$OUTPUT"
echo "]" >> "$OUTPUT"
echo "index.json erstellt mit $(grep -c '"name"' "$OUTPUT") Eintraegen."
