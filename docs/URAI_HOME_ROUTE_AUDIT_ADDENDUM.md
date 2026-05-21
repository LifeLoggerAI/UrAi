# URAI Home Route Audit Addendum

Status: merged post-PR #299 clarification
Merge commit: `d30827f1d4b05c4f8f2624ed12c961dd9bbea4dc`

## Finding

The repo has two HomeWorld requirements that must stay aligned:

1. Production navigation treats `/` as the canonical home shell.
2. Smoke checks need stable HomeWorld DOM hooks, labels, text, and data attributes.

During PR #299, `/home` was briefly made direct to expose route-level hooks, but full production E2E expects `/home` to redirect to `/`. The final merged state restores `/home -> /` and keeps the runtime HomeWorld smoke contract available through the canonical root shell.

## Final merged state

- `next.config.mjs` redirects `/home` to `/` with `permanent: false`.
- `src/app/home/page.tsx` still renders `UraiResolvedHomeScene` and `HomeWorldSmokeContract` for static route-contract checks.
- The canonical runtime entry remains `/`.
- HomeWorld accessibility and smoke hooks remain covered without making `/home` the production canonical route.

## Verified in PR #299

The final PR head `58f6ccaee55cb9246de5ecddd9dd985207fb05c1` passed:

- CI
- UrAi CI/CD
- Playwright Smoke
- URAI Launch Gate
- URAI Vault CI
- Assets CI
- QA - Lighthouse and A11y
- QA - Local Script
- Independent Release Verifier
