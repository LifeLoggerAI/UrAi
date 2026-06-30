# URAI Genesis / Main Front Door Production Lock Audit

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi
Default branch: main
Visibility/access observed through connector: public repo, admin/push permissions available

## Executive verdict

PARTIAL / NOT READY for public production launch.

The repo is a real Next.js/Firebase URAI Genesis front-door app with a public demo surface, route implementations, Firebase hosting configuration, Firebase rules, deterministic companion API, waitlist API, XR capability-gated foundation, and strict production-lock documentation. It is not production-ready because the registry marks the canonical repo as demo-only and not launch eligible; deploy, rollback, monitoring, and privacy-gate evidence remain missing; local install/lint/typecheck/test/build commands were not executable from this connector-only audit; and live hosting shows route/deploy drift including a live /ground 404 despite source code existing for /ground.

Readiness score: 63/100 source-side, 38/100 launch-side.

## Repo identity and purpose

LifeLoggerAI/UrAi is the canonical public/demo product app for the URAI Genesis front door. Current source and README frame V1 as a launch-safe sample memory-to-world demo, not as full private sensing, therapy, marketplace, AR/VR, B2B, autonomous jobs, communications, or life-logging production.

## Done with receipts

- Repo access confirmed: admin, maintain, pull, push, and triage permissions were visible through the GitHub connector.
- Package scripts exist for dev, build, lint, tests, typecheck, preflight, smoke, release checks, Firebase deploy, and production evidence checks.
- Root route and /home route render NewHomeScene.
- Source includes a real /ground route with launch-safety copy and public sample-data framing.
- Source includes /system route backed by system/urai-system-registry.json.
- Source includes /xr route with WebXR capability detection and a gated Enter VR button that only appears when immersive-vr and a renderer are ready.
- Source includes /dashboard, /login, and /signup gated pages.
- Source includes /api/companion deterministic mocked narrator endpoint with safety boundaries.
- Source includes /api/waitlist with validation, rate limit hook, dry-run mode, and Firebase Admin write path when configured.
- Firebase hosting is configured for site urai-4dc1d, .firebaserc points default/production to urai-4dc1d, and env.local.template now documents FIREBASE_PROJECT_ID=urai-4dc1d.
- Firestore rules contain owner/admin boundaries for many user-owned/private collections and admin-only control collections.
- Live https://urai.app redirects to /home and returns public-demo copy.

## Partial with receipts

- Live site responds and shows public-demo language, but source/live route parity is not complete.
- /system source exists with registry-backed production truth, but earlier final report says live /system did not show the new production-lock truth.
- /ground source exists, but live fetch returned 404 during this pass.
- Waitlist API can dry-run without Admin credentials; real persistence depends on deployment env Admin credentials.
- XR foundation is real capability gating, but full headset behavior was not device-tested in this audit.
- Firestore rules exist, but deployment of rules and emulator/rules test results were not verified in this pass.

## Not started / not launch-proven

- Production deploy evidence: missing.
- Deployed commit SHA: missing.
- Rollback target/drill evidence: missing.
- Monitoring/alert evidence: missing.
- Privacy release gate proof: missing.
- Live visual screenshot proof: missing.
- Full local install/lint/typecheck/test/build proof: not produced by this connector-only pass.
- Full cross-repo production integrations: not proven live.

## Mock/demo/fake inventory

- /api/companion is deterministic mocked companion behavior by design, not a real LLM/provider integration.
- Home/Life Map/Ground are public sample/demo surfaces and should not be represented as private account memory systems.
- XR is capability-gated foundation only, not universal VR/AR launch.
- Jobs/content/storytime/analytics/admin/privacy/communications integrations are registry-gated and not live production dependencies.

## Broken or blocking findings

- Live /ground returned 404 despite source route existing.
- Registry marks LifeLoggerAI/UrAi launchMode demo-only and eligibleForLaunch false.
- Prior final launch report records NO-GO, no staging deploy, no production deploy, no rollback proof, no monitoring evidence, no privacy gate pass, and /system live mismatch.

## Security/privacy risks

- No obvious committed private key value was observed in the files inspected; FIREBASE_PRIVATE_KEY and client email are blank in the env template.
- NEXT_PUBLIC Firebase config keys are correctly documented as browser-exposed.
- Server-side Firebase Admin fields are documented, but real deployment secret wiring was not verified.
- API waitlist writes require Firebase Admin when not dry-run; auth/authz for API surfaces beyond waitlist/companion needs deployment-level verification.
- Public/private route boundaries are honestly gated in dashboard/login/signup source.
- Firestore owner/admin rules exist, but rules deployment and tests were not verified here.

## Deployment/live verification

- Live root https://urai.app redirected to https://urai.app/home and rendered public-demo copy.
- Live status route was reachable and described static preview/private actions off.
- Live /life-map rendered a public page shell but parsed text was limited.
- Live /privacy-controls rendered privacy controls copy.
- Live /ground failed with 404 in this pass.
- Direct opening of several non-root URLs was constrained by browser safety behavior, so route checks were mostly performed via root-page links.

## Integration status

- urai-spatial: registry roadmap-only/partial; no production proof.
- urai-storytime: registry blocked; no production proof.
- urai-content: demo/source package; standalone launch blocked.
- urai-jobs: staging-only with historical URL smoke; missing rollback/monitoring/privacy proof.
- urai-admin: blocked; historical live URL returned 503.
- urai-privacy: blocked release gate; public surface does not prove consent/export/delete/admin audit workflows.
- urai-analytics: blocked; privacy/monitoring/smoke/storage proof missing.
- urai-communications: blocked/pilot only; opt-in/legal/export/delete/provider proof missing.
- urai-marketing: demo-only/public surface evidence, but strict production lock incomplete.

## Blockers

### P0

1. Fix live/source route drift, especially /ground 404 and /system production-truth parity.
2. Produce clean npm install, lint, typecheck, unit/rules/e2e smoke, and build logs from a real Node 20 terminal.
3. Record deploy target, deployed commit SHA, hosting URL, and Firebase site evidence.
4. Produce rollback target and rollback drill evidence.
5. Produce monitoring/alert evidence.
6. Pass privacy release gate evidence or keep all private/account features gated.

### P1

1. Verify Firestore/Storage rules deployed and tested.
2. Verify waitlist API persistence in the deployed environment.
3. Add live URL smoke for every route linked from the home dock.
4. Capture screenshots for root/home/system/life-map/ground/xr/privacy/waitlist/dashboard/login/signup.

### P2

1. Add current deployment evidence to docs/FINAL_LAUNCH_REPORT.md.
2. Add automated route parity check between source route map and live host.
3. Strengthen public copy around demo/preview/live badges.

### P3

1. Add richer observability dashboards and public status history.
2. Add cross-repo integration proof links only after downstream systems pass their locks.

## Completion plan to 100%

1. Run npm ci on Node 20 and commit package-lock drift if any.
2. Run npm run check:v1, check:system-registry, check:production-lock, check:firestore-contract, check:public-copy, check:production-claims, validate:completion, typecheck, lint, unit tests, rules tests, e2e smoke, and build.
3. Fix every failing route/script without adding fake functionality.
4. Deploy to staging or production target with explicit Firebase project/site and capture command logs.
5. Smoke live root, /home, /system, /life-map, /ground, /xr, /privacy, /terms, /waitlist, /dashboard, /login, /signup, and all home dock links.
6. Verify /system displays registry production truth on live host.
7. Verify waitlist POST behavior in deployed env with dry-run off only if Admin credentials are correctly configured.
8. Deploy and test Firestore/Storage rules.
9. Capture rollback target and rollback drill proof.
10. Capture monitoring/alert proof.
11. Keep dashboard/login/signup/private data/jobs/communications/storytime/content/analytics/admin claims gated until downstream systems are proven.
12. Update FINAL_LAUNCH_REPORT, PRODUCTION_LOCK, release checklist, and this proof folder with final logs.

## Commits made in this pass

This audit report file was added in launch-proof/urai-genesis-production-lock/2026-06-30T0000Z/ and refreshed after env target evidence showed the Firebase project template now matches urai-4dc1d.

## Final verdict

FINAL VERDICT: PARTIAL / NOT READY — the source is a serious public-demo front door, but production launch is blocked by missing command/deploy/rollback/monitoring/privacy evidence and live route parity failures.
