# URAI V1 Launch Shell

This branch implements the URAI V1 Launch Shell across the main Next/Firebase app.

## Core rule

URAI Private is completely ad-free.

Do not add:

- ad SDKs
- banner ads
- interstitial ads
- rewarded ads
- watch-ad-to-unlock flows
- private ad targeting
- sponsored private insights
- ad slots inside private routes

URAI Worlds/social/YouTube is the public monetized media layer. The app stays clean.

## Routes

- `/` — main URAI positioning
- `/worlds` — public cinematic signal layer
- `/make-mine` — paid cinematic memory preview offer
- `/founding` — founding access offer
- `/creators` — creator application
- `/watch` — public video hub
- `/trust` — trust center and no-ad promise
- `/waitlist` — early signup
- `/passport` — access/consent/permission layer
- `/app/home` — private magical URAI home shell
- `/admin` — admin command center with no-ad compliance panel

## Launch collections

The shell writes to or references these Firestore collections:

- `waitlistEntries`
- `makeMineRequests`
- `foundingAccessMembers`
- `creatorApplications`
- `publicWorlds`
- `watchVideos`
- `signalLedgerEntries`
- `paymentEvents`
- `analyticsEvents`

## Forms

- Waitlist form
- Make Mine form
- Founding Access form
- Creator Application form

All launch forms validate required fields, include consent copy, write to Firestore through `addLaunchDocument`, and fire analytics events through `trackLaunchEvent`.

## Payment placeholders

The shell includes placeholders in `src/lib/launch/payments.ts`:

- `createMakeMineCheckout(requestId, amountTier)`
- `createFoundingAccessCheckout(memberId, tier)`
- `handlePaymentWebhook(event)`

These currently write placeholder `paymentEvents` and preserve a clean seam for Stripe, Gumroad, or Lemon Squeezy.

## No-ad enforcement constants

Defined in `src/lib/launch/noAds.ts`:

```ts
PRIVATE_APP_ADS_ALLOWED = false;
PUBLIC_MEDIA_MONETIZATION_ALLOWED = true;
```

The admin route renders a no-ad compliance checklist so launch review can verify no ad SDKs or private ad surfaces have been added.

## Trust copy

Use these exact lines:

- “URAI Private is ad-free. Your memory is not ad inventory.”
- “No ads inside your memory.”
- “URAI Worlds funds the public signal.”
- “URAI Private earns trust. URAI Worlds earns attention.”
- “Not a chatbot. A memory OS.”
- “Your phone has the fragments. URAI builds the world.”

## Acceptance checks

The launch shell is ready when:

1. All launch routes render.
2. `/app/home` stays private and has the no-ad notice.
3. `/admin` remains admin-gated.
4. Forms write to Firestore in configured environments.
5. Payment placeholder functions write `paymentEvents`.
6. Analytics events are emitted and mirrored best-effort.
7. No ad SDKs, ad components, ad slots, rewarded ads, or private ad targeting exist in the private app.
8. URAI Worlds is clearly public/media monetized.
9. URAI Private is clearly private/ad-free.
