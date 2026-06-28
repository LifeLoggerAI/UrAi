#!/usr/bin/env node

// Canonical production evidence entrypoint. The collector remains separate so
// older automation that calls it directly keeps working.
await import("./collect-production-evidence.mjs");
