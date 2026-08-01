# Current-main legacy quarantine receipt

- Repository: `LifeLoggerAI/UrAi`
- Starting current main: `658b36da6b239333a918396251aad6386894e78f`
- Historical reviewed quarantine source: `b08490ec27245481ae8d163604ea2403eee0c3de`
- Canonical public authority: `LifeLoggerAI/urai-spatial` -> `urai-tier1` -> `main` -> `urai.app`

This reconciliation preserves the current-main launch-shell history while selectively transplanting only reviewed quarantine workflows, authority guards, deployment-denial scripts, canonical-authority records, and legacy documentation. It does not merge the historical divergent product tree.

Source containment removes every Firebase project alias, every deployable Hosting, Firestore, Functions, Storage, and App Hosting section, and the entire legacy Firebase Functions source/package tree. Production deployment package aliases remain fail-closed. `URAI Launch Verify` remains verification-only and may not read production secrets or deploy infrastructure.

Repository settings, environments, secrets, deploy keys, installed apps, webhooks, historic artifacts, provider credentials, and credential revocation remain administrator-side gates outside source control.
