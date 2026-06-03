# URAI Analytics Safety

Analytics are optional and should remain off unless intentionally selected.

## Rules

- No raw user content events.
- No Companion message text.
- No transcript text.
- No Gmail content.
- No exact location data.
- No health data.
- No Shadow content.
- No private export content.
- Use event names and coarse page/feature events only.
- Include an opt-out path in Settings before enabling analytics broadly.

## Safe examples

- `page_view_launch`
- `demo_entered`
- `waitlist_submitted`
- `passport_opened`
- `reduced_sensory_enabled`

## Not implemented

If analytics are not implemented, keep `NEXT_PUBLIC_ANALYTICS_ENABLED=false` and leave provider keys blank.
