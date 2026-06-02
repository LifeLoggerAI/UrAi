#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

export npm_config_cache="${URAI_NPM_CACHE:-/tmp/urai-npm-cache}"
export NPM_CONFIG_CACHE="$npm_config_cache"
export PLAYWRIGHT_OUTPUT_DIR="${PLAYWRIGHT_OUTPUT_DIR:-test-results}"
export NEXT_DISABLE_CACHE="${NEXT_DISABLE_CACHE:-1}"

mkdir -p "$npm_config_cache" "$PLAYWRIGHT_OUTPUT_DIR"

if [ "${URAI_CLEAN_INSTALL:-0}" = "1" ]; then
  rm -rf node_modules .next/cache test-results playwright-report .turbo 2>/dev/null || true
fi

npm config set cache "$npm_config_cache" --global
npm config get cache

npm ci
npm run typecheck
npm run test
npm run build
npm run test:smoke

if [ "${URAI_RUN_PRODUCTION_SMOKE:-0}" = "1" ]; then
  npm run test:smoke:production
fi
