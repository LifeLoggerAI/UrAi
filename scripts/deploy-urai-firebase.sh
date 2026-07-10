#!/usr/bin/env bash
set -euo pipefail

TARGET_ENV="${URAI_DEPLOY_ENV:-production}"
DEPLOY_ONLY="${URAI_FIREBASE_DEPLOY_ONLY:-firestore:rules,firestore:indexes,hosting}"
RUN_LOCAL_CHECKS="${URAI_DEPLOY_RUN_CHECKS:-1}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "$TARGET_ENV" == "production" || "$TARGET_ENV" == "prod" ]]; then
  node scripts/block-legacy-production-deploy.mjs "scripts/deploy-urai-firebase.sh ${TARGET_ENV}"
fi

if [[ "$TARGET_ENV" != "staging" ]]; then
  echo "[urai-deploy] Unknown or unauthorized URAI_DEPLOY_ENV '$TARGET_ENV'. Only staging is allowed from this legacy repository." >&2
  exit 1
fi

export npm_config_cache="${npm_config_cache:-/tmp/urai-npm-cache}"
mkdir -p "$npm_config_cache"

EXPECTED_PROJECT="urai-staging"
EXPECTED_SITE="urai-staging"
FIREBASE_CONFIG_FILE="firebase.staging.json"

export URAI_EXPECTED_FIREBASE_PROJECT="$EXPECTED_PROJECT"
export URAI_EXPECTED_FIREBASE_SITE="$EXPECTED_SITE"

echo "[urai-deploy] Legacy repository staging verification only."
echo "[urai-deploy] Production authority: LifeLoggerAI/urai-spatial/urai-tier1"
echo "[urai-deploy] Firebase project/site: ${EXPECTED_PROJECT}/${EXPECTED_SITE}"
echo "[urai-deploy] Firebase config: ${FIREBASE_CONFIG_FILE}"
echo "[urai-deploy] Deploy scope: ${DEPLOY_ONLY}"

echo "[urai-deploy] Verifying clean working tree before staging release..."
node scripts/check-clean-working-tree.mjs

echo "[urai-deploy] Verifying Firebase target lock for staging..."
node scripts/check-firebase-target.mjs --config "$FIREBASE_CONFIG_FILE"

if [[ "$RUN_LOCAL_CHECKS" == "1" ]]; then
  echo "[urai-deploy] Running local gates before staging deploy..."
  npm run check:v1
  npm run check:types
  npm run lint
  npm run test:unit
  npm run build
else
  echo "[urai-deploy] Skipping local gates because URAI_DEPLOY_RUN_CHECKS=${RUN_LOCAL_CHECKS}."
fi

echo "[urai-deploy] Deploying staging verification target..."
NEXT_DISABLE_CACHE="${NEXT_DISABLE_CACHE:-1}" firebase deploy \
  --project "$EXPECTED_PROJECT" \
  --config "$FIREBASE_CONFIG_FILE" \
  --only "$DEPLOY_ONLY" \
  --force

echo "[urai-deploy] Done. Legacy staging verification deployed to ${EXPECTED_PROJECT}/${EXPECTED_SITE}."
