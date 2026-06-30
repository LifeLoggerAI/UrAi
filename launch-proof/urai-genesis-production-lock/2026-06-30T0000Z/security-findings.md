# URAI Genesis Security Findings

Generated: 2026-06-30 America/Chicago
Repo: LifeLoggerAI/UrAi

## Executive summary

The public demo routes are generally honest and gated, and Firestore rules include owner/admin boundaries. The highest source-level security issue found in this continuation pass is the admin status API access pattern.

## Finding S1: `/api/admin/status` trusts caller-supplied admin email header

Severity: P0 before production admin use / P1 if kept demo-only and not linked publicly

Source files:

- `src/app/api/admin/status/route.ts`
- `src/lib/admin/adminAccess.ts`

Observed behavior:

- `adminUserFromRequest(request)` returns `{ email: request.headers.get("x-urai-admin-email") }`.
- `GET` passes that email into `requireAdminAccess`.
- `requireAdminAccess` checks the supplied email against `URAI_ADMIN_EMAILS` or `NEXT_PUBLIC_URAI_FOUNDER_EMAILS`.
- There is no verified Firebase ID token, session cookie, custom claim, signed request, or server-authenticated identity check in this source path.

Risk:

If this API route is reachable publicly and an attacker knows or guesses a configured admin/founder email, the attacker could spoof `x-urai-admin-email` and receive admin status/config details. The endpoint currently returns feature flags and environment configuration booleans.

Current exposure impact:

The route does not appear to mutate data, but it exposes internal status and confirms configured capabilities. It must not be treated as production admin security.

Required fix before production:

1. Remove trust in `x-urai-admin-email` for production.
2. Verify Firebase ID token or session cookie server-side through Firebase Admin.
3. Require custom claim such as `admin: true` or a server-side admin allowlist after identity verification.
4. Return 401 for missing/invalid auth and 403 for authenticated non-admin.
5. Add tests proving spoofed headers fail.
6. Add deployment smoke proving unauthorized public requests return 401/403.
7. Keep admin routes hidden/gated until this passes.

Safe interim mitigation:

- Keep `/api/admin/status` undocumented for public users.
- Do not link it from public pages.
- Treat `/admin` as demo/gated only.
- If possible, add an environment guard such as `URAI_ENABLE_HEADER_ADMIN_STATUS=1` for local/demo only, default off in production.

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

Security posture is acceptable for a clearly-labeled public demo if private/admin/user-data behavior stays gated. It is not production-ready for admin, private account, provider AI, analytics, communications, jobs, or user-derived memory features until auth, rules, deployment, privacy, and monitoring evidence pass.
