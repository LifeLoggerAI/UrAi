# URAI DNS/SSL Domain Audit

Generated: 2026-06-25

Method: `Resolve-DnsName` plus HTTP/HTTPS `Invoke-WebRequest` from the Codex environment. This did not modify DNS.

## Findings

| Domain | Owner repo | DNS result | HTTPS result | Status | Launch blocker |
| --- | --- | --- | --- | --- | --- |
| urai.app | LifeLoggerAI/UrAi | A 199.36.158.100 | HTTP 200 | Firebase-compatible apex responds | No for demo; still not production proof |
| www.urai.app | LifeLoggerAI/UrAi | CNAME urai-4dc1d.web.app | HTTP 200 | Firebase custom domain responds | No for demo; still not production proof |
| uraiadmin.com | LifeLoggerAI/urai-admin | Squarespace A records | HTTP 200 | Does not point to admin Firebase surface | Yes for admin production |
| www.uraiadmin.com | LifeLoggerAI/urai-admin | CNAME ext-sq.squarespace.com | HTTP 200 | Does not point to admin Firebase surface | Yes for admin production |
| uraiprivacy.com | LifeLoggerAI/urai-privacy | Squarespace A records | HTTP 200 | Public privacy domain responds, not proven Firebase app | Yes for privacy release gate proof |
| www.uraiprivacy.com | LifeLoggerAI/urai-privacy | CNAME ext-sq.squarespace.com | HTTP 200 | Public privacy domain responds, not proven Firebase app | Yes for privacy release gate proof |
| uraiassetfactory.com | LifeLoggerAI/asset-factory | A 199.36.158.100 | HTTP 200 | Apex responds | No for deferred apex; user-data/provider gates still block |
| www.uraiassetfactory.com | LifeLoggerAI/asset-factory | CNAME ghs.googlehosted.com | HTTPS failed; HTTP 404 | www domain not ready | Yes for asset-factory custom domain |
| uraifoundation.org | LifeLoggerAI/urai-foundation | Squarespace A records | HTTP 200 | External governance surface responds | Not Genesis launch proof |
| www.uraifoundation.org | LifeLoggerAI/urai-foundation | CNAME ext-sq.squarespace.com | HTTP 200 | External governance surface responds | Not Genesis launch proof |
| urai-4dc1d.web.app | LifeLoggerAI/UrAi | Firebase web.app A/AAAA | HTTP 200 | Firebase host responds | No for demo; not enough for production |
| urai-staging.web.app | LifeLoggerAI/urai-staging | Firebase web.app A/AAAA | HTTP 200 | Staging root responds | Staging-only |
| urai-jobs.web.app | LifeLoggerAI/urai-jobs | Firebase web.app A/AAAA | HTTP 200 | Jobs root responds | Still blocked by rollback/monitoring/privacy/deploy evidence |
| urai-admin.web.app | LifeLoggerAI/urai-admin | Firebase web.app A/AAAA | HTTP 503 | Firebase admin host unavailable | Yes |

## Required Fixes

- Keep `urai.app` and `www.urai.app` as demo-safe until build/check/deploy/rollback/monitoring/privacy evidence exists.
- Do not claim `uraiadmin.com` for admin production until DNS points to the intended admin host and HTTPS smoke passes.
- Do not treat `uraiprivacy.com` as privacy gate pass until live privacy workflows and legal evidence are proven.
- Fix `www.uraiassetfactory.com` HTTPS/HTTP before any custom-domain claim.
- Record Firebase console/custom-domain verification evidence for any custom domain before production cutover.
