# URAI Repo System Map

## Current canonical launch target

`LifeLoggerAI/UrAi` is the canonical V1 public demo spine for launch hardening.

Verified V1 routes and surfaces:

- `/` cinematic home scene
- `/u/adamclamp` public constellation demo
- `/api/companion` deterministic companion endpoint
- `/api/waitlist` early-access capture endpoint
- Firebase rules/index scaffolding for V1 collections
- seeded demo data for timeline stars, memory blooms, mood forecast, and weekly reflection

## Product boundary

URAI V1 is a public demo. It must not claim live passive sensing, therapy, diagnosis, marketplace, AR/VR, B2B, or studio/export functionality unless a feature is implemented, tested, consent-gated where needed, and deployed.

## Repo role map

| Repo | Current launch role | Status |
| --- | --- | --- |
| `LifeLoggerAI/UrAi` | V1 public demo spine | Canonical for V1 launch |
| `LifeLoggerAI/UrAi-Dev` | Dev/staging/governance evidence | Use as reference; do not assume prod parity |
| `LifeLoggerAI/UrAiProd` | Broader system/product archive and production-oriented scaffolds | Treat as source of future-phase modules until extracted/tested |
| `LifeLoggerAI/B2Bportal` | Future B2B/enterprise portal | Not part of V1 launch spine |
| `LifeLoggerAI/asset-factory` | Future media/export job service | Not part of V1 launch spine |
| `LifeLoggerAI/urai-admin` | Future admin dashboard | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-analytics` | Future analytics service | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-communications` | Future SMS/email/push service | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-content` | Future content engine | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-foundation` | Future foundation/nonprofit layer | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-investors` | Future investor layer | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-labs-llc` | Future company/legal layer | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-marketing` | Future marketing layer | Not verified in V1 launch spine |
| `LifeLoggerAI/urai-privacy` | Future privacy/compliance layer | V1 privacy docs live in `UrAi` for now |
| `LifeLoggerAI/urai-spatial` | Future AR/VR/spatial layer | Not part of V1 launch spine |
| `LifeLoggerAI/urai-storytime` | Future story/narrative layer | Not part of V1 launch spine |
| `LifeLoggerAI/urai-studio` | Future studio/media layer | Not part of V1 launch spine |

## V1 system architecture

```txt
Browser
  -> Next.js app routes
     -> / home demo
     -> /u/adamclamp public constellation demo
     -> /api/companion deterministic reflective companion
     -> /api/waitlist waitlist capture
  -> Firebase client config
  -> Firebase Admin only from server routes/scripts
     -> waitlistSignups server-only collection
     -> V1 owner-gated private collections
```

## Future-phase system architecture

```txt
User app
  -> consent center
  -> passive capture modules
  -> Firebase/Firestore
  -> Cloud Functions / backend enrichment
  -> narrator and report generation
  -> admin/B2B/analytics/studio/spatial surfaces
```

Future-phase modules must enter V1 only through shared contracts, feature flags, consent checks, rules tests, and deployment verification.
