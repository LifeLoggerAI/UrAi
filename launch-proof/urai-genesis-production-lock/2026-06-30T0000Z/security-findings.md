# URAI Genesis Security Findings

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi

## Executive summary

The public demo routes are generally honest and gated, and Firestore rules include owner/admin boundaries. This continuation pass found and mitigated one source-level admin API risk: `/api/admin/status` no longer trusts a caller-supplied admin email header in production unless an explicit local/demo escape hatch is enabled.

## Finding S1: `/api/admin/status` previously trusted caller-supplied admin email header

Severity before fix: P0 before production admin use / P1 if kept demo-only and not linked publicly
Current status: mitigated in source, still requires tests and deployed smoke proof

Source files:

- `src/app/api/admin/status/route.ts`
- `src/lib/admin/adminAccess.ts`
- `env.local.template`

Original observed behavior:

- `adminUserFromRequest(request)` returned `{ email: request.headers.get("x-urai-admin-email") }`.
- `GET` passed that email into `requireAdminAccess`.
- `requireAdminAccess` checked the supplied email against `URAI_ADMIN_EMAILS` or `NEXT_PUBLIC_URAI_FOUNDER_EMAILS`.
- There was no verified Firebase ID token, session cookie, custom claim, signed request, or server-authenticated identity check in this source path.

Risk before fix:

If this API route were reachable publicly and an attacker knew or guessed a configured admin/founder email, the attacker could spoof `x-urai-admin-email` and receive admin status/config details. The endpoint did not mutate data, but it exposed internal status and confirmed configured capabilities.

Source mitigation applied:

- Added `allowHeaderAdminStatus()`.
- Header-based admin status is now allowed only when `URAI_ENABLE_HEADER_ADMIN_STATUS=1` or `NODE_ENV !== "production"`.
- Production default ignores `x-urai-admin-email` and returns 403 unless a future verified-auth path is implemented.
- Added `authMode` response field to show when the local/demo header gate is active.
- Documented `URAI_ENABLE_HEADER_ADMIN_STATUS=0` in `env.local.template` with production warning.

Remaining required proof before production:

1. Add automated tests proving spoofed `x-urai-admin-email` fails in production mode unless the explicit demo env gate is enabled.
2. Add deployment smoke proving unauthorized public requests return 403.
3. Replace demo header gate with verified Firebase ID token or session cookie before any production admin use.
4. Require custom claim such as `admin: true` or server-side admin allowlist after identity verification.
5. Keep admin routes hidden/gated until real auth passes.

## Finding S2: Public/private route claims depend on deployment parity

Severity: P0 launch blocker

Observed behavior:

- Source has `/ground`, but live `/ground` returned 404.
- Prior evidence says source `/system` had production-lock truth but live `/system` did not show expected markers.

Risk:

Users may see stale public copy or broken links while repo documentation says routes are present. Production launch claims require source/live parity.

Required fix:

1. Deploy the current commit.
2. Smoke every linked route.
3. Capture live route logs and screenshots.
4. Block release if any source-linked route returns 404/500.

## Finding S3: Provider-capable AI is source-present but not deployment-proven

Severity: P0 claim blocker

Observed behavior:

- `/api/companion/respond` can call OpenAI when `OPENAI_API_KEY` exists.
- It falls back locally if no key or provider failure occurs.
- This pass did not verify deployed provider env or live provider smoke.

Risk:

Marketing live AI generation before deployment proof would overclaim.

Required fix:

1. Verify server-only provider env.
2. Smoke provider path with safe input.
3. Verify fallback path.
4. Verify safety boundaries.
5. Record proof before claiming live AI.

## Finding S4: Firestore rules are source-present but not deployment-proven

Severity: P0/P1 depending on launch mode

Observed behavior:

- Firestore rules include owner/admin boundaries and write restrictions.
- This connector-only pass did not deploy or run emulator/rules tests.

Required fix:

1. Run `npm run test:rules`.
2. Deploy rules to intended Firebase project.
3. Record Firebase project/site evidence.
4. Smoke waitlist/admin/user-owned flows under allowed and denied cases.

## Current security verdict

Security posture is acceptable for a clearly-labeled public demo if private/admin/user-data behavior stays gated. The admin header spoof risk has been reduced in source, but production is still not ready for admin, private account, provider AI, analytics, communications, jobs, or user-derived memory features until auth, rules, deployment, privacy, monitoring, and smoke evidence pass.
