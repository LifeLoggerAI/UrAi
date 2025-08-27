#!/usr/bin/env bash
set -euo pipefail

echo "--- Running URAI Rebuild (safe) ---"

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

CACHE_BASE="$HOME/urai-build-cache"
export NPM_CONFIG_CACHE="$CACHE_BASE/.npm"
export TMPDIR="$CACHE_BASE/tmp"

mkdir -p "$NPM_CONFIG_CACHE" "$TMPDIR"

echo "🧹 Cleaning project artifacts..."
rm -rf node_modules package-lock.json .next

# Ensure we do NOT override npm prefix or cwd
npm config delete prefix >/dev/null 2>&1 || true
unset npm_config_prefix || true
unset prefix || true

echo "📦 Installing deps in project root: $PROJECT_ROOT"
npm cache clean --force
npm install

echo "✅ Done."
