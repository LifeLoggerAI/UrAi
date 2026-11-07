# Original UrAi — coverage statement and exclusions

**Frozen source:** `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a` at 2026-11-07 connector audit.

| Coverage dimension | Observed verified | Excluded / missing |
|---|---|---|
| Main tree Git metadata | 2,489/2,489 tracked blob paths; 604,647,401 reported bytes; 1,542 directories; `truncated:false` | No proof that all file bodies were independently retrieved |
| Main blob SHA256 | 0/2,489 separately SHA256-certified as a complete read set | Actual raw binary SHA256 and content authentication pending |
| Branch HEAD refs | 242 names and source SHAs captured in `REFS.json` | Branch trees/full history not inventoried |
| History/tags/releases | 200 recent main commit metadata fetched; releases page empty | Entire graph/2024–present history not crawled; tag-ref API returned 404 |
| Main source docs | Selected complete README, route, release, architecture, config sources fetched | Majority of 426 Markdown files not yet semantically read |
| Source tests | 66 named `*.test.*`/`*.spec.*` files located and 28 workflow paths | 0 original test commands executed in this audit |
| Static assets | Git identity/size for MP4/PNG/OBJ and one Git LFS pointer | Video decode, all original media bytes, LFS contents, licenses |
| Integration | Cross-system repository boundaries and source paths identified | No authenticated service/Cloud IAM or signed consent positive flow |
| Devices/live | No claims | No browser/XR/physical smartphone/localization/production proof |

## Runtime access limitation
GitHub connector allows read/write of textual repository resources; programmatic container `git ls-remote` could not resolve `github.com`, and this tool does not grant a clean full checkout. The GitHub repository is public but binary blobs and assets cannot be safely treated as downloaded solely because tree metadata is visible. No native `npm`/Jest/Playwright suite, Firestore emulator, deployment or paid provider was started.

## Safety and release
This branch changes evidence documents only; no validated code repair or production certification. Canonical consumer production is `LifeLoggerAI/urai-spatial` / `urai-tier1` / `main`. Prior successful tests in other repos have their own exact refs and scopes. **ONE URAI GENESIS remains HOLD.**
