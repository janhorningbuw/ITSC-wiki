#!/usr/bin/env bash
# Erzeugt index.json rekursiv aus allen HTML/PDF-Dateien im Dokumentordner.
set -euo pipefail

DOCS="${1:-docs}"
OUTPUT="$DOCS/index.json"

python3 - "$DOCS" "$OUTPUT" <<'PY'
import json
import sys
from datetime import datetime
from pathlib import Path

docs = Path(sys.argv[1])
output = Path(sys.argv[2])

if not docs.is_dir():
    raise SystemExit(f"Dokumentordner nicht gefunden: {docs}")

entries = []
for path in sorted(docs.rglob("*"), key=lambda item: item.as_posix().casefold()):
    extension = path.suffix.lower()
    if not path.is_file() or extension not in {".html", ".pdf"}:
        continue

    relative_path = path.relative_to(docs).as_posix()
    folder = path.parent.relative_to(docs).as_posix()
    if folder == ".":
        folder = ""

    entries.append({
        "name": path.stem.replace("-", " ").replace("_", " ").title(),
        "file": relative_path,
        "folder": folder,
        "type": extension.removeprefix("."),
        "description": "",
        "tags": [],
        "size": path.stat().st_size,
        "date": datetime.fromtimestamp(path.stat().st_mtime).date().isoformat(),
    })

output.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"index.json erstellt mit {len(entries)} Einträgen in {docs}.")
PY
