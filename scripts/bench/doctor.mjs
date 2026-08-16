#!/usr/bin/env node
import { providerRegistry } from './providers.mjs';

const registry = providerRegistry(process.env);
const ids = ['gemini', 'gemini+urai', 'fable', 'fable+urai', 'mythos', 'mythos+urai', 'openai', 'openai+urai', 'mock', 'mock+urai'];
let availableLive = 0;
for (const id of ids) {
  const provider = registry[id];
  const availability = provider.availability ?? { available: false, reason: 'unknown' };
  const label = availability.available ? 'READY' : 'MISSING';
  console.log(`${label.padEnd(7)} ${id.padEnd(14)} model=${provider.model ?? 'unset'}${availability.reason ? ` reason=${availability.reason}` : ''}`);
  if (availability.available && id !== 'mock' && id !== 'mock+urai') availableLive += 1;
}
console.log(`\nLive benchmark paths ready: ${availableLive}`);
console.log('Required environment variables are never printed.');
