# URAI Vault Automation Plan

This branch sets up the automation foundation for the URAI Vault / Data Wallet build.

## What this branch adds

1. A GitHub Actions validation workflow at `.github/workflows/urai-vault-ci.yml`.
2. A reusable agent build prompt at `docs/prompts/BUILD_URAI_VAULT.md`.
3. This automation plan for running the build safely through Firebase Studio, Cursor, Codex, or another repo-connected coding agent.

## Why this exists

URAI Vault is the trust, consent, data wallet, LifeMap pattern asset, anonymized pattern licensing, audit, export/delete, and future earnings layer for URAI.

The goal is to automate implementation while preventing unsafe shortcuts around privacy, user consent, paid licensing, and sensitive data.

## How to use this branch

1. Open the repo in Firebase Studio, Cursor, Codex, or a repo-connected coding agent.
2. Ask the agent to read `docs/prompts/BUILD_URAI_VAULT.md`.
3. Ask the agent to implement the work in stages.
4. After each stage, run:

```bash
npm run check:types
npm run lint
npm test
npm run build
```

Or run the combined script:

```bash
npm run ci
```

## Recommended staged implementation

1. Types and trust copy.
2. Validators and consent logic.
3. Pattern asset and anonymization logic.
4. Licensing preference logic.
5. Audit, usage ledger, earnings placeholders.
6. API routes.
7. Vault UI pages and components.
8. Firestore rules updates.
9. Tests.
10. Documentation and smoke test checklist.

## Hard safety rules

- Do not implement crypto or tokens.
- Do not promise user earnings.
- Do not license raw personal data.
- Do not license raw audio, exact GPS trails, private messages, names, emails, phone numbers, or identity-level relationship data.
- Do not imply medical, legal, financial, or therapeutic advice.
- Keep pattern licensing opt-in only.
- Keep research and B2B aggregate use opt-in only.
- Ensure revocation stops future use.
- Ensure audit logs and consent history are immutable from the client.

## Launch blockers

Before this can launch publicly, URAI still needs:

1. Legal review of pattern licensing and trust copy.
2. Security review of Firestore rules.
3. Deletion/export backend worker verification.
4. Payment/payout infrastructure before any real earnings feature.
5. Partner approval workflow before external licensing offers.

## Final target

URAI Vault should make the privacy promise visible, usable, and valuable:

> Trust is not a legal footer. Trust is the product.
