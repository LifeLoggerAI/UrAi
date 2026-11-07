# Original UrAi — exact main-tree metadata inventory

**Observed:** 2026-11-07. **Repository:** `LifeLoggerAI/UrAi`; immutable main commit `8cac3ba513830c11261d57bc2b5dd7ad8b83e85a`. **Class:** Git-tree metadata verified, content bytes NOT exhaustively read.

## Reproducible source and manifest
GitHub recursive Git Trees API: `GET /repos/LifeLoggerAI/UrAi/git/trees/8cac3ba513830c11261d57bc2b5dd7ad8b83e85a?recursive=1`; returned `truncated:false`, 4,031 total tree entries, of which **2,489** blobs and **1,542** trees. The tracked blobs total **604,647,401 Git-reported bytes**. Complete path, size, Git SHA-1 object ID and mode entries are in [MANIFEST.json](MANIFEST.json). The separate [REFS.json](REFS.json) captures **242 branch-name/head-SHA records** from four paginated GitHub Branches API pages (100/100/42/0); branch contents and history not scanned.

## Major root groups at pinned main
| Top-level group | Blobs | Git-reported bytes |
|---|---:|---:|
| `public/` | 112 | 415,912,444 |
| unusual tracked `:USERPROFILE\npm-cache-fresh/` (actual path contains newline before `pm-cache-fresh`) | 965 | 181,799,742 |
| `src/` | 681 | 2,204,065 |
| `deploy/` | 65 | 1,653,941 |
| `docs/` | 319 | 859,573 |
| `scripts/` | 88 | 313,106 |
| `tests/` | 40 | 102,466 |

Media extensions include 35 MP4 files (317,151,274 bytes), 47 PNG files (93,969,153 bytes), 41 SVG files and 3 OBJ models. 426 Markdown files, 364 TSX, 330 TS and 85 MJS entries are registered. There are 28 workflow YAML files under `.github/workflows/`. Git modes: 2,484 regular `100644`, 2 executable `100755`, 3 symlink `120000`; symlink targets were not dereferenced.

Large named source assets include `public/assets/sky/cosmic/sky-cosmic-09a.mp4` (34,780,725 bytes, Git blob `fd6b23ba382449df964fcbd42168b0b5b6c41a6d`) and `public/assets/avatar/Texture.png` (12,002,243 bytes, Git blob `e23b83da27083c1629629b330fe38304548c18da`). The `public/assets/orb/orb_images_lottie.json` 133-byte Git entry is an LFS pointer; its true external payload was not recovered.

## Byte-boundary warning
File paths, reported sizes and Git SHA-1 IDs for one tree are enumerated in full. **0/2,489 blobs independently downloaded and SHA-256 verified as a complete set.** Selected text files were retrieved separately for content review; that is not an independent all-byte scan. Git LFS object bytes, ignored/untracked artifacts, historical/deleted objects, branch-specific files, CI artifacts, releases, external assets and provider data remain outside the manifest. No inference of license or authenticity from filenames or Git sizes.

The tracked cache tree is both substantial (30.07% of reported bytes) and anomalously named; preserve it for archaeology but do not transfer it blindly into current builds. Do not delete or history-rewrite on audit authority.
