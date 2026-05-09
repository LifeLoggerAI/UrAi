# URAI Privacy and Security Checklist

URAI handles emotionally sensitive and potentially passive data. V1 must remain a public demo until consent, security, and deletion/export controls are implemented and verified.

## V1 launch requirements

- [ ] Public copy says passive sensing is not live in V1.
- [ ] Companion copy says it is not a therapist, doctor, lawyer, crisis service, or diagnostic authority.
- [ ] `waitlistSignups` is server-only in Firestore rules.
- [ ] Private collections require `ownerUid == request.auth.uid`.
- [ ] No client code imports Firebase Admin credentials.
- [ ] No secrets are committed.
- [ ] Demo data is safe for public display.
- [ ] Staging waitlist persistence is verified before launch copy claims persistence.

## Before passive capture

- [ ] Consent center exists.
- [ ] Each passive source has independent opt-in and revoke controls.
- [ ] Audio capture has explicit recording consent and jurisdiction-aware copy.
- [ ] Location capture has explicit location consent and retention controls.
- [ ] Voiceprint/biometric/facial analysis is disabled until high-sensitivity consent and deletion controls exist.
- [ ] Raw passive events have retention limits.
- [ ] Enrichment jobs check consent before writing derived insights.
- [ ] Users can export and delete their data.
- [ ] Admin access is role-gated and audit logged.

## Before live AI companion/model calls

- [ ] Unsafe-phrasing tests pass.
- [ ] Companion never diagnoses or prescribes.
- [ ] Crisis fallback copy is reviewed.
- [ ] User feedback/report controls exist.
- [ ] Expensive endpoints are rate limited.
- [ ] Prompt/model outputs include confidence or "why this" framing where appropriate.

## Before data marketplace

- [ ] Marketplace participation is separate opt-in.
- [ ] Anonymization method is documented and tested.
- [ ] Re-identification risk review is complete.
- [ ] Users can revoke future participation.
- [ ] User-facing explanation avoids income overclaims.
- [ ] Marketplace exports are audit logged.

## Before B2B/admin dashboards

- [ ] Tenant isolation is enforced.
- [ ] Admin roles use least privilege.
- [ ] Admin reads/writes are audit logged.
- [ ] Production data access is denied by default.
- [ ] Support tooling cannot bypass user deletion/export policy.

## Engineering rule

No new passive, biometric, marketplace, therapy-like, admin, or B2B capability should ship without matching consent, rules, tests, docs, and deployment verification.
