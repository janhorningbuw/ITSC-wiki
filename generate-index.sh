#!/bin/bash
# Erzeugt index.json aus allen HTML/PDF Dateien im docs/ Ordner.
# Dateien muessen manuell in der name_map definiert werden.

DOCS="docs"
OUTPUT="$DOCS/index.json"

echo "[" > "$OUTPUT"

first=true

add_entry() {
  local file="$1" name="$2" type="$3" desc="$4" tags="$5"
  [ -f "$DOCS/$file" ] || return
  size=$(stat -f%z "$DOCS/$file" 2>/dev/null || stat -c%s "$DOCS/$file" 2>/dev/null)
  if [ "$first" = true ]; then first=false; else echo "," >> "$OUTPUT"; fi
  printf '  {"name":"%s","file":"%s","type":"%s","description":"%s","tags":[%s],"size":%s}' \
    "$name" "$file" "$type" "$desc" "$tags" "$size" >> "$OUTPUT"
}

add_entry "willkommen.html"        "Willkommen"                      "html" "Einführung ins ITSC-Wiki"                            '"start","hilfe"'
add_entry "margherita.html"        "Pizza Margherita"                "html" "Klassisches Rezept mit Tomaten und Mozzarella"        '"pizza","klassisch"'
add_entry "diavola.html"           "Pizza Diavola"                   "html" "Scharfe Pizza mit Salami Piccante"                   '"pizza","scharf"'
add_entry "quattro-formaggi.html"  "Pizza Quattro Formaggi"         "html" "Vier-Käse-Pizza mit Gorgonzola und Parmesan"         '"pizza","käse"'
add_entry "prosciutto-funghi.html" "Pizza Prosciutto e Funghi"      "html" "Pizza mit Kochschinken und Champignons"              '"pizza","schinken"'
add_entry "teig-grundrezept.pdf"   "Pizza Teig Grundrezept (PDF)"   "pdf"  "Grundrezept für Pizzateig als PDF"                   '"pizza","teig","pdf"'

echo "" >> "$OUTPUT"
echo "]" >> "$OUTPUT"
echo "index.json erstellt mit $(grep -c '"name"' "$OUTPUT") Eintraegen."
