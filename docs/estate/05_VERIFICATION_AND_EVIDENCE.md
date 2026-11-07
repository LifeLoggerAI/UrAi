# Original UrAi — exact-source test and certification boundary

**Source head reviewed:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`; **documentation PR:** #396; **engineering donor:** #394 head `12794cbb2599e644fbb982c2d5be244f4879e35e` when read.

| Evidence scope | Observed outcome | What remains |
|---|---|---|
| Current main tracked-tree inventory | **PASS (metadata only):** 4,031 entries, 2,489 blobs, 1,542 tree entries; recursive API `truncated:false` | SHA256 each actual blob, LFS payload, alternate trees/history |
| Branch head discovery | **PASS (ref metadata only):** 242 branch names and SHAs; `REFS.json` | Branch-tree comparisons, all commits, tags (tag endpoint 404), old PR history |
| Selected original source files | **PASS (source read only):** package, routes, Firestore adapters, deployment guards, companion, static consent | Every file semantic/byte review; binary image/video inspection |
| Original unit/security/Browser suites | **NOT RUN in this audit**; test names and npm scripts inventoried | Clean exact-SHA checkout, Node 20, immutable logs, exit 0 |
| CI status / workflow jobs | Existing workflows observed; some separate worker historic reports claim green, and #394 reports offline benchmark workflow success | Independently obtain exact-job logs, run SHA and current status; reported green unrelated to full acceptance |
| Firestore Auth/Rules/Storage emulator | Rules and Jest test sources exist; **no current emulators run in this audit** | Independent real SDK multi-owner, revocation/deletion proof |
| Privacy → Studio → Jobs → Replay | **NOT VERIFIED here**; previous repo-specific synthetic receipts are not transferable | Signed positive owner consent, render MP4/SRT/JSON, protected playback, revoke/delete/late write denial |
| Device / XR / languages / accessibility | **NOT VERIFIED here** | Real Android/desktop/XR, approved iOS, VoiceOver/TalkBack/NVDA, reduced motion, 20+ locale acceptance |
| Production deployment | **NOT AUTHORIZED**; UrAi legacy deploy guards fail closed by source | Protected Spatial immutable source, cloud IAM, independent review, rollout, rollback, founder GO |

## Safe original-app command candidates (not executed)
At an authorized, capable exact-source checkout, preserve Node `20` from `package.json` and run nondeploy checks `npm run check:legacy-quarantine`, `npm run check:genesis`, `npm run check:firestore-contract`, `npm run test:unit`, `npm run test:rules`, `npm run check:types`, `npm run lint`, `npm run build`, then browser e2e with controlled synthetic data. Collect runner environment, exact commit, stdout and SHA256 receipts.

This connected audit used repository APIs; direct container Git remote access failed with `Could not resolve host: github.com`. It did NOT clone, install dependencies, invoke service credentials, start paid compute or change production. Do not translate prior workers' PASS into a new source head certificate.

## Release truth
**HOLD.** A GitHub source file is not a build; a build is not authentication; an emulator is not protected cloud IAM; a visual preview is not private replay; a device mock is not physical acceptance; a documentation PR is not production approval.
