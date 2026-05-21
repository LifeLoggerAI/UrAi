# UrAi QA and Release Blocker System

Status: active QA control document
Owner: QA Lead / Release Lead

## Release rule

UrAi cannot be released or frozen with any open Blocker or Critical issue.

## Severity levels

| Severity | Definition | Release rule |
| --- | --- | --- |
| Blocker | Launch impossible, data loss, auth bypass, payment broken, production deploy broken, rollback impossible, or security critical | Must fix before release |
| Critical | Major user flow broken, privacy risk, billing lifecycle broken, AI safety failure, or tier bypass | Must fix before release |
| High | Important feature broken, serious UX/accessibility/performance issue, missing docs for launch-critical flow | Must fix or receive explicit exception |
| Medium | Noticeable issue with workaround and no safety/security/payment impact | Can defer with approval |
| Low | Cosmetic or minor copy issue | Can defer |

## Bug report template

```text
Title:
Severity:
Tier:
Environment:
Build/version:
Route/screen/system:
Steps to reproduce:
Expected result:
Actual result:
Screenshots/logs:
User impact:
Suspected implementation area:
Owner:
Labels:
```

## Bug verification template

```text
Bug ID:
Fix PR/commit:
Tested build:
Regression tests run:
Manual QA result:
Automated result:
Evidence link:
QA signoff:
```

## Release candidate checklist

- [ ] Branch cut from green main
- [ ] Version/tag proposed
- [ ] `npm run check:v1` passes
- [ ] `npm run check:firestore-contract` passes
- [ ] `npm run seed:demo` passes
- [ ] `npm run test:unit` passes
- [ ] `npm run check:types` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run preflight` passes
- [ ] `npm run test:smoke` passes
- [ ] `npm run test:e2e` passes or exception attached
- [ ] Security/privacy review complete
- [ ] Accessibility check complete
- [ ] Performance check complete
- [ ] Staging smoke complete
- [ ] Rollback procedure tested
- [ ] Monitoring/alerting verified
- [ ] Documentation pack reviewed
- [ ] Known issues reviewed
- [ ] Go/no-go completed

## Smoke test checklist

- [ ] `/` loads without console or server errors
- [ ] `/u/adamclamp` loads without console or server errors
- [ ] Waitlist valid email path works
- [ ] Waitlist invalid email path shows safe error state
- [ ] Companion happy path works within safety boundaries
- [ ] Companion empty input guard works
- [ ] Mobile viewport renders without overflow
- [ ] Keyboard navigation reaches core actions
- [ ] Firebase config validation passes
- [ ] Firestore contract audit passes

## Tier-specific QA gates

| Tier | Required QA evidence |
| --- | --- |
| Tier 1 | Auth/profile/demo/dashboard/waitlist/symbolic mirror tests |
| Tier 2 | Pricing, checkout, webhook, entitlement, billing portal, cancel/downgrade/failed payment tests |
| Tier 3 | AI prompt suite, adversarial suite, fallback, memory/privacy, rate/cost tests |
| Tier 4 | SDK/API contract tests, key issuance, metering, abuse/rate-limit tests |
| Tier 5 | Partner/franchise admin, branded companion, revenue/compliance/audit tests |

## Final QA signoff template

```text
Release candidate:
Commit SHA:
Environment:
Smoke result:
Regression result:
Security result:
Accessibility result:
Performance result:
Known issues:
Open blockers:
Open criticals:
Approved exceptions:
QA recommendation:
QA lead approval:
Date:
```
