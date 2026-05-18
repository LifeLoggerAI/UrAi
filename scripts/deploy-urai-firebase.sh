#!/usr/bin/env bash
set -euo pipefail

TARGET_ENV="${URAI_DEPLOY_ENV:-production}"
DEPLOY_ONLY="${URAI_FIREBASE_DEPLOY_ONLY:-firestore:rules,firestore:indexes,hosting}"
RUN_LOCAL_CHECKS="${URAI_DEPLOY_RUN_CHECKS:-1}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

case "$TARGET_ENV" in
  staging)
    EXPECTED_PROJECT="urai-staging"
    EXPECTED_SITE="urai-staging"
    FIREBASE_CONFIG_FILE="firebase.staging.json"
    ;;
  production|prod)
    TARGET_ENV="production"
    EXPECTED_PROJECT="urai-4dc1d"
    EXPECTED_SITE="urai-4dc1d"
    FIREBASE_CONFIG_FILE="firebase.json"
    if [[ "${URAI_PRODUCTION_DEPLOY_APPROVED:-0}" != "1" ]]; then
      echo "[urai-deploy] Refusing production deploy: set URAI_PRODUCTION_DEPLOY_APPROVED=1 after staging smoke signoff." >&2
      exit 1
    fi
    ;;
  *)
    echo "[urai-deploy] Unknown URAI_DEPLOY_ENV '$TARGET_ENV'. Use staging or production." >&2
    exit 1
    ;;
esac

export URAI_EXPECTED_FIREBASE_PROJECT="$EXPECTED_PROJECT"
export URAI_EXPECTED_FIREBASE_SITE="$EXPECTED_SITE"

echo "[urai-deploy] Target environment: ${TARGET_ENV}"
echo "[urai-deploy] Firebase project/site: ${EXPECTED_PROJECT}/${EXPECTED_SITE}"
echo "[urai-deploy] Firebase config: ${FIREBASE_CONFIG_FILE}"
echo "[urai-deploy] Deploy scope: ${DEPLOY_ONLY}"

echo "[urai-deploy] Verifying Firebase target lock for ${TARGET_ENV}..."
node scripts/check-firebase-target.mjs --config "$FIREBASE_CONFIG_FILE"

if [[ "$RUN_LOCAL_CHECKS" == "1" ]]; then
  echo "[urai-deploy] Running local gates before deploy..."
  npm run check:v1
  npm run check:types
  npm run lint
  npm run test:unit
  npm run build
else
  echo "[urai-deploy] Skipping local gates because URAI_DEPLOY_RUN_CHECKS=${RUN_LOCAL_CHECKS}."
fi

echo "[urai-deploy] Deploying to ${EXPECTED_PROJECT}/${EXPECTED_SITE}..."
NEXT_DISABLE_CACHE="${NEXT_DISABLE_CACHE:-1}" firebase deploy \
  --project "$EXPECTED_PROJECT" \
  --config "$FIREBASE_CONFIG_FILE" \
  --only "$DEPLOY_ONLY" \
  --force

echo "[urai-deploy] Done. URAI ${TARGET_ENV} deployed to Firebase project ${EXPECTED_PROJECT}, hosting site ${EXPECTED_SITE}."
