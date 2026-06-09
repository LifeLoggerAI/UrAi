'use client';

import { useEffect, useMemo, useState } from 'react';
import MemoryBloom from './MemoryBloom';
import './LifeMap.css';

type MemoryState = 'recovery' | 'bond' | 'threshold' | 'blueFog' | 'reflection';

export type MemoryStar = {
  id: string;
  userId: string;
  title: string;
  state: MemoryState;
  era: string;
  narratorLine: string;
  x: number;
  y: number;
  z: number;
  intensity: number;
  relatedStarIds: string[];
  createdAt: string;
};

const memoryStars: MemoryStar[] = [
  {
    id: 'star-1',
    userId: 'genesis-user',
    title: 'The Clearing',
    state: 'recovery',
    era: 'Last Summer',
    narratorLine: 'The field softened, and recovery began to glow through the quiet.',
    x: 18,
    y: 26,
    z: 1,
    intensity: 1,
    relatedStarIds: ['star-2'],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'star-2',
    userId: 'genesis-user',
    title: 'Shared Silence',
    state: 'bond',
    era: 'Two Years Ago',
    narratorLine: 'Connection appeared without force, held in a calm orbit.',
    x: 34,
    y: 48,
    z: 2,
    intensity: 0.88,
    relatedStarIds: ['star-3', 'star-5'],
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'star-3',
    userId: 'genesis-user',
    title: 'The Threshold',
    state: 'threshold',
    era: 'A turning season',
    narratorLine: 'A doorway opened where the old pattern could no longer hold.',
    x: 72,
    y: 58,
    z: 3,
    intensity: 1.05,
    relatedStarIds: ['star-4'],
    createdAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'star-4',
    userId: 'genesis-user',
    title: 'Blue Fog',
    state: 'blueFog',
    era: 'Last Month',
    narratorLine: 'The signal dimmed, but the field kept listening beneath the haze.',
    x: 84,
    y: 28,
    z: 2,
    intensity: 0.78,
    relatedStarIds: [],
    createdAt: '2026-01-04T00:00:00.000Z',
  },
  {
    id: 'star-5',
    userId: 'genesis-user',
    title: 'The Pattern Remembered',
    state: 'reflection',
    era: 'Earlier chapter',
    narratorLine: 'What once felt scattered began to arrange itself into meaning.',
    x: 52,
    y: 78,
    z: 1,
    intensity: 0.95,
    relatedStarIds: [],
    createdAt: '2026-01-05T00:00:00.000Z',
  },
];

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

export default function LifeMap() {
  const [selectedStar, setSelectedStar] = useState<MemoryStar | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { x, y } = useMousePosition();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const starMap = useMemo(() => {
    return new Map(memoryStars.map((star) => [star.id, star]));
  }, []);

  const parallaxX = isClient ? (x / window.innerWidth - 0.5) * -32 : 0;
  const parallaxY = isClient ? (y / window.innerHeight - 0.5) * -32 : 0;

  return (
    <main className="lifeMapScene">
      <div
        className="starfield"
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
      >
        <svg className="constellationLayer" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(125, 211, 252, 0.08)" />
              <stop offset="100%" stopColor="rgba(125, 211, 252, 0.34)" />
            </linearGradient>
          </defs>

          {memoryStars.flatMap((star) =>
            star.relatedStarIds.map((relatedId) => {
              const relatedStar = starMap.get(relatedId);
              if (!relatedStar) return null;

              return (
                <line
                  key={`${star.id}-${relatedId}`}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${relatedStar.x}%`}
                  y2={`${relatedStar.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                />
              );
            })
          )}
        </svg>

        {memoryStars.map((star) => (
          <button
            key={star.id}
            type="button"
            className="star"
            data-state={star.state}
            aria-label={star.title}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: `scale(${star.intensity})`,
              boxShadow: `0 0 ${star.intensity * 18}px 4px var(--star-color)`,
            }}
            onClick={() => setSelectedStar(star)}
          />
        ))}
      </div>

      {selectedStar && (
        <MemoryBloom star={selectedStar} onClose={() => setSelectedStar(null)} />
      )}
    </main>
  );
}
