import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), process.argv[2] || '.next/server/app');
if (!fs.existsSync(root)) {
  console.log('URAI QA skipped because the target build folder was not found. Run after build.');
  process.exit(0);
}

const files = collect(root).filter((file) => file.endsWith('.html'));
const problems = [];
for (const file of files) {
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8').toLowerCase();
  if (text.includes('lorem ipsum')) problems.push(`${relative}: remove lorem ipsum`);
  if (text.includes('todo')) problems.push(`${relative}: remove todo text`);
  if (text.includes('debug')) problems.push(`${relative}: remove debug text`);
  if (!text.includes('uraiprivacy.com') && !text.includes('/privacy')) problems.push(`${relative}: add privacy link`);
}

for (const problem of problems) console.error(problem);
console.log(`URAI QA checked ${files.length} HTML files.`);
process.exit(problems.length ? 1 : 0);

function collect(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collect(full));
    else out.push(full);
  }
  return out;
}
