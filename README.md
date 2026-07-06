# URAI — Legacy V1 Reference

> **Canonical status:** this repository is an earlier V1 reference and demo surface. The canonical public product is [`LifeLoggerAI/urai-spatial`](https://github.com/LifeLoggerAI/urai-spatial), with runtime root `urai-tier1`, branch `main`, and public domain `https://urai.app`.

This repository may support historical reference, migration, testing, or rollback work. It must not be treated as the current public production owner unless a reviewed decision record explicitly changes that authority.

## What remains here

- an earlier sample memory-to-world demo;
- compatibility routes and a symbolic Life Map surface;
- waitlist and demo APIs;
- conservative launch and evidence documents;
- Firebase rules and index scaffolding;
- browser and release-validation scripts.

## Evidence boundary

Route availability, demo data, or a local build does not prove a production release. Claims about this repository require the applicable test, deployment, rollback, monitoring, visual, and privacy evidence.

The repository evidence and status documents include:

- `docs/FINAL_LAUNCH_REPORT.md`
- `docs/URAI_FINAL_DONE_DONE_STATUS.md`
- `docs/PRODUCTION_LOCK.md`
- `docs/REPO_CANONICAL_STATUS.md`
- `docs/PRODUCTION_EVIDENCE_REQUIREMENTS.md`
- `system/urai-system-registry.json`

## Local reference setup

Use Node 20.

```bash
npm install
npm run check:v1
npm run seed:demo
npm run dev
```

Run the validation path before sharing or deploying this legacy surface:

```bash
npm run check:system-registry
npm run check:production-lock
npm run smoke:production
npm run smoke:genesis-spine
npm run check:v1
npm run check:firestore-contract
npm run test:unit
npm run check:types
npm run lint
npm run build
npm run preflight
```

For current product, route, version, and release authority, use the `urai-spatial` repository and its `STATUS.md` and `EVIDENCE.md` files.
