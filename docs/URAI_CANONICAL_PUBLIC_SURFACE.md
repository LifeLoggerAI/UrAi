# URAI Canonical Public Launch Surface

Status: canonical public-surface decision recorded
Date: 2026-05-22
Owner: Adam Clamp
Related issue: #300

## Decision

URAI V1 launches as the memory-world public demo surface.

- Canonical root surface: `/`
- Existing world/deeper shrine surface: `/home`
- Public demo constellation: `/u/adamclamp`
- Companion API smoke surface: `/api/companion`
- Waitlist API smoke surface: `/api/waitlist`
- Spatial preview surface: `/spatial`
- Spatial health surface: `/api/spatial/health`

## Public routing rule

The public root must not be a Spatial-only shell for V1. The root should introduce the memory-to-world product promise and route users into the home/world experience.

Spatial remains visible as a preview layer at `/spatial`, but it is not the V1 production claim and must not be marketed as a complete AR/VR or production Spatial system until independent Spatial evidence exists.

## Claim boundaries

Public V1 copy must avoid claims that are not backed by deployed evidence:

- no health or diagnosis claims
- no passive sensing claims unless opt-in data collection is live and reviewed
- no marketplace, data-sale, or revenue-share claims
- no AR/VR production claims
- no enterprise-live or B2B-production claims
- no production-live claim until Issue #300 closure evidence is complete

## Launch gating rule

Do not broadly share the public demo until Issue #300 has a passing Production Evidence workflow comment with run URL and artifact URL, or equivalent attached deploy evidence.

## Rationale

The V1 repo evidence is strongest for the memory-world demo spine: root entry, `/home` shrine, public constellation, companion endpoint, waitlist endpoint, smoke tests, and release evidence workflow. Spatial is important, but it remains a preview surface unless and until `/spatial`, `/api/spatial/health`, consent/auth/rules, provider checks, and public-copy evidence are all attached.
