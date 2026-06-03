# URAI Bundle and Dependency Audit

- [ ] No unused heavy libraries in the client bundle.
- [ ] No accidental server-only package in the client bundle.
- [ ] No API keys client-side.
- [ ] No dev-only tools visible in production.
- [ ] No large audio files preloaded at Genesis startup.
- [ ] Export renderer is not loaded at Genesis startup unless needed.
- [ ] Life Map, Ground, Mirror, Shadow, Legacy, and Export Center are reviewed for dynamic import opportunities.
- [ ] Asset manifests do not force noncritical layers to preload.
- [ ] Production source maps policy reviewed.
- [ ] Lighthouse bundle and performance reports captured before launch.
