# Original UrAi — legacy main Firebase/Rules/data boundary crosswalk

**Read at immutable main** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`, 2026-11-07. This is **source-only**: effective deployed Firebase Rules and live project mapping were not retrieved.

| Path / Git blob ID | Observed enforcement / implementation |
|---|---|
| `system/canonical-authority.json` / `b6bab8f4939dd239d61f3281ae54b9213c8d216a` | Quarantine declares `urai-spatial` / `urai-tier1` production; UrAi is legacy. |
| `firebase.json` / `41d19cb3d5886c0a04faaef4c062cf4a033ecb3a` | Emulator-only Firestore port 8080; **does not install root Rules or deploy hosting**. |
| `.firebaserc` / `b49ad35cde53275e3206456c669028493de73153` | Empty `projects`, `targets`, `etags` maps. |
| `src/lib/firebase-admin.ts` / `52732c344aa4626697e4748e18146693f8573422` | Explicitly returns `null` for Admin DB/Auth, `false` for Admin configured. Legacy server cannot re-establish provider through this helper. |
| `src/app/api/waitlist/route.ts` / `e482061425213bd70d452bd4a0cbc77abd2f943a` | Server route normalizes/rate-limits and uses Admin when available; with disabled Admin it responds `{ok:true, mode:"dry-run"}` to valid requests. **Dry-run is not persistence.** |
| `src/components/launch/LaunchShell.tsx` / `079c7c7b2c5f8021f8e92cfe69af72fc6756dab9` | Public browser forms call `addLaunchDocument` for `waitlistEntries`, `makeMineRequests`, `foundingAccessMembers`, `creatorApplications`; browser tracking and payment placeholders. These are not the server-only `waitlistSignups` contract. |
| `src/lib/launch/firebaseClient.ts` / `9e58cbbd279a6ba1f58983f838bd0db89821451a` | Client Firebase SDK uses NEXT_PUBLIC variables and `addDoc` for caller-specified collection. Without configuration it warns and returns `{id:"local-preview", offline:true}`; UI should not claim successful persistent submissions based on that. |
| `src/lib/launch/payments.ts` / `450192434fe32e298c2025f299507baae60d8506` | Placeholder checkout URLs and Firestore `paymentEvents`; no real payment receipt verification. |
| `firestore.rules` / `7d63727cbd8b67af375325ee46e11f310d09fdc0` | Larger reference Rules. `createsPublicSubmission()` checks only `createdAt != null`, and anonymous creation is allowed for `waitlistEntries`, `contactMessages`, `makeMineRequests`, `foundingAccessMembers`, `creatorApplications`, `analyticsEvents`, and `paymentEvents`. Client reads are denied for these. |
| `firestore.staging.rules` / `ec239136747b8eb6c648f5e943b12e66c85b1358` | Distinct staging Rules; `staging_waitlist` has a stronger field allowlist/email constraints, while `waitlistEntries` remains simple public create. |
| `firebase/firestore.rules` / `2b552bfd259a7ea5d58b535ebab4b3f665ef65de` | Separate minimal Rules family permitting authenticated user-path access and public `waitlist` creation. Not interchangeable with root Rules. |
| `storage.rules` / `2cf60684df3b13f013c67b48c5689f9673d31ba8` | Owner-path read/write under `users`, `staging`, `exports`; no explicit per-file size/content-type enforcement in this version. |
| `firebase/storage.rules` / `7213a24df6f13ceda5cd43fb0f7193612921dcff` | Simpler owner-path Storage family; source design is not a cloud-IAM/revocation certification. |

## Security and functional risks, explicitly conditional
- **P0 if legacy paths are reactivated:** simple anonymous `createdAt` public-submission rule has no schema, size, anti-abuse or authenticity constraint. `paymentEvents` client-generated "checkout_started"/"webhook_received" cannot be trusted as payment authority. This is a reference policy risk, not a claim current production is exploitable.
- **P1:** client-side `Make Mine` collects story content and contact data before an independently verified private-data consent and retention contract; review collection scope, input limits, explicit purpose, deletion and no-ads promise before enabling.
- **P1:** browser form displays success after `addLaunchDocument` in offline/local-preview mode; the user-facing text implies receipt although persistence is skipped. Separate demo status from actual server receipt.
- **P1:** owner-nested `users/{uid}/{privateCollection}/{privateDoc}` rules permit owner creation of any allowlisted document without a purpose-scoped positive consent receipt. These Rules are broad legacy scaffolding, not a modern signed provenance source.
- **P1:** historical root `/users/{uid}/tokens/{id}` is client owner-readable and writable; verify exact intended token type/issuer, and never use client-writable records as authority credentials.

## Gated acceptance
1. Discover *effective* canonical `urai-spatial` deployed Rules, hosting target and source SHA through authorized cloud read-only inspection.
2. Run real disposable Rules emulator tests for anonymous public-write schemas, field injection, forged payment events, cross-owner reads, stale permission and delete/export; do not treat previous suite names as new PASS.
3. Reconcile public lead capture in its actual approved service with server rate limits, durable acknowledgments, consent purpose and tenant isolation.
4. Keep all original UrAi live deployment/mutation prohibited; accept controlled historical imports only after independent review.
