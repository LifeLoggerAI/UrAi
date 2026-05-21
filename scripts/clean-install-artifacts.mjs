import fs from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const pathsToRemove = [
  'node_modules',
  '.next',
  '.turbo',
  'coverage',
  'playwright-report',
  'test-results',
]

async function removePath(path) {
  try {
    await fs.rm(path, { recursive: true, force: true })
    console.log(`[URAI clean] Removed ${path}`)
  } catch (error) {
    console.warn(`[URAI clean] Could not remove ${path}: ${error.message}`)
  }
}

function runOptional(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  })

  if (result.status === 0) {
    const output = result.stdout?.trim()
    if (output) console.log(output)
    return
  }

  const detail = result.stderr?.trim() || result.stdout?.trim() || `${command} exited with ${result.status}`
  console.warn(`[URAI clean] Optional cleanup skipped: ${detail}`)
}

console.log('[URAI clean] Removing generated install/build/test artifacts.')
for (const path of pathsToRemove) {
  await removePath(path)
}

console.log('[URAI clean] Attempting optional package-manager cache cleanup.')
runOptional('npm', ['cache', 'verify'])
runOptional('pnpm', ['store', 'prune'])

console.log('[URAI clean] Complete. Re-run: npm install')
