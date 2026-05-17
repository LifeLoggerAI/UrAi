import { emotionPalette, type MemoryCategory } from "@/components/urai/data/emotionPalette";

export function NebulaZones({ activeCategory = "all" }: { activeCategory?: MemoryCategory | "all" }) {
  return (
    <div className="urai-nebula-zones" aria-hidden>
      {Object.entries(emotionPalette).map(([category, palette], index) => {
        const isActive = activeCategory === "all" || activeCategory === category;
        return (
          <div
            key={category}
            className="urai-galaxy-nebula-zone"
            style={{
              left: `${18 + index * 13}%`,
              top: `${30 + (index % 3) * 16}%`,
              width: `${42 + (index % 2) * 18}%`,
              height: `${22 + (index % 3) * 5}%`,
              transform: `translate(-50%, -50%) rotate(${index % 2 ? 14 : -14}deg)`,
              background: `radial-gradient(ellipse at center, ${palette.nebula}, transparent 68%)`,
              opacity: isActive ? 1 : 0.24,
            }}
          />
        );
      })}
    </div>
  );
}
