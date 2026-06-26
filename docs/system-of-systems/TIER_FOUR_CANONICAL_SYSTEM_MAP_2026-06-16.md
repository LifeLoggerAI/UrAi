# Tier Four Canonical System Map — 2026-06-16

## Purpose

This document is the Tier Four system-of-systems map for the URAI ecosystem. It is intentionally conservative: a repo, endpoint, pipeline, or surface is not production-green unless code, config, tests, deploy target, live smoke, privacy gate, rollback path, and release evidence prove it.

Tier Four is an integration pass, not a single-bug fix. The goal is to make every repo agree on ownership, handoff contracts, deployment responsibility, privacy constraints, and release gates.

## Current launch framing

- Narrow launch spine: close, but still gated.
- Full Tier One through Tier Five ecosystem: not yet locked.
- Tier Five vision: allowed as roadmap/demo/canon only until production evidence exists.

## Canonical layers

| Layer | Canonical repo | Launch posture | Required downstream handoff |
| --- | --- | --- | --- |
| Public acquisition and launch funnel | `urai-marketing` | Static green; live API red/yellow until functions redeploy and `live-check` pass | Emits privacy-minimal lead, invite, and demo-unlock events toward `UrAi` |
| Main user-facing app and V1 spine | `UrAi` | Canonical, must be verified before final launch | Owns public V1 routes, demo/app shell, waitlist/demo alignment, and user-facing claims |
| Spatial rendering and immersive shell | `urai-spatial` | Close for V1/Tier One; Tier Three not fully locked | Consumes approved/fallback-safe app state; does not become canonical owner of sensitive user memory/mood data without privacy signoff |
| Privacy and data governance | `urai-privacy` | Binding gate; not optional | Owns consent, export, deletion, retention, audit, legal hold, and unsafe-flow blocks for all repos |
| Content source of truth | `urai-content` | Preview/staging until provider/deploy proof | Provides approved content packs, copy, localization, moderation state, and legal/policy version links |
| Asset generation and artifact publication | `asset-factory` | Partial production scaffold; not fully launch-locked | Executes generation/materialization/publish/approve flows and returns manifests/artifacts |
| Aggregate analytics | `urai-analytics` | Staging/preview until service auth, CORS/HMAC, live smoke, and privacy signoff pass | Receives aggregate-only privacy-safe events; no raw personal signal leakage |
| Creative orchestration and export tooling | `urai-studio` | Important integration repo; likely biggest remaining Tier Four repo | Owns creative/project intent and diagnostics; hands work to Asset Factory and Jobs; exports Spatial handoff manifests |
| Async execution fabric | `urai-jobs` | Unknown/needs audit | Owns long-running job state, queue transitions, worker leases, retries, results, and artifacts if verified by repo audit |
| Admin/operator surface | `urai-admin` | Do not launch public until auth proven | Owns operator workflows, role checks, audit logs, seed/bootstrap, and no-public-admin guarantees |
| B2B/customer portal | `B2Bportal` | Not production-ready until legal/security gates pass | Owns partner-facing aggregate dashboards only; must not expose raw personal signals |
| Investor/commercial narrative | `urai-investors` | Content/legal polish needed | Must not publish unverified traction, fundraising, or capability claims |
| Labs/corporate support site | `urai-labs-llc` | Corporate support layer | Must align brand/legal relationship and avoid contradictory product claims |
| Foundation/public-benefit support site | `urai-foundation` | Corporate/support layer | Must align relationship to URAI Labs and not conflict with product/privacy claims |
| Story and communication surfaces | `urai-storytime`, `urai-communications` | Preview/staging only until provider/privacy proof | No automated outreach without consent; provider credentials, safety review, privacy review, smoke, monitoring, and rollback required |

## System-of-record rule

Every production data type must have exactly one system of record. Other repos may consume, cache, render, or summarize that data only through a documented contract.

### Initial ownership model

| Data / artifact type | System of record | Allowed consumers | Notes |
| --- | --- | --- | --- |
| Marketing lead / waitlist entry | `urai-marketing` | `UrAi`, aggregate analytics | Minimum payload only: lead ID, email or hashed ID as permitted, source/UTM/referral, consent version, cohort/status |
| Invite code / demo unlock event | `urai-marketing` | `UrAi`, aggregate analytics | Demo unlock must not imply full product access unless verified |
| V1 app shell and public route contract | `UrAi` | `urai-marketing`, `urai-spatial`, `urai-studio` | Canonical copy must avoid overclaiming passive sensing, B2B, AR/VR, marketplace, or fully automated life logging |
| Spatial scene/render state | `urai-spatial` | `UrAi`, `urai-studio` | Spatial may own scene state and handoff manifests, not raw private memory unless separately gated |
| Consent, export, delete, retention, audit, legal hold | `urai-privacy` | All repos through policy/API/gate | Binding control plane |
| Approved content packs and localization | `urai-content` | `UrAi`, `urai-marketing`, `urai-studio`, `urai-spatial` | Content must carry version, locale, moderation state, and legal/policy linkage |
| Generated asset job and artifact manifest | `asset-factory` | `urai-studio`, `UrAi`, `urai-spatial` | Asset Factory executes; Studio orchestrates creative intent |
| Creative project / brief / export intent | `urai-studio` | `asset-factory`, `urai-jobs`, `urai-spatial` | Avoid overlap with Jobs by keeping Studio as intent owner, not worker-state owner |
| Async job runtime state | `urai-jobs` | `urai-studio`, `asset-factory`, admin/ops | Jobs owns queue lifecycle only after audit confirms runtime matches docs |
| Aggregate analytics event | `urai-analytics` | dashboards, admin/B2B aggregate views | No raw sensitive/user-linked personal signals without separate consent and privacy audit |
| Admin action / operator audit log | `urai-admin` + `urai-privacy` | ops/privacy evidence | Admin must never be public without auth, role checks, audit logs, and bootstrap proof |

## Required Tier Four contracts

These contracts must be versioned and release-gated before full ecosystem lock:

1. `urai-marketing` → `UrAi`
   - Events: `waitlistLeadCreated`, `inviteValidated`, `demoUnlocked`.
   - Payload: lead ID, consent version, referral/UTM metadata, cohort/status.
   - Forbidden: passive life data, raw emotional signals, device telemetry, contacts, health records, private memories.

2. `UrAi` → `urai-spatial`
   - Read-only preview state and fallback-safe handoff manifest.
   - Spatial consumes approved state; it does not silently become source of record.

3. `urai-studio` → `asset-factory`
   - Envelope: project ID, brief ID, job ID, tenant ID, asset type, manifest checksum, publish state.
   - Asset Factory executes and returns artifact manifests.

4. `urai-studio` → `urai-jobs`
   - Studio submits intent; Jobs owns execution lifecycle.
   - No duplicate job truth between Studio and Jobs.

5. `urai-content` → app surfaces
   - Immutable content pack version, locale, moderation state, publish state, legal/policy version link.

6. Any repo → `urai-privacy`
   - Consent check, export/delete request, retention/legal hold check, audit write, unsafe-flow block.

7. All repos → `urai-analytics`
   - Aggregate-only analytics envelope.
   - Privacy repo must define disallowed fields.

## Standard release gate per repo

Each deployable repo must record the following before being marked production-green:

- local check command and output
- typecheck/lint/test/build output
- deploy target and project/site ownership
- live smoke command and output
- rollback path
- privacy signoff or explicit no-user-data determination
- security/auth signoff where any private/admin/B2B/internal data exists
- evidence file path and commit SHA

## Immediate launch sequence

1. Finish `urai-marketing` live API status codes.
2. Verify `UrAi` canonical production app.
3. Verify `urai-spatial` Tier One and Tier Two.
4. Make `urai-privacy` launch gate explicit for the narrow public reveal.
5. Record release evidence.
6. Deploy or link only surfaces that pass.

## Non-green claims that must stay separated

Do not claim production lock for these until evidence exists:

- full Tier Three/Four/Five ecosystem
- passive sensing
- advanced 3D/AR/VR production world
- B2B data product
- investor traction or revenue claims
- automated outreach
- creator/content engine live integrations
- provider-backed asset generation
- aggregate analytics dashboards
- admin/operator production surface

## Current bottom line

Static green does not equal system green.

The narrow public launch spine is close. The full ecosystem is built in pieces. Tier Four is the sealing pass: ownership, contracts, release gates, privacy adoption, deployment proof, and one canonical map.
