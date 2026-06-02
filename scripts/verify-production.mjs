import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const commands = [];
if (existsSync('package.json')) {
  commands.push(['npm', ['run', 'typecheck', '--if-present']]);
  commands.push(['npm', ['test', '--if-present']]);
  commands.push(['npm', ['run', 'build', '--if-present']]);
  commands.push(['npm', ['run', 'urai:qa', '--if-present']]);
}

let failed = false;
for (const [cmd, args] of commands) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}

if (!commands.length) console.log('No package.json found.');
process.exit(failed ? 1 : 0);
