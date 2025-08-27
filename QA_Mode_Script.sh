#!/usr/bin/env bash
set -euo pipefail
echo "=== UrAi QA Mode Script ==="
command -v node >/dev/null || { echo "Node required"; exit 1; }
command -v firebase >/dev/null || { echo "Install Firebase CLI: npm i -g firebase-tools"; exit 1; }
if [ ! -f ".env.local" ]; then echo "Missing .env.local – copy env.local.template and fill values."; exit 1; fi
for d in urai.app geturai.app ruai.app; do if command -v dig >/dev/null 2>&1; then dig +short "$d"; else nslookup "$d"; fi || true; done
if command -v pnpm >/dev/null; then pnpm install && pnpm build; else npm install && npm run build; fi
[ -f firestore.rules ] || echo "WARNING: firestore.rules not found"
[ -f storage.rules ] || echo "WARNING: storage.rules not found"
if command -v lighthouse >/dev/null 2>&1; then
  (npm run start || pnpm start) & APP_PID=$!; sleep 5
  lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo,pwa --output=json --output-path=./lh-artifacts/report.json --chrome-flags="--headless --no-sandbox" || true
  kill $APP_PID || true
else
  echo "Lighthouse not installed (npm i -g lighthouse)"
fi
if [ -f "serviceAccount.json" ] && [ -n "${FCM_TOKEN:-}" ]; then
  node -e "const admin=require('firebase-admin');const sa=require('./serviceAccount.json');admin.initializeApp({credential:admin.credential.cert(sa)});admin.messaging().send({token:process.env.FCM_TOKEN,notification:{title:'UrAi test',body:'Push working 🚀'}}).then(r=>{console.log('FCM sent:',r)}).catch(e=>{console.error(e);process.exit(1);});"
else
  echo "Skipping FCM test (need serviceAccount.json + FCM_TOKEN)"
fi
echo "=== QA Mode complete ==="
