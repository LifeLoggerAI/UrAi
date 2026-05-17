#!/usr/bin/env bash
set -euo pipefail

EXPECTED_PROJECT="urai-4dc1d"
EXPECTED_SITE="urai-4dc1d"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[urai-deploy] Verifying Firebase target lock..."
node scripts/check-firebase-target.mjs

echo "[urai-deploy] Building URAI app from canonical repo: LifeLoggerAI/UrAi"
npm run check:v1
npm run check:types
npm run lint
npm run test:unit
npm run build

echo "[urai-deploy] Deploying Firestore rules, indexes, functions, and hosting to ${EXPECTED_PROJECT}/${EXPECTED_SITE}..."
firebase deploy --project "$EXPECTED_PROJECT"

echo "[urai-deploy] Done. URAI is deployed to Firebase project ${EXPECTED_PROJECT}, hosting site ${EXPECTED_SITE}."
