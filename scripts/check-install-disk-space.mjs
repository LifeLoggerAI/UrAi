import { spawnSync } from 'node:child_process'
import process from 'node:process'

const defaultMinimumMb = 4096
const minimumMb = Number.parseInt(process.env.URAI_MIN_INSTALL_FREE_MB ?? String(defaultMinimumMb), 10)

function fail(message) {
  console.error(`\n[URAI install] ${message}`)
  console.error('Free disk space before installing dependencies.')
  console.error('Suggested cleanup: npm run clean:install, remove old package-manager caches, or use a larger runner.')
  console.error('Set URAI_MIN_INSTALL_FREE_MB lower only if you know the install can fit.')
  console.error('')
  process.exit(1)
}

if (!Number.isFinite(minimumMb) || minimumMb <= 0) {
  fail(`Invalid URAI_MIN_INSTALL_FREE_MB value: ${process.env.URAI_MIN_INSTALL_FREE_MB}`)
}

const result = spawnSync('df', ['-Pk', '.'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
})

if (result.status !== 0) {
  console.warn('[URAI install] Could not inspect free disk space with df; continuing install preflight.')
  if (result.stderr) console.warn(result.stderr.trim())
  process.exit(0)
}

const lines = result.stdout.trim().split(/\r?\n/)
const data = lines.at(-1)?.trim().split(/\s+/)
const availableKb = Number.parseInt(data?.[3] ?? '0', 10)
const availableMb = Math.floor(availableKb / 1024)

if (!Number.isFinite(availableMb) || availableMb <= 0) {
  console.warn('[URAI install] Could not parse free disk space; continuing install preflight.')
  process.exit(0)
}

if (availableMb < minimumMb) {
  fail(`Not enough free disk space for install. Required at least ${minimumMb} MB; found ${availableMb} MB.`)
}

console.log(`[URAI install] Free disk preflight passed: ${availableMb} MB available.`)
