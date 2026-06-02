#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const prefix = '[clean-tree]';

const ignoredGeneratedPaths = [
  '.firebase/',
  '.next/',
  'release-evidence/',
  'tmp/',
  'playwright-report/',
  'test-results/',
];

const ignoredGeneratedFiles = new Set([
  'tsconfig.tsbuildinfo',
  'release-verification/INDEPENDENT_RELEASE_VERIFICATION.md',
]);

function runGit(args) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function normalizePorcelainPath(line) {
  const rawPath = line.slice(3).trim();
  const renameIndex = rawPath.indexOf(' -> ');
  return renameIndex >= 0 ? rawPath.slice(renameIndex + 4).trim() : rawPath;
}

function isIgnoredGeneratedPath(filePath) {
  if (ignoredGeneratedFiles.has(filePath)) return true;
  return ignoredGeneratedPaths.some((prefixPath) => filePath === prefixPath.slice(0, -1) || filePath.startsWith(prefixPath));
}

const gitAvailable = runGit(['--version']);

if (gitAvailable.error || gitAvailable.status !== 0) {
  console.warn(`${prefix} git is not available; skipping clean working tree check.`);
  process.exit(0);
}

const workTree = runGit(['rev-parse', '--is-inside-work-tree']);

if (workTree.status !== 0 || workTree.stdout.trim() !== 'true') {
  console.warn(`${prefix} not inside a git work tree; skipping clean working tree check.`);
  process.exit(0);
}

const status = runGit(['status', '--porcelain']);

if (status.status !== 0) {
  console.error(`${prefix} unable to read git status.`);
  if (status.stderr.trim()) {
    console.error(status.stderr.trim());
  }
  process.exit(status.status || 1);
}

const dirtyLines = status.stdout
  .split('\n')
  .map((line) => line.trimEnd())
  .filter(Boolean);
const blockingDirtyLines = dirtyLines.filter((line) => !isIgnoredGeneratedPath(normalizePorcelainPath(line)));
const ignoredDirtyLines = dirtyLines.filter((line) => isIgnoredGeneratedPath(normalizePorcelainPath(line)));

if (!blockingDirtyLines.length) {
  if (ignoredDirtyLines.length) {
    console.warn(`${prefix} ignoring generated local artifacts:`);
    for (const line of ignoredDirtyLines) console.warn(line);
  }
  console.log(`${prefix} working tree is clean for release.`);
  process.exit(0);
}

console.error(`${prefix} release blocked: working tree has local source changes.`);
console.error('Commit, stash, or restore source/config changes before release.');
console.error('Generated artifacts are ignored by this gate, but source, config, and dependency changes are not.');
console.error('');
console.error(blockingDirtyLines.join('\n'));
process.exit(1);
