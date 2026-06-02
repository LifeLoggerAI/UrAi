# URAI Genesis Home, Orb, and Galaxy Spec

## Home World

Home is the product surface. It must never feel like a menu.

### Layout

- Sky top: emotional weather and Galaxy portal.
- Orb center: primary companion and interaction anchor.
- Ground bottom: stability, recovery, roots.
- Gateway glows: subtle entry points to Mirror, Shadow, Legacy, Passport.

### Required interactions

- Tap Orb: chat.
- Long press Orb: Council.
- Tap Sky: Galaxy.
- Tap Ground: Ground/recovery.
- Tap Mirror Glow: Mirror.
- Tap Shadow Ripple: Shadow.
- Tap Legacy Glow: Legacy.
- Tap Passport Sigil: Passport.

### Home states

- Clear
- Quiet
- Heavy
- Bright
- Restless
- Focused
- Overstimulated
- Recovering
- Unknown

### Empty state

> Your world is beginning to form. As URAI learns from the permissions you choose, your sky, stars, and reflections will become more personal.

### Permission-off state

> URAI can still give you a quiet home world. To form richer stars, reflections, and weather, you can add permissions in Passport.

## Orb / Companion State Sheet

| State | Visual | Motion | Sound | Trigger |
|---|---|---|---|---|
| Idle | soft silver-blue glow | slow breathing pulse | low hum | default |
| Listening | brighter rim | gentle inward pull | open pulse | user speaks/types |
| Speaking | rhythmic glow | subtle wave | voice start cue | companion response |
| Thinking | rotating inner light | slow orbit | soft shimmer | generating response |
| Calming | warm blue-green | slower pulse | exhale tone | calm mode |
| Reflecting | glassy aura | mirror ripple | glass tone | Mirror insight |
| Shadow | dim violet-blue | low pulse | atmospheric pad | Shadow pattern |
| Legacy | amber halo | scroll flare | film shimmer | Legacy scroll |
| Passport | white-blue lock shimmer | steady secure pulse | clean chime | permissions/data |
| Council | split-light orb | radial expansion | chamber resonance | long press orb |

The orb never panics, judges, diagnoses, or manipulates.

## Galaxy Star System

Galaxy is the symbolic life map. Each star represents a memory, event, pattern, insight, emotional moment, milestone, recovery point, relationship shift, or passive signal cluster.

| Star Type | Shape | Color | Meaning | Tap Result | Sound | Firestore type |
|---|---|---|---|---|---|
| Mood | soft aura | blue/gold | mood state | Star Detail | shimmer | mood |
| Memory | warm glow | amber | meaningful moment | Star Detail | warm ping | memory |
| Relationship | twin-star | rose/blue | social tone | Star Detail | twin chime | relationship |
| Recovery | bloom | green/gold | rebound/softening | Star Detail | lift tone | recovery |
| Shadow | dim ripple | violet/blue | difficult pattern | Star Detail | low pulse | shadow |
| Legacy | scroll flare | amber/gold | chapter/scroll | Scroll Detail | film shimmer | legacy |
| Pattern | geometry | white/teal | recurring rhythm | Star Detail | pulse | pattern |
| Passport | lock shimmer | white/blue | data/permission event | Passport Detail | secure chime | passport |
| Threshold | doorway/eclipse | indigo/gold | major shift | Star Detail | doorway swell | threshold |
| Companion | orb-star | silver/blue | narrator insight | Chat/Detail | orb pulse | companion |

## Required star fields

Every star requires:

- title
- summary
- timestamp
- emotionalTone
- sourceSignals
- confidenceLevel
- explanationId
- visibility
- user controls

## Star Detail required actions

- Ask URAI
- Save to Legacy
- Hide
- Correct
- Delete related insight
- Manage permissions

## Galaxy empty state

> Your sky is still forming. The first stars appear when URAI notices meaningful moments, rhythms, or reflections.

## Galaxy permission-off state

> Galaxy can hold memories you create, but passive stars need permissioned signals to form automatically.
