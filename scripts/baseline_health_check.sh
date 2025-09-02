set -euo pipefail

printf "\n▶ Dependency sanity\n"; ./scripts/pm.sh exec depcheck || true

printf "\n▶ TODO/FIXME scan\n"; rg -n "TODO|FIXME|HACK|XXX" --hidden --glob '!node_modules' > audit_todos.txt || true

printf "\n▶ Size snapshot\n"; du -sh node_modules || true

printf "\nDone. Key outputs: audit_todos.txt\n"