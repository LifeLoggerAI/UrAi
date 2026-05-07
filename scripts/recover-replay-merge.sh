#!/usr/bin/env bash
set -euo pipefail

printf '\n[URAI] Local replay merge recovery helper\n'
printf '[URAI] This script is intentionally conservative. It will not auto-edit conflict markers.\n\n'

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo '[ERROR] Run this from the repository root.' >&2
  exit 1
fi

if ! git diff --name-only --diff-filter=U | grep -q .; then
  echo '[URAI] No unmerged files detected.'
else
  echo '[URAI] Unmerged files:'
  git diff --name-only --diff-filter=U
fi

if [ -f pages/life-map.tsx ] && [ -f app/life-map/page.tsx ]; then
  echo '[URAI] Removing duplicate Pages Router file: pages/life-map.tsx'
  git rm pages/life-map.tsx
fi

if git ls-files -u apps/web/src/components/home/HomeXRScene.tsx >/dev/null 2>&1 && git ls-files -u apps/web/src/components/home/HomeXRScene.tsx | grep -q .; then
  echo '[URAI] Staging HomeXRScene.tsx to keep the merged file version.'
  git add apps/web/src/components/home/HomeXRScene.tsx
fi

for file in app/layout.tsx app/page.tsx app/globals.css global-error.tsx not-found.tsx; do
  if [ ! -e "$file" ] && git show "origin/main:$file" >/dev/null 2>&1; then
    echo "[URAI] Restoring $file from origin/main"
    git restore --source=origin/main -- "$file"
    git add "$file"
  fi
done

if [ -d node_modules ]; then
  echo '[URAI] Restoring node_modules deletions so they are not committed.'
  git restore -- node_modules 2>/dev/null || true
fi

if grep -R "<<<<<<<\|=======\|>>>>>>>" app/home/page.tsx app/life-map/page.tsx >/dev/null 2>&1; then
  echo ''
  echo '[ACTION REQUIRED] Conflict markers remain in:'
  grep -n "<<<<<<<\|=======\|>>>>>>>" app/home/page.tsx app/life-map/page.tsx || true
  echo ''
  echo 'Edit these files with vi, code, or sed before committing:'
  echo '  app/home/page.tsx'
  echo '  app/life-map/page.tsx'
  echo ''
  echo 'Then run:'
  echo '  git add app/home/page.tsx app/life-map/page.tsx'
  echo '  git status'
  echo '  git commit'
  exit 2
fi

git add app/home/page.tsx app/life-map/page.tsx 2>/dev/null || true

if git diff --name-only --diff-filter=U | grep -q .; then
  echo ''
  echo '[ACTION REQUIRED] Unmerged files remain:'
  git diff --name-only --diff-filter=U
  exit 3
fi

echo ''
echo '[URAI] No unmerged files detected after cleanup.'
echo '[URAI] Review status, then commit if it looks correct:'
echo '  git status'
echo '  git commit'
echo '  npm install'
echo '  npm run build'
