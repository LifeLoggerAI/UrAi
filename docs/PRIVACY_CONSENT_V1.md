# URAI V1 Privacy and Consent Model

This is a product/engineering starter document, not final legal advice.

## V1 privacy posture

URAI V1 should default to minimal data, clear consent, and no silent collection.

The current V1 demo spine is mostly static/demo data plus optional waitlist capture. It does not yet implement full passive sensing.

## Data categories

### Public/demo data

- Seeded public constellation data
- Demo mood forecast
- Demo weekly reflection
- Demo memory blooms
- Demo timeline stars

This data is static and not private user data.

### Waitlist data

Collected through `/api/waitlist`:

- email
- source
- handle
- intent
- createdAt
- updatedAt
- status

Waitlist data is server-only in Firestore rules and should not be readable from client SDKs.

### Future private user data

Future private collections may include:

- timeline events
- memory blooms
- mood forecasts
- weekly reflections
- companion messages
- passive signals
- relationship signals
- symbolic states

Private docs should include `ownerUid` and must be accessible only by the authenticated owner or server-side trusted processes.

## Consent principles

1. No passive collection before explicit opt-in.
2. Explain what each signal category does before enabling it.
3. Let users disable each data source independently.
4. Let users delete private data.
5. Never make users feel trapped by emotional memory features.
6. Avoid clinical/diagnostic framing unless reviewed by qualified experts.
7. Treat relationship and passive-signal data as high sensitivity.

## Consent tiers

### Tier 0: Public demo

- No account required.
- Static demo data only.
- Optional waitlist email capture.

### Tier 1: Account memory

- User-created or explicitly imported memories.
- Companion messages.
- Manual reflections.

### Tier 2: Passive context

- Device/app/location/contextual signals.
- Must be opt-in per source.
- Must include retention controls.

### Tier 3: Sensitive relationship/emotional intelligence

- Relationship signals.
- Voice familiarity.
- Trust/attachment patterns.
- Requires heightened consent and clear explanations.

## Data retention defaults

Recommended defaults for future implementation:

- Waitlist: retain until unsubscribe/delete request.
- Companion messages: user-configurable retention.
- Passive raw signals: short retention, enriched summaries only.
- Relationship signals: explicit retention window and delete controls.
- Public exports: user-controlled sharing and revocation.

## Engineering requirements

- Server-only writes for waitlist.
- `ownerUid` for private documents.
- No direct client read/write to `waitlistSignups`.
- No public read access to passive or relationship data.
- Clear environment separation for staging and production.
- Avoid logging sensitive message content in server logs.
- Rate-limit public write endpoints before broad launch.

## User trust copy direction

Use plain-language explanations:

- “URAI only collects passive signals after you turn them on.”
- “You can delete your memories and exports.”
- “Your private emotional data is not public.”
- “The companion reflects patterns; it does not diagnose you.”

## V1 launch gate

Before broad launch:

- [ ] Confirm waitlist Firestore rules deny client reads/writes.
- [ ] Confirm no passive data collection is enabled silently.
- [ ] Add unsubscribe/delete process for waitlist.
- [ ] Publish privacy copy on public site.
- [ ] Review consent language before enabling passive signals.
