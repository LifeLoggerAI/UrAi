# URAI Free Static Launch Proof

Generated: 20260621T012158Z

## Live URL

https://urai-4dc1d.web.app

## Current production mode

URAI is live as a polished free static Firebase Hosting shell.

The full Firebase SSR/API deployment remains parked until Blaze billing or another backend host is available.

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

## Repo-backed deploy command

```bash
npx firebase-tools@15.18.0 deploy --project urai-4dc1d --config firebase.free-static.json --only hosting --non-interactive
```

## Live verify command

```bash
URAI_LIVE_URL=https://urai-4dc1d.web.app node scripts/verify-free-static-live.mjs
```
