# URAI Genesis Passport, Copy, Motion, and Sound

## Passport UX Flows

### First permission request

Show:

- plain reason
- data category
- resulting feature improvement
- control promise

CTA options:

- Allow
- Not now
- Learn more

### Permission granted

- Write permissionEvent.
- Update Passport.
- Play secure chime.
- Explain what changed.

### Permission denied

- Do not punish.
- Show reduced mode.
- Explain what remains available.

### Permission limited

- Show feature boundary.
- Keep user in control.

### Permission revoked

- Stop future access.
- Write permissionEvent.
- Offer delete related data.

### Delete related data

- Show what will be deleted.
- Ask for confirmation.
- Delete records.
- Write auditLog.
- Show completion.

### Export data

Export types:

- Passport archive
- Permission history
- Personal data
- Legacy scrolls
- Stars
- Explanations

### Future data value opt-in

- Default off.
- Explain future-controlled external permission layer.
- Never imply data is sold by default.
- URAI itself remains ad-free.

## Copy + Tone Bible

### Voice

Calm, intelligent, concise, emotionally aware, non-judgmental, subtly poetic, never manipulative.

### Allowed language

- looked heavier
- seemed quieter
- may suggest
- might reflect
- worth noticing
- your rhythm shifted
- your world looks softer

### Forbidden language

- you are depressed
- you are paranoid
- you are addicted
- you are unstable
- they betrayed you
- you are lying
- we are tracking you
- enable monitoring

### CTA labels

Use:

- Enter URAI
- Ask URAI
- Show Why
- Manage Permissions
- Save to Legacy
- Hide This
- Delete Related Data

Avoid:

- Start Demo
- Test
- Debug
- Track Me
- Enable Monitoring
- Submit Data

### Universal why template

> You're seeing this because {signalGroup} changed from your usual pattern during {timePeriod}. This may suggest {gentleInterpretation}, but it may also simply reflect {alternativeExplanation}. URAI is showing it because {reasonForSurfacing}. You can hide, correct, or delete this anytime.

## Animation + Motion Spec

Motion principles: slow, atmospheric, cinematic, calm. Motion explains state and movement through worlds.

| Transition | Duration | Feel | Sound | Reduced motion fallback |
|---|---:|---|---|---|
| Welcome to Home | 1400ms | orb reveals world | soft swell | fade |
| Home to Galaxy | 900ms | sky zoom to stars | airy whoosh | crossfade |
| Galaxy to Star Detail | 550ms | star expands to card | shimmer | card fade |
| Home to Mirror | 650ms | glass ripple | glass tone | fade |
| Home to Shadow | 700ms | dim ripple, safe | low pad | fade |
| Home to Legacy | 750ms | scroll unfurl | film shimmer | fade |
| Home to Passport | 550ms | lock shimmer | secure chime | fade |
| Home to Council | 850ms | orb opens chamber | resonance | fade |
| Permission toggle | 180ms | tactile switch | lock/unlock | instant |
| Shadow relief exit | 800ms | darkness warms | exhale | fade |

## Sound Design Brief

Sound is launch-critical. It must feel premium, subtle, emotional, and muteable.

### Ambient loops

- Home sky
- Home ground
- Galaxy deep space
- Mirror glass
- Shadow low pad
- Legacy warm memory
- Passport clean secure
- Council chamber

### Interaction cues

- Orb tap
- Orb long press
- Sky tap
- Star tap
- Mirror open
- Shadow open
- Legacy open
- Passport open
- Permission enabled
- Permission revoked
- Export complete
- Delete complete
- Notification

### Sound rules

- No harsh alarms unless true safety-critical flow.
- No cheap mobile app clicks.
- Sound must never be required to understand the UI.
- Mute all sounds must be available.
- Reduced motion and accessibility modes must still preserve state through visual cues.
