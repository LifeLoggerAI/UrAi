# Production Evidence Requirements

Updated: 2026-06-25

No URAI repo may be marked production-ready unless the evidence exists in repo artifacts, CI artifacts, deploy logs, or observed live verification.

## Minimum Evidence

1. Exact repo and branch or commit SHA
2. Clean or intentionally documented working tree state
3. Build command output
4. Typecheck command output
5. Test or smoke command output
6. Deploy command or deploy workflow output
7. Live URL or runtime endpoint verification
8. Environment/target confirmation
9. Rollback target
10. Owner/operator approval where required

## Additional Required Evidence For Sensitive Systems

### Privacy-bound systems

- consent behavior proof
- export proof
- delete proof
- retention/legal-hold proof
- audit-log proof

### Communications systems

- provider staging proof
- callback proof
- opt-out and quiet-hours proof
- legal/privacy signoff

### Analytics and passive/derived signal systems

- privacy gate dependency
- durable storage proof
- non-wildcard CORS proof
- strong auth proof
- live smoke proof

### Admin systems

- non-admin denial proof
- admin bootstrap proof
- audit trail proof

## Explicit Anti-Overclaim Rule

If a repo only has scaffolding, static docs, or local tests, it must not be described as production-live.
