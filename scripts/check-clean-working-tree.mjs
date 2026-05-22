#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const prefix = '[clean-tree]';

function runGit(args) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
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

const dirtyFiles = status.stdout.trim();

if (!dirtyFiles) {
  console.log(`${prefix} working tree is clean.`);
  process.exit(0);
}

console.error(`${prefix} release blocked: working tree has local changes.`);
console.error('Commit, stash, or restore local changes before release.');
console.error('For package conflicts, use:');
console.error("git stash push -m 'local package changes before release' package.json package-lock.json");
console.error('');
console.error(dirtyFiles);
process.exit(1);
