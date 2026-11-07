# Original UrAi — independently executed exact-blob legacy deploy guard (isolated)

**Execution date:** 2026-11-07. **Scope:** only two manually reconstructed, Git SHA-1-verified files from UrAi `main` `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. **Runner:** local container, Node.js `v22.16.0`, Git `2.47.3`. Declared repository target in `package.json` is Node 20; this is **not** a frozen project build or production certification.

## Original source identity verification
| Source | GitHub blob SHA-1 from connector | Local `git hash-object` | Match |
|---|---|---|---|
| `scripts/block-legacy-production-deploy.mjs` | `6f1df84e4f1d0d71de7c4c3c3862a22014b60f30` | `6f1df84e4f1d0d71de7c4c3c3862a22014b60f30` | YES |
| `scripts/check-legacy-quarantine-boundary.mjs` | `70dacc6b1ea9a9bec877d6c059dd16a79a51bf1c` | `70dacc6b1ea9a9bec877d6c059dd16a79a51bf1c` | YES |

## Execution and observed stdout/exit
In an isolated no-credentials directory with the original relative script paths, command `node scripts/check-legacy-quarantine-boundary.mjs` produced:

```
[legacy-quarantine-check] PASS: legacy production authority remains fail-closed.
check_exit=0
```

Direct negative control `node scripts/block-legacy-production-deploy.mjs deploy` exited `1` as the original script requires.

**Outcome:** `isolated_test_verified` for the *two exact source blobs and direct fail-closed invocation only*. No other repository files or original npm dependencies were installed in this test. No original full CI/Rules/Playwright/TypeScript/build run was executed. No actual Firebase, staging, live deployment, credentials, or server/provider identity was accessed. This narrow PASS **cannot certify** every workflow/quarantine route, let alone the Genesis integrated release.

Container direct GitHub HTTPS attempt still failed with DNS `Could not resolve host: github.com`; exact text source came from connected GitHub source API, then SHA-1 verified locally.
