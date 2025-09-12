# LFS migration: non-destructive index conversion for Lottie JSON

This document describes how to perform a non-destructive index-only conversion that replaces tracked Lottie JSON files under `public/assets` with Git LFS pointer files. These steps do not rewrite history or remove existing blobs.

Branch to create:
- chore/lfs/convert-lottie-json

Dry-run (always verify output first)
```bash
git fetch origin
git checkout -b chore/lfs/convert-lottie-json origin/main
./scripts/convert-lottie-to-lfs.sh --dry-run
```

Non-destructive index conversion (when ready)
```bash
# From the branch created above
./scripts/convert-lottie-to-lfs.sh
```

Verify the conversion
- Show changed files:
```bash
git status --porcelain
git diff --name-only origin/main...HEAD
```

- List LFS files:
```bash
git lfs ls-files
```

- Spot-check a converted file to confirm it is now a Git LFS pointer (pointer files begin with the LFS spec header):
```bash
git show HEAD:public/assets/path/to/example-lottie.json | sed -n '1,8p'
# Expect the first line to be:
# version https://git-lfs.github.com/spec/v1
```

Commit (if the script did not auto-commit)
```bash
git add -A
git commit -m "chore(lfs): non-destructive index conversion for Lottie JSON -> Git LFS"
```

Push and open a PR
```bash
git push -u origin chore/lfs/convert-lottie-json

# Using GitHub CLI:
gh pr create --base main --head chore/lfs/convert-lottie-json --title "chore(lfs): non-destructive index conversion for Lottie JSON -> Git LFS" --body "$(cat <<'EOF'
This PR performs a non-destructive index-only conversion of tracked Lottie JSON files under public/assets to Git LFS pointers. It does not rewrite history or remove existing blobs.

Dry-run:
./scripts/convert-lottie-to-lfs.sh --dry-run

What changed:
- Index-only conversion so matching files are now LFS pointers in this commit.
- This is non-destructive and does not rewrite history.

Please review and verify the converted files before merging.
EOF
)"
```

Important safety notes
- Do NOT run `git lfs migrate import` or any history-rewriting operation on this branch.
- Do NOT force-push `main`.
- This is an index-only, non-destructive change. Any history rewrite to remove old blobs must be a separate, coordinated, destructive operation.