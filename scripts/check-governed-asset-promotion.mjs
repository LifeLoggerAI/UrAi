#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseSha = process.env.URAI_PROMOTION_BASE_SHA || process.argv[2];
const requiredCheck = 'Governed asset promotion gate';
const autoApproveClasses = new Set(['icon', 'background', 'environmental-texture', 'ambient-audio', 'scene-asset']);
const allowedExtensions = new Set(['png', 'webp', 'svg', 'wav', 'mp3']);
const allowedRoots = [
  'public/assets/generated/',
  'public/assets/generated-manifests/',
  'public/assets/generated-validation/',
];

function fail(message) {
  console.error(`Governed asset promotion rejected: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`invalid JSON at ${path.relative(root, filePath)}: ${error instanceof Error ? error.message : error}`);
  }
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function changedFiles() {
  if (!baseSha || !/^[a-f0-9]{7,40}$/i.test(baseSha)) fail('URAI_PROMOTION_BASE_SHA is required and must be a commit SHA.');
  const output = execFileSync('git', ['diff', '--name-only', `${baseSha}...HEAD`], { cwd: root, encoding: 'utf8' });
  return output.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

const changed = changedFiles();
if (changed.length === 0) fail('the pull request contains no changes.');
const unrelated = changed.filter((file) => !allowedRoots.some((prefix) => file.startsWith(prefix)));
if (unrelated.length > 0) fail(`promotion PR contains unrelated files: ${unrelated.join(', ')}`);

const assets = changed.filter((file) => file.startsWith('public/assets/generated/'));
if (assets.length === 0) fail('promotion PR must include at least one generated asset.');
if (assets.length > 20) fail('promotion PR exceeds the 20-asset review limit.');

for (const assetPath of assets) {
  const absoluteAsset = path.join(root, assetPath);
  if (!existsSync(absoluteAsset)) fail(`generated asset is missing: ${assetPath}`);
  if (lstatSync(absoluteAsset).isSymbolicLink()) fail(`generated asset may not be a symbolic link: ${assetPath}`);
  if (!statSync(absoluteAsset).isFile()) fail(`generated asset must be a regular file: ${assetPath}`);

  const relative = assetPath.slice('public/assets/generated/'.length);
  const parts = relative.split('/');
  if (parts.length !== 2) fail(`generated asset path must be class/file: ${assetPath}`);
  const [assetClass, fileName] = parts;
  if (!autoApproveClasses.has(assetClass)) fail(`asset class is not enabled for governed auto-promotion: ${assetClass}`);
  const extension = path.extname(fileName).slice(1).toLowerCase();
  if (!allowedExtensions.has(extension)) fail(`unsupported generated asset extension: ${extension}`);
  const slug = fileName.slice(0, -(extension.length + 1));
  if (!/^[a-z0-9._-]+$/.test(slug)) fail(`unsafe generated asset slug: ${slug}`);

  const manifestPath = `public/assets/generated-manifests/${assetClass}/${slug}.manifest.json`;
  const validationPath = `public/assets/generated-validation/${assetClass}/${slug}.validation.json`;
  if (!changed.includes(manifestPath) || !existsSync(path.join(root, manifestPath))) fail(`missing changed manifest: ${manifestPath}`);
  if (!changed.includes(validationPath) || !existsSync(path.join(root, validationPath))) fail(`missing changed validation report: ${validationPath}`);

  const manifest = readJson(path.join(root, manifestPath));
  const validation = readJson(path.join(root, validationPath));
  const artifactHash = sha256(readFileSync(absoluteAsset));

  if ('prompt' in manifest) fail(`raw prompt must not be promoted: ${manifestPath}`);
  if (!/^[a-f0-9]{64}$/i.test(String(manifest.promptHash || ''))) fail(`manifest promptHash is missing or invalid: ${manifestPath}`);
  if (!/^[a-f0-9]{64}$/i.test(String(manifest.artifactSha256 || ''))) fail(`manifest artifactSha256 is missing or invalid: ${manifestPath}`);
  if (manifest.artifactSha256 !== artifactHash) fail(`manifest artifact hash does not match ${assetPath}`);
  if (!manifest.provenance || !manifest.provenance.engine || !manifest.provenance.rendererContract || !manifest.provenance.inputHash) {
    fail(`manifest provenance is incomplete: ${manifestPath}`);
  }
  if (manifest.validationReportId !== validation.reportId) fail(`manifest validationReportId does not match report: ${manifestPath}`);

  if (validation.status !== 'passed' || Number(validation.summary?.failed || 0) !== 0) fail(`validation report did not pass: ${validationPath}`);
  if (validation.repository !== 'LifeLoggerAI/UrAi') fail(`validation report targets another repository: ${validationPath}`);
  if (validation.classification?.assetClass !== assetClass) fail(`classification does not match path: ${validationPath}`);
  if (!autoApproveClasses.has(validation.classification?.assetClass)) fail(`classification is not auto-promotable: ${validationPath}`);
  if (Number(validation.classification?.confidence || 0) < 0.9) fail(`classification confidence is below 0.90: ${validationPath}`);
  if (!['none', 'low'].includes(String(validation.classification?.sensitivity || ''))) fail(`sensitive asset requires manual review: ${validationPath}`);
  if (Array.isArray(validation.classification?.riskTags) && validation.classification.riskTags.length > 0) {
    fail(`risk-tagged asset requires manual review: ${validationPath}`);
  }
  if (!Array.isArray(validation.requiredChecks) || !validation.requiredChecks.includes(requiredCheck)) {
    fail(`validation report does not require this promotion gate: ${validationPath}`);
  }
  if (validation.artifactSha256 !== artifactHash) fail(`validation artifact hash does not match ${assetPath}`);

  const serializedEvidence = `${JSON.stringify(manifest)}\n${JSON.stringify(validation)}`;
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:api[_-]?key|password|secret token)\b/i.test(serializedEvidence)) {
    fail(`promotion evidence appears to contain a credential: ${manifestPath}`);
  }
}

const expectedEvidence = new Set();
for (const assetPath of assets) {
  const relative = assetPath.slice('public/assets/generated/'.length);
  const [assetClass, fileName] = relative.split('/');
  const extension = path.extname(fileName).slice(1);
  const slug = fileName.slice(0, -(extension.length + 1));
  expectedEvidence.add(`public/assets/generated-manifests/${assetClass}/${slug}.manifest.json`);
  expectedEvidence.add(`public/assets/generated-validation/${assetClass}/${slug}.validation.json`);
}
const unexpectedEvidence = changed.filter((file) => (
  file.startsWith('public/assets/generated-manifests/') || file.startsWith('public/assets/generated-validation/')
) && !expectedEvidence.has(file));
if (unexpectedEvidence.length > 0) fail(`orphaned or unrelated evidence files: ${unexpectedEvidence.join(', ')}`);

console.log(`Governed asset promotion validated ${assets.length} asset(s) with deterministic evidence.`);
