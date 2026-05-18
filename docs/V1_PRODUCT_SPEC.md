# URAI V1 Product Spec

## Purpose

URAI V1 is a public demo spine. It is not live in V1 as a passive sensing, marketplace, AR/VR/spatial, or clinical product.

## In scope for V1

- Public cinematic home demo
- Public-safe `adamclamp` constellation route
- Companion reflection demo loop
- Mood forecast demo card
- Weekly reflection demo card
- Waitlist capture API and form
- Demo seed JSON generation
- Optional Firestore seeding
- Waitlist CSV export
- V1 sanity check script

### Out of scope for V1

- Full passive sensor ingestion
- Production AI model orchestration
- AR/VR/spatial viewer is not part of V1 and remains future roadmap work
- Real user authentication flow
- Full marketplace is not included in V1 and remains future consent-gated roadmap work
- Therapist-grade clinical claims are not live in V1; URAI does not diagnose, treat, or replace professional care
- Production mobile app packaging
- Monetized data exchange

## Key routes

| Route | Purpose |
| --- | --- |
| `/` | Public demo spine |
| `/u/adamclamp` | Public-safe constellation demo |
| `/api/companion` | Companion demo endpoint |
| `/api/waitlist` | Waitlist endpoint |
