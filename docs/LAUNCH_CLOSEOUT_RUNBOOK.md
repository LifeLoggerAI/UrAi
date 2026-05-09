# URAI V1 Launch Closeout Runbook

This runbook collects the final operational proof required after the P0, P1, and first-pass P2 work has landed.

It is not a product-expansion plan. Do not add new surfaces while completing this checklist.

## Current baseline

- P0 launch gate is merged.
- P1 release hardening gate is merged.
- P2 first-pass demo polish is merged.
- Closeout tracking issue: #196.

## 1. Confirm the release candidate

Use the exact commit intended for staging and production promotion.

```bash
git rev-parse HEAD
```

Record the value as:

```bash
URAI_RELEASE_CANDIDATE_SHA="..."
```

Confirm the rollback target is a different known-good commit:

```bash
URAI_ROLLBACK_TARGET_SHA="..."
```

## 2. Run local structural gates

From the release-candidate commit:

```bash
npm install
npm run check:lockfile
npm run check:v1
npm run launch:p0
npm run release:p1
npm run seed:demo
npm run test:unit
npm run test:rules
npm run typecheck
npm run lint
npm run build
```

Record the command output summary in #196.

## 3. Run strict P1 promotion gate

Strict P1 requires real deployment evidence values. Include `URAI_P0_RUN_COMMANDS=1` so the generated P1 report contains full P0 command evidence instead of only the nested P0 pass/fail marker.

```bash
URAI_P1_STRICT=1 \
URAI_P1_RUN_COMMANDS=1 \
URAI_P0_RUN_COMMANDS=1 \
URAI_STAGING_PROJECT_ID="..." \
URAI_PRODUCTION_PROJECT_ID="..." \
URAI_RELEASE_CANDIDATE_SHA="..." \
URAI_ROLLBACK_TARGET_SHA="..." \
URAI_STAGING_SMOKE_TESTED=1 \
URAI_PRODUCTION_DEPLOY_APPROVED=1 \
npm run release:p1
```

Expected output:

```txt
P1 READY
```

The command writes:

```txt
tmp/p1-release-gate-report.md
```

Attach or paste the report summary into #196.

## 4. Verify staging

Record:

```bash
URAI_STAGING_PROJECT_ID="..."
URAI_STAGING_DEPLOY_URL="..."
```

Verify these on staging:

- [ ] `/` loads on desktop.
- [ ] `/` loads on mobile.
- [ ] `/u/adamclamp` loads on desktop.
- [ ] `/u/adamclamp` loads on mobile.
- [ ] `/api/companion` returns a valid response for a short prompt.
- [ ] `/api/companion` rejects or guards an empty prompt.
- [ ] `/api/waitlist` accepts valid dry-run payload.
- [ ] Configured waitlist Firestore persistence works.
- [ ] Waitlist/private data is not publicly readable.

Useful manual API checks:

```bash
curl -X POST "$URAI_STAGING_DEPLOY_URL/api/companion" \
  -H "Content-Type: application/json" \
  -d '{"history":[],"message":"What pattern stands out today?"}'
```

```bash
curl -X POST "$URAI_STAGING_DEPLOY_URL/api/companion" \
  -H "Content-Type: application/json" \
  -d '{"history":[],"message":""}'
```

```bash
curl -X POST "$URAI_STAGING_DEPLOY_URL/api/waitlist" \
  -H "Content-Type: application/json" \
  -d '{"email":"launch-smoke@example.com","source":"launch-closeout","handle":"adamclamp","intent":"early-access"}'
```

## 5. Verify production readiness

Record:

```bash
URAI_PRODUCTION_PROJECT_ID="..."
URAI_PRODUCTION_DEPLOY_URL="..."
URAI_PRODUCTION_DEPLOY_APPROVED=1
```

Before production promotion, confirm:

- [ ] Staging and production project IDs are different.
- [ ] Production deploy uses `URAI_RELEASE_CANDIDATE_SHA`.
- [ ] Rollback target SHA is recorded.
- [ ] Firestore rules and indexes are deployed.
- [ ] Functions are deployed if required for the release target.
- [ ] No ad hoc local branch is treated as the release candidate.

## 6. Capture visual proof

Attach screenshots or a short recording for each:

- [ ] Desktop `/`.
- [ ] Mobile `/`.
- [ ] Desktop `/u/adamclamp`.
- [ ] Mobile `/u/adamclamp`.
- [ ] Companion interaction.
- [ ] Waitlist CTA and success state.

## 7. Capture the final demo recording

Record a 30-60 second clip that shows:

1. `/` home demo framing.
2. Public constellation CTA.
3. `/u/adamclamp` public-safe demo-data framing.
4. Companion prompt and response.
5. Waitlist CTA and success state.

The recording must avoid:

- private user data,
- real non-demo memories,
- roadmap-only claims,
- B2B/jobs surfaces,
- spatial/XR/story/export claims unless explicitly marked out of scope.

Attach the final recording link to #196, then cross-link it back to:

- #182 for P0,
- #191 for P1,
- #194 for P2.

## 8. Closeout comment template

Paste this into #196 when evidence is ready:

```md
## Launch closeout evidence

Release candidate SHA: `...`
Rollback target SHA: `...`
Staging project ID: `...`
Production project ID: `...`
Staging URL: `...`
Production URL: `...`

### Gates

- [ ] `npm run check:lockfile` passed
- [ ] `npm run check:v1` passed
- [ ] `npm run launch:p0` passed
- [ ] `npm run release:p1` passed
- [ ] strict P1 gate passed with `URAI_P0_RUN_COMMANDS=1`
- [ ] `tmp/p1-release-gate-report.md` summary attached

### Visual proof

- [ ] Desktop `/` attached
- [ ] Mobile `/` attached
- [ ] Desktop `/u/adamclamp` attached
- [ ] Mobile `/u/adamclamp` attached
- [ ] Companion proof attached
- [ ] Waitlist proof attached

### Recording

Final demo recording: ...

### Notes

No new product surfaces were added during closeout. Production promotion used only the verified release-candidate SHA.
```
