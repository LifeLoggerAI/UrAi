# URAI Domain Audit Summary Receipt

DATE: 2026-07-09
SYSTEM: URAI Domain Registry
REPO: LifeLoggerAI/UrAi
RAW_EVIDENCE:
- receipts/domain-audits/raw/2026-07-09-domain-probe-results.txt

SUMMARY:
A DNS, HTTPS, HTTP, and response-header probe was run across URAI-owned domains.

KEY_FINDINGS:
1. Many URAI domains resolve to Squarespace infrastructure and return HTTP/HTTPS 200.
2. Squarespace 200 does not prove the domain is connected to the intended URAI repo or Firebase app.
3. Admin, privacy, jobs, analytics, communications, storytime, investors, studio, content, B2B, foundation, and company/IP domains require repo-to-domain verification before production claims.
4. Several domains do not currently resolve and need DNS setup or registrar verification.

KNOWN_NON_RESOLVING_DOMAINS:
- uraistaging.com
- www.uraistaging.com
- uraiipholdings.com
- www.uraiipholdings.com

KNOWN_SQUARESPACE_PATTERN:
Many apex domains return Squarespace A records:
- 198.185.159.144
- 198.185.159.145
- 198.49.23.144
- 198.49.23.145

Many www domains return CNAME:
- ext-sq.squarespace.com

OPERATIONAL INTERPRETATION:
Domains returning 200 through Squarespace should be treated as reserved/parked/public holding surfaces unless there is separate proof that the intended URAI repo is deployed there.

PRODUCTION_RULE:
No domain may be called production for its intended URAI service unless there is:
- DNS/SSL proof
- hosting target proof
- connected repo proof
- deploy SHA proof
- smoke test proof
- rollback proof
- monitoring proof
- privacy/security proof where applicable

P0 FOLLOW_UP:
- Verify urai.app and www.urai.app as canonical app targets.
- Verify or fix www.uraiassetfactory.com.
- Fix or intentionally park uraistaging.com and www.uraistaging.com.
- Fix or intentionally park uraiipholdings.com and www.uraiipholdings.com.
- Confirm uraiadmin.com is not being treated as live admin if it points to Squarespace.
- Confirm uraiprivacy.com is not treated as privacy gate complete unless consent/export/delete/audit workflows are proven.
- Create per-domain receipts for main app, admin, privacy, asset factory, staging, and IP holdings first.

STATUS:
RAW_DOMAIN_EVIDENCE_RECORDED
SUMMARY_REVIEW_REQUIRED

VERIFIED_BY: Adam Clamp / URAI Labs
