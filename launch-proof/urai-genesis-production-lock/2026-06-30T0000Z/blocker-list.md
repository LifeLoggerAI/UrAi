# URAI Genesis Blocker List

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi

## P0 launch blockers

1. Live/source route drift: `/ground` exists in source but live `https://urai.app/ground` returned 404.
2. Live `/system` parity is not proven. Prior launch report says live `/system` did not show production-lock truth markers.
3. Registry marks canonical repo as `demo-only`, `eligibleForLaunch: false`, and `canClaimProduction: false`.
4. No current install/lint/typecheck/test/build proof from this pass.
5. No production deploy log or deployed commit SHA.
6. No rollback target/drill proof.
7. No monitoring/alert proof.
8. No privacy release gate pass.
9. Firestore/Storage rules deployment and test proof not verified here.
10. Cross-repo production integrations remain blocked, roadmap-only, demo-only, or staging-only in registry.

## P1 release blockers

1. Verify `/api/waitlist` real persistence with Firebase Admin credentials in deployed environment.
2. Smoke every internal route linked from the home dock and footer.
3. Capture screenshots for primary surfaces.
4. Update live status/system pages after deploy so public truth matches repo truth.
5. Confirm env.local.template, firebase.json, .firebaserc, registry, Firebase CLI target, and deploy logs all agree on `urai-4dc1d` before production deploy.

## P2 polish blockers

1. Add route parity CI that fails when source/internal links return 404 on the deployment URL.
2. Add evidence index linking command logs, screenshot proof, deployment proof, rollback proof, monitoring proof, and privacy proof.
3. Make preview/live/gated language consistent across all visible route badges.

## P3 non-launch polish

1. Add public uptime history or monitoring status export.
2. Add downstream repo evidence links only once each downstream repo passes its own production lock.
3. Add richer manual QA checklist for mobile/XR fallback states.

## Required state for READY verdict

- Source route map equals live route map.
- `/system` live displays registry-backed launch truth.
- All P0 command checks pass in Node 20.
- Firebase deploy evidence exists for hosting and rules.
- Rollback proof exists.
- Monitoring proof exists.
- Privacy gate proof exists or all private-account surfaces remain explicitly gated.
- Public claims remain demo-safe and evidence-backed.
