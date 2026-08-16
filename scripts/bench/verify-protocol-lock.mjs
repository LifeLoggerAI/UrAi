#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const protocolPath = path.resolve(process.cwd(), String(args.protocol ?? 'bench/protocols/urai-holdout-v2-lock.json'));
const expectedProtocol = String(args['expected-protocol'] ?? 'URAI-HOLDOUT-v2');
const absentPath = args['assert-absent'] ? path.resolve(process.cwd(), String(args['assert-absent'])) : null;

const protocol = JSON.parse(await readFile(protocolPath, 'utf8'));
if (protocol.protocol !== expectedProtocol) throw new Error(`Unexpected protocol: ${protocol.protocol}; expected ${expectedProtocol}`);
if (protocol.status !== 'frozen_before_holdout_generation') throw new Error(`Protocol is not frozen: ${protocol.status}`);
const entries = Object.entries(protocol.locked_git_blobs ?? {});
if (!entries.length) throw new Error('Protocol has no locked_git_blobs.');

for (const [file, expectedBlob] of entries) {
  const absolute = path.resolve(process.cwd(), file);
  await access(absolute);
  const actualBlob = execFileSync('git', ['hash-object', file], { encoding: 'utf8' }).trim();
  if (actualBlob !== expectedBlob) throw new Error(`LOCK DRIFT ${file}: expected ${expectedBlob}, got ${actualBlob}`);
  console.log(`LOCK_OK ${file} ${actualBlob}`);
}

if (absentPath) {
  try {
    await access(absentPath);
    throw new Error(`Holdout boundary violation: path already exists before generation: ${absentPath}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  console.log(`ABSENT_OK ${path.relative(process.cwd(), absentPath)}`);
}

console.log(`PROTOCOL_LOCK_OK ${protocol.protocol} locked_blobs=${entries.length}`);
