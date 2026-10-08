import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
// This test-only location supports a bounded installed consumer graph. Product
// code has no override and the exact locked module versions are checked below.
const moduleRoot = process.env.URAI_DEPENDENCY_PROOF_MODULE_ROOT || root;
const require = createRequire(path.join(moduleRoot, 'package.json'));
// A separate, read-only installed Next closure can be used locally. Hosted CI
// leaves both overrides unset and exercises its ordinary full frozen graph.
const nextRequire = createRequire(process.env.URAI_DEPENDENCY_PROOF_NEXT_PACKAGE
  || require.resolve('next/package.json'));
const lock = JSON.parse(readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const json = file => JSON.parse(readFileSync(file, 'utf8'));
function packagePath(name, loader = require) {
  try { return loader.resolve(`${name}/package.json`); }
  catch (error) {
    if (error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
    // Sharp exposes its real CommonJS entry while deliberately hiding the
    // package.json subpath. Read metadata beside that resolved installed entry.
    for (let dir = path.dirname(loader.resolve(name)); ; dir = path.dirname(dir)) {
      try {
        const file = path.join(dir, 'package.json');
        if (json(file).name === name) return file;
      } catch (readError) { if (readError.code !== 'ENOENT') throw readError; }
      if (path.dirname(dir) === dir) throw error;
    }
  }
}
const version = (name, loader = require) => json(packagePath(name, loader)).version;
const childRequire = name => createRequire(packagePath(name));
const blob = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const braces = require('braces');
const mm = require('micromatch');

test('installed consumer versions match the actual patched root lock', () => {
  for (const name of ['tailwindcss', 'postcss', 'autoprefixer', 'gaxios',
    '@istanbuljs/load-nyc-config', 'micromatch', 'chokidar', 'sharp', 'uuid', '@grpc/grpc-js']) {
    assert.equal(version(name), lock.packages[`node_modules/${name}`].version, name);
  }
  assert.equal(version('next', nextRequire), lock.packages['node_modules/next'].version);
  assert.equal(version('braces'), '3.0.3-urai.1');
  assert.equal(version('postcss-selector-parser', childRequire('tailwindcss')), '7.1.6');
  assert.equal(version('js-yaml', childRequire('@istanbuljs/load-nyc-config')), '4.3.2');
  assert.equal(version('uuid', childRequire('gaxios')), '11.1.1');
  assert.deepEqual(manifest.overrides, manifest.pnpm.overrides);
  assert.equal(manifest.dependencies.next, '15.5.27');
  assert.equal(manifest.dependencies['r3f-perf'], undefined);
});

test('installed brace fork preserves the admitted canonical source bytes', () => {
  const dir = path.dirname(require.resolve('braces/package.json'));
  const expected = {
    'index.js': 'd222c13b579d2d476dc26d692219dbaee1665b88',
    'lib/constants.js': 'e83f5f5bf20b1b5a3483caf946b81fa0d01c2b85',
    'lib/parse.js': '91fb5ee0b35b156d0416c7ee3140c880cbd9e44c',
    'lib/compile.js': '70aced2464d1a6029d2c29ca1fda88b6830d1705',
    'lib/expand.js': 'fa96594a750d58210babb44402d9d5f67640e8ee',
    'lib/stringify.js': 'f5498e39cd44037e4c2126a5b21f6b0b4c5e083b',
    'lib/utils.js': 'd19311fe044ad5157624077670dc297e8b53da49',
  };
  for (const [file, expectedBlob] of Object.entries(expected)) {
    assert.equal(blob(readFileSync(path.join(dir, file))), expectedBlob, file);
  }
});

for (const [name, pattern] of [
  ['deep braces', '{'.repeat(256) + 'x' + '}'.repeat(256)],
  ['deep parentheses', '('.repeat(256) + 'x' + ')'.repeat(256)],
  ['unmatched prefix cannot reduce the depth ceiling', ')}'.repeat(256) + '{'.repeat(256) + 'x' + '}'.repeat(256)],
]) test(`actual brace parser rejects ${name}`, () => {
  assert.throws(() => braces.parse(pattern, { maxDepth: 1_000_000, maxLength: 1_000_000 }),
    error => error instanceof SyntaxError && /maximum depth/.test(error.message));
});

function deepAst(depth) {
  let node = { type: 'text', value: 'x' };
  for (let index = 0; index < depth; index++) node = { type: 'root', nodes: [node] };
  return node;
}
for (const method of ['compile', 'expand', 'stringify']) {
  test(`actual brace ${method} bounds a caller-supplied AST`, () => {
    assert.throws(() => braces[method](deepAst(6000), { maxDepth: 1_000_000 }),
      error => error instanceof SyntaxError && /maximum depth/.test(error.message));
  });
}

test('ordinary brace expansion and the actual micromatch consumer still work', () => {
  assert.deepEqual(braces.expand('src/{app,lib}/*.{ts,tsx}'),
    ['src/app/*.ts', 'src/app/*.tsx', 'src/lib/*.ts', 'src/lib/*.tsx']);
  assert.deepEqual(mm(['src/app/a.ts', 'src/lib/b.tsx', 'private/a.json'], 'src/{app,lib}/*.{ts,tsx}'),
    ['src/app/a.ts', 'src/lib/b.tsx']);
  const pattern = '{'.repeat(256) + 'x' + '}'.repeat(256);
  assert.throws(() => mm.braces(pattern, { expand: true }),
    error => error instanceof SyntaxError && /maximum depth/.test(error.message));
});

test('actual Chokidar observes a synthetic brace glob with the patched dependency chain', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'urai-synthetic-watch-'));
  mkdirSync(path.join(dir, 'src/app'), { recursive: true });
  writeFileSync(path.join(dir, 'src/app/example.ts'), '// SYNTHETIC SOURCE\n');
  const watcher = require('chokidar').watch('src/{app,lib}/*.{ts,tsx}', { cwd: dir, persistent: false });
  try {
    const observed = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Synthetic watch did not observe its own fixture')), 5000);
      watcher.once('add', file => { clearTimeout(timeout); resolve(file); });
      watcher.once('error', error => { clearTimeout(timeout); reject(error); });
    });
    assert.equal(observed, path.join('src', 'app', 'example.ts'));
  } finally { await watcher.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('actual Tailwind processes the existing stylesheet and config through patched CSS parsers', async () => {
  const configSource = readFileSync(path.join(root, 'tailwind.config.ts'), 'utf8');
  const ts = require('typescript');
  const configCode = ts.transpileModule(configSource, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText;
  const { default: originalConfig } = await import('data:text/javascript;base64,' + Buffer.from(configCode).toString('base64'));
  const config = { ...originalConfig, content: [{ raw: '<div class="grid grid-cols-2 sm:grid-cols-3 px-2 text-red-500"></div>', extension: 'html' }] };
  const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
  const result = await require('postcss')([require('tailwindcss')(config), require('autoprefixer')])
    .process(css, { from: undefined });
  assert.match(result.css, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(result.css, /\.sm\\:grid-cols-3/);
  assert.match(result.css, /\.glass-button/);
  assert.doesNotMatch(result.css, /@tailwind|@apply/);
});

test('actual fixed selector parser preserves nested and escaped class handling', () => {
  const parse = childRequire('tailwindcss')('postcss-selector-parser');
  const classes = [];
  const output = parse(selectors => selectors.walkClasses(node => classes.push(node.value)))
    .processSync('.sm\\:grid-cols-3:is(.grid,.px-2)');
  assert.deepEqual(classes, ['sm:grid-cols-3', 'grid', 'px-2']);
  assert.equal(output, '.sm\\:grid-cols-3:is(.grid,.px-2)');
});

test('the actual NYC YAML configuration consumer works without its vulnerable sprintf chain', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'urai-synthetic-nyc-'));
  try {
    writeFileSync(path.join(dir, 'package.json'), '{"name":"synthetic-configuration-only","version":"1.0.0"}');
    writeFileSync(path.join(dir, '.nycrc.yaml'), 'all: true\ninclude:\n  - src/**/*.ts\nreporter: [text, json]\n');
    const { loadNycConfig } = require('@istanbuljs/load-nyc-config');
    const config = await loadNycConfig({ cwd: dir });
    assert.equal(config.all, true);
    assert.deepEqual(config.include, ['src/**/*.ts']);
    assert.deepEqual(config.reporter, ['text', 'json']);
    const yaml = childRequire('@istanbuljs/load-nyc-config')('js-yaml');
    assert.throws(() => yaml.load('!!js/function "function () { return 1; }"'));
    assert.equal(Object.keys(lock.packages).some(key => key.endsWith('node_modules/sprintf-js')), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('actual gaxios multipart generation uses the patched CommonJS UUID API without network', async () => {
  const { Gaxios } = require('gaxios');
  let transported = 0;
  const client = new Gaxios();
  const response = await client.request({
    url: 'https://synthetic.invalid/no-network', method: 'POST',
    multipart: [{ headers: { 'Content-Type': 'text/plain' }, content: 'SYNTHETIC-NONPRIVATE-BYTES' }],
    adapter: async options => {
      transported++;
      // Gaxios 6 passes its normalized plain header object to the adapter.
      const type = options.headers['Content-Type'];
      assert.match(type, /^multipart\/related; boundary=/);
      const boundary = type.split('boundary=')[1];
      assert.equal(childRequire('gaxios')('uuid').validate(boundary), true);
      let body = '';
      for await (const chunk of options.body) body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : chunk;
      assert.match(body, /SYNTHETIC-NONPRIVATE-BYTES/);
      assert.ok(body.includes(boundary));
      return { config: options, data: 'synthetic-ack', status: 200, statusText: 'OK', headers: new Headers() };
    },
  });
  assert.equal(transported, 1);
  assert.equal(response.data, 'synthetic-ack');
});

test('actual patched gRPC preserves the SDK constructor API without opening a request', () => {
  const grpc = require('@grpc/grpc-js');
  const Client = grpc.makeGenericClientConstructor({}, 'SyntheticOnly');
  const client = new Client('127.0.0.1:1', grpc.credentials.createInsecure());
  try { assert.equal(client.getChannel().getConnectivityState(false), grpc.connectivityState.IDLE); }
  finally { client.close(); }
});

test('actual Next image optimizer loads patched Sharp and handles a bounded synthetic image', async () => {
  const sharp = nextRequire('sharp');
  assert.equal(version('sharp', nextRequire), '0.35.5');
  const input = await sharp({ create: { width: 2, height: 2, channels: 4, background: '#ff0000' } }).png().toBuffer();
  const { optimizeImage } = nextRequire('./dist/server/image-optimizer.js');
  const output = await optimizeImage({ buffer: input, contentType: 'image/png', quality: 75,
    width: 1, height: 1, concurrency: 1, limitInputPixels: 16, sequentialRead: true, timeoutInSeconds: 1 });
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 1); assert.equal(metadata.height, 1); assert.equal(metadata.format, 'png');
});

test('actual Next optimizer rejects malformed synthetic image bytes', async () => {
  const { optimizeImage } = nextRequire('./dist/server/image-optimizer.js');
  await assert.rejects(optimizeImage({ buffer: Buffer.from('SYNTHETIC-NOT-AN-IMAGE'),
    contentType: 'image/png', quality: 75, width: 1, concurrency: 1, limitInputPixels: 16,
    sequentialRead: true, timeoutInSeconds: 1 }));
});
