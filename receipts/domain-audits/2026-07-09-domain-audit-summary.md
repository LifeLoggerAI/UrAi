# URAI Domain Audit Summary Receipt

DATE: 2026-07-09
SYSTEM: URAI Domain Registry
REPO: LifeLoggerAI/UrAi
RAW_EVIDENCE:
- receipts/domain-audits/raw/2026-07-09-domain-probe-results.txt

SUMMARY:
A DNS, HTTPS, HTTP, and response-header probe was run across URAI-owned domains.

CONTEXT:
Not all URAI domains have been moved to Firebase, app hosting, or their final production targets yet.
Many domains are currently parked, reserved, or temporarily pointed to Squarespace while registrar access, identity validation, Firebase setup, and final hosting decisions are completed.

KEY_FINDINGS:
1. Many URAI domains resolve to Squarespace infrastructure and return HTTP/HTTPS 200.
2. This is not automatically an error because several domains have not yet been moved to their final app hosts.
3. A 200 response from Squarespace proves the domain resolves, but does not prove the intended URAI repo/service is deployed there.
4. Several domains do not currently resolve and should be treated as reserved/not configured until DNS is intentionally completed.
5. Future audits must distinguish between intentionally parked domains and domains that are expected to be live.

KNOWN_NON_RESOLVING_DOMAINS:
- uraistaging.com
- www.uraistaging.com
- uraiipholdings.com
- www.uraiipholdings.com

KNOWN_PARKED_OR_TEMPORARY_SQUARESPACE_PATTERN:
Many apex domains return Squarespace A records:
- 198.185.159.144
- 198.185.159.145
- 198.49.23.144
- 198.49.23.145

Many www domains return CNAME:
- ext-sq.squarespace.com

OPERATIONAL INTERPRETATION:
Domains returning 200 through Squarespace should be treated as parked/reserved/temporary surfaces unless there is separate proof that the intended URAI repo is deployed there.

PRODUCTION_RULE:
No domain may be called production for its intended URAI service unless there is:
- DNS/SSL proof
- final hosting target proof
- connected repo proof
- deploy SHA proof
- smoke test proof
- rollback proof
- monitoring proof
- privacy/security proof where applicable

P0 FOLLOW_UP:
- Identify which domains are meant to be live now.
- Identify which domains are intentionally parked.
- Identify which domains should move to Firebase Hosting.
- Verify urai.app and www.urai.app as canonical app targets.
- Verify or fix www.uraiassetfactory.com only if Asset Factory is intended to be live now.
- Leave parked domains parked until product/service readiness exists.
- Do not claim admin, privacy, analytics, communications, jobs, studio, storytime, B2B, or IP holdings as live production services without deploy receipts.

STATUS:
RAW_DOMAIN_EVIDENCE_RECORDED
DNS_MIGRATION_INCOMPLETE_BY_DESIGN
SUMMARY_REVIEW_REQUIRED

VERIFIED_BY: Adam Clamp / URAI Labs
