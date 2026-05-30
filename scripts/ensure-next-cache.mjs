#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const nextDir = join(root, '.next');
const cacheDir = join(nextDir, 'cache');

function ensureDirectory(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
    return;
  }

  const stat = lstatSync(path);
  if (stat.isDirectory()) return;

  rmSync(path, { force: true, recursive: true });
  mkdirSync(path, { recursive: true });
}

ensureDirectory(nextDir);
ensureDirectory(cacheDir);

console.log('[ensure-next-cache] .next/cache is ready.');
