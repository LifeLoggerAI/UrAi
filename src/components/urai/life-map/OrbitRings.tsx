export function OrbitRings({ mirrorMode = false }: { mirrorMode?: boolean }) {
  return (
    <svg className="urai-orbit-rings" viewBox="-600 -360 1200 720" aria-hidden>
      {[1, 2, 3, 4].map((ring) => (
        <ellipse
          key={ring}
          cx="0"
          cy="0"
          rx={220 + ring * 86}
          ry={70 + ring * 32}
          transform={`rotate(${ring % 2 ? -14 : 16})`}
          fill="none"
          stroke="rgba(155,231,255,.18)"
          strokeWidth={ring === 3 ? 1.4 : 0.9}
          strokeDasharray={ring % 2 ? "12 18" : ""}
        />
      ))}
      {mirrorMode && <line x1="0" x2="0" y1="-310" y2="310" stroke="rgba(232,242,255,.2)" />}
    </svg>
  );
}
