#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
OUT="$ROOT/audit-inventory.json"

# Expected asset folders (customize as needed)
expect=(
  "public/assets/sky"
  "public/assets/ground"
  "public/assets/avatar"
  "public/assets/overlays"
  "public/assets/transitions"
)

json='{'
for d in "${expect[@]}"; do
  count=$(find "$ROOT/$d" -type f | wc -l | tr -d ' ')
  json+="\"$d\": $count,"
done
json=${json%,}
json+='}'

printf "%s\n" "$json" | jq . > "$OUT"
echo "Saved $OUT" && cat "$OUT"