# URAI Genesis Agent Guide

This repository is the official URAI application repository for the `LifeLoggerAI/UrAi` project. Agents must treat it as a production-adjacent Next.js/Firebase codebase and work conservatively.

## Safety lock

- Do not edit secrets, `.env*` files, Firebase credentials, service-account keys, production keys, or private tokens.
- Do not delete existing working product routes or launch gates unless a replacement is already committed and verified.
- Do not add user-facing placeholder, debug, test, demo, or development wording to production surfaces.
- Do not represent scaffolded intelligence as live sensing, diagnosis, therapy, deception detection, or medical prediction.
- Use "Council" in visible product language. Do not reintroduce "OS Crew".
- Keep URAI ad-free. URAI Passport may include future external personalization or data-marketplace permissions, but URAI itself must not contain ads-inside-product logic.

## Product contract

URAI Genesis is a passive, true-3D emotional/spatial AI life OS that reconstructs a user's life as a living memory field using permissioned passive signals, emotional weather, memory stars, relationship fields, recovery fields, narrator insights, and the Council/orb companion.

The core home/world must be spatial and cinematic. Two-dimensional UI is allowed only for overlays, menus, cards, settings, and controls.

## Implementation rules

- Prefer additive changes and compatibility exports.
- Preserve existing public routes and package scripts.
- Keep sensitive insight language inferential: "signals", "patterns", "may indicate", "worth noticing".
- Avoid certainty claims, medical claims, diagnoses, or relationship accusations.
- Gate sensitive social, facial, location, audio, and mental-load features behind explicit permissions.
- If a subsystem is scaffolded, mark that in docs or internal comments only, not in polished production UI.

## Verification expectation

Before deployment, run the repository's own validation path from `package.json`, especially typecheck, lint, tests, Genesis checks, Firebase checks, and build. Do not deploy when checks fail or when Firebase project identity is unclear.
