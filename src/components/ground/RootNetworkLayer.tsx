"use client";

import type { GroundElement } from "@/lib/ground/groundTypes";

type RootNetworkLayerProps = {
  elements: GroundElement[];
  selectedElementId?: string;
};

export function RootNetworkLayer({ elements, selectedElementId }: RootNetworkLayerProps) {
  const visible = elements.filter((element) => element.state !== "hidden");
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {visible.slice(1).map((element, index) => {
        const previous = visible[index];
        if (!previous) return null;
        const active = selectedElementId === element.id || selectedElementId === previous.id;
        return (
          <path
            key={`${previous.id}-${element.id}`}
            d={`M ${previous.position.x} ${previous.position.y} C ${(previous.position.x + element.position.x) / 2} ${previous.position.y + 8}, ${(previous.position.x + element.position.x) / 2} ${element.position.y - 8}, ${element.position.x} ${element.position.y}`}
            vectorEffect="non-scaling-stroke"
            transform="scale(1)"
            fill="none"
            stroke="rgba(244,214,154,0.34)"
            strokeWidth={active ? 1.5 : 0.9}
            strokeDasharray="3 8"
            opacity={active ? 0.7 : 0.32}
          />
        );
      })}
    </svg>
  );
}
