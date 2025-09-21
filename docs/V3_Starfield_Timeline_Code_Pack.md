# V3 Copy‑Paste Code Pack (Starfield Timeline)

> Add a shimmering starfield timeline, timeline metadata, and a floating panel UI for memories. These snippets assume you already applied the V1 + V2 packs (Next.js + Firebase wiring).

## 1) Firestore Schema

```txt
Collections:
  memories/{id}
    - uid
    - title
    - occurredAt: timestamp
    - mood: 'calm' | 'energized' | 'melancholy' | 'curious'
    - highlight: boolean
    - star: { x: number, y: number, z: number, color: string, size: number }
    - panel: { summary: string, mediaUrl?: string }
  timelines/{uid}
    - updatedAt: timestamp
  timelines/{uid}/keyframes/{keyId}
    - t: number // 0 → 1 normalized time
    - pos: { x: number, y: number, z: number }
    - lookAt: { x: number, y: number, z: number }
```

## 2) Star Generator Utility

`lib/starfield/generator.ts`

```ts
import { Color, Vector3 } from 'three';

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export type Star = {
  id: string;
  position: Vector3;
  color: Color;
  size: number;
  memoryId?: string;
};

export function generateStars(count = 64, radius = 24, seed = Date.now()): Star[] {
  const rand = seededRandom(seed || 1);
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * Math.pow(rand(), 0.25);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const hue = 200 + rand() * 80;
    const saturation = 60 + rand() * 30;
    const lightness = 55 + rand() * 35;

    stars.push({
      id: `star-${seed}-${i}`,
      position: new Vector3(x, y, z),
      color: new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`),
      size: 0.12 + rand() * 0.4,
    });
  }

  return stars;
}
```

## 3) Camera Path Helper

`lib/starfield/cameraPath.ts`

```ts
import { CatmullRomCurve3, Vector3 } from 'three';

export type CameraKeyframe = {
  t: number;
  position: Vector3;
  lookAt: Vector3;
};

export function buildCameraCurve(points: Vector3[]) {
  if (points.length < 2) throw new Error('Need at least two points');
  return new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}

export function sampleCameraPath(curve: CatmullRomCurve3, lookAt = new Vector3(0, 0, 0), samples = 100): CameraKeyframe[] {
  return Array.from({ length: samples }, (_, i) => {
    const t = i / (samples - 1);
    const position = curve.getPoint(t);
    return { t, position, lookAt };
  });
}
```

## 4) Timeline Panel UI

`components/TimelinePanel.tsx`

```tsx
'use client';
import { useMemo } from 'react';
import clsx from 'clsx';

type MemoryPanel = {
  id: string;
  title: string;
  summary: string;
  mood?: string;
  occurredAt?: Date;
  mediaUrl?: string;
};

type Props = {
  memories: MemoryPanel[];
  activeId?: string;
  onSelect?: (id: string) => void;
};

const moodClass: Record<string, string> = {
  calm: 'from-sky-500/70 to-indigo-500/40',
  energized: 'from-amber-500/70 to-orange-500/30',
  melancholy: 'from-purple-500/70 to-blue-700/40',
  curious: 'from-emerald-500/70 to-teal-500/30',
};

export default function TimelinePanel({ memories, activeId, onSelect }: Props) {
  const ordered = useMemo(
    () => [...memories].sort((a, b) => (b.occurredAt?.getTime() || 0) - (a.occurredAt?.getTime() || 0)),
    [memories],
  );

  return (
    <aside className="pointer-events-auto w-full max-w-sm space-y-3 overflow-y-auto rounded-2xl bg-black/40 p-4 text-white backdrop-blur">
      {ordered.map((memory) => {
        const gradient = moodClass[memory.mood ?? ''] ?? 'from-white/10 to-white/5';
        const isActive = memory.id === activeId;
        return (
          <button
            key={memory.id}
            onClick={() => onSelect?.(memory.id)}
            className={clsx(
              'w-full rounded-xl border border-white/10 bg-gradient-to-br p-3 text-left transition hover:border-white/40',
              gradient,
              isActive && 'ring-2 ring-white/60',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold tracking-wide">{memory.title}</div>
                <div className="text-xs opacity-80">
                  {memory.occurredAt ? memory.occurredAt.toLocaleString() : 'Timeline marker'}
                </div>
              </div>
              {memory.mediaUrl && (
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-black/30">
                  <img src={memory.mediaUrl} alt={memory.title} className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed opacity-90">{memory.summary}</p>
            {memory.mood && <div className="mt-1 text-xs uppercase tracking-[0.2em] opacity-70">{memory.mood}</div>}
          </button>
        );
      })}
      {ordered.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm opacity-70">
          No memories yet—drop one into the field or sync from the narrator flow.
        </div>
      )}
    </aside>
  );
}
```

## 5) Starfield Scene Hook-Up (React Three Fiber sample)

`app/timeline/page.tsx`

```tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useMemo, useState } from 'react';
import { generateStars } from '@/lib/starfield/generator';
import TimelinePanel from '@/components/TimelinePanel';

export default function TimelinePage() {
  const [active, setActive] = useState<string | undefined>();
  const stars = useMemo(() => generateStars(80, 32, 7), []);
  const memories = useMemo(
    () =>
      stars.slice(0, 6).map((star, index) => ({
        id: star.id,
        title: `Memory ${index + 1}`,
        summary: 'Placeholder summary for your cinematic memory.',
        mood: ['calm', 'energized', 'melancholy', 'curious'][index % 4],
        occurredAt: new Date(Date.now() - index * 86_400_000),
      })),
    [stars],
  );

  return (
    <main className="relative flex min-h-screen flex-col bg-black text-white">
      <div className="relative h-[60vh] w-full">
        <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <Stars radius={60} depth={40} count={2000} factor={4} saturation={0} fade speed={1} />
            {stars.map((star) => (
              <mesh key={star.id} position={star.position.toArray()}>
                <sphereGeometry args={[star.size, 8, 8]} />
                <meshBasicMaterial color={star.color} />
              </mesh>
            ))}
            <OrbitControls enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-6 flex justify-end">
        <TimelinePanel memories={memories} activeId={active} onSelect={setActive} />
      </div>
    </main>
  );
}
```

---

✅ With V3 you now have a seeded starfield, camera helpers, Firestore schema, and UI panel ready for integration with narrator-driven memories. Ping me when you want the V4 bundle (voice blooms + ambient scoring)!
