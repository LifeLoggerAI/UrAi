# URAI Free Static Launch Proof

Generated: 20260621T012158Z

## Live URL

https://urai-4dc1d.web.app

## Current production mode

URAI is live as a polished free static Firebase Hosting shell.

The deeper server-side production lane remains parked until billing or another backend host is available.

## Static routes

- /
- /home
- /demo
- /life-map
- /status
- /waitlist
- /privacy
- /terms
- /robots.txt
- /sitemap.xml
- /assets/manifest.json
- /assets/asset-manifest.js

## Repo-backed deploy command

```bash
npx firebase-tools@15.18.0 deploy --project urai-4dc1d --config firebase.free-static.json --only hosting --non-interactive
```

## Live verify command

```bash
URAI_LIVE_URL=https://urai-4dc1d.web.app node scripts/verify-free-static-live.mjs
```

Expected green markers:

```text
FREE_STATIC_LIVE_VERIFY_GREEN=1
CURATED_STATIC_ASSET_LAYER_GREEN=1
LIVE_URL=https://urai-4dc1d.web.app
```

## Next lanes

- Phone and desktop visual QA.
- Custom domain connection.
- Billing or alternate backend host.
- Server-side waitlist capture.
- Full backend deploy after that lane is unlocked.
