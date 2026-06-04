# URAI Genesis Versioning Strategy

This document defines the versioning strategy for the URAI Genesis project, leading up to and including the V1.0.0 launch.

## 1. Versioning Scheme

The project will follow a semantic versioning scheme (`MAJOR.MINOR.PATCH`) tailored for a pre-launch application.

- **`MAJOR`**: Indicates the overall stability and feature completeness of the application.
  - `0`: Pre-release, under active development, APIs are not stable.
  - `1`: First official public release (V1).
- **`MINOR`**: Indicates the completion of a major implementation tier or a significant new feature set.
- **`PATCH`**: Indicates bug fixes, minor tweaks, and pass-level implementation completions within a tier.

## 2. Pre-Release Versioning (v0.x.y)

All work prior to the public launch will be part of the `v0` major version. The `MINOR` and `PATCH` versions will be incremented according to the completion of the autonomous implementation tiers.

- **`v0.1.0`**: Tier 1 (Foundation + Repo Normalization) complete.
- **`v0.2.0`**: Tier 2 (Core Genesis Product) complete.
- **`v0.3.0`**: Tier 3 (Backend, Auth, AI, Privacy + Safety) complete.
- **`v0.4.0`**: Tier 4 (Demo, Launch, Admin, Tests + Deployment) complete.
- **`v0.5.0`**: Tier 5 (Post-V1 Expansion Foundations) complete.

Patch releases (`y` in `0.x.y`) will be used internally by the implementation agent to mark the completion of individual passes or significant bug fix cycles within a tier. For example, `v0.1.1`, `v0.1.2`, etc.

## 3. V1 Launch Version (v1.0.0)

The `v1.0.0` release will be tagged only after the following conditions are met:

1.  All five implementation tiers (Passes 1-48) are complete.
2.  All launch-readiness checks have passed (`npm run launch:check`, etc.).
3.  All critical build errors, TypeScript errors, and test failures have been resolved.
4.  Final assets have been integrated.
5.  The public demo has been successfully deployed and verified.
6.  All privacy and security gates have been confirmed by both automated checks and a final manual review.
7.  Explicit approval for public launch has been given by Adam.

## 4. Post-V1 Versioning

After `v1.0.0`, standard semantic versioning will apply:

- **`MAJOR`** updates for significant breaking changes or architectural shifts.
- **`MINOR`** updates for new, backward-compatible features.
- **`PATCH`** updates for backward-compatible bug fixes.
