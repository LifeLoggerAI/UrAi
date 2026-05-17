import type { MemoryStar } from "@/components/urai/data/memoryStars";

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
    <svg className="urai-thread-layer" viewBox="-600 -360 1200 720" aria-hidden>
      {threads.map((thread, index) =>
        thread.slice(1).map((id, pointIndex) => {
          const from = stars.find((star) => star.id === thread[pointIndex]);
          const to = stars.find((star) => star.id === id);
          if (!from || !to) return null;
          const active = hasSelection ? relatedIds.has(from.id) && relatedIds.has(to.id) : true;
          return (
            <line
              key={`${index}-${id}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={active ? "rgba(155,231,255,.48)" : "rgba(155,231,255,.12)"}
              strokeWidth={active ? 1.2 : 0.6}
            />
          );
        }),
      )}
    </svg>
  );
}
