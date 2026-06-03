# URAI Domain Setup

## Production routes

- Production home: `https://urai.app/`
- Public demo: `https://urai.app/demo`
- Founder demo: `https://urai.app/u/adamclamp`
- Launch page: `https://urai.app/launch`
- Admin route: `https://urai.app/admin` protected; never linked from public UI.

## DNS notes

- Use HTTPS only.
- Configure apex/root domain and `www` redirect according to the selected host.
- Keep staging on a separate domain or Firebase/Vercel preview URL.

## Firebase Auth authorized domains

Add:

- `urai.app`
- `www.urai.app` if used
- staging domain if used
- localhost only for development

## Hosting notes

If Firebase Hosting is used, verify `firebase.json` targets and deploy with:

```bash
npm run deploy:hosting
```

If Vercel is used for Next.js hosting, deploy Firebase rules separately with:

```bash
npm run deploy:rules
```
