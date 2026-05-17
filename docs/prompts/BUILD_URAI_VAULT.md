# Build URAI Vault / Data Wallet

Use this prompt with Firebase Studio, Cursor, Codex, or another repo-connected coding agent.

## Mission

Build **URAI Vault** as the first-class user-owned data wallet, consent ledger, LifeMap pattern asset system, anonymized pattern licensing foundation, trust center, usage ledger, export/delete/revocation request layer, and future earnings ledger for URAI.

This is not a crypto/token build. Do not implement tokens, wallets on-chain, speculative payouts, or guaranteed earnings.

Core product principle:

> Trust is not a legal footer. Trust is the product.

## Product goals

Implement the foundation for:

1. URAI Vault / Data Wallet
2. User-owned LifeMap pattern assets
3. Granular consent controls
4. Anonymized pattern licensing preferences
5. Pattern asset eligibility rules
6. Data usage transparency
7. Audit logs
8. Earnings ledger placeholders
9. Export, deletion, and revocation request flows
10. Public trust and data ownership pages

## Required routes

Create or verify:

```txt
app/vault/page.tsx
app/vault/assets/page.tsx
app/vault/consent/page.tsx
app/vault/licensing/page.tsx
app/vault/earnings/page.tsx
app/vault/audit/page.tsx
app/vault/export/page.tsx
app/vault/delete/page.tsx
app/vault/revoke/page.tsx
app/vault/trust/page.tsx
app/data-ownership/page.tsx
app/pattern-licensing/page.tsx
app/trust/page.tsx
app/api/vault/assets/route.ts
app/api/vault/consent/update/route.ts
app/api/vault/licensing/opt-in/route.ts
app/api/vault/licensing/opt-out/route.ts
app/api/vault/audit/route.ts
app/api/vault/export/request/route.ts
app/api/vault/delete/request/route.ts
app/api/vault/revoke/route.ts
app/api/vault/earnings/route.ts
app/api/vault/patterns/create/route.ts
```

## Required shared files

Create or verify:

```txt
src/lib/vault/types.ts
src/lib/vault/validators.ts
src/lib/vault/consent.ts
src/lib/vault/patternAssets.ts
src/lib/vault/anonymization.ts
src/lib/vault/licensing.ts
src/lib/vault/audit.ts
src/lib/vault/earnings.ts
src/lib/vault/export.ts
src/lib/vault/revocation.ts
src/lib/vault/trustCopy.ts
```

Create or verify components:

```txt
components/vault/VaultShell.tsx
components/vault/VaultOverview.tsx
components/vault/PatternAssetCard.tsx
components/vault/ConsentControlPanel.tsx
components/vault/LicensingPreferences.tsx
components/vault/DataEarningsLedger.tsx
components/vault/DataUsageLedger.tsx
components/vault/AuditEventList.tsx
components/vault/ExportRequestPanel.tsx
components/vault/DeleteRequestPanel.tsx
components/vault/RevocationPanel.tsx
components/vault/TrustExplanationCard.tsx
components/vault/LifeMapAssetConstellation.tsx
```

## Firestore collections

Use these collections:

```txt
userDataWallets
userPatternAssets
lifeMapPatternAssets
userConsentPolicies
consentHistory
patternLicensingPreferences
patternLicensingOffers
patternLicensingAgreements
researchInsightRequests
anonymizedPatternPools
dataEarningsLedger
dataUsageLedger
vaultAuditLogs
revocationEvents
dataExportRequests
dataDeletionRequests
trustDisclosures
sensitiveDataClassifications
retentionPolicies
insightSourceLedger
assetRightsLedger
```

## Required TypeScript model

Implement these core concepts in `src/lib/vault/types.ts`:

- `VaultStatus`
- `PatternAssetType`
- `ConsentStatus`
- `AnonymizationLevel`
- `LicensingStatus`
- `AllowedUseCase`
- `ProhibitedUseCase`
- `UserDataWallet`
- `UserPatternAsset`
- `UserConsentPolicy`
- `PatternLicensingPreference`
- `PatternLicensingOffer`
- `DataEarningsLedgerEntry`
- `DataUsageLedgerEntry`
- `VaultAuditLog`

Use these prohibited use cases at minimum:

```ts
"identity_targeting"
"insurance_pricing"
"credit_scoring"
"employment_screening"
"law_enforcement"
"political_targeting"
"medical_diagnosis"
"sale_of_identifiable_data"
```

## Consent rules

Default policy:

```txt
audioTranscription: private
gpsLocation: private
socialGraph: private
moodEmotionalData: private
healthWellnessSignals: private
aiInsightGeneration: allowed
productAnalytics: private
anonymizedPatternLicensing: private
b2bAggregateReports: private
researchUse: private
```

Rules:

- Pattern licensing is off by default.
- Research use is off by default.
- B2B aggregate reports are off by default.
- Users must explicitly opt in.
- Revocation must stop future use.
- Consent history must be immutable.
- Consent updates must write audit logs.

## Pattern asset rules

- Pattern assets are derived intelligence objects, not raw user data.
- LifeMap pattern assets may reference LifeMap star IDs.
- Pattern assets must not expose raw audio, exact GPS traces, private messages, names, emails, phone numbers, or identity-level relationship data.
- Restricted assets cannot be licensed.
- High sensitivity assets require `research_safe` or `licensing_safe` anonymization.
- All asset creation must write data usage ledger and audit events.

## Anonymization rules

Implement helpers to:

- strip direct identifiers
- strip quasi-identifiers
- bucket timestamps
- generalize location
- remove raw text
- remove raw audio references
- remove relationship identifiers
- create aggregate pattern summaries
- assert licensing safety

Block licensing if anonymization cannot be verified.

## Licensing rules

- Licensing is off by default.
- Users can opt in, pause, or revoke.
- Users can require per-offer approval.
- No identifiable personal data can be licensed.
- All allowed use cases must be explicit.
- All prohibited use cases must be enforced.
- External paid offers require legal review.
- Do not promise earnings.
- Show earnings as estimated unless actually paid.

## UI direction

Make `/vault` feel like a premium URAI product, not a settings page.

Design metaphor:

- Vault
- Constellation
- Pattern stars
- Private-by-default trust layer

Do not use crypto language or token visuals.

Core copy:

> Your life patterns belong to you.

> URAI turns your daily signals into private intelligence you can understand, control, export, revoke, and — only if you choose — make eligible for anonymized pattern licensing.

Trust bullets:

- Private by default.
- Pattern licensing is off by default.
- No sale of identifiable personal data.
- Raw audio, exact GPS trails, private messages, and identity-level relationship data are never eligible for licensing.
- You can pause or revoke future use.
- You can request export or deletion.
- Every important use is logged.

Earnings disclaimer:

> Estimated values are not guaranteed earnings. Actual payouts depend on approved licensing opportunities, eligibility, legal review, and payment infrastructure.

AI disclaimer:

> URAI insights are informational and reflective. They are not medical, legal, financial, or therapeutic advice.

## Required tests

Add or update tests for:

- default licensing is private/off
- consent update increments version
- revocation writes revocation event
- LifeMap asset excludes raw data
- restricted asset cannot be licensed
- identifiable data licensing is blocked
- prohibited use cases are enforced
- export request is created
- deletion request is created
- user cannot read another user's vault
- user cannot write fake earnings
- user cannot modify audit logs

## Documentation

Create or verify:

```txt
docs/URAI_VAULT_SYSTEM.md
docs/URAI_DATA_WALLET_SCHEMA.md
docs/URAI_PATTERN_LICENSING_MODEL.md
docs/URAI_TRUST_LANGUAGE.md
docs/URAI_VAULT_SMOKE_TEST.md
```

## Validation commands

This repo uses npm, not pnpm. Run:

```bash
npm ci
npm run check:types
npm run lint
npm test
npm run build
```

Or the existing combined script:

```bash
npm run ci
```

## Final report

When finished, report:

- files created
- files modified
- routes created
- API routes created
- Firestore collections used
- security rules changed
- tests added
- docs added
- env vars required
- manual setup still required
- remaining blockers
- final launch verdict

Final verdict format:

```txt
Is URAI Vault complete as a user-owned data wallet and pattern-licensing foundation?

YES / PARTIAL / NO
```

If partial or no, list exact blockers only.
