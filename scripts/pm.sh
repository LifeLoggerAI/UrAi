#!/usr/bin/env bash
# Usage: ./scripts/pm.sh <command>
set -euo pipefail
if [ -f pnpm-lock.yaml ] && command -v pnpm >/dev/null 2>&1; then
  PM=pnpm
elif [ -f package-lock.json ]; then
  PM=npm
else
  PM=${PM_OVERRIDE:-npm}
fi
case "${1:-}" in
  install)
    if [ "$PM" = pnpm ]; then pnpm install --frozen-lockfile; else npm ci || npm install; fi ;;
  run)
    shift
    if [ "$PM" = pnpm ]; then pnpm run "$@"; else npm run "$@"; fi ;;
  exec)
    shift
    if [ "$PM" = pnpm ]; then pnpm exec "$@"; else npx "$@"; fi ;;
  *) echo "Usage: pm.sh {install|run <script>|exec <bin> [args...]"; exit 2;;
esac