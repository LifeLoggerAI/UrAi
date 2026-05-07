# Firestore V1 Collection Contract

This is the minimum data contract for the URAI V1 demo spine and launch funnel.

## users/{userId}

```ts
{
  handle: string;
  displayName: string;
  tagline: string;
  currentTone: string;
  companionName: string;
  createdAt: string;
}
```

## timelineEvents/{eventId}

```ts
{
  userId: string;
  occurredAt: string;
  title: string;
  detail: string;
  emotionalTone: string;
  symbolicTags: string[];
  intensity: number;
  bloomId?: string;
}
```

## memoryBlooms/{bloomId}

```ts
{
  userId: string;
  title: string;
  summary: string;
  emotionalTone: string;
  symbolicTags: string[];
  narratorLine: string;
}
```

## moodForecasts/{forecastId}

```ts
{
  userId: string;
  generatedAt: string;
  rhythmState: "stable" | "off-rhythm" | "overstimulated" | "recovering";
  summary: string;
  confidence: number;
  nextBestAction: string;
}
```

## weeklyReflections/{reflectionId}

```ts
{
  userId: string;
  weekOf: string;
  title: string;
  highlights: string[];
  narratorSummary: string;
}
```

## companionMessages/{messageId}

```ts
{
  userId?: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  moodTag?: string;
  insights?: string[];
  createdAt: string;
}
```

## narratorInsights/{insightId}

```ts
{
  userId: string;
  sourceIds: string[];
  sourceTypes: string[];
  title: string;
  summary: string;
  emotionalTone: string;
  confidence: number;
  createdAt: string;
}
```

## rituals/{ritualId}

```ts
{
  userId: string;
  title: string;
  prompt: string;
  symbolicTags: string[];
  cadence?: string;
  createdAt: string;
  completedAt?: string;
}
```

## relationshipSignals/{signalId}

```ts
{
  userId: string;
  personKey: string;
  signalType: string;
  emotionalTone: string;
  confidence: number;
  observedAt: string;
}
```

## passiveSignals/{signalId}

```ts
{
  userId: string;
  source: string;
  signalType: string;
  value: unknown;
  confidence: number;
  observedAt: string;
  retentionUntil?: string;
}
```

## symbolicStates/{stateId}

```ts
{
  userId: string;
  skyState: "clear" | "mist" | "stars" | "storm" | "dawn";
  groundTier: 1 | 2 | 3 | 4 | 5;
  aura: string;
  companionState: "quiet" | "listening" | "guiding" | "celebrating";
  updatedAt?: string;
}
```

## waitlistSignups/{signupId}

```ts
{
  email: string;
  source: string;
  handle?: string;
  intent?: string;
  createdAt: string;
  userAgent?: string;
}
```

## Required composite indexes

- `timelineEvents`: `userId ASC`, `occurredAt DESC`
- `memoryBlooms`: `userId ASC`, `emotionalTone ASC`
- `moodForecasts`: `userId ASC`, `generatedAt DESC`
- `weeklyReflections`: `userId ASC`, `weekOf DESC`
- `companionMessages`: `sessionId ASC`, `createdAt ASC`
- `narratorInsights`: `userId ASC`, `createdAt DESC`
- `passiveSignals`: `userId ASC`, `observedAt DESC`
- `relationshipSignals`: `userId ASC`, `personKey ASC`, `observedAt DESC`
- `waitlistSignups`: `createdAt DESC`

## V1 rule posture

- Public demo data can be served from static seed data.
- Waitlist writes should be allowed only through server routes or Cloud Functions.
- User private memory data should require authenticated ownership checks.
- Passive signals should never be publicly readable.
- Relationship signals should never be publicly readable.
