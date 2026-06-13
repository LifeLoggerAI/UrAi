import { Line } from '@react-three/drei';
import type { MemoryStar } from '@/components/urai/data/memoryStars';

export function ConstellationThreadLayer({
  stars,
  threads,
  relatedIds,
  hasSelection,
}: {
  stars: MemoryStar[];
  threads: string[][];
  relatedIds: Set<string>;
  hasSelection: boolean;
}) {
  return (
    <group>
      {threads.map((thread, index) =>
        thread.slice(1).map((id, pointIndex) => {
          const from = stars.find((star) => star.id === thread[pointIndex]);
          const to = stars.find((star) => star.id === id);
          if (!from || !to) return null;
          const active = hasSelection ? relatedIds.has(from.id) && relatedIds.has(to.id) : true;
          return (
            <Line
              key={`${index}-${id}`}
              points={[[from.x, from.y, from.z], [to.x, to.y, to.z]]}
              color={active ? '#9BE7FF' : '#9BE7FF'}
              lineWidth={active ? 1.2 : 0.6}
              transparent
              opacity={active ? 0.48 : 0.12}
            />
          );
        })
      )}
    </group>
  );
}
