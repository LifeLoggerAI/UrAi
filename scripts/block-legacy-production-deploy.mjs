#!/usr/bin/env node

const canonical = 'LifeLoggerAI/urai-spatial/urai-tier1'
const requestedCommand = process.argv.slice(2).join(' ') || 'legacy production deploy'

console.error('[legacy-deploy-blocked] Refusing:', requestedCommand)
console.error(`[legacy-deploy-blocked] ${canonical} is the sole authority for urai.app production hosting.`)
console.error('[legacy-deploy-blocked] This repository may run validation and staging workflows, but it may not deploy production hosting.')
process.exit(1)
