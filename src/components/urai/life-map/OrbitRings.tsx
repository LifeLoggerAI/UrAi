export function OrbitRings({ mirrorMode = false }: { mirrorMode?: boolean }) {
  const rings = [
    { rx: 306, ry: 102, rotate: -14 },
    { rx: 392, ry: 134, rotate: 16 },
    { rx: 478, ry: 166, rotate: -14 },
    { rx: 564, ry: 198, rotate: 16 },
  ];

  return (
    <svg className="urai-orbit-rings" viewBox="-600 -360 1200 720" aria-hidden>
      {rings.map((ring) => (
        <ellipse
          key={ring.rx}
          cx="0"
          cy="0"
          rx={ring.rx}
          ry={ring.ry}
          transform={`rotate(${ring.rotate})`}
          fill="none"
          stroke="rgba(155,231,255,.18)"
          strokeWidth="1"
        />
      ))}
      {mirrorMode ? <path d="M 0 -310 L 0 310" stroke="rgba(232,242,255,.2)" /> : null}
    </svg>
  );
}
